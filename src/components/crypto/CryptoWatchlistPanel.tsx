
import React from 'react';
import { WatchlistPanel } from './WatchlistPanel';

interface CryptoWatchlistPanelProps {
  onSymbolSelect: (symbol: string) => void;
  currentSymbol: string;
}

const CryptoWatchlistPanel: React.FC<CryptoWatchlistPanelProps> = ({ 
  onSymbolSelect, 
  currentSymbol 
}) => {
  return (
    <div className="md:col-span-1">
      <WatchlistPanel 
        onSymbolSelect={onSymbolSelect}
        currentSymbol={currentSymbol}
        className="sticky top-6"
      />
    </div>
  );
};

export default CryptoWatchlistPanel;
