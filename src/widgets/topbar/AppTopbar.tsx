import { observer } from 'mobx-react-lite';
import { Menu, User, LogOut, Sun, Moon, Laptop } from 'lucide-react';
import { useStore } from '@/app/providers/StoreProvider';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const AppTopbar = observer(() => {
    const { uiStore, authStore } = useStore();

    const handleLogout = () => {
        authStore.logout();
    };

    return (
        <header className="h-16 shrink-0 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8">
            <div className="flex items-center">
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden mr-2"
                    onClick={() => uiStore.toggleSidebar()}
                >
                    <Menu className="h-5 w-5" />
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9">
                        {uiStore.theme === 'light' && <Sun className="h-5 w-5" />}
                        {uiStore.theme === 'dark' && <Moon className="h-5 w-5" />}
                        {uiStore.theme === 'system' && <Laptop className="h-5 w-5" />}
                        <span className="sr-only">Toggle theme</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => uiStore.setTheme('light')}>
                            <Sun className="mr-2 h-4 w-4" /> Светлая
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => uiStore.setTheme('dark')}>
                            <Moon className="mr-2 h-4 w-4" /> Темная
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => uiStore.setTheme('system')}>
                            <Laptop className="mr-2 h-4 w-4" /> Системная
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 relative rounded-full">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="/avatars/01.png" alt="@admin" />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                                {authStore.user?.first_name?.[0]}{authStore.user?.last_name?.[0]}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    {/* @ts-expect-error forceMount type variance */}
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <div className="px-2 py-1.5 text-sm font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{authStore.user?.first_name} {authStore.user?.last_name}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {authStore.user?.email}
                                </p>
                            </div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            <span>Профиль</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Выйти</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
});
