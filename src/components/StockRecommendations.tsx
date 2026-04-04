import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Clock, ExternalLink, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { StockRecommendation, Signal } from "@/hooks/use-market-intelligence";

const SignalIcon = ({ signal }: { signal: Signal }) => {
  if (signal === "buy") return <TrendingUp className="h-5 w-5 text-signal-buy" />;
  if (signal === "sell") return <TrendingDown className="h-5 w-5 text-signal-sell" />;
  return <Minus className="h-5 w-5 text-signal-hold" />;
};

const signalGlow: Record<Signal, string> = {
  buy: "shadow-glow-buy",
  sell: "shadow-glow-sell",
  hold: "shadow-glow-hold",
};

const signalBorder: Record<Signal, string> = {
  buy: "border-signal-buy",
  sell: "border-signal-sell",
  hold: "border-signal-hold",
};

interface Props {
  recommendations: StockRecommendation[];
  isLoading: boolean;
}

export function StockRecommendations({ recommendations, isLoading }: Props) {
  return (
    <section className="py-16 px-4">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="text-3xl font-bold tracking-tight mb-2">AI Recommendations</h2>
          <p className="text-muted-foreground">Real-time signals based on breaking news and AI analysis</p>
        </motion.div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="text-muted-foreground text-sm">Analyzing market news with AI...</p>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg mb-2">No recommendations yet</p>
            <p className="text-sm">Click "Analyze Market" to scan live news and generate signals</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {recommendations.map((rec, i) => {
              // Mock logic based on signal
              const isBuy = rec.signal === "buy";
              const isSell = rec.signal === "sell";
              const overallScore = isBuy ? 82 : isSell ? 35 : 55;
              const scoreColor = isBuy ? 'text-signal-buy' : isSell ? 'text-signal-sell' : 'text-signal-hold';
              
              const scorecardData = [
                { label: "Valuation", score: isBuy ? 40 : 20, badge: isBuy ? "Neutral" : "Bearish", color: isBuy ? "bg-signal-hold" : "bg-signal-sell" },
                { label: "Momentum", score: isBuy ? 85 : 30, badge: isBuy ? "Bullish" : "Bearish", color: isBuy ? "bg-signal-buy" : "bg-signal-sell" },
                { label: "Analyst Consensus", score: isBuy ? 75 : 45, badge: isBuy ? "Bullish" : "Neutral", color: isBuy ? "bg-signal-buy" : "bg-signal-hold" },
                { label: "AI Sentiment", score: rec.confidence, badge: isBuy ? "Bullish" : isSell ? "Bearish" : "Neutral", color: isBuy ? "bg-signal-buy" : isSell ? "bg-signal-sell" : "bg-signal-hold" }
              ];

              return (
                <motion.div
                  key={`${rec.ticker}-${i}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <Card
                    className={`bg-gradient-card border ${signalBorder[rec.signal]} hover:scale-[1.01] transition-all duration-300 h-full overflow-hidden`}
                  >
                    <CardContent className="p-0">
                      
                      {/* Top Section: Original Content */}
                      <div className="p-6 border-b border-border/50">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <SignalIcon signal={rec.signal} />
                            <div>
                              <span className="font-mono text-xl font-bold">{rec.ticker}</span>
                              <p className="text-sm text-muted-foreground">{rec.company}</p>
                            </div>
                          </div>
                          <Badge variant={rec.signal} className="px-3 py-1 text-xs">{rec.signal.toUpperCase()}</Badge>
                        </div>

                        <div className="mb-4 max-w-md">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground font-medium">AI Confidence</span>
                            <span className="font-mono">{rec.confidence}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${
                                rec.signal === "buy" ? "bg-signal-buy" : rec.signal === "sell" ? "bg-signal-sell" : "bg-signal-hold"
                              }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${rec.confidence}%` }}
                              transition={{ duration: 0.8, delay: i * 0.1 }}
                            />
                          </div>
                        </div>

                        <p className="text-[15px] text-secondary-foreground leading-relaxed mb-4">{rec.reason}</p>

                        <div className="flex items-start gap-3 p-3 rounded-md bg-secondary/30 border border-border/50 max-w-3xl">
                          <ExternalLink className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-foreground leading-snug">{rec.newsHeadline}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-semibold text-muted-foreground">{rec.newsSource}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Middle Section: Benchmark Panel */}
                      <div className="p-6 bg-secondary/10 border-b border-border/50">
                        <h4 className="text-xs font-bold mb-4 text-muted-foreground uppercase tracking-wider">Benchmark Panel</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Valuation */}
                          <div className="bg-card border border-border p-4 rounded-md shadow-sm">
                            <p className="text-xs text-muted-foreground font-semibold mb-2 uppercase tracking-wide">Valuation</p>
                            <p className="text-sm font-mono tracking-tight">P/E: <span className="font-bold text-foreground">{isBuy ? '18x' : '35x'}</span> vs Sector <span className="text-muted-foreground">20x</span> vs S&P <span className="text-muted-foreground">22x</span></p>
                          </div>
                          {/* Price Momentum */}
                          <div className="bg-card border border-border p-4 rounded-md shadow-sm">
                            <p className="text-xs text-muted-foreground font-semibold mb-2 uppercase tracking-wide">Price Momentum</p>
                            <p className="text-sm font-mono tracking-tight">30d Return: <span className={`${isBuy ? 'text-signal-buy' : 'text-signal-sell'} font-bold`}>{isBuy ? '+12%' : '-4%'}</span> vs Sector <span className="text-muted-foreground">+5%</span> vs S&P <span className="text-muted-foreground">+2%</span></p>
                          </div>
                          {/* Analyst Consensus */}
                          <div className="bg-card border border-border p-4 rounded-md shadow-sm">
                            <p className="text-xs text-muted-foreground font-semibold mb-3 uppercase tracking-wide">Analyst Consensus</p>
                            <div className="flex h-2.5 w-full rounded-full overflow-hidden">
                              <div className="bg-signal-buy transition-all" style={{ width: isBuy ? '70%' : '20%' }} title="Buy" />
                              <div className="bg-signal-hold transition-all" style={{ width: isBuy ? '20%' : '50%' }} title="Hold" />
                              <div className="bg-signal-sell transition-all" style={{ width: isBuy ? '10%' : '30%' }} title="Sell" />
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-2 font-mono">{isBuy ? '14 Buy / 4 Hold / 2 Sell' : '4 Buy / 10 Hold / 6 Sell'}</p>
                          </div>
                          {/* AI Sentiment */}
                          <div className="bg-card border border-border p-4 rounded-md shadow-sm">
                            <p className="text-xs text-muted-foreground font-semibold mb-2 uppercase tracking-wide">AI Sentiment vs History</p>
                            <p className="text-sm font-mono tracking-tight">Score: <span className={`${scoreColor} font-bold`}>{rec.confidence}</span> vs 90d Avg <span className="text-muted-foreground">50</span> vs Sector <span className="text-muted-foreground">62</span></p>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Section: Scorecard */}
                      <div className="p-6 flex flex-col md:flex-row gap-8 items-center bg-background/30 w-full relative">
                        <div className="flex-1 space-y-5 w-full">
                          <h4 className="text-xs font-bold mb-1 text-muted-foreground uppercase tracking-wider">Investor Verdict Scorecard</h4>
                          
                          {scorecardData.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                              <span className="w-36 text-sm font-semibold">{item.label}</span>
                              <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                                <motion.div 
                                  className={`h-full ${item.color}`}
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${item.score}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 1, delay: idx * 0.1 }}
                                />
                              </div>
                              <Badge variant="outline" className={`w-20 justify-center text-[10px] uppercase font-bold tracking-wide ${item.color.replace('bg-', 'text-')} border-current/30`}>
                                {item.badge}
                              </Badge>
                            </div>
                          ))}
                        </div>

                        <div className="md:w-56 shrink-0 flex flex-col items-center justify-center p-6 bg-card border border-border shadow-md rounded-xl">
                          <span className="text-xs font-bold text-muted-foreground uppercase mb-3 text-center tracking-wider">Overall Investor Score</span>
                          <div className={`text-6xl font-black font-mono ${scoreColor}`}>
                            {overallScore}
                          </div>
                          <div className="mt-4 px-3 py-1 rounded bg-secondary/50 border border-border text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                            Out of 100
                          </div>
                        </div>
                      </div>

                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
