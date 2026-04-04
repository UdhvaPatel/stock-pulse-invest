import { motion } from "framer-motion";
import { Clock, Zap, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import type { NewsItem } from "@/hooks/use-market-intelligence";

interface Props {
  newsItems: NewsItem[];
  isLoading: boolean;
}

export function NewsFeed({ newsItems, isLoading }: Props) {
  return (
    <section className="py-16 px-4 bg-surface-elevated/50">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Live News Feed</h2>
            <p className="text-muted-foreground">Breaking market news with AI-powered sentiment analysis</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-primary">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-mono">AI-Analyzed</span>
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
            <p className="text-muted-foreground text-sm">Scanning news sources...</p>
          </div>
        ) : newsItems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>News feed will populate after analysis</p>
          </div>
        ) : (
          <div className="space-y-3">
            {newsItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="group flex items-start gap-4 p-4 rounded-lg border border-border/50 bg-card hover:bg-secondary/30 transition-all cursor-pointer"
              >
                <div className={`mt-1 p-1.5 rounded-md ${
                  item.sentiment === "positive" ? "bg-signal-buy/10" : item.sentiment === "negative" ? "bg-signal-sell/10" : "bg-secondary"
                }`}>
                  {item.sentiment === "positive" ? (
                    <ArrowUpRight className="h-4 w-4 text-signal-buy" />
                  ) : item.sentiment === "negative" ? (
                    <ArrowDownRight className="h-4 w-4 text-signal-sell" />
                  ) : (
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  {item.isDistressSignal && (
                    <span className="inline-flex items-center rounded-sm bg-destructive/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-destructive ring-1 ring-inset ring-destructive/20 mb-1.5">
                      Distress Signal
                    </span>
                  )}
                  <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors">
                    {item.headline}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1.5">{item.impact}</p>
                  <span className="text-xs text-muted-foreground mt-2 inline-block">{item.source}</span>
                </div>

                <div className="shrink-0">
                  <span className="font-mono text-sm font-semibold text-primary">{item.relatedTicker}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
