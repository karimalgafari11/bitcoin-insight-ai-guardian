
export interface Trade {
  id: string;
  symbol: string;
  entry_date: string;
  exit_date?: string;
  entry_price: number;
  exit_price?: number;
  stop_loss?: number;
  take_profit?: number;
  size: number;
  direction: 'long' | 'short';
  status: 'open' | 'closed' | 'canceled';
  profit_loss?: number;
  profit_loss_percentage?: number;
  strategy?: string;
  setup_type?: string;
  timeframe?: string;
  notes?: string;
  tags?: string[];
  screenshot_url?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface TradeFormData {
  symbol: string;
  entry_date: string;
  exit_date?: string;
  entry_price: number;
  exit_price?: number;
  stop_loss?: number;
  take_profit?: number;
  size: number;
  direction: 'long' | 'short';
  status: 'open' | 'closed' | 'canceled';
  strategy?: string;
  setup_type?: string;
  timeframe?: string;
  notes?: string;
  tags?: string[];
}
