
import { useState } from "react";
import { ChartCandlestick } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";

type SymbolSelectorProps = {
  onSymbolChange: (symbol: string) => void;
  symbol: string;
  className?: string;
};

const SymbolSelector = ({ onSymbolChange, symbol, className }: SymbolSelectorProps) => {
  const { t } = useLanguage();
  
  // Demo list of available symbols
  const cryptoSymbols = ["BTC/USD", "ETH/USD", "BNB/USD", "SOL/USD", "XRP/USD"];
  const stockSymbols = ["AAPL", "MSFT", "AMZN", "GOOGL", "TSLA"];
  const forexSymbols = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD"];
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={`min-w-[140px] ${className}`}>
          <ChartCandlestick className="mr-2 h-4 w-4" />
          {symbol}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{t("العملات الرقمية", "Cryptocurrencies")}</DropdownMenuLabel>
        {cryptoSymbols.map((sym) => (
          <DropdownMenuItem
            key={sym}
            onClick={() => onSymbolChange(sym)}
            className={sym === symbol ? "bg-accent" : ""}
          >
            {sym}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>{t("الأسهم", "Stocks")}</DropdownMenuLabel>
        {stockSymbols.map((sym) => (
          <DropdownMenuItem 
            key={sym}
            onClick={() => onSymbolChange(sym)}
            className={sym === symbol ? "bg-accent" : ""}
          >
            {sym}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>{t("العملات", "Forex")}</DropdownMenuLabel>
        {forexSymbols.map((sym) => (
          <DropdownMenuItem
            key={sym}
            onClick={() => onSymbolChange(sym)}
            className={sym === symbol ? "bg-accent" : ""}
          >
            {sym}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SymbolSelector;
