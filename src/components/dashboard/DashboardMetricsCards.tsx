
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowUpRight, ArrowDownRight, TrendingUp, BarChart3, DollarSign, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const DashboardMetricsCards = () => {
  const { t } = useLanguage();

  const metrics = [
    {
      title: t('مؤشر السوق', 'Market Index'),
      value: '12,456',
      change: '+2.3%',
      isPositive: true,
      icon: TrendingUp,
      description: t('قياس أداء السوق', 'Market performance measure')
    },
    {
      title: t('حجم التداول', 'Trading Volume'),
      value: '$14.2B',
      change: '+5.4%',
      isPositive: true,
      icon: BarChart3,
      description: t('إجمالي التداول اليومي', 'Total daily volume')
    },
    {
      title: t('القيمة السوقية', 'Market Cap'),
      value: '$1.14T',
      change: '-0.8%',
      isPositive: false,
      icon: DollarSign,
      description: t('إجمالي قيمة العملات', 'Total crypto value')
    },
    {
      title: t('المتداولين النشطين', 'Active Traders'),
      value: '3.2M',
      change: '+1.2%',
      isPositive: true,
      icon: Users,
      description: t('خلال 24 ساعة', 'During 24h')
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card 
          key={index}
          className="overflow-hidden border-none relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-md hover:shadow-lg transition-all duration-300"
        >
          <div className="absolute top-0 left-0 w-full h-1" style={{
            background: metric.isPositive 
              ? 'linear-gradient(90deg, rgb(34, 197, 94), rgb(16, 185, 129))' 
              : 'linear-gradient(90deg, rgb(239, 68, 68), rgb(248, 113, 113))'
          }}></div>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{metric.title}</p>
                <h3 className="text-2xl font-bold">{metric.value}</h3>
              </div>
              <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                <metric.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {metric.description}
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
              <span className={`text-sm font-medium flex items-center ${metric.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {metric.isPositive ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                {metric.change}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{t('منذ آخر أسبوع', 'Since last week')}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardMetricsCards;
