
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface EducationLessonProps {
  title: string;
  description: string;
  content: string;
}

const EducationLesson: React.FC<EducationLessonProps> = ({ 
  title, 
  description,
  content
}) => {
  return (
    <div className="py-2">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      <Card className="bg-primary/5 border-primary/10">
        <CardContent className="p-4 prose prose-sm dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </CardContent>
      </Card>
    </div>
  );
};

export default EducationLesson;
