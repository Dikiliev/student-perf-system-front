import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/app/providers/StoreProvider';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { RiskBadge } from '@/shared/ui/RiskBadge';
import { Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export const PredictionsList = observer(() => {
    const { predictionsStore, groupsStore } = useStore();
    const navigate = useNavigate();

    // Local state for client-side search by student name
    const [search, setSearch] = useState('');

    useEffect(() => {
        groupsStore.fetchGroups();
        predictionsStore.fetchPredictions();
    }, [groupsStore, predictionsStore]);

    const handleGroupFilter = (val: string | null) => {
        predictionsStore.setFilters({ group: val === 'all' || !val ? '' : val });
        predictionsStore.fetchPredictions();
    };

    const handleRiskFilter = (val: string | null) => {
        predictionsStore.setFilters({ risk_level: val === 'all' || !val ? '' : val });
        predictionsStore.fetchPredictions();
    };

    const filteredPredictions = predictionsStore.predictions.filter(p =>
        p.student_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Прогнозы рисков</h1>
                <p className="text-muted-foreground mt-1">
                    Журнал прогнозов и рекомендаций
                </p>
            </div>

            <Card>
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Поиск по ФИО в списке..."
                                className="pl-9"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Select value={predictionsStore.filters.group || 'all'} onValueChange={handleGroupFilter}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Все группы" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Все группы</SelectItem>
                                {groupsStore.groups.map(g => (
                                    <SelectItem key={g.id} value={g.id.toString()}>{g.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={predictionsStore.filters.risk_level || 'all'} onValueChange={handleRiskFilter}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Все риски" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Все риски</SelectItem>
                                <SelectItem value="low">Низкий (0-30%)</SelectItem>
                                <SelectItem value="medium">Средний (31-70%)</SelectItem>
                                <SelectItem value="high">Высокий (&gt;70%)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded-md border border-border overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>Студент и Группа</TableHead>
                                    <TableHead>Метрики</TableHead>
                                    <TableHead>Ключевой фактор</TableHead>
                                    <TableHead>Прогноз</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {predictionsStore.isLoading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-[100px] rounded-full" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredPredictions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            Прогнозы не найдены.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPredictions.map((pred) => (
                                        <TableRow
                                            key={pred.id}
                                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                                            onClick={() => navigate(`/students/${pred.student}`)}
                                        >
                                            <TableCell>
                                                <div className="font-medium truncate max-w-[200px]">{pred.student_name}</div>
                                                <div className="text-sm text-muted-foreground">{pred.group_name}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">Ср. балл: <span className="font-medium">{pred.average_grade}</span></div>
                                                <div className="text-sm">Посещ: <span className="font-medium">{pred.attendance_percent}%</span></div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm text-muted-foreground truncate max-w-[250px] lg:max-w-[400px]">
                                                    {pred.factors[0] || 'Факторы не указаны'}
                                                    {pred.factors.length > 1 && ` (+${pred.factors.length - 1} др.)`}
                                                </div>
                                                <div className="text-xs text-emerald-600 dark:text-emerald-400 truncate max-w-[250px] mt-1">
                                                    {pred.recommendations[0]}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <RiskBadge level={pred.risk_level} score={pred.risk_score} />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
});
