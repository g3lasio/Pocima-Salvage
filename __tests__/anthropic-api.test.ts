import { describe, it, expect } from "vitest";

describe("Anthropic API Key Validation", () => {
  it("should have ANTHROPIC_API_KEY environment variable set", () => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    expect(apiKey).toBeDefined();
    expect(apiKey).not.toBe("");
  });

  it("should be able to make a simple API call to Anthropic", async () => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY not set");
    }

    // Hacer una llamada simple a la API de Anthropic
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 10,
        messages: [
          { role: "user", content: "Di 'hola'" }
        ],
      }),
    });

    // 200 = éxito, 400 = error de request pero API key válida
    // 401 = API key inválida
    expect(response.status).not.toBe(401);
    expect(response.status).toBe(200);
  });
});
