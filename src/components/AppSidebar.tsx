
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  LineChart, 
  BookOpen, 
  Settings, 
  CandlestickChart, 
  BookMarked,
  FileBarChart,
  MessageSquare,
  Globe,
  Calculator
} from 'lucide-react';

export function AppSidebar() {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const location = useLocation();

  const menuItems = [
    {
      title: t('لوحة التحكم', 'Dashboard'),
      url: '/dashboard',
      icon: LayoutDashboard
    },
    {
      title: t('التحليل', 'Analysis'),
      url: '/analysis',
      icon: LineChart
    },
    {
      title: t('تحليل الشموع', 'Candlestick Analysis'),
      url: '/candlestick-analysis',
      icon: CandlestickChart
    },
    {
      title: t('الأنماط الفنية', 'Technical Patterns'),
      url: '/technical-patterns',
      icon: FileBarChart
    },
    {
      title: t('يومية التداول', 'Trading Journal'),
      url: '/trading-journal',
      icon: BookMarked
    },
    {
      title: t('تحليل الأخبار', 'News Sentiment'),
      url: '/news-sentiment',
      icon: MessageSquare
    },
    {
      title: t('حاسبة المخاطر', 'Risk Calculator'),
      url: '/risk-calculator',
      icon: Calculator
    },
    {
      title: t('التعليم', 'Education'),
      url: '/education',
      icon: BookOpen
    },
    {
      title: t('التكاملات', 'Integrations'),
      url: '/integrations',
      icon: Globe
    },
    {
      title: t('الإعدادات', 'Settings'),
      url: '/settings',
      icon: Settings
    }
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center">
          <img src="/placeholder.svg" alt="Logo" className="h-8 w-8 mr-2" />
          <div className="font-bold text-lg">TradePro</div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('الرئيسية', 'Main')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.url}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4 mr-2" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="flex flex-col gap-2">
          <LanguageSwitcher />
          {user && (
            <button 
              onClick={signOut}
              className="w-full text-sm text-red-500 hover:text-red-600 text-left"
            >
              {t('تسجيل الخروج', 'Logout')}
            </button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
