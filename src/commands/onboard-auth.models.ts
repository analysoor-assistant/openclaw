import {
  QIANFAN_BASE_URL,
  QIANFAN_DEFAULT_MODEL_ID,
  buildZaiModelDefinition,
  resolveZaiBaseUrl,
  ZAI_CODING_CN_BASE_URL,
  ZAI_CODING_GLOBAL_BASE_URL,
  ZAI_CN_BASE_URL,
  ZAI_DEFAULT_MODEL_ID,
  ZAI_GLOBAL_BASE_URL,
} from "../agents/models-config.providers.js";
import type { ModelDefinitionConfig } from "../config/types.js";
import {
  KILOCODE_DEFAULT_CONTEXT_WINDOW,
  KILOCODE_DEFAULT_COST,
  KILOCODE_DEFAULT_MAX_TOKENS,
  KILOCODE_DEFAULT_MODEL_ID,
  KILOCODE_DEFAULT_MODEL_NAME,
} from "../providers/kilocode-shared.js";
export {
  KILOCODE_DEFAULT_CONTEXT_WINDOW,
  KILOCODE_DEFAULT_COST,
  KILOCODE_DEFAULT_MAX_TOKENS,
  KILOCODE_DEFAULT_MODEL_ID,
};

export const DEFAULT_MINIMAX_BASE_URL = "https://api.minimax.io/v1";
export const MINIMAX_API_BASE_URL = "https://api.minimax.io/anthropic";
export const MINIMAX_CN_API_BASE_URL = "https://api.minimaxi.com/anthropic";
export const MINIMAX_HOSTED_MODEL_ID = "MiniMax-M2.5";
export const MINIMAX_HOSTED_MODEL_REF = `minimax/${MINIMAX_HOSTED_MODEL_ID}`;
export const DEFAULT_MINIMAX_CONTEXT_WINDOW = 200000;
export const DEFAULT_MINIMAX_MAX_TOKENS = 8192;

export const MOONSHOT_BASE_URL = "https://api.moonshot.ai/v1";
export const MOONSHOT_CN_BASE_URL = "https://api.moonshot.cn/v1";
export const MOONSHOT_DEFAULT_MODEL_ID = "kimi-k2.5";
export const MOONSHOT_DEFAULT_MODEL_REF = `moonshot/${MOONSHOT_DEFAULT_MODEL_ID}`;
export const MOONSHOT_DEFAULT_CONTEXT_WINDOW = 256000;
export const MOONSHOT_DEFAULT_MAX_TOKENS = 8192;
export const KIMI_CODING_MODEL_ID = "k2p5";
export const KIMI_CODING_MODEL_REF = `kimi-coding/${KIMI_CODING_MODEL_ID}`;

export { QIANFAN_BASE_URL, QIANFAN_DEFAULT_MODEL_ID };
export const QIANFAN_DEFAULT_MODEL_REF = `qianfan/${QIANFAN_DEFAULT_MODEL_ID}`;

export {
  buildZaiModelDefinition,
  resolveZaiBaseUrl,
  ZAI_CODING_CN_BASE_URL,
  ZAI_CODING_GLOBAL_BASE_URL,
  ZAI_CN_BASE_URL,
  ZAI_DEFAULT_MODEL_ID,
  ZAI_GLOBAL_BASE_URL,
};

// Pricing per 1M tokens (USD) — https://platform.minimaxi.com/document/Price
export const MINIMAX_API_COST = {
  input: 0.3,
  output: 1.2,
  cacheRead: 0.03,
  cacheWrite: 0.12,
};
export const MINIMAX_HOSTED_COST = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
};
export const MINIMAX_LM_STUDIO_COST = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
};
export const MOONSHOT_DEFAULT_COST = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
};

const MINIMAX_MODEL_CATALOG = {
  "MiniMax-M2.5": { name: "MiniMax M2.5", reasoning: true },
  "MiniMax-M2.5-highspeed": { name: "MiniMax M2.5 Highspeed", reasoning: true },
} as const;

type MinimaxCatalogId = keyof typeof MINIMAX_MODEL_CATALOG;

export function buildMinimaxModelDefinition(params: {
  id: string;
  name?: string;
  reasoning?: boolean;
  cost: ModelDefinitionConfig["cost"];
  contextWindow: number;
  maxTokens: number;
}): ModelDefinitionConfig {
  const catalog = MINIMAX_MODEL_CATALOG[params.id as MinimaxCatalogId];
  return {
    id: params.id,
    name: params.name ?? catalog?.name ?? `MiniMax ${params.id}`,
    reasoning: params.reasoning ?? catalog?.reasoning ?? false,
    input: ["text"],
    cost: params.cost,
    contextWindow: params.contextWindow,
    maxTokens: params.maxTokens,
  };
}

export function buildMinimaxApiModelDefinition(modelId: string): ModelDefinitionConfig {
  return buildMinimaxModelDefinition({
    id: modelId,
    cost: MINIMAX_API_COST,
    contextWindow: DEFAULT_MINIMAX_CONTEXT_WINDOW,
    maxTokens: DEFAULT_MINIMAX_MAX_TOKENS,
  });
}

export function buildMoonshotModelDefinition(): ModelDefinitionConfig {
  return {
    id: MOONSHOT_DEFAULT_MODEL_ID,
    name: "Kimi K2.5",
    reasoning: false,
    input: ["text", "image"],
    cost: MOONSHOT_DEFAULT_COST,
    contextWindow: MOONSHOT_DEFAULT_CONTEXT_WINDOW,
    maxTokens: MOONSHOT_DEFAULT_MAX_TOKENS,
  };
}

export const MISTRAL_BASE_URL = "https://api.mistral.ai/v1";
export const MISTRAL_DEFAULT_MODEL_ID = "mistral-large-latest";
export const MISTRAL_DEFAULT_MODEL_REF = `mistral/${MISTRAL_DEFAULT_MODEL_ID}`;
export const MISTRAL_DEFAULT_CONTEXT_WINDOW = 262144;
export const MISTRAL_DEFAULT_MAX_TOKENS = 262144;
export const MISTRAL_DEFAULT_COST = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
};

export function buildMistralModelDefinition(): ModelDefinitionConfig {
  return {
    id: MISTRAL_DEFAULT_MODEL_ID,
    name: "Mistral Large",
    reasoning: false,
    input: ["text", "image"],
    cost: MISTRAL_DEFAULT_COST,
    contextWindow: MISTRAL_DEFAULT_CONTEXT_WINDOW,
    maxTokens: MISTRAL_DEFAULT_MAX_TOKENS,
  };
}

export const XAI_BASE_URL = "https://api.x.ai/v1";
export const XAI_DEFAULT_MODEL_ID = "grok-4";
export const XAI_DEFAULT_MODEL_REF = `xai/${XAI_DEFAULT_MODEL_ID}`;
export const XAI_DEFAULT_CONTEXT_WINDOW = 131072;
export const XAI_DEFAULT_MAX_TOKENS = 8192;
export const XAI_DEFAULT_COST = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
};

export function buildXaiModelDefinition(): ModelDefinitionConfig {
  return {
    id: XAI_DEFAULT_MODEL_ID,
    name: "Grok 4",
    reasoning: false,
    input: ["text"],
    cost: XAI_DEFAULT_COST,
    contextWindow: XAI_DEFAULT_CONTEXT_WINDOW,
    maxTokens: XAI_DEFAULT_MAX_TOKENS,
  };
}

export function buildKilocodeModelDefinition(): ModelDefinitionConfig {
  return {
    id: KILOCODE_DEFAULT_MODEL_ID,
    name: KILOCODE_DEFAULT_MODEL_NAME,
    reasoning: true,
    input: ["text", "image"],
    cost: KILOCODE_DEFAULT_COST,
    contextWindow: KILOCODE_DEFAULT_CONTEXT_WINDOW,
    maxTokens: KILOCODE_DEFAULT_MAX_TOKENS,
  };
}

// Alibaba Cloud Model Studio Coding Plan
export const MODELSTUDIO_CN_BASE_URL = "https://coding.dashscope.aliyuncs.com/v1";
export const MODELSTUDIO_GLOBAL_BASE_URL = "https://coding-intl.dashscope.aliyuncs.com/v1";
export const MODELSTUDIO_DEFAULT_MODEL_ID = "qwen3.5-plus";
export const MODELSTUDIO_DEFAULT_MODEL_REF = `modelstudio/${MODELSTUDIO_DEFAULT_MODEL_ID}`;
export const MODELSTUDIO_DEFAULT_COST = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
};

const MODELSTUDIO_MODEL_CATALOG = {
  "qwen3.5-plus": {
    name: "qwen3.5-plus",
    reasoning: false,
    input: ["text", "image"],
    contextWindow: 1000000,
    maxTokens: 65536,
  },
  "qwen3-max-2026-01-23": {
    name: "qwen3-max-2026-01-23",
    reasoning: false,
    input: ["text"],
    contextWindow: 262144,
    maxTokens: 65536,
  },
  "qwen3-coder-next": {
    name: "qwen3-coder-next",
    reasoning: false,
    input: ["text"],
    contextWindow: 262144,
    maxTokens: 65536,
  },
  "qwen3-coder-plus": {
    name: "qwen3-coder-plus",
    reasoning: false,
    input: ["text"],
    contextWindow: 1000000,
    maxTokens: 65536,
  },
  "MiniMax-M2.5": {
    name: "MiniMax-M2.5",
    reasoning: false,
    input: ["text"],
    contextWindow: 1000000,
    maxTokens: 65536,
  },
  "glm-5": {
    name: "glm-5",
    reasoning: false,
    input: ["text"],
    contextWindow: 202752,
    maxTokens: 16384,
  },
  "glm-4.7": {
    name: "glm-4.7",
    reasoning: false,
    input: ["text"],
    contextWindow: 202752,
    maxTokens: 16384,
  },
  "kimi-k2.5": {
    name: "kimi-k2.5",
    reasoning: false,
    input: ["text", "image"],
    contextWindow: 262144,
    maxTokens: 32768,
  },
} as const;

type ModelStudioCatalogId = keyof typeof MODELSTUDIO_MODEL_CATALOG;

export function buildModelStudioModelDefinition(params: {
  id: string;
  name?: string;
  reasoning?: boolean;
  input?: string[];
  cost?: ModelDefinitionConfig["cost"];
  contextWindow?: number;
  maxTokens?: number;
}): ModelDefinitionConfig {
  const catalog = MODELSTUDIO_MODEL_CATALOG[params.id as ModelStudioCatalogId];
  return {
    id: params.id,
    name: params.name ?? catalog?.name ?? params.id,
    reasoning: params.reasoning ?? catalog?.reasoning ?? false,
    input:
      (params.input as ("text" | "image")[]) ??
      ([...(catalog?.input ?? ["text"])] as ("text" | "image")[]),
    cost: params.cost ?? MODELSTUDIO_DEFAULT_COST,
    contextWindow: params.contextWindow ?? catalog?.contextWindow ?? 262144,
    maxTokens: params.maxTokens ?? catalog?.maxTokens ?? 65536,
  };
}

export function buildModelStudioDefaultModelDefinition(): ModelDefinitionConfig {
  return buildModelStudioModelDefinition({
    id: MODELSTUDIO_DEFAULT_MODEL_ID,
  });
}
