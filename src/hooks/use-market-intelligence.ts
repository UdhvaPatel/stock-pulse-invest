import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type Signal = "buy" | "sell" | "hold";
export type Sentiment = "positive" | "negative" | "neutral";

export interface StockRecommendation {
  ticker: string;
  company: string;
  signal: Signal;
  confidence: number;
  reason: string;
  newsHeadline: string;
  newsSource: string;
}

export interface NewsItem {
  headline: string;
  source: string;
  sentiment: Sentiment;
  relatedTicker: string;
  impact: string;
  isDistressSignal?: boolean;
}

export interface MarketData {
  recommendations: StockRecommendation[];
  newsFeed: NewsItem[];
}

export function useMarketIntelligence() {
  const [data, setData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAndAnalyze = useCallback(async (query?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Fetch news via Firecrawl
      const { data: newsData, error: newsError } = await supabase.functions.invoke("fetch-news", {
        body: { query: query || "stock market breaking news company earnings layoffs investments acquisitions today" },
      });

      if (newsError) throw new Error(newsError.message || "Failed to fetch news");
      if (!newsData?.success && newsData?.error) throw new Error(newsData.error);

      const articles = newsData?.data || [];
      if (articles.length === 0) {
        throw new Error("No news articles found. Try a different search.");
      }

      // Step 2: Analyze with AI
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke("analyze-news", {
        body: { newsArticles: articles },
      });

      if (analysisError) throw new Error(analysisError.message || "Failed to analyze news");
      if (analysisData?.error) {
        // Surface rate limit / credit errors
        toast({
          title: "Analysis Error",
          description: analysisData.error,
          variant: "destructive",
        });
        throw new Error(analysisData.error);
      }

      const result = analysisData?.data as MarketData;
      if (result) {
        // NLP Logic: Flag distressed news
        const distressKeywords = ["emergency", "lifeline", "bankruptcy", "restructure", "rescue", "bailout"];
        const processedNewsFeed = result.newsFeed?.map(item => {
          const lowerHeadline = item.headline.toLowerCase();
          const isDistress = distressKeywords.some(kw => lowerHeadline.includes(kw));
          if (isDistress) {
            return { ...item, sentiment: "negative" as Sentiment, isDistressSignal: true };
          }
          return item;
        }) || [];

        setData({
          ...result,
          newsFeed: processedNewsFeed
        });
      } else {
        throw new Error("No analysis data returned");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return { data, isLoading, error, fetchAndAnalyze };
}
