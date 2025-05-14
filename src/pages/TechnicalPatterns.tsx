
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";

const TechnicalPatterns = () => {
  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">الأنماط الفنية</h1>
            <div className="flex items-center gap-4">
              <SidebarTrigger />
            </div>
          </div>
          
          <Card className="border-zinc-800">
            <CardHeader>
              <CardTitle>صفحة الأنماط الفنية</CardTitle>
            </CardHeader>
            <CardContent>
              <p>سيتم تطوير هذه الصفحة لاكتشاف وتحليل الأنماط الفنية مثل المثلثات، القنوات، الرأس والكتفين، وغيرها.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TechnicalPatterns;
