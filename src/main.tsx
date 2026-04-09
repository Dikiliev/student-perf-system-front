import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router'
import { StoreProvider, useStore } from './app/providers/StoreProvider'
import { ThemeProvider } from './app/providers/ThemeProvider'
import { observer } from 'mobx-react-lite'
import './index.css'

const AppBootstrap = observer(({ children }: { children: React.ReactNode }) => {
  const { authStore } = useStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    authStore.bootstrap().then(() => setIsReady(true));
  }, [authStore]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 set-loading-spinner text-primary" />
        <span className="ml-3 text-muted-foreground w-max blink-animation">Загрузка системы...</span>
      </div>
    );
  }

  return <>{children}</>;
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <ThemeProvider>
        <AppBootstrap>
          <RouterProvider router={router} />
        </AppBootstrap>
      </ThemeProvider>
    </StoreProvider>
  </StrictMode>,
)
