
import { 
  BarChart3, 
  BookText, 
  ChartCandlestick, 
  CircleHelp,
  Home, 
  Newspaper, 
  Settings as SettingsIcon, 
  TrendingUp,
  Calculator
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

const AppSidebar = () => {
  const location = useLocation();
  
  const navigationItems = [
    {
      title: "الرئيسية",
      path: "/",
      icon: Home,
    },
    {
      title: "التحليل",
      path: "/analysis",
      icon: TrendingUp,
    },
    {
      title: "الأنماط الفنية",
      path: "/technical-patterns",
      icon: BarChart3,
    },
    {
      title: "تحليل الشموع",
      path: "/candlestick-analysis",
      icon: ChartCandlestick,
    },
    {
      title: "الأخبار والمعنويات",
      path: "/news-sentiment",
      icon: Newspaper,
    },
    {
      title: "دفتر التداول",
      path: "/trading-journal",
      icon: BookText,
    },
    {
      title: "حاسبة المخاطر",
      path: "/risk-calculator",
      icon: Calculator,
    },
    {
      title: "التعليم",
      path: "/education",
      icon: CircleHelp,
    },
    {
      title: "الإعدادات",
      path: "/settings",
      icon: SettingsIcon,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center px-4 py-5">
        <span className="text-xl font-semibold">BitSight</span>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild className={location.pathname === item.path ? "bg-sidebar-accent" : ""}>
                    <Link to={item.path} className="flex items-center gap-3 text-right">
                      <item.icon className="h-[18px] w-[18px]" />
                      <span className="flex-1">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="px-4 py-3 text-xs text-muted-foreground">
        BitSight &copy; 2025
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
