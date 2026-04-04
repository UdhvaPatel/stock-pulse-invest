import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
  Label,
  TooltipProps
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NewsItem } from '@/hooks/use-market-intelligence';

interface DashboardChartsProps {
  newsFeed?: NewsItem[];
  isLoading?: boolean;
}

// Mock Data for Line Chart
const lineMockData = [
  { date: 'Mar 5', score: 0.3 },
  { date: 'Mar 8', score: 0.45 },
  { date: 'Mar 11', score: 0.2 },
  { date: 'Mar 14', score: -0.1 },
  { date: 'Mar 17', score: 0.15 },
  { date: 'Mar 20', score: 0.6 },
  { date: 'Mar 23', score: 0.55 },
  { date: 'Mar 26', score: 0.4 },
  { date: 'Mar 29', score: 0.7 },
  { date: 'Apr 1', score: 0.8 },
  { date: 'Apr 3', score: 0.75 },
];

// Mock Data for Bar Chart
const barMockData = [
  { name: 'Baseline (price only)', accuracy: 54, fill: '#374151' },
  { name: 'StockPulse (sentiment)', accuracy: 68, fill: '#22c55e' },
  { name: 'StockPulse + Spillover', accuracy: 74, fill: '#3b82f6' },
];

// Mock Data for Scatter Chart
const scatterHighGrowth = [
  { pe: 28, rev: 42, ticker: 'NVDA' },
  { pe: 32, rev: 38, ticker: 'AMD' },
  { pe: 18, rev: 55, ticker: 'PLTR' },
];

const scatterMatureTech = [
  { pe: 18, rev: 22, ticker: 'AAPL' },
  { pe: 22, rev: 18, ticker: 'MSFT' },
];

const scatterLegacy = [
  { pe: 8, rev: 8, ticker: 'INTC' },
  { pe: 12, rev: 12, ticker: 'IBM' },
];

const CustomTooltipLine = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 border border-border p-3 rounded-lg shadow-lg">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground mt-1">
          Sentiment Score: <span className="font-semibold text-foreground">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const CustomTooltipBar = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 border border-border p-3 rounded-lg shadow-lg">
        <p className="text-sm font-medium">{payload[0].payload.name}</p>
        <p className="text-sm text-muted-foreground mt-1">
          Accuracy: <span className="font-semibold text-foreground">{payload[0].value}%</span>
        </p>
      </div>
    );
  }
  return null;
};

const CustomTooltipScatter = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background/95 border border-border p-3 rounded-lg shadow-lg">
        <p className="text-sm font-bold">{data.ticker}</p>
        <p className="text-sm text-muted-foreground mt-1">
          P/E Ratio: <span className="font-semibold text-foreground">{data.pe}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Rev Growth: <span className="font-semibold text-foreground">{data.rev}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ newsFeed = [], isLoading }) => {

  const pieData = useMemo(() => {
    // If we have actual dynamic data
    if (newsFeed && newsFeed.length > 0) {
      let pos = 0, neu = 0, neg = 0;
      newsFeed.forEach((item) => {
        if (item.sentiment === 'positive') pos++;
        else if (item.sentiment === 'negative') neg++;
        else neu++;
      });
      return [
        { name: 'Positive', value: pos, color: '#22c55e' },
        { name: 'Neutral', value: neu, color: '#6b7280' },
        { name: 'Negative', value: neg, color: '#ef4444' },
      ];
    }

    // Fallback Mock Data if no data yet
    return [
      { name: 'Positive', value: 62, color: '#22c55e' },
      { name: 'Neutral', value: 23, color: '#6b7280' },
      { name: 'Negative', value: 15, color: '#ef4444' },
    ];
  }, [newsFeed]);

  const totalPieValues = pieData.reduce((acc, curr) => acc + curr.value, 0);

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card w-full h-[400px] animate-pulse" />
          <Card className="bg-card w-full h-[400px] animate-pulse" />
          <Card className="bg-card w-full h-[400px] animate-pulse" />
          <Card className="bg-card w-full h-[400px] animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <section className="container max-w-6xl mx-auto py-8 px-4">
      <div className="mb-6 flex flex-col gap-2">
        <h2 className="text-2xl font-bold font-display">System Analytics</h2>
        <p className="text-muted-foreground">Deep dive into AI sentiment and model accuracy.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 1: LINE CHART */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold tracking-wider text-signal-buy uppercase">Chart 1 — Highest Impact</span>
            </div>
            <div className="flex items-center gap-3">
              <CardTitle className="text-xl">Sentiment Score Over Time</CardTitle>

            </div>
            <CardDescription className="pt-1">
              Line chart showing daily sentiment score for tracked stocks over last 30 days. Green = positive trajectory.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineMockData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="date" stroke="#888" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltipLine />} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#22c55e', strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* CHART 2: BAR CHART */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold tracking-wider text-signal-buy uppercase">Chart 2</span>
            </div>
            <div className="flex items-center gap-3">
              <CardTitle className="text-xl">Baseline vs Model Accuracy</CardTitle>

            </div>
            <CardDescription className="pt-1">
              Bar chart comparing our model's accuracy vs a price-momentum baseline. Proves sentiment helps.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={barMockData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                <XAxis type="number" domain={[40, 85]} stroke="#888" fontSize={12} tickFormatter={(val) => `${val}%`} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#e5e7eb" fontSize={12} tickLine={false} axisLine={false} width={130} />
                <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltipBar />} />
                <Bar dataKey="accuracy" radius={[0, 4, 4, 0]}>
                  {barMockData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* CHART 3: DONUT CHART */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold tracking-wider text-signal-buy uppercase">Chart 3 — Spillover Effect</span>
            </div>
            <div className="flex items-center gap-3">
              <CardTitle className="text-xl">News Sentiment Breakdown</CardTitle>

            </div>
            <CardDescription className="pt-1">
              Donut chart showing % of positive, neutral, and negative articles analyzed in the current scan.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 h-[300px] flex items-center">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 flex flex-col justify-center gap-4 pl-4">
              {pieData.map((entry, index) => {
                const percentage = totalPieValues > 0 ? Math.round((entry.value / totalPieValues) * 100) : 0;
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-sm font-medium text-foreground">{entry.name}</span>
                    <span className="text-sm text-muted-foreground ml-auto">— {percentage}%</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* CHART 4: SCATTER CHART */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold tracking-wider text-signal-buy uppercase">Chart 4 — Bonus / Clusters</span>
            </div>
            <div className="flex items-center gap-3">
              <CardTitle className="text-xl">Stock Cluster Map</CardTitle>

            </div>
            <CardDescription className="pt-1">
              Bubble chart showing AI stocks grouped by clusters (P/E Ratio vs Revenue Growth).
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 h-[300px] flex flex-col">
            <div className="flex justify-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="text-xs text-muted-foreground">High-growth AI</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500/80" />
                <span className="text-xs text-muted-foreground">Mature tech</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="text-xs text-muted-foreground">Legacy hardware</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 25, left: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" dataKey="pe" stroke="#888" fontSize={12} tickLine={false} axisLine={false} domain={[5, 40]}>
                  <Label value="P/E Ratio" position="insideBottom" offset={-20} fill="#888" fontSize={12} />
                </XAxis>
                <YAxis type="number" dataKey="rev" stroke="#888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 60]}>
                  <Label value="Revenue Growth %" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} fill="#888" fontSize={12} offset={-20} />
                </YAxis>
                <ZAxis type="number" range={[200, 400]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltipScatter />} />
                <Scatter name="High-growth" data={scatterHighGrowth} fill="#22c55e" opacity={0.8} />
                <Scatter name="Mature" data={scatterMatureTech} fill="#3b82f6" opacity={0.8} />
                <Scatter name="Legacy" data={scatterLegacy} fill="#ef4444" opacity={0.8} />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </section>
  );
};
