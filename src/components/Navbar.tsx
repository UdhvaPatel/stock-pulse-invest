import { Activity } from "lucide-react";
import React, { useState, useEffect } from 'react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const checkMarketStatus = () => {
    
    const now = new Date();
    const cstString = now.toLocaleString("en-US", { timeZone: "America/Chicago" });
    const cstDate = new Date(cstString);

    const day = cstDate.getDay(); 
    const hour = cstDate.getHours();
    const minute = cstDate.getMinutes();
    
    const year = cstDate.getFullYear();
    const month = String(cstDate.getMonth() + 1).padStart(2, '0');
    const date = String(cstDate.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${date}`;

    const holidays2026 = [
      "2026-01-01", "2026-01-19", "2026-02-16", "2026-04-03", 
      "2026-05-25", "2026-06-19", "2026-07-03", "2026-09-07", 
      "2026-11-26", "2026-12-25"
    ];

    const earlyCloseDays = ["2026-07-02", "2026-11-27", "2026-12-24"];

    const isWeekend = day === 0 || day === 6;
    const isHoliday = holidays2026.includes(dateString);
    
    const currentTimeMinutes = hour * 60 + minute;
    const openTimeMinutes = 8 * 60 + 30; // 8:30 AM
    const closeTimeMinutes = earlyCloseDays.includes(dateString) ? 12 * 60 : 15 * 60;

    const isWithinHours = currentTimeMinutes >= openTimeMinutes && currentTimeMinutes < closeTimeMinutes;

    setIsOpen(!isWeekend && !isHoliday && isWithinHours);
  };

  useEffect(() => {
    checkMarketStatus();
    const interval = setInterval(checkMarketStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <span className="text-lg font-bold tracking-tight">
            Stock<span className="text-primary">Pulse</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          
        </div>

        <div className="flex items-center gap-2">
          <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-500 ${
            isOpen 
              ? "bg-emerald-500/10 border-emerald-500/20" 
              : "bg-muted/50 border-border"
          }`}>
            <div className={`h-1.5 w-1.5 rounded-full ${
              isOpen ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"
            }`} />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${
              isOpen ? "text-emerald-500" : "text-muted-foreground"
            }`}>
              {isOpen ? "Markets Open" : "Markets Closed"}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}