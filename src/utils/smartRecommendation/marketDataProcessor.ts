
import { CryptoMarketData } from '@/types/crypto';

/**
 * استخراج قوة النمط وتحديد اتجاه السوق بناءً على بيانات السعر
 */
export function processMarketData(cryptoData: CryptoMarketData | null) {
  if (!cryptoData || !cryptoData.prices || cryptoData.prices.length === 0) {
    return {
      hasValidData: false,
      patternStrength: 50,
      patternName: 'نمط متعادل',
      percentChange: 0,
      priceLevels: null
    };
  }
  
  // الحصول على آخر سعر وتحديد قوة النمط بناءً على حركة السعر
  const prices = cryptoData.prices;
  const lastPrice = prices[prices.length - 1][1];
  const prevPrice = prices[prices.length - 2]?.[1] || lastPrice;
  
  // حساب التغير في السعر
  const priceChange = lastPrice - prevPrice;
  const percentChange = (priceChange / prevPrice) * 100;
  const patternStrength = 50 + percentChange * 5; // صيغة بسيطة: محايد (50) +/- نسبة التغيير
  
  // تحديد اسم النمط بناءً على حركة السوق
  let patternName = 'نمط متعادل';
  if (percentChange > 1) {
    patternName = 'نموذج صعودي';
  } else if (percentChange < -1) {
    patternName = 'نموذج هبوطي';
  }
  
  // مستويات السعر لوقف الخسارة وجني الأرباح
  const priceLevels = {
    current: lastPrice,
    resistance: lastPrice * 1.03, // بسيط 3% فوق المقاومة
    support: lastPrice * 0.97,   // بسيط 3% تحت الدعم
  };
  
  return {
    hasValidData: true,
    patternStrength,
    patternName,
    percentChange,
    priceLevels
  };
}
