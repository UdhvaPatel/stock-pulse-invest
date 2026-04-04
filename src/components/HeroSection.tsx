import { motion } from "framer-motion";
import { Activity, TrendingUp, TrendingDown, BarChart3, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Props {
  onAnalyze: (query?: string) => void;
  isLoading: boolean;
  hasData: boolean;
}

export function HeroSection({ onAnalyze, isLoading, hasData }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleAnalyze = () => {
    onAnalyze(searchQuery || undefined);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-hero min-h-[85vh] flex items-center">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />

      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="h-2 w-2 rounded-full bg-signal-buy animate-pulse-glow" />
              <span className="text-sm font-mono text-muted-foreground tracking-wider uppercase">
                Live Market Intelligence
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
              Smart Investing,{" "}
              <span className="text-gradient-hero">Powered by News</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8 leading-relaxed">
              AI scans thousands of news sources in real-time to tell you which stocks to 
              buy, sell, or hold — and exactly why.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 mb-12"
          >
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="e.g. Tesla layoffs, Apple earnings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                className="pl-10 bg-secondary/50 border-border/50 h-12"
              />
            </div>
            <Button
              variant="hero"
              size="lg"
              className="text-base px-8 h-12"
              onClick={handleAnalyze}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Market"
              )}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { icon: Activity, label: "News Sources", value: "10,000+", sub: "monitored" },
              { icon: TrendingUp, label: "Buy Signals", value: hasData ? "Live" : "—", sub: "AI-powered" },
              { icon: TrendingDown, label: "Sell Alerts", value: hasData ? "Live" : "—", sub: "AI-powered" },
              { icon: BarChart3, label: "Analysis", value: "Real-time", sub: "Gemini AI" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                className="p-4 rounded-lg bg-surface-elevated border border-border/50"
              >
                <stat.icon className="h-4 w-4 text-primary mb-2" />
                <div className="font-mono text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">
                  {stat.label} <span className="text-primary/60">· {stat.sub}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
