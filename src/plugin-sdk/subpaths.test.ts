import * as compatSdk from "openclaw/plugin-sdk/compat";
import * as discordSdk from "openclaw/plugin-sdk/discord";
import * as discordCoreSdk from "openclaw/plugin-sdk/discord-core";
import * as extensionSharedSdk from "openclaw/plugin-sdk/extension-shared";
import * as googleSdk from "openclaw/plugin-sdk/google";
import * as imessageSdk from "openclaw/plugin-sdk/imessage";
import * as imessageCoreSdk from "openclaw/plugin-sdk/imessage-core";
import * as lineSdk from "openclaw/plugin-sdk/line";
import * as lineCoreSdk from "openclaw/plugin-sdk/line-core";
import * as msteamsSdk from "openclaw/plugin-sdk/msteams";
import * as signalSdk from "openclaw/plugin-sdk/signal";
import * as signalCoreSdk from "openclaw/plugin-sdk/signal-core";
import * as slackSdk from "openclaw/plugin-sdk/slack";
import * as slackCoreSdk from "openclaw/plugin-sdk/slack-core";
import * as telegramSdk from "openclaw/plugin-sdk/telegram";
import * as telegramCoreSdk from "openclaw/plugin-sdk/telegram-core";
import * as whatsappSdk from "openclaw/plugin-sdk/whatsapp";
import { describe, expect, it } from "vitest";

const bundledExtensionSubpathLoaders = [
  { id: "acpx", load: () => import("openclaw/plugin-sdk/acpx") },
  { id: "bluebubbles", load: () => import("openclaw/plugin-sdk/bluebubbles") },
  { id: "copilot-proxy", load: () => import("openclaw/plugin-sdk/copilot-proxy") },
  { id: "device-pair", load: () => import("openclaw/plugin-sdk/device-pair") },
  { id: "diagnostics-otel", load: () => import("openclaw/plugin-sdk/diagnostics-otel") },
  { id: "diffs", load: () => import("openclaw/plugin-sdk/diffs") },
  { id: "feishu", load: () => import("openclaw/plugin-sdk/feishu") },
  {
    id: "google-gemini-cli-auth",
    load: () => import("openclaw/plugin-sdk/google-gemini-cli-auth"),
  },
  { id: "googlechat", load: () => import("openclaw/plugin-sdk/googlechat") },
  { id: "irc", load: () => import("openclaw/plugin-sdk/irc") },
  { id: "llm-task", load: () => import("openclaw/plugin-sdk/llm-task") },
  { id: "lobster", load: () => import("openclaw/plugin-sdk/lobster") },
  { id: "matrix", load: () => import("openclaw/plugin-sdk/matrix") },
  { id: "mattermost", load: () => import("openclaw/plugin-sdk/mattermost") },
  { id: "memory-core", load: () => import("openclaw/plugin-sdk/memory-core") },
  { id: "memory-lancedb", load: () => import("openclaw/plugin-sdk/memory-lancedb") },
  {
    id: "minimax-portal-auth",
    load: () => import("openclaw/plugin-sdk/minimax-portal-auth"),
  },
  { id: "nextcloud-talk", load: () => import("openclaw/plugin-sdk/nextcloud-talk") },
  { id: "nostr", load: () => import("openclaw/plugin-sdk/nostr") },
  { id: "open-prose", load: () => import("openclaw/plugin-sdk/open-prose") },
  { id: "phone-control", load: () => import("openclaw/plugin-sdk/phone-control") },
  { id: "qwen-portal-auth", load: () => import("openclaw/plugin-sdk/qwen-portal-auth") },
  { id: "synology-chat", load: () => import("openclaw/plugin-sdk/synology-chat") },
  { id: "talk-voice", load: () => import("openclaw/plugin-sdk/talk-voice") },
  { id: "test-utils", load: () => import("openclaw/plugin-sdk/test-utils") },
  { id: "thread-ownership", load: () => import("openclaw/plugin-sdk/thread-ownership") },
  { id: "tlon", load: () => import("openclaw/plugin-sdk/tlon") },
  { id: "twitch", load: () => import("openclaw/plugin-sdk/twitch") },
  { id: "voice-call", load: () => import("openclaw/plugin-sdk/voice-call") },
  { id: "zalo", load: () => import("openclaw/plugin-sdk/zalo") },
  { id: "zalouser", load: () => import("openclaw/plugin-sdk/zalouser") },
] as const;

describe("plugin-sdk subpath exports", () => {
  it("exports compat helpers", () => {
    expect(typeof compatSdk.emptyPluginConfigSchema).toBe("function");
    expect(typeof compatSdk.resolveControlCommandGate).toBe("function");
  });

  it("exports Discord helpers", () => {
    expect(typeof discordSdk.resolveDiscordAccount).toBe("function");
    expect(typeof discordSdk.inspectDiscordAccount).toBe("function");
    expect(typeof discordSdk.discordOnboardingAdapter).toBe("object");
  });

  it("exports Discord core helpers", () => {
    expect(typeof discordCoreSdk.buildChannelConfigSchema).toBe("function");
    expect(typeof discordCoreSdk.DiscordConfigSchema).toBe("object");
    expect(typeof discordCoreSdk.resolvePollMaxSelections).toBe("function");
  });

  it("exports Slack helpers", () => {
    expect(typeof slackSdk.resolveSlackAccount).toBe("function");
    expect(typeof slackSdk.inspectSlackAccount).toBe("function");
    expect(typeof slackSdk.handleSlackMessageAction).toBe("function");
  });

  it("exports Slack core helpers", () => {
    expect(typeof slackCoreSdk.buildChannelConfigSchema).toBe("function");
    expect(typeof slackCoreSdk.SlackConfigSchema).toBe("object");
    expect(typeof slackCoreSdk.readStringParam).toBe("function");
  });

  it("exports Telegram helpers", () => {
    expect(typeof telegramSdk.resolveTelegramAccount).toBe("function");
    expect(typeof telegramSdk.inspectTelegramAccount).toBe("function");
    expect(typeof telegramSdk.telegramOnboardingAdapter).toBe("object");
  });

  it("exports Telegram core helpers", () => {
    expect(typeof telegramCoreSdk.buildChannelConfigSchema).toBe("function");
    expect(typeof telegramCoreSdk.TelegramConfigSchema).toBe("object");
    expect(typeof telegramCoreSdk.resolvePollMaxSelections).toBe("function");
  });

  it("exports Signal helpers", () => {
    expect(typeof signalSdk.resolveSignalAccount).toBe("function");
    expect(typeof signalSdk.signalOnboardingAdapter).toBe("object");
  });

  it("exports Signal core helpers", () => {
    expect(typeof signalCoreSdk.buildChannelConfigSchema).toBe("function");
    expect(typeof signalCoreSdk.SignalConfigSchema).toBe("object");
    expect(typeof signalCoreSdk.normalizeE164).toBe("function");
  });

  it("exports iMessage helpers", () => {
    expect(typeof imessageSdk.resolveIMessageAccount).toBe("function");
    expect(typeof imessageSdk.imessageOnboardingAdapter).toBe("object");
  });

  it("exports iMessage core helpers", () => {
    expect(typeof imessageCoreSdk.buildChannelConfigSchema).toBe("function");
    expect(typeof imessageCoreSdk.parseChatTargetPrefixesOrThrow).toBe("function");
    expect(typeof imessageCoreSdk.resolveServicePrefixedTarget).toBe("function");
  });

  it("exports WhatsApp helpers", () => {
    expect(typeof whatsappSdk.resolveWhatsAppAccount).toBe("function");
    expect(typeof whatsappSdk.whatsappOnboardingAdapter).toBe("object");
  });

  it("exports LINE helpers", () => {
    expect(typeof lineSdk.processLineMessage).toBe("function");
    expect(typeof lineSdk.createInfoCard).toBe("function");
  });

  it("exports LINE core helpers", () => {
    expect(typeof lineCoreSdk.resolveDefaultLineAccountId).toBe("function");
    expect(typeof lineCoreSdk.resolveExactLineGroupConfigKey).toBe("function");
    expect(typeof lineCoreSdk.LineConfigSchema).toBe("object");
  });

  it("exports Microsoft Teams helpers", () => {
    expect(typeof msteamsSdk.resolveControlCommandGate).toBe("function");
    expect(typeof msteamsSdk.loadOutboundMediaFromUrl).toBe("function");
  });

  it("exports Google helpers", () => {
    expect(typeof googleSdk.normalizeGoogleModelId).toBe("function");
    expect(typeof googleSdk.parseGeminiAuth).toBe("function");
  });

  it("exports shared extension helpers", () => {
    expect(typeof extensionSharedSdk.buildPassiveChannelStatusSummary).toBe("function");
    expect(typeof extensionSharedSdk.buildTrafficStatusSummary).toBe("function");
    expect(typeof extensionSharedSdk.createDeferred).toBe("function");
  });

  it("exports acpx helpers", async () => {
    const acpxSdk = await import("openclaw/plugin-sdk/acpx");
    expect(typeof acpxSdk.listKnownProviderAuthEnvVarNames).toBe("function");
    expect(typeof acpxSdk.omitEnvKeysCaseInsensitive).toBe("function");
  });

  it("resolves bundled extension subpaths", async () => {
    for (const { id, load } of bundledExtensionSubpathLoaders) {
      const mod = await load();
      expect(typeof mod).toBe("object");
      expect(mod, `subpath ${id} should resolve`).toBeTruthy();
    }
  });

  it("keeps the newly added bundled plugin-sdk contracts available", async () => {
    const bluebubbles = await import("openclaw/plugin-sdk/bluebubbles");
    expect(typeof bluebubbles.parseFiniteNumber).toBe("function");

    const mattermost = await import("openclaw/plugin-sdk/mattermost");
    expect(typeof mattermost.parseStrictPositiveInteger).toBe("function");

    const nextcloudTalk = await import("openclaw/plugin-sdk/nextcloud-talk");
    expect(typeof nextcloudTalk.waitForAbortSignal).toBe("function");

    const twitch = await import("openclaw/plugin-sdk/twitch");
    expect(typeof twitch.DEFAULT_ACCOUNT_ID).toBe("string");
    expect(typeof twitch.normalizeAccountId).toBe("function");
  });
});
