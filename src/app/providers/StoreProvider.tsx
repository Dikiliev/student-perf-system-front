import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { rootStore, RootStore } from '@/stores/RootStore';

const StoreContext = createContext<RootStore>(rootStore);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
    return (
        <StoreContext.Provider value={rootStore}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    return useContext(StoreContext);
};
