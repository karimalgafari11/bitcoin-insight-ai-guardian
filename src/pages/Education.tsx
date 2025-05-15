
import React, { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import EducationCategory from "@/components/EducationCategory";
import { educationCategories } from "@/data/educationData";
import { Search } from "lucide-react";

const Education = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Filter categories based on search term
  const filteredCategories = educationCategories.filter((category) => {
    // If a specific tab is selected, filter by tab first
    if (activeTab !== "all" && category.id !== activeTab) {
      return false;
    }

    // Then apply search filter if there is a search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      // Search in category title and description
      const matchesCategory = 
        t(category.title, category.titleEn).toLowerCase().includes(searchLower) || 
        t(category.description, category.descriptionEn).toLowerCase().includes(searchLower);
      
      // Search in lessons
      const matchesLesson = category.lessons.some(lesson => 
        t(lesson.title, lesson.titleEn).toLowerCase().includes(searchLower) || 
        t(lesson.description, lesson.descriptionEn).toLowerCase().includes(searchLower)
      );
      
      return matchesCategory || matchesLesson;
    }
    
    return true;
  });

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">{t("التعليم", "Education")}</h1>
            <div className="flex items-center gap-4">
              <SidebarTrigger />
            </div>
          </div>
          
          <Card className="border-zinc-800 mb-6">
            <CardHeader>
              <CardTitle>{t("مركز المعرفة", "Knowledge Center")}</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                {t(
                  "استكشف المحتوى التعليمي حول التحليل الفني، أنماط التداول، وفهم سوق البيتكوين",
                  "Explore educational content about technical analysis, trading patterns, and Bitcoin market understanding"
                )}
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    className="pl-10" 
                    placeholder={t("البحث عن المحتوى التعليمي...", "Search educational content...")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Tabs 
                  defaultValue="all" 
                  className="w-full"
                  value={activeTab}
                  onValueChange={setActiveTab}
                >
                  <TabsList className="mb-4 flex-wrap">
                    <TabsTrigger value="all">
                      {t("الكل", "All")}
                    </TabsTrigger>
                    {educationCategories.map((category) => (
                      <TabsTrigger key={category.id} value={category.id}>
                        {t(category.title, category.titleEn)}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  <TabsContent value="all" className="space-y-4">
                    {filteredCategories.map((category) => (
                      <EducationCategory
                        key={category.id}
                        id={category.id}
                        title={category.title}
                        titleEn={category.titleEn}
                        description={category.description}
                        descriptionEn={category.descriptionEn}
                        icon={category.icon}
                        lessons={category.lessons}
                      />
                    ))}
                    
                    {filteredCategories.length === 0 && (
                      <div className="text-center py-10">
                        <p className="text-muted-foreground">
                          {t("لا توجد نتائج بحث مطابقة", "No matching search results")}
                        </p>
                      </div>
                    )}
                  </TabsContent>
                  
                  {educationCategories.map((category) => (
                    <TabsContent key={category.id} value={category.id} className="space-y-4">
                      {filteredCategories.map((filteredCategory) => (
                        filteredCategory.id === category.id && (
                          <EducationCategory
                            key={filteredCategory.id}
                            id={filteredCategory.id}
                            title={filteredCategory.title}
                            titleEn={filteredCategory.titleEn}
                            description={filteredCategory.description}
                            descriptionEn={filteredCategory.descriptionEn}
                            icon={filteredCategory.icon}
                            lessons={filteredCategory.lessons}
                          />
                        )
                      ))}
                      
                      {filteredCategories.length === 0 && (
                        <div className="text-center py-10">
                          <p className="text-muted-foreground">
                            {t("لا توجد نتائج بحث مطابقة", "No matching search results")}
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Education;
