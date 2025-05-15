
import React from 'react';
import CryptoDataContainer from './crypto/CryptoDataContainer';

interface CryptoDataDisplayProps {
  defaultCoin?: string;
}

/**
 * Main entry point for the Cryptocurrency data display component
 * This component has been refactored into smaller components for better maintainability
 */
const CryptoDataDisplay: React.FC<CryptoDataDisplayProps> = ({ defaultCoin = 'bitcoin' }) => {
  return <CryptoDataContainer defaultCoin={defaultCoin} />;
};

export default React.memo(CryptoDataDisplay);
