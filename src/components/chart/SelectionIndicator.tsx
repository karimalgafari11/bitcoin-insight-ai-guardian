
import { useLanguage } from "@/contexts/LanguageContext";
import { CandleData } from "@/components/CandleDetail";

interface SelectionIndicatorProps {
  selectedCandleIndex: number | null;
  data: CandleData[];
}

const SelectionIndicator = ({ selectedCandleIndex, data }: SelectionIndicatorProps) => {
  const { t } = useLanguage();
  
  if (selectedCandleIndex === null) return null;
  
  return (
    <div className="absolute top-2 left-2 bg-card/80 backdrop-blur-sm rounded px-2 py-1 text-xs">
      {t("الشمعة المحددة:", "Selected candle:")} {data[selectedCandleIndex]?.date}
    </div>
  );
};

export default SelectionIndicator;
