import type { OpenClawConfig, PluginRuntime } from "openclaw/plugin-sdk/discord";
import { describe, expect, it, vi } from "vitest";
import { discordPlugin } from "./channel.js";
import { setDiscordRuntime } from "./runtime.js";

describe("discordPlugin outbound", () => {
  it("forwards mediaLocalRoots to sendMessageDiscord", async () => {
    const sendMessageDiscord = vi.fn(async () => ({ messageId: "m1" }));
    setDiscordRuntime({
      channel: {
        discord: {
          sendMessageDiscord,
        },
      },
    } as unknown as PluginRuntime);

    const result = await discordPlugin.outbound!.sendMedia!({
      cfg: {} as OpenClawConfig,
      to: "channel:123",
      text: "hi",
      mediaUrl: "/tmp/image.png",
      mediaLocalRoots: ["/tmp/agent-root"],
      accountId: "work",
    });

    expect(sendMessageDiscord).toHaveBeenCalledWith(
      "channel:123",
      "hi",
      expect.objectContaining({
        mediaUrl: "/tmp/image.png",
        mediaLocalRoots: ["/tmp/agent-root"],
      }),
    );
    expect(result).toMatchObject({ channel: "discord", messageId: "m1" });
  });

  it("uses channel-keyed outbound deps when provided", async () => {
    const runtimeSend = vi.fn(async () => ({ messageId: "runtime" }));
    const injectedSend = vi.fn(async () => ({ messageId: "dep" }));
    setDiscordRuntime({
      channel: {
        discord: {
          sendMessageDiscord: runtimeSend,
        },
      },
    } as unknown as PluginRuntime);

    const result = await discordPlugin.outbound!.sendText!({
      cfg: {} as OpenClawConfig,
      to: "channel:456",
      text: "hello",
      accountId: "work",
      deps: { discord: injectedSend },
    });

    expect(injectedSend).toHaveBeenCalledWith(
      "channel:456",
      "hello",
      expect.objectContaining({
        accountId: "work",
      }),
    );
    expect(runtimeSend).not.toHaveBeenCalled();
    expect(result).toMatchObject({ channel: "discord", messageId: "dep" });
  });
});
