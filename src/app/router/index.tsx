import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/widgets/app-shell/AppShell';
import { AuthLayout } from '@/widgets/auth-layout/AuthLayout';

import { Login } from '@/pages/auth/Login';
import { Dashboard } from '@/pages/dashboard/Dashboard';
import { StudentsList } from '@/pages/students/StudentsList';
import { StudentDetails } from '@/pages/students/StudentDetails';
import { GroupsList } from '@/pages/groups/GroupsList';
import { PredictionsList } from '@/pages/predictions/PredictionsList';
import { DataManagement } from '@/pages/data-management/DataManagement';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppShell />,
        children: [
            {
                index: true,
                element: <Navigate to="/dashboard" replace />,
            },
            {
                path: 'dashboard',
                element: <Dashboard />,
            },
            {
                path: 'groups',
                element: <GroupsList />,
            },
            {
                path: 'students',
                element: <StudentsList />,
            },
            {
                path: 'students/:id',
                element: <StudentDetails />,
            },
            {
                path: 'predictions',
                element: <PredictionsList />,
            },
            {
                path: 'data-management',
                element: <DataManagement />,
            },
        ],
    },
    {
        element: <AuthLayout />,
        children: [
            {
                path: 'login',
                element: <Login />,
            },
        ],
    },
    {
        path: '*',
        element: <div className="p-8 text-center text-xl">404 - Страница не найдена</div>,
    },
]);
