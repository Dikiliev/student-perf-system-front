import { createContext, useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from './StoreProvider';

const ThemeProviderContext = createContext({});

export const ThemeProvider = observer(({ children, ...props }: any) => {
    const { uiStore } = useStore();

    useEffect(() => {
        uiStore.applyTheme();
    }, [uiStore.theme]);

    return (
        <ThemeProviderContext.Provider {...props} value={{}}>
            {children}
        </ThemeProviderContext.Provider>
    );
});

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);
    if (context === undefined)
        throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};
