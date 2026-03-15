import { isSilentReplyText, SILENT_REPLY_TOKEN } from "../auto-reply/tokens.js";
import { isAnnounceSkip } from "./tools/sessions-send-helpers.js";

type CompletionReplyQuality = {
  tier: number;
  sectionCount: number;
  length: number;
};

function countStructuredSections(text: string): number {
  const patterns = [
    /(?:^|\n)\*{0,2}Verdict\*{0,2}\s*:/i,
    /(?:^|\n)\*{0,2}Scope(?: Reviewed)?\*{0,2}\s*:/i,
    /(?:^|\n)\*{0,2}Findings\*{0,2}\s*:/i,
    /(?:^|\n)\*{0,2}Sub-Reviewer Runs\*{0,2}\s*:/i,
    /(?:^|\n)\*{0,2}Context (?:Artifacts|Updated)\*{0,2}\s*:/i,
    /(?:^|\n)\*{0,2}(?:Why This Verdict|Summary)\*{0,2}\s*:/i,
  ];
  return patterns.reduce((count, pattern) => count + (pattern.test(text) ? 1 : 0), 0);
}

function classifyCompletionReply(text: string): CompletionReplyQuality {
  const trimmed = text.trim();
  if (!trimmed || isAnnounceSkip(trimmed) || isSilentReplyText(trimmed, SILENT_REPLY_TOKEN)) {
    return { tier: 0, sectionCount: 0, length: 0 };
  }

  const sectionCount = countStructuredSections(trimmed);
  const startsWithChildCompletion = /^Child completion results:/i.test(trimmed);
  const hasVerdict = /(?:^|\n)\*{0,2}Verdict\*{0,2}\s*:/i.test(trimmed);
  const isProgressOrAck =
    /(?:^|\n)\*{0,2}Task Completed\*{0,2}/i.test(trimmed) ||
    /(?:^|\n)File written successfully:/i.test(trimmed) ||
    /already synthesized and delivered in my prior message/i.test(trimmed) ||
    /no additional work is needed/i.test(trimmed) ||
    /synthesizing verdict now/i.test(trimmed) ||
    /still waiting for/i.test(trimmed) ||
    /waiting for .*confirmation/i.test(trimmed);

  let tier = 2;
  if (startsWithChildCompletion) {
    tier = 3;
  } else if (hasVerdict && sectionCount >= 3) {
    tier = 5;
  } else if (hasVerdict || sectionCount >= 2) {
    tier = 4;
  } else if (isProgressOrAck) {
    tier = 1;
  }

  return {
    tier,
    sectionCount,
    length: trimmed.length,
  };
}

export function preferBetterSubagentCompletionReply(
  current?: string | null,
  candidate?: string | null,
): string | undefined {
  const currentTrimmed = current?.trim();
  const candidateTrimmed = candidate?.trim();
  if (!currentTrimmed) {
    return candidateTrimmed || undefined;
  }
  if (!candidateTrimmed) {
    return currentTrimmed;
  }

  const currentQuality = classifyCompletionReply(currentTrimmed);
  const candidateQuality = classifyCompletionReply(candidateTrimmed);
  if (candidateQuality.tier !== currentQuality.tier) {
    return candidateQuality.tier > currentQuality.tier ? candidateTrimmed : currentTrimmed;
  }
  if (candidateQuality.sectionCount !== currentQuality.sectionCount) {
    return candidateQuality.sectionCount > currentQuality.sectionCount
      ? candidateTrimmed
      : currentTrimmed;
  }
  if (candidateQuality.length !== currentQuality.length) {
    return candidateQuality.length > currentQuality.length ? candidateTrimmed : currentTrimmed;
  }
  return candidateTrimmed;
}
