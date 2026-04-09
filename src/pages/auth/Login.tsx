import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/app/providers/StoreProvider';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const Login = observer(() => {
    const { authStore } = useStore();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!username || !password) {
            setError('Введите логин и пароль');
            return;
        }

        try {
            await authStore.login(username, password);
            // Wait for authStore to fetch user if needed, or simply redirect
            navigate('/dashboard');
        } catch (err: any) {
            if (err.response?.status === 401) {
                setError('Неверный логин или пароль');
            } else {
                setError('Произошла ошибка при подключении к серверу');
            }
        }
    };

    return (
        <Card className="border-border">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Вход в систему</CardTitle>
                <CardDescription className="text-center">
                    Введите ваш логин и пароль
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none" htmlFor="username">
                            Пользователь
                        </label>
                        <Input
                            id="username"
                            placeholder="Введите логин (напр. teacher_demo)"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={authStore.isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none" htmlFor="password">
                            Пароль
                        </label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={authStore.isLoading}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" type="submit" disabled={authStore.isLoading}>
                        {authStore.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Войти
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
});
