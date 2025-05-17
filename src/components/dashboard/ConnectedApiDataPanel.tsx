
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { RefreshCw, CircleAlertIcon, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useConnectedApiData } from "@/hooks/useConnectedApiData";
import { format } from "date-fns";

const ConnectedApiDataPanel = () => {
  const { t } = useLanguage();
  const { apiData, isLoading, lastRefreshed, refreshData } = useConnectedApiData();

  // Get the number of connected platforms
  const connectedCount = apiData.filter(item => item.isConnected).length;

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
            </div>
          );
        
        case 'coinapi':
          return (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>BTC/USD</span>
                <span className="font-mono">${data.rate?.toFixed(2)}</span>
              </div>
            </div>
          );
          
        case 'cryptocompare':
          return (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>BTC/USD</span>
                <span className="font-mono">${data.USD?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>BTC/EUR</span>
                <span className="font-mono">€{data.EUR?.toFixed(2)}</span>
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
                <span className="font-mono">${data.rate?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('حجم 24 ساعة', '24h Volume')}</span>
                <span className="font-mono">${(data.volume / 1000000).toFixed(2)}M</span>
              </div>
            </div>
          );
          
        case 'coindesk':
          return (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>BTC/USD</span>
                <span className="font-mono">${parseFloat(data.bpi?.USD?.rate?.replace(',', '') || '0').toFixed(2)}</span>
              </div>
            </div>
          );
          
        default:
          return <p className="text-sm text-muted-foreground">{t('بيانات غير معروفة', 'Unknown data format')}</p>;
      }
    } catch (error) {
      console.error(`Error formatting data for ${platform}:`, error);
      return <p className="text-sm text-red-500">{t('خطأ في تنسيق البيانات', 'Error formatting data')}</p>;
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
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={refreshData}
            title={t('تحديث البيانات', 'Refresh data')}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        ) : apiData.length === 0 ? (
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
          </div>
        ) : (
          <div className="space-y-4">
            {apiData.map((item, index) => (
              <div key={index} className="border rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium flex items-center gap-2">
                    {item.isConnected && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {item.platform === 'binance_testnet' ? 'Binance Testnet' : 
                      item.platform.charAt(0).toUpperCase() + item.platform.slice(1).replace('_', ' ')}
                  </h3>
                </div>
                
                {item.error ? (
                  <p className="text-red-500 text-sm">{item.error}</p>
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
