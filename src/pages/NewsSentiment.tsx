
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";

const NewsSentiment = () => {
  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">الأخبار والمعنويات</h1>
            <div className="flex items-center gap-4">
              <SidebarTrigger />
            </div>
          </div>
          
          <Card className="border-zinc-800">
            <CardHeader>
              <CardTitle>أخبار البيتكوين وتحليل المعنويات</CardTitle>
            </CardHeader>
            <CardContent>
              <p>سيتم تطوير هذه الصفحة لعرض أحدث الأخبار وتحليل معنويات السوق.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewsSentiment;
