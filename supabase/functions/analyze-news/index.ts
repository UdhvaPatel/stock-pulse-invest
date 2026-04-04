import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { newsArticles } = await req.json();

    if (!newsArticles || !Array.isArray(newsArticles) || newsArticles.length === 0) {
      return new Response(
        JSON.stringify({ error: "newsArticles array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepare news summary for AI
    const newsSummary = newsArticles
      .map((article: any, i: number) => {
        return `[${i + 1}] Title: ${article.title || "N/A"}\nURL: ${article.url || "N/A"}\nDescription: ${article.description || "N/A"}\nContent snippet: ${(article.markdown || "").slice(0, 500)}`;
      })
      .join("\n\n");

    const systemPrompt = `You are a financial analyst AI. Analyze the following news articles and generate stock investment recommendations.

For each relevant article, determine:
1. Which stock ticker(s) are affected
2. Whether the signal is "buy", "sell", or "hold"
3. A confidence score (0-100)
4. A clear reason explaining why this news impacts the stock
5. The sentiment of the news ("positive", "negative", or "neutral")

Focus on actionable, specific companies. Do not recommend index funds or ETFs.`;

    const userPrompt = `Analyze these breaking news articles and generate stock recommendations:\n\n${newsSummary}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_recommendations",
              description: "Generate stock investment recommendations based on news analysis",
              parameters: {
                type: "object",
                properties: {
                  recommendations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        ticker: { type: "string", description: "Stock ticker symbol (e.g. AAPL)" },
                        company: { type: "string", description: "Full company name" },
                        signal: { type: "string", enum: ["buy", "sell", "hold"] },
                        confidence: { type: "number", description: "Confidence score 0-100" },
                        reason: { type: "string", description: "Clear explanation of why this news impacts the stock" },
                        newsHeadline: { type: "string", description: "The relevant news headline" },
                        newsSource: { type: "string", description: "Source of the news" },
                      },
                      required: ["ticker", "company", "signal", "confidence", "reason", "newsHeadline", "newsSource"],
                      additionalProperties: false,
                    },
                  },
                  newsFeed: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        headline: { type: "string" },
                        source: { type: "string" },
                        sentiment: { type: "string", enum: ["positive", "negative", "neutral"] },
                        relatedTicker: { type: "string" },
                        impact: { type: "string", description: "Brief impact analysis" },
                      },
                      required: ["headline", "source", "sentiment", "relatedTicker", "impact"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["recommendations", "newsFeed"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_recommendations" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings > Workspace > Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(
        JSON.stringify({ error: "AI analysis failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await response.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      console.error("No tool call in AI response");
      return new Response(
        JSON.stringify({ error: "AI did not return structured data" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = JSON.parse(toolCall.function.arguments);
    console.log("AI analysis complete:", result.recommendations?.length, "recommendations");

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Analysis error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
