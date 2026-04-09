import { makeAutoObservable } from 'mobx';
import type { RootStore } from './RootStore';

type Theme = 'light' | 'dark' | 'system';

export class UiStore {
    rootStore: RootStore;

    theme: Theme = (localStorage.getItem('vite-ui-theme') as Theme) || 'system';
    isSidebarCollapsed = false;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }

    setTheme(theme: Theme) {
        this.theme = theme;
        localStorage.setItem('vite-ui-theme', theme);
        this.applyTheme();
    }

    toggleSidebar() {
        this.isSidebarCollapsed = !this.isSidebarCollapsed;
    }

    setSidebarCollapsed(collapsed: boolean) {
        this.isSidebarCollapsed = collapsed;
    }

    applyTheme() {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        if (this.theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';
            root.classList.add(systemTheme);
            return;
        }

        root.classList.add(this.theme);
    }
}
