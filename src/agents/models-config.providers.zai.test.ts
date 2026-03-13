import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { withEnvAsync } from "../test-utils/env.js";
import {
  installModelsConfigTestHooks,
  resolveImplicitProvidersForTest,
  withModelsTempHome as withTempHome,
} from "./models-config.e2e-harness.js";
import { ensureOpenClawModelsJson } from "./models-config.js";
import { buildZaiProvider } from "./models-config.providers.js";
import { readGeneratedModelsJson } from "./models-config.test-utils.js";

installModelsConfigTestHooks();

describe("zai implicit provider", () => {
  it("should include zai when ZAI_API_KEY is configured", async () => {
    const agentDir = mkdtempSync(join(tmpdir(), "openclaw-test-"));
    const zaiApiKey = "test-key"; // pragma: allowlist secret
    await withEnvAsync({ ZAI_API_KEY: zaiApiKey }, async () => {
      const providers = await resolveImplicitProvidersForTest({ agentDir });
      expect(providers?.zai).toBeDefined();
      expect(providers?.zai?.apiKey).toBe("ZAI_API_KEY");
      expect(providers?.zai?.baseUrl).toBe("https://api.z.ai/api/paas/v4");
    });
  });

  it("should build the static zai provider catalog", () => {
    const provider = buildZaiProvider();
    const modelIds = provider.models.map((model) => model.id);
    expect(provider.api).toBe("openai-completions");
    expect(provider.baseUrl).toBe("https://api.z.ai/api/paas/v4");
    expect(modelIds).toEqual(["glm-5", "glm-4.7", "glm-4.7-flash", "glm-4.7-flashx"]);
  });

  it("writes zai into models.json for env-backed developer defaults", async () => {
    await withTempHome(async () => {
      const zaiApiKey = "test-key"; // pragma: allowlist secret
      await withEnvAsync({ ZAI_API_KEY: zaiApiKey }, async () => {
        await ensureOpenClawModelsJson({
          agents: {
            defaults: {
              model: {
                primary: "zai/glm-5",
              },
            },
          },
          models: {
            providers: {},
          },
        });

        const parsed = await readGeneratedModelsJson<{
          providers: Record<
            string,
            { apiKey?: string; baseUrl?: string; models?: Array<{ id: string }> }
          >;
        }>();
        expect(parsed.providers.zai?.apiKey).toBe("ZAI_API_KEY");
        expect(parsed.providers.zai?.baseUrl).toBe("https://api.z.ai/api/paas/v4");
        expect(parsed.providers.zai?.models?.map((model) => model.id)).toEqual([
          "glm-5",
          "glm-4.7",
          "glm-4.7-flash",
          "glm-4.7-flashx",
        ]);
        expect(parsed.providers.openrouter).toBeUndefined();
      });
    });
  });
});
