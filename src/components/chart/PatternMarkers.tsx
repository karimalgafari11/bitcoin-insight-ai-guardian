
import { ReferenceLine, ReferenceArea } from "recharts";
import { CandleData } from "@/components/CandleDetail";
import { useLanguage } from "@/contexts/LanguageContext";

interface PatternProps {
  index: number;
  type: string;
}

interface PatternMarkersProps {
  patterns: PatternProps[];
  data: CandleData[];
  selectedPatternIndex: number | null;
  onSelectPattern: (patternIndex: number | null) => void;
}

const PatternMarkers = ({ 
  patterns, 
  data, 
  selectedPatternIndex,
  onSelectPattern 
}: PatternMarkersProps) => {
  const { t } = useLanguage();
  
  // Determine pattern color and style based on type
  const getPatternStyle = (type: string) => {
    switch (type) {
      case "bullish-engulfing":
      case "hammer":
      case "morning-star":
        return {
          stroke: "#0ecb81",
          fill: "rgba(14, 203, 129, 0.2)",
          strokeDasharray: "3 3"
        };
      case "bearish-engulfing":
      case "shooting-star":
      case "evening-star":
        return {
          stroke: "#f6465d",
          fill: "rgba(246, 70, 93, 0.2)",
          strokeDasharray: "3 3"
        };
      case "doji":
        return {
          stroke: "#ffcc00",
          fill: "rgba(255, 204, 0, 0.2)",
          strokeDasharray: "3 3"
        };
      default:
        return {
          stroke: "#9b87f5",
          fill: "rgba(155, 135, 245, 0.2)",
          strokeDasharray: "3 3"
        };
    }
  };

  // Get pattern label based on pattern type
  const getPatternLabel = (type: string) => {
    switch (type) {
      case "bullish-engulfing": return t("ابتلاع صعودي", "Bullish Engulfing");
      case "hammer": return t("المطرقة", "Hammer");
      case "doji": return t("دوجي", "Doji");
      case "bearish-engulfing": return t("ابتلاع هبوطي", "Bearish Engulfing");
      case "shooting-star": return t("نجمة ساقطة", "Shooting Star");
      case "morning-star": return t("نجمة الصباح", "Morning Star");
      case "evening-star": return t("نجمة المساء", "Evening Star");
      default: return type;
    }
  };
  
  return (
    <>
      {patterns.map((pattern, index) => {
        const patternStyle = getPatternStyle(pattern.type);
        const isSelected = selectedPatternIndex === index;
        const patternEndIndex = Math.min(pattern.index + 2, data.length - 1);
        
        return (
          <g key={`pattern-${index}`} onClick={() => onSelectPattern(isSelected ? null : index)}>
            {/* Highlight pattern area */}
            {data[pattern.index] && data[patternEndIndex] && (
              <ReferenceArea
                x1={data[pattern.index].date}
                x2={data[patternEndIndex].date}
                yAxisId="price"
                stroke={isSelected ? "#ffffff" : patternStyle.stroke}
                strokeWidth={isSelected ? 2 : 1}
                fill={patternStyle.fill}
                strokeDasharray={patternStyle.strokeDasharray}
                className="cursor-pointer"
              />
            )}
            
            {/* Pattern marker line */}
            <ReferenceLine
              x={data[pattern.index]?.date}
              yAxisId="price"
              stroke={isSelected ? "#ffffff" : patternStyle.stroke}
              strokeWidth={isSelected ? 2 : 1}
              strokeDasharray={patternStyle.strokeDasharray}
              className="cursor-pointer"
            />
            
            {/* Pattern label (only show if selected) */}
            {isSelected && data[pattern.index] && (
              <text
                x={0}
                y={0}
                dy={-10}
                fill="#ffffff"
                fontSize={12}
                textAnchor="start"
              >
                {getPatternLabel(pattern.type)}
              </text>
            )}
          </g>
        );
      })}
    </>
  );
};

export default PatternMarkers;
