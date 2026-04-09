import { cn } from '@/lib/utils';
import { useStore } from '@/app/providers/StoreProvider';
import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    LineChart,
    Database
} from 'lucide-react';

export const AppSidebar = observer(() => {
    const { uiStore } = useStore();

    const navItems = [
        { name: 'Дашборд', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: 'Группы', path: '/groups', icon: <Users className="w-5 h-5" /> },
        { name: 'Студенты', path: '/students', icon: <GraduationCap className="w-5 h-5" /> },
        { name: 'Прогнозы', path: '/predictions', icon: <LineChart className="w-5 h-5" /> },
        { name: 'Данные', path: '/data-management', icon: <Database className="w-5 h-5" /> },
    ];

    return (
        <>
            {/* Mobile Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden transition-opacity",
                    !uiStore.isSidebarCollapsed ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => uiStore.setSidebarCollapsed(true)}
            />

            <aside
                className={cn(
                    "fixed top-0 left-0 z-50 h-screen w-[250px] bg-card border-r border-border transition-transform duration-300 flex flex-col",
                    uiStore.isSidebarCollapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
                )}
            >
                <div className="h-16 flex items-center px-6 border-b border-border text-primary font-bold text-lg tracking-tight">
                    SPS System
                </div>

                <div className="flex-1 py-6 px-3 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            {item.icon}
                            {item.name}
                        </NavLink>
                    ))}
                </div>
            </aside>
        </>
    );
});
