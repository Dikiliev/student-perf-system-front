import { observer } from 'mobx-react-lite';
import { Outlet, Navigate } from 'react-router-dom';
import { useStore } from '@/app/providers/StoreProvider';

export const AuthLayout = observer(() => {
    const { authStore } = useStore();

    if (authStore.isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-background">
            <div className="flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <Outlet />
                </div>
            </div>
            <div className="hidden lg:flex flex-col justify-center p-12 bg-primary/5 border-l border-border relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
                <div className="relative z-10 max-w-2xl">
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-8">
                        <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight mb-4">
                        Система прогнозирования успеваемости
                    </h1>
                    <p className="text-lg text-muted-foreground mb-8">
                        Интеллектуальная аналитика для образовательных учреждений.
                        Выявляйте риски отчисления на ранних этапах и помогайте студентам добиваться успеха.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-background/80 p-6 rounded-xl border border-border/50 backdrop-blur-sm shadow-sm">
                            <div className="text-2xl font-bold text-primary mb-1">Точность 94%</div>
                            <div className="text-sm text-muted-foreground">алгоритмов классификации рисков</div>
                        </div>
                        <div className="bg-background/80 p-6 rounded-xl border border-border/50 backdrop-blur-sm shadow-sm">
                            <div className="text-2xl font-bold text-emerald-500 mb-1">Своевременность</div>
                            <div className="text-sm text-muted-foreground">мгновенные уведомления кураторам</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});
