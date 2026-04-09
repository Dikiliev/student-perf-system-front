import { observer } from 'mobx-react-lite';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useStore } from '@/app/providers/StoreProvider';
import { AppSidebar } from '@/widgets/sidebar/AppSidebar';
import { AppTopbar } from '@/widgets/topbar/AppTopbar';

export const AppShell = observer(() => {
    const { authStore } = useStore();
    const location = useLocation();

    if (!authStore.isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <AppSidebar />
            <div className="flex-1 flex flex-col lg:pl-[250px] transition-all relative">
                <AppTopbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-muted/30 p-4 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
});
