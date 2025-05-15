
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowUpRight, ArrowDownRight, TrendingUp, BarChart3, DollarSign, Users } from "lucide-react";

const DashboardMetricsCards = () => {
  const { t } = useLanguage();

  const metrics = [
    {
      title: t('مؤشر السوق', 'Market Index'),
      value: '12,456',
      change: '+2.3%',
      isPositive: true,
      icon: TrendingUp
    },
    {
      title: t('حجم التداول', 'Trading Volume'),
      value: '$14.2B',
      change: '+5.4%',
      isPositive: true,
      icon: BarChart3
    },
    {
      title: t('القيمة السوقية', 'Market Cap'),
      value: '$1.14T',
      change: '-0.8%',
      isPositive: false,
      icon: DollarSign
    },
    {
      title: t('المتداولين النشطين', 'Active Traders'),
      value: '3.2M',
      change: '+1.2%',
      isPositive: true,
      icon: Users
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div 
          key={index}
          className="rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-all hover:shadow-md"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">{metric.title}</p>
              <h3 className="text-2xl font-bold">{metric.value}</h3>
            </div>
            <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              <metric.icon className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`text-sm font-medium flex items-center ${metric.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {metric.isPositive ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
              {metric.change}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{t('منذ آخر أسبوع', 'Since last week')}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardMetricsCards;
