
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronRight } from "lucide-react";
import EducationLesson from "./EducationLesson";
import { useLanguage } from "@/contexts/LanguageContext";
import { IconType, getIcon } from "@/utils/iconUtil";

export interface Lesson {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  content: string;
  contentEn: string;
}

export interface CategoryProps {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  iconType: IconType;
  lessons: Lesson[];
}

const EducationCategory: React.FC<CategoryProps> = ({
  id,
  title,
  titleEn,
  description,
  descriptionEn,
  iconType,
  lessons
}) => {
  const { t } = useLanguage();
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

  const handleLessonClick = (lessonId: string) => {
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
  };

  return (
    <Card className="mb-6 border-zinc-800 hover:shadow-lg transition-all">
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-md">
          {getIcon(iconType)}
        </div>
        <div>
          <CardTitle>{t(title, titleEn)}</CardTitle>
          <p className="text-sm text-muted-foreground">{t(description, descriptionEn)}</p>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {lessons.map((lesson) => (
            <AccordionItem key={lesson.id} value={lesson.id}>
              <AccordionTrigger className="hover:text-primary">
                <div className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4" />
                  <span>{t(lesson.title, lesson.titleEn)}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <EducationLesson 
                  title={t(lesson.title, lesson.titleEn)} 
                  description={t(lesson.description, lesson.descriptionEn)}
                  content={t(lesson.content, lesson.contentEn)}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default EducationCategory;
