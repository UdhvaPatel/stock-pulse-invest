# StockPulse (AI Hype Navigator)

**Live Demo:** [https://stock-pulse-invest.vercel.app/](https://stock-pulse-invest.vercel.app/)

**StockPulse** is an AI-powered financial intelligence platform designed to cut through market noise. It autonomously scrapes real-time breaking news, evaluates the context using advanced AI data-structuring, and provides actionable stock market recommendations paired with rich interactive data visualizations to back up its verdicts.

---

## ⚙️ How It Works (The Workflow)

1. **Real-time News Aggregation:** 
   When a user initiates a market scan, the React frontend triggers a Supabase Edge Function (`fetch-news`). This function communicates with the **Firecrawl API** to query the web for the latest financial news (earnings, layoffs, acquisitions) from the past 24 hours, pulling articles cleanly as structured Markdown.

2. **AI Algorithmic Analysis:** 
   The retrieved articles are routed to a second Edge Function (`analyze-news`) which interfaces with **Google Gemini 3 Flash Preview**. Instructed via a strict system prompt to act as an expert financial analyst, the AI utilizes Function Calling to predictably output complex structured JSON—returning precise details like stock tickers affected, Buy/Sell/Hold signals, and granular confidence percentages based on textual context.

3. **Frontend Distress Signal Engine:** 
   Before the data hits the UI layers, the custom `useMarketIntelligence.ts` React hook runs a secondary NLP filter against the headlines. If it detects critical distress keywords (e.g., *emergency*, *bankruptcy*, *rescue*, *bailout*), it explicitly penalizes the sentiment to `negative` and structurally flags the payload. The user interface then reacts by injecting a glaring red **"Distress Signal"** tag over the associated news feed cards.

4. **Interactive Dashboard Charts:**
   With the JSON payload secured in the frontend state via React Query, a suite of analytic visualizations dynamically populates. Powered by **Recharts**, judges and users evaluate:
   - *Line Charts:* Showing simulated high-impact sentiment trajectories over time.
   - *Bar Charts:* Mapping a baseline Model vs. the customized AI Sentiment integrations.
   - *Donut Charts:* Spitting out percentiles of positive, neutral, and negative spillover news.
   - *Scatter Plots:* A customizable stock cluster map demonstrating portfolio grouping matrices (P/E ratio vs Revenue Growth).

5. **Deep Benchmark Scorecards:**
   Inside each AI Recommendation card rests a sprawling visual Investor Scorecard. It cross-references metrics to power individual progress bars indicating Valuation, Momentum, and Analyst Consensus ratings *(Bullish/Neutral/Bearish)*—ultimately culminating in a master overarching algorithmic **Investor Score (out of 100)** dictated dynamically by the context engine.

---

## 🛠️ Tools & Technologies Used

We assembled a modern, highly performant tech stack to construct StockPulse:

### **Frontend & User Interface**
*   **React 18 & Vite:** The lightning-fast core foundations of the Single Page Application.
*   **TypeScript:** Used universally for strict typing and interface adherence on the complex backend JSON responses.
*   **Tailwind CSS:** For rapid, utility-inclusive styling. Configured strictly utilizing the **GitHub Dark Dimmed** aesthetic palette for a sleek premium feel (incorporating `#0D1117` native backgrounds alongside specialized Signal Green/Red/Gold hexadecimal constraints).
*   **Shadcn UI (Radix Primitives):** Engineered structural components, providing accessible and beautiful base UI logic.
*   **Framer Motion:** Powering the entrance scale routines and micro-interactions on the financial scorecards.
*   **Recharts:** Handling the intricate responsive charting capabilities (Line, Scatter, Donut, Bar).
*   **React Query**: Caching, state synchronization, and reliable asynchronous querying architecture.
*   **Lucide React:** Minimal lightweight iconography.

### **Backend Infrastructure & Data APIs**
*   **Supabase Edge Functions (Deno):** True serverless application capabilities. Abstracts API keys securely out of the client browser.
*   **Firecrawl API:** Highly scalable web-scraping tool converting raw Google Search URLs instantly into parsed LLM-ready markdown.

### **Artificial Intelligence**
*   **Google Gemini 3 Flash Preview:** The core LLM routing logic, accessed securely via the Lovable AI Gateway, structured to return enforced function-call JSON.

### **Deployment**
*   **Vercel:** Lightning-fast edge-network continuous integration. Connected directly to GitHub to rebuild live immediately upon git push.