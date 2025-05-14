
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";

const RiskCalculator = () => {
  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">حاسبة المخاطر</h1>
            <div className="flex items-center gap-4">
              <SidebarTrigger />
            </div>
          </div>
          
          <Card className="border-zinc-800">
            <CardHeader>
              <CardTitle>حاسبة إدارة المخاطر</CardTitle>
            </CardHeader>
            <CardContent>
              <p>سيتم تطوير هذه الصفحة لحساب حجم المراكز، وقف الخسارة، وأهداف الربح.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RiskCalculator;
