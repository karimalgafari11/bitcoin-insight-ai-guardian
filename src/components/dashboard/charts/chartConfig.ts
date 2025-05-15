
// Chart theme and styling configuration
export type ChartTheme = {
  light: string;
  dark: string;
};

export interface ChartConfigItem {
  label: string;
  theme: ChartTheme;
}

export interface ChartConfigMap {
  [key: string]: ChartConfigItem;
}

export const createChartConfig = (t: (arabic: string, english: string) => string): ChartConfigMap => ({
  market: {
    label: t('مؤشرات السوق', 'Market Indicators'),
    theme: { 
      light: '#10b981',
      dark: '#059669' 
    },
  },
  btc: {
    label: 'Bitcoin',
    theme: {
      light: '#f59e0b',
      dark: '#d97706'
    }
  },
  eth: {
    label: 'Ethereum',
    theme: {
      light: '#6366f1',
      dark: '#4f46e5'
    }
  },
  sol: {
    label: 'Solana',
    theme: {
      light: '#ec4899',
      dark: '#db2777'
    }
  }
});
