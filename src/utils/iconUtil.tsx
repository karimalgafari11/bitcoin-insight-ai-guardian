
import React from "react";
import { BookText, GraduationCap, LineChart, BookOpen, Presentation, Video } from "lucide-react";

export type IconType = "bookText" | "lineChart" | "graduationCap" | "bookOpen" | "presentation" | "video";

export const getIcon = (iconType: IconType) => {
  switch (iconType) {
    case "bookText":
      return <BookText className="h-5 w-5 text-primary" />;
    case "lineChart":
      return <LineChart className="h-5 w-5 text-primary" />;
    case "graduationCap":
      return <GraduationCap className="h-5 w-5 text-primary" />;
    case "bookOpen":
      return <BookOpen className="h-5 w-5 text-primary" />;
    case "presentation":
      return <Presentation className="h-5 w-5 text-primary" />;
    case "video":
      return <Video className="h-5 w-5 text-primary" />;
    default:
      return <BookText className="h-5 w-5 text-primary" />;
  }
};
