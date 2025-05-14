
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TechnicalPatternCard, { PatternData } from "./TechnicalPatternCard";

interface TechnicalPatternsListProps {
  patterns: PatternData[];
  className?: string;
}

const TechnicalPatternsList = ({ patterns, className }: TechnicalPatternsListProps) => {
  if (patterns.length === 0) {
    return (
      <Card className={`${className} border-zinc-800`}>
        <CardHeader>
          <CardTitle className="text-lg">الأنماط الفنية المكتشفة</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">لم يتم اكتشاف أنماط فنية في الإطار الزمني الحالي</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} border-zinc-800`}>
      <CardHeader>
        <CardTitle className="text-lg">الأنماط الفنية المكتشفة</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {patterns.map((pattern) => (
          <TechnicalPatternCard key={pattern.id} pattern={pattern} />
        ))}
      </CardContent>
    </Card>
  );
};

export default TechnicalPatternsList;
