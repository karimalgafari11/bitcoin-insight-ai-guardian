
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { RefreshCw, CircleAlertIcon, CheckCircle, AlertCircle, Info, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useConnectedApiData } from "@/hooks/useConnectedApiData";
import { format } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/**
 * مكون لعرض البيانات من منصات API المتصلة
 * يعرض بيانات من مختلف المنصات المتصلة في بطاقات منفصلة مع
 * خيار تحديث البيانات يدوياً
 */
const ConnectedApiDataPanel = () => {
  const { t } = useLanguage();
  const { apiData, isLoading, lastRefreshed, refreshData } = useConnectedApiData();

  // حساب عدد المنصات المتصلة
  const connectedCount = apiData.filter(item => item.isConnected).length;
  
  // حساب عدد المنصات التي بها أخطاء
  const errorCount = apiData.filter(item => item.error).length;

  /**
   * تنسيق عرض البيانات بناءً على نوع المنصة
   * يعالج أنماط البيانات المختلفة من كل منصة
   * 
   * @param platform - اسم المنصة
   * @param data - بيانات المنصة الخام
   * @returns مكون JSX منسق لعرض البيانات
   */
  const formatDataDisplay = (platform: string, data: any) => {
    if (!data) return null;

    try {
      switch (platform) {
        case 'binance':
        case 'binance_testnet':
          return (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground mb-1">
                {platform === 'binance_testnet' ? 
                  t('بيانات من تست نت بينانس', 'Data from Binance Testnet') : 
                  t('بيانات من بينانس', 'Data from Binance')}
              </p>
              {Array.isArray(data) && data.slice(0, 3).map((item: any, index: number) => (
                <div key={index} className="flex justify-between">
                  <span>{item.symbol}</span>
                  <span className="font-mono">${parseFloat(item.lastPrice).toFixed(2)}</span>
                </div>
              ))}
              {Array.isArray(data) && data.length === 0 && (
                <p className="text-sm text-amber-500">
                  {t('لا توجد بيانات متاحة', 'No data available')}
                </p>
              )}
            </div>
          );
        
        case 'coinapi':
          return (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>BTC/USD</span>
                <span className="font-mono">${data.rate?.toFixed(2) || 'N/A'}</span>
              </div>
            </div>
          );
          
        case 'cryptocompare':
          return (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>BTC/USD</span>
                <span className="font-mono">${data.USD?.toFixed(2) || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>BTC/EUR</span>
                <span className="font-mono">€{data.EUR?.toFixed(2) || 'N/A'}</span>
              </div>
            </div>
          );
          
        case 'livecoinwatch':
          return (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground mb-1">
                {t('بيانات من لايف كوين ووتش', 'Data from LiveCoinWatch')}
              </p>
              <div className="flex justify-between">
                <span>BTC</span>
                <span className="font-mono">${data.rate?.toFixed(2) || data.price?.toFixed(2) || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('حجم 24 ساعة', '24h Volume')}</span>
                <span className="font-mono">
                  ${data.volume ? (data.volume / 1000000).toFixed(2) + 'M' : 'N/A'}
                </span>
              </div>
            </div>
          );
          
        case 'coindesk':
          return (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>BTC/USD</span>
                <span className="font-mono">
                  ${parseFloat(data.bpi?.USD?.rate?.replace(',', '') || '0').toFixed(2)}
                </span>
              </div>
            </div>
          );
          
        default:
          return (
            <p className="text-sm text-muted-foreground">
              {t('بيانات غير معروفة', 'Unknown data format')}
            </p>
          );
      }
    } catch (error) {
      console.error(`خطأ في تنسيق البيانات لـ ${platform}:`, error);
      return (
        <div className="text-sm text-red-500">
          <AlertCircle className="inline-block mr-1 h-4 w-4" />
          {t('خطأ في تنسيق البيانات', 'Error formatting data')}
        </div>
      );
    }
  };

  /**
   * تنسيق اسم المنصة للعرض
   * يحول اسم المنصة من الترميز البرمجي إلى نص عرض
   * 
   * @param platform - اسم المنصة البرمجي
   * @returns اسم المنصة المنسق للعرض
   */
  const formatPlatformName = (platform: string): string => {
    switch (platform) {
      case 'binance_testnet':
        return 'Binance Testnet';
      case 'binance':
        return 'Binance';
      case 'coinapi':
        return 'CoinAPI';
      case 'cryptocompare':
        return 'CryptoCompare';
      case 'livecoinwatch':
        return 'LiveCoinWatch';
      case 'coindesk':
        return 'CoinDesk';
      default:
        return platform.charAt(0).toUpperCase() + platform.slice(1);
    }
  };

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{t('بيانات API المتصلة', 'Connected API Data')}</CardTitle>
            <CardDescription>
              {t(
                `${connectedCount} منصات متصلة`,
                `${connectedCount} connected platforms`
              )}
              {errorCount > 0 && (
                <span className="ml-2 text-amber-500">
                  ({t(`${errorCount} بها أخطاء`, `${errorCount} with errors`)})
                </span>
              )}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={refreshData}
            title={t('تحديث البيانات', 'Refresh data')}
            disabled={isLoading}
            className="relative"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {errorCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          // حالة التحميل - عرض هياكل عظمية
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        ) : apiData.length === 0 ? (
          // حالة عدم وجود اتصالات نشطة
          <div className="py-8 text-center">
            <CircleAlertIcon className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium">
              {t('لا توجد اتصالات API نشطة', 'No active API connections')}
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              {t(
                'قم بإعداد مفاتيح API في صفحة التكاملات لعرض البيانات هنا',
                'Set up API keys in the Integrations page to display data here'
              )}
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.href = '/integrations'}
            >
              {t('إعداد المفاتيح', 'Set up keys')} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          // عرض البيانات من المنصات المتصلة
          <div className="space-y-4">
            {errorCount > 0 && (
              <Alert variant="warning" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>
                  {t('مشكلات في الاتصال', 'Connection issues')}
                </AlertTitle>
                <AlertDescription>
                  {t(
                    'بعض المنصات لديها مشكلات في الاتصال. تحقق من مفاتيح API الخاصة بك.',
                    'Some platforms are experiencing connection issues. Check your API keys.'
                  )}
                </AlertDescription>
              </Alert>
            )}
            
            {apiData.map((item, index) => (
              <div 
                key={index} 
                className={`border rounded-md p-4 ${item.error ? 'border-amber-200 bg-amber-50 dark:bg-amber-900/20' : ''}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium flex items-center gap-2">
                    {item.isConnected && !item.error && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {item.error && (
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                    )}
                    {formatPlatformName(item.platform)}
                  </h3>
                </div>
                
                {item.error ? (
                  <div className="text-amber-600 text-sm flex items-start gap-2">
                    <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <p>{item.error}</p>
                  </div>
                ) : (
                  formatDataDisplay(item.platform, item.data)
                )}
              </div>
            ))}
            
            <p className="text-xs text-muted-foreground text-right mt-4">
              {t('آخر تحديث', 'Last updated')}: {format(lastRefreshed, 'HH:mm:ss')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConnectedApiDataPanel;
