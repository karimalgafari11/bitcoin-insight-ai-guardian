
import { useState } from "react";
import { Button } from "@/components/ui/button";

type TimeframeOption = "4h" | "1d" | "1w" | "1m";

type TimeframeSelectorProps = {
  onTimeframeChange: (timeframe: TimeframeOption) => void;
  className?: string;
};

const TimeframeSelector = ({ onTimeframeChange, className }: TimeframeSelectorProps) => {
  const [activeTimeframe, setActiveTimeframe] = useState<TimeframeOption>("4h");
  
  const timeframes: TimeframeOption[] = ["4h", "1d", "1w", "1m"];
  
  const handleTimeframeChange = (timeframe: TimeframeOption) => {
    setActiveTimeframe(timeframe);
    onTimeframeChange(timeframe);
  };
  
  const getTimeframeLabel = (timeframe: TimeframeOption) => {
    switch (timeframe) {
      case "4h": return "4 ساعات";
      case "1d": return "يوم";
      case "1w": return "أسبوع";
      case "1m": return "شهر";
    }
  };

  return (
    <div className={`flex space-x-2 ${className}`}>
      {timeframes.map((timeframe) => (
        <Button
          key={timeframe}
          variant={activeTimeframe === timeframe ? "default" : "outline"}
          size="sm"
          onClick={() => handleTimeframeChange(timeframe)}
          className="px-3"
        >
          {getTimeframeLabel(timeframe)}
        </Button>
      ))}
    </div>
  );
};

export default TimeframeSelector;
