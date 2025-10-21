import React, {createContext, useContext, useState, ReactNode} from 'react';

// ============= PRICE CONTEXT =============

export const WatchListContext = createContext<any>(undefined);

// ============= PRICE PROVIDER =============

export const WatchListProvider = ({children}: {children: ReactNode}) => {
  const [watchlist, setWatchlist] = useState<Record<string, any>>([]);

  return (
    <WatchListContext.Provider value={{watchlist, setWatchlist}}>
      {children}
    </WatchListContext.Provider>
  );
};

export const useWatchListHook = () => {
  const context = useContext(WatchListContext);
  if (!context) {
    throw new Error('usePrices must be used within PriceProvider');
  }
  return context;
};

export default WatchListContext;
