
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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import UserProfile from "./UserProfile";

const AppSidebar = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  const navigationItems = [
    {
      title: t("الرئيسية", "Home"),
      path: "/",
      icon: Home,
    },
    {
      title: t("التحليل", "Analysis"),
      path: "/analysis",
      icon: TrendingUp,
    },
    {
      title: t("الأنماط الفنية", "Technical Patterns"),
      path: "/technical-patterns",
      icon: BarChart3,
    },
    {
      title: t("تحليل الشموع", "Candlestick Analysis"),
      path: "/candlestick-analysis",
      icon: ChartCandlestick,
    },
    {
      title: t("الأخبار والمعنويات", "News & Sentiment"),
      path: "/news-sentiment",
      icon: Newspaper,
    },
    {
      title: t("دفتر التداول", "Trading Journal"),
      path: "/trading-journal",
      icon: BookText,
    },
    {
      title: t("حاسبة المخاطر", "Risk Calculator"),
      path: "/risk-calculator",
      icon: Calculator,
    },
    {
      title: t("التعليم", "Education"),
      path: "/education",
      icon: CircleHelp,
    },
    {
      title: t("الإعدادات", "Settings"),
      path: "/settings",
      icon: SettingsIcon,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-5">
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold">BitSight</span>
          <LanguageSwitcher />
        </div>
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
      
      <SidebarFooter className="px-4 py-3">
        <div className="flex flex-col gap-4">
          <UserProfile />
          <div className="text-xs text-muted-foreground">
            BitSight &copy; 2025
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
