import { describe, expect, it, vi } from "vitest";
import { createOutboundSendDepsFromCliSource } from "./outbound-send-mapping.js";

describe("createOutboundSendDepsFromCliSource", () => {
  it("adds legacy aliases for channel-keyed send deps", () => {
    const deps = {
      whatsapp: vi.fn(),
      telegram: vi.fn(),
      discord: vi.fn(),
      slack: vi.fn(),
      signal: vi.fn(),
      imessage: vi.fn(),
    };

    const outbound = createOutboundSendDepsFromCliSource(deps);

    expect(outbound).toEqual({
      whatsapp: deps.whatsapp,
      telegram: deps.telegram,
      discord: deps.discord,
      slack: deps.slack,
      signal: deps.signal,
      imessage: deps.imessage,
      sendWhatsApp: deps.whatsapp,
      sendTelegram: deps.telegram,
      sendDiscord: deps.discord,
      sendSlack: deps.slack,
      sendSignal: deps.signal,
      sendIMessage: deps.imessage,
    });
  });

  it("adds channel aliases for legacy source keys and prefers explicit channel keys", () => {
    const preferredTelegram = vi.fn();
    const legacyTelegram = vi.fn();
    const legacySlack = vi.fn();

    const outbound = createOutboundSendDepsFromCliSource({
      telegram: preferredTelegram,
      sendMessageTelegram: legacyTelegram,
      sendMessageSlack: legacySlack,
    });

    expect(outbound.telegram).toBe(preferredTelegram);
    expect(outbound.sendTelegram).toBe(preferredTelegram);
    expect(outbound.slack).toBe(legacySlack);
    expect(outbound.sendSlack).toBe(legacySlack);
  });
});
