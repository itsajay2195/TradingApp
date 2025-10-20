import React, {createContext, useContext, useState, ReactNode} from 'react';

// ============= PRICE CONTEXT =============

interface PriceData {
  price: number;
  change24h: number;
  volume: number;
}

interface PriceContextType {
  prices: Record<string, PriceData>;
  setPrices: (updater: (prev: any) => any) => void;
}

export const PriceContext = createContext<PriceContextType | undefined>(
  undefined,
);

// ============= PRICE PROVIDER =============

export const PriceProvider = ({children}: {children: ReactNode}) => {
  const [prices, setPrices] = useState<Record<string, PriceData>>({});

  return (
    <PriceContext.Provider value={{prices, setPrices}}>
      {children}
    </PriceContext.Provider>
  );
};

export const usePrices = () => {
  const context = useContext(PriceContext);
  if (!context) {
    throw new Error('usePrices must be used within PriceProvider');
  }
  return context;
};

export default PriceContext;
