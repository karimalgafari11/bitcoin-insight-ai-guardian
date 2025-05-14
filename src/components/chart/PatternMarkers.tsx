
import { ReferenceLine } from "recharts";
import { CandleData } from "@/components/CandleDetail";

interface PatternMarkersProps {
  patterns: Array<{ index: number; type: string }>;
  data: CandleData[];
}

const PatternMarkers = ({ patterns, data }: PatternMarkersProps) => {
  return (
    <>
      {patterns.map((pattern, index) => (
        <ReferenceLine
          key={`pattern-${index}`}
          x={data[pattern.index]?.date}
          yAxisId="price"
          stroke="#ffcc00"
          strokeWidth={1}
          strokeDasharray="3 3"
        />
      ))}
    </>
  );
};

export default PatternMarkers;
