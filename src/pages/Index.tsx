import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { StockRecommendations } from "@/components/StockRecommendations";
import { NewsFeed } from "@/components/NewsFeed";
import { HowItWorks } from "@/components/HowItWorks";
import { DashboardCharts } from "@/components/DashboardCharts";
import { useMarketIntelligence } from "@/hooks/use-market-intelligence";

const Index = () => {
  const { data, isLoading, fetchAndAnalyze } = useMarketIntelligence();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <HeroSection
          onAnalyze={fetchAndAnalyze}
          isLoading={isLoading}
          hasData={!!data}
        />
        <DashboardCharts 
          newsFeed={data?.newsFeed} 
          isLoading={isLoading} 
        />
        <StockRecommendations
          recommendations={data?.recommendations || []}
          isLoading={isLoading}
        />
        <NewsFeed
          newsItems={data?.newsFeed || []}
          isLoading={isLoading}
        />
        <HowItWorks />
      </main>

      <footer className="border-t border-border/50 py-10 px-4">
        <div className="container max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2026 StockPulse. AI-powered investment intelligence.</p>
          <p className="text-xs text-muted-foreground/60">Not financial advice. Always do your own research before investing.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
