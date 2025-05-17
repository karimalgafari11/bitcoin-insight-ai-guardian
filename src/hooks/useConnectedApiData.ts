
import { useState, useEffect } from 'react';
import { useApiKeys } from '@/hooks/api-keys';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export interface ApiDataSummary {
  platform: string;
  isConnected: boolean;
  lastUpdated: string;
  data: any | null;
  error: string | null;
}

export const useConnectedApiData = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { apiKeys, connectionStates } = useApiKeys();
  const [apiData, setApiData] = useState<ApiDataSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Function to fetch data from connected APIs
  const fetchConnectedApiData = async () => {
    setIsLoading(true);
    const connectedPlatforms = Object.keys(connectionStates).filter(
      platform => connectionStates[platform]
    );

    if (connectedPlatforms.length === 0) {
      setApiData([]);
      setIsLoading(false);
      return;
    }

    try {
      const dataPromises = connectedPlatforms.map(async (platform) => {
        try {
          // Different fetch logic based on platform type
          let data = null;
          
          if (platform === 'binance' || platform === 'binance_testnet') {
            data = await fetchBinanceData(platform, apiKeys[platform]);
          } else if (platform === 'coinapi') {
            data = await fetchCoinApiData(apiKeys[platform]);
          } else if (platform === 'cryptocompare') {
            data = await fetchCryptoCompareData(apiKeys[platform]);
          } else if (platform === 'livecoinwatch') {
            data = await fetchLiveCoinWatchData(apiKeys[platform]);
          } else if (platform === 'coindesk') {
            data = await fetchCoinDeskData();
          }

          return {
            platform,
            isConnected: true,
            lastUpdated: new Date().toISOString(),
            data,
            error: null
          };
        } catch (error) {
          console.error(`Error fetching data from ${platform}:`, error);
          return {
            platform,
            isConnected: true,
            lastUpdated: new Date().toISOString(),
            data: null,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      });

      const results = await Promise.all(dataPromises);
      setApiData(results);
    } catch (err) {
      toast({
        title: t('خطأ', 'Error'),
        description: t(
          'حدث خطأ أثناء جلب البيانات من المنصات المتصلة',
          'An error occurred while fetching data from connected platforms'
        ),
        variant: 'destructive',
      });
      console.error('Error fetching API data:', err);
    } finally {
      setIsLoading(false);
      setLastRefreshed(new Date());
    }
  };

  // Helper functions to fetch data from different platforms
  const fetchBinanceData = async (platform: string, apiKey: string): Promise<any> => {
    const endpoint = platform === 'binance' 
      ? 'https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT","BNBUSDT","ADAUSDT","SOLUSDT"]' 
      : 'https://testnet.binance.vision/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT","BNBUSDT"]';
    
    const response = await fetch(endpoint, {
      headers: { 'X-MBX-APIKEY': apiKey }
    });
    
    if (!response.ok) {
      throw new Error(`Binance API error: ${response.status}`);
    }
    
    return await response.json();
  };

  const fetchCoinApiData = async (apiKey: string): Promise<any> => {
    const response = await fetch('https://rest.coinapi.io/v1/exchangerate/BTC/USD', {
      headers: { 'X-CoinAPI-Key': apiKey }
    });
    
    if (!response.ok) {
      throw new Error(`CoinAPI error: ${response.status}`);
    }
    
    return await response.json();
  };

  const fetchCryptoCompareData = async (apiKey: string): Promise<any> => {
    const response = await fetch('https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD,EUR,GBP', {
      headers: { 'authorization': `Apikey ${apiKey}` }
    });
    
    if (!response.ok) {
      throw new Error(`CryptoCompare error: ${response.status}`);
    }
    
    return await response.json();
  };

  const fetchLiveCoinWatchData = async (apiKey: string): Promise<any> => {
    const response = await fetch('https://api.livecoinwatch.com/coins/single', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        currency: 'USD',
        code: 'BTC',
        meta: true
      })
    });
    
    if (!response.ok) {
      throw new Error(`LiveCoinWatch error: ${response.status}`);
    }
    
    return await response.json();
  };

  const fetchCoinDeskData = async (): Promise<any> => {
    const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
    
    if (!response.ok) {
      throw new Error(`CoinDesk error: ${response.status}`);
    }
    
    return await response.json();
  };

  // Initial data fetch on component mount
  useEffect(() => {
    fetchConnectedApiData();
  }, []);

  return {
    apiData,
    isLoading,
    lastRefreshed,
    refreshData: fetchConnectedApiData
  };
};
