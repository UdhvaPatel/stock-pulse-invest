import { motion } from "framer-motion";
import { Newspaper, Brain, BarChart3, Bell} from "lucide-react";

const steps = [
  {
    icon: Newspaper,
    title: "Scan News Sources",
    description: "AI monitors 10,000+ news outlets, SEC filings, and social media for market-moving events.",
  },
  {
    icon: Brain,
    title: "Analyze Sentiment",
    description: "Natural language processing determines whether news is positive, negative, or neutral for each stock.",
  },
  {
    icon: BarChart3,
    title: "Generate Signals",
    description: "Algorithms cross-reference news sentiment with price action and fundamentals to produce Buy, Sell, or Hold signals.",
  },
  {
    icon: Newspaper,
    title: "Summary",
    description: "AI system processes news sentiment to generate actionable trading signals with clear supporting logical explanations.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 px-4">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl font-bold tracking-tight mb-3">How It Works</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            From breaking news to actionable investment signals in seconds
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative p-6 rounded-xl border border-border/50 bg-gradient-card group hover:border-primary/30 transition-all"
            >
              <div className="absolute -top-3 -left-1 font-mono text-5xl font-bold text-primary/5 group-hover:text-primary/10 transition-colors">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="relative z-10">
                <div className="p-2.5 rounded-lg bg-primary/10 w-fit mb-4">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
