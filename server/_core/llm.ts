import { ENV } from "./env";

export type Role = "system" | "user" | "assistant" | "tool" | "function";

export type TextContent = {
  type: "text";
  text: string;
};

export type ImageContent = {
  type: "image_url";
  image_url: {
    url: string;
    detail?: "auto" | "low" | "high";
  };
};

export type FileContent = {
  type: "file_url";
  file_url: {
    url: string;
    mime_type?: "audio/mpeg" | "audio/wav" | "application/pdf" | "audio/mp4" | "video/mp4";
  };
};

export type MessageContent = string | TextContent | ImageContent | FileContent;

export type Message = {
  role: Role;
  content: MessageContent | MessageContent[];
  name?: string;
  tool_call_id?: string;
};

export type Tool = {
  type: "function";
  function: {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
  };
};

export type ToolChoicePrimitive = "none" | "auto" | "required";
export type ToolChoiceByName = { name: string };
export type ToolChoiceExplicit = {
  type: "function";
  function: {
    name: string;
  };
};

export type ToolChoice = ToolChoicePrimitive | ToolChoiceByName | ToolChoiceExplicit;

export type InvokeParams = {
  messages: Message[];
  tools?: Tool[];
  toolChoice?: ToolChoice;
  tool_choice?: ToolChoice;
  maxTokens?: number;
  max_tokens?: number;
  outputSchema?: OutputSchema;
  output_schema?: OutputSchema;
  responseFormat?: ResponseFormat;
  response_format?: ResponseFormat;
};

export type ToolCall = {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
};

export type InvokeResult = {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: Role;
      content: string | Array<TextContent | ImageContent | FileContent>;
      tool_calls?: ToolCall[];
    };
    finish_reason: string | null;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export type JsonSchema = {
  name: string;
  schema: Record<string, unknown>;
  strict?: boolean;
};

export type OutputSchema = JsonSchema;

export type ResponseFormat =
  | { type: "text" }
  | { type: "json_object" }
  | { type: "json_schema"; json_schema: JsonSchema };

const ensureArray = (value: MessageContent | MessageContent[]): MessageContent[] =>
  Array.isArray(value) ? value : [value];

const normalizeContentPart = (part: MessageContent): TextContent | ImageContent | FileContent => {
  if (typeof part === "string") {
    return { type: "text", text: part };
  }

  if (part.type === "text") {
    return part;
  }

  if (part.type === "image_url") {
    return part;
  }

  if (part.type === "file_url") {
    return part;
  }

  throw new Error("Unsupported message content part");
};

const normalizeMessage = (message: Message) => {
  const { role, name, tool_call_id } = message;

  if (role === "tool" || role === "function") {
    const content = ensureArray(message.content)
      .map((part) => (typeof part === "string" ? part : JSON.stringify(part)))
      .join("\n");

    return {
      role,
      name,
      tool_call_id,
      content,
    };
  }

  const contentParts = ensureArray(message.content).map(normalizeContentPart);

  // If there's only text content, collapse to a single string for compatibility
  if (contentParts.length === 1 && contentParts[0].type === "text") {
    return {
      role,
      name,
      content: contentParts[0].text,
    };
  }

  return {
    role,
    name,
    content: contentParts,
  };
};

const normalizeToolChoice = (
  toolChoice: ToolChoice | undefined,
  tools: Tool[] | undefined,
): "none" | "auto" | ToolChoiceExplicit | undefined => {
  if (!toolChoice) return undefined;

  if (toolChoice === "none" || toolChoice === "auto") {
    return toolChoice;
  }

  if (toolChoice === "required") {
    if (!tools || tools.length === 0) {
      throw new Error("tool_choice 'required' was provided but no tools were configured");
    }

    if (tools.length > 1) {
      throw new Error(
        "tool_choice 'required' needs a single tool or specify the tool name explicitly",
      );
    }

    return {
      type: "function",
      function: { name: tools[0].function.name },
    };
  }

  if ("name" in toolChoice) {
    return {
      type: "function",
      function: { name: toolChoice.name },
    };
  }

  return toolChoice;
};

// Determine which LLM provider to use
const getLLMProvider = (): "anthropic" | "forge" => {
  const provider = ENV.llmProvider.toLowerCase();
  
  if (provider === "anthropic" && ENV.anthropicApiKey) {
    return "anthropic";
  }
  
  if (provider === "forge" && ENV.forgeApiKey) {
    return "forge";
  }
  
  // Auto-detect: prefer Anthropic if available, fallback to Forge
  if (provider === "auto") {
    if (ENV.anthropicApiKey) return "anthropic";
    if (ENV.forgeApiKey) return "forge";
  }
  
  // Default to forge if nothing else works
  return "forge";
};

const resolveApiUrl = () => {
  const provider = getLLMProvider();
  
  if (provider === "anthropic") {
    return "https://api.anthropic.com/v1/messages";
  }
  
  return ENV.forgeApiUrl && ENV.forgeApiUrl.trim().length > 0
    ? `${ENV.forgeApiUrl.replace(/\/$/, "")}/v1/chat/completions`
    : "https://forge.manus.im/v1/chat/completions";
};

const assertApiKey = () => {
  const provider = getLLMProvider();
  
  if (provider === "anthropic" && !ENV.anthropicApiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }
  
  if (provider === "forge" && !ENV.forgeApiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
};

const normalizeResponseFormat = ({
  responseFormat,
  response_format,
  outputSchema,
  output_schema,
}: {
  responseFormat?: ResponseFormat;
  response_format?: ResponseFormat;
  outputSchema?: OutputSchema;
  output_schema?: OutputSchema;
}):
  | { type: "json_schema"; json_schema: JsonSchema }
  | { type: "text" }
  | { type: "json_object" }
  | undefined => {
  const explicitFormat = responseFormat || response_format;
  if (explicitFormat) {
    if (explicitFormat.type === "json_schema" && !explicitFormat.json_schema?.schema) {
      throw new Error("responseFormat json_schema requires a defined schema object");
    }
    return explicitFormat;
  }

  const schema = outputSchema || output_schema;
  if (!schema) return undefined;

  if (!schema.name || !schema.schema) {
    throw new Error("outputSchema requires both name and schema");
  }

  return {
    type: "json_schema",
    json_schema: {
      name: schema.name,
      schema: schema.schema,
      ...(typeof schema.strict === "boolean" ? { strict: schema.strict } : {}),
    },
  };
};

// Convert messages to Anthropic format
const convertToAnthropicFormat = (messages: Message[]) => {
  let systemPrompt = "";
  const anthropicMessages: Array<{
    role: "user" | "assistant";
    content: string | Array<{ type: string; text?: string; source?: { type: string; media_type: string; data: string } }>;
  }> = [];

  for (const msg of messages) {
    const normalized = normalizeMessage(msg);
    
    if (normalized.role === "system") {
      systemPrompt = typeof normalized.content === "string" 
        ? normalized.content 
        : (normalized.content as Array<{ type: string; text?: string }>).map(c => c.text || "").join("\n");
      continue;
    }

    if (normalized.role === "user" || normalized.role === "assistant") {
      // Handle multimodal content
      if (Array.isArray(normalized.content)) {
        const anthropicContent: Array<{ type: string; text?: string; source?: { type: string; media_type: string; data: string } }> = [];
        
        for (const part of normalized.content) {
          if (part.type === "text") {
            anthropicContent.push({ type: "text", text: part.text });
          } else if (part.type === "image_url") {
            const imageUrl = (part as ImageContent).image_url.url;
            // Handle base64 images
            if (imageUrl.startsWith("data:")) {
              const matches = imageUrl.match(/^data:([^;]+);base64,(.+)$/);
              if (matches) {
                anthropicContent.push({
                  type: "image",
                  source: {
                    type: "base64",
                    media_type: matches[1],
                    data: matches[2],
                  },
                });
              }
            }
          }
        }
        
        anthropicMessages.push({
          role: normalized.role as "user" | "assistant",
          content: anthropicContent,
        });
      } else {
        anthropicMessages.push({
          role: normalized.role as "user" | "assistant",
          content: normalized.content as string,
        });
      }
    }
  }

  return { systemPrompt, messages: anthropicMessages };
};

// Invoke Anthropic Claude API
async function invokeAnthropic(params: InvokeParams): Promise<InvokeResult> {
  const { messages } = params;
  const { systemPrompt, messages: anthropicMessages } = convertToAnthropicFormat(messages);

  // Use claude-3-5-sonnet as it's widely available and stable
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";

  const payload: Record<string, unknown> = {
    model,
    max_tokens: 8192,
    messages: anthropicMessages,
  };

  if (systemPrompt) {
    payload.system = systemPrompt;
  }

  // Validate API key before making request
  if (!ENV.anthropicApiKey || ENV.anthropicApiKey.trim() === "") {
    throw new Error("ANTHROPIC_API_KEY is not configured. Please add it to your Replit Secrets.");
  }

  console.log(`[LLM] Invoking Anthropic API with model: ${model}`);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": ENV.anthropicApiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[LLM] Anthropic API error: ${response.status} - ${errorText}`);
    
    // Parse error for better messaging
    try {
      const errorJson = JSON.parse(errorText);
      if (errorJson.error?.type === "authentication_error") {
        throw new Error("Invalid ANTHROPIC_API_KEY. Please check your API key in Replit Secrets.");
      }
      if (errorJson.error?.type === "invalid_request_error") {
        throw new Error(`Anthropic request error: ${errorJson.error.message}`);
      }
    } catch (parseError) {
      // If parsing fails, use original error
    }
    
    throw new Error(`Anthropic API invoke failed: ${response.status} ${response.statusText} – ${errorText}`);
  }

  const anthropicResult = await response.json() as {
    id: string;
    content: Array<{ type: string; text?: string }>;
    model: string;
    stop_reason: string;
    usage: { input_tokens: number; output_tokens: number };
  };

  // Convert Anthropic response to OpenAI-compatible format
  const textContent = anthropicResult.content
    .filter((c: { type: string }) => c.type === "text")
    .map((c: { text?: string }) => c.text || "")
    .join("");

  return {
    id: anthropicResult.id,
    created: Date.now(),
    model: anthropicResult.model,
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content: textContent,
        },
        finish_reason: anthropicResult.stop_reason,
      },
    ],
    usage: {
      prompt_tokens: anthropicResult.usage.input_tokens,
      completion_tokens: anthropicResult.usage.output_tokens,
      total_tokens: anthropicResult.usage.input_tokens + anthropicResult.usage.output_tokens,
    },
  };
}

// Invoke Forge/OpenAI-compatible API
async function invokeForge(params: InvokeParams): Promise<InvokeResult> {
  const {
    messages,
    tools,
    toolChoice,
    tool_choice,
    outputSchema,
    output_schema,
    responseFormat,
    response_format,
  } = params;

  const payload: Record<string, unknown> = {
    model: "gemini-2.5-flash",
    messages: messages.map(normalizeMessage),
  };

  if (tools && tools.length > 0) {
    payload.tools = tools;
  }

  const normalizedToolChoice = normalizeToolChoice(toolChoice || tool_choice, tools);
  if (normalizedToolChoice) {
    payload.tool_choice = normalizedToolChoice;
  }

  payload.max_tokens = 32768;
  payload.thinking = {
    budget_tokens: 128,
  };

  const normalizedResponseFormat = normalizeResponseFormat({
    responseFormat,
    response_format,
    outputSchema,
    output_schema,
  });

  if (normalizedResponseFormat) {
    payload.response_format = normalizedResponseFormat;
  }

  const apiUrl = ENV.forgeApiUrl && ENV.forgeApiUrl.trim().length > 0
    ? `${ENV.forgeApiUrl.replace(/\/$/, "")}/v1/chat/completions`
    : "https://forge.manus.im/v1/chat/completions";

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${ENV.forgeApiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LLM invoke failed: ${response.status} ${response.statusText} – ${errorText}`);
  }

  return (await response.json()) as InvokeResult;
}

export async function invokeLLM(params: InvokeParams): Promise<InvokeResult> {
  assertApiKey();
  
  const provider = getLLMProvider();
  
  if (provider === "anthropic") {
    return invokeAnthropic(params);
  }
  
  return invokeForge(params);
}

// Export provider info for debugging
export function getLLMProviderInfo(): { provider: string; model: string; configured: boolean } {
  const provider = getLLMProvider();
  const anthropicConfigured = !!(ENV.anthropicApiKey && ENV.anthropicApiKey.trim());
  const forgeConfigured = !!(ENV.forgeApiKey && ENV.forgeApiKey.trim());
  
  return {
    provider,
    model: provider === "anthropic" 
      ? (process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022") 
      : "gemini-2.5-flash",
    configured: provider === "anthropic" ? anthropicConfigured : forgeConfigured,
  };
}
