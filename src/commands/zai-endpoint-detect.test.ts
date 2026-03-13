import { describe, expect, it } from "vitest";
import { detectZaiEndpoint } from "./zai-endpoint-detect.js";

type MockResponse = { status: number; body?: unknown };

function makeFetch(map: Record<string, MockResponse>) {
  return (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;

    let modelId = "";
    if (typeof init?.body === "string") {
      try {
        const parsed = JSON.parse(init.body) as { model?: unknown };
        if (typeof parsed.model === "string") {
          modelId = parsed.model;
        }
      } catch {
        // ignore malformed test payloads
      }
    }

    const entry = map[`${url}::${modelId}`] ?? map[url];
    if (!entry) {
      throw new Error(`unexpected request: ${url} (${modelId || "no-model"})`);
    }
    const json = entry.body ?? {};
    return new Response(JSON.stringify(json), {
      status: entry.status,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;
}

describe("detectZaiEndpoint", () => {
  it("resolves preferred/fallback endpoints and null when probes fail", async () => {
    const scenarios: Array<{
      responses: Record<string, { status: number; body?: unknown }>;
      expected: { endpoint: string; modelId: string } | null;
    }> = [
      {
        responses: {
          "https://api.z.ai/api/paas/v4/chat/completions::glm-5": { status: 200 },
        },
        expected: { endpoint: "global", modelId: "glm-5" },
      },
      {
        responses: {
          "https://api.z.ai/api/paas/v4/chat/completions::glm-5": {
            status: 404,
            body: { error: { message: "not found" } },
          },
          "https://open.bigmodel.cn/api/paas/v4/chat/completions::glm-5": { status: 200 },
        },
        expected: { endpoint: "cn", modelId: "glm-5" },
      },
      {
        responses: {
          "https://api.z.ai/api/paas/v4/chat/completions::glm-5": { status: 404 },
          "https://open.bigmodel.cn/api/paas/v4/chat/completions::glm-5": { status: 404 },
          "https://api.z.ai/api/coding/paas/v4/chat/completions::glm-5": { status: 200 },
        },
        expected: { endpoint: "coding-global", modelId: "glm-5" },
      },
      {
        responses: {
          "https://api.z.ai/api/paas/v4/chat/completions::glm-5": { status: 404 },
          "https://open.bigmodel.cn/api/paas/v4/chat/completions::glm-5": { status: 404 },
          "https://api.z.ai/api/coding/paas/v4/chat/completions::glm-5": { status: 404 },
          "https://open.bigmodel.cn/api/coding/paas/v4/chat/completions::glm-5": { status: 404 },
          "https://api.z.ai/api/coding/paas/v4/chat/completions::glm-4.7": { status: 200 },
        },
        expected: { endpoint: "coding-global", modelId: "glm-4.7" },
      },
      {
        responses: {
          "https://api.z.ai/api/paas/v4/chat/completions": { status: 401 },
          "https://open.bigmodel.cn/api/paas/v4/chat/completions": { status: 401 },
          "https://api.z.ai/api/coding/paas/v4/chat/completions": { status: 401 },
          "https://open.bigmodel.cn/api/coding/paas/v4/chat/completions": { status: 401 },
        },
        expected: null,
      },
    ];

    for (const scenario of scenarios) {
      const detected = await detectZaiEndpoint({
        apiKey: "sk-test", // pragma: allowlist secret
        fetchFn: makeFetch(scenario.responses),
      });

      if (scenario.expected === null) {
        expect(detected).toBeNull();
      } else {
        expect(detected?.endpoint).toBe(scenario.expected.endpoint);
        expect(detected?.modelId).toBe(scenario.expected.modelId);
      }
    }
  });
});
