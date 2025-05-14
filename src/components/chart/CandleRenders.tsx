
import { ReferenceLine } from "recharts";
import { CandleData } from "@/components/CandleDetail";

interface CandleRendersProps {
  data: CandleData[];
  selectedCandleIndex: number | null;
}

export const CandleWicks = ({ data, selectedCandleIndex }: CandleRendersProps) => {
  return (
    <>
      {data.map((entry, index) => (
        <ReferenceLine
          key={`candle-${index}`}
          x={entry.date}
          yAxisId="price"
          stroke={selectedCandleIndex === index ? "#9b87f5" : "transparent"}
          strokeWidth={selectedCandleIndex === index ? 2 : 1}
          segment={[
            { x: index, y: entry.low },
            { x: index, y: entry.high }
          ]}
        />
      ))}
    </>
  );
};

export const CandleBodies = ({ data, selectedCandleIndex }: CandleRendersProps) => {
  return (
    <>
      {data.map((entry, index) => (
        <ReferenceLine
          key={`body-${index}`}
          yAxisId="price"
          x={entry.date}
          stroke={selectedCandleIndex === index 
            ? "#9b87f5" 
            : entry.open > entry.close ? "#f6465d" : "#0ecb81"
          }
          strokeWidth={selectedCandleIndex === index ? 10 : 8}
          segment={[
            { x: index, y: entry.open },
            { x: index, y: entry.close }
          ]}
        />
      ))}
    </>
  );
};
