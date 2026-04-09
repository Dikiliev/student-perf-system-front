import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/app/providers/StoreProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, AlertTriangle, UserCheck, TrendingUp } from 'lucide-react';
import { RISK_COLORS, RISK_LABELS } from '@/shared/constants';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export const Dashboard = observer(() => {
    const { studentsStore, groupsStore, predictionsStore } = useStore();

    useEffect(() => {
        groupsStore.fetchAllSummaries();
        studentsStore.fetchStudents();
        predictionsStore.fetchPredictions();
    }, [groupsStore, studentsStore, predictionsStore]);

    // Derive stats from current state
    const totalStudents = studentsStore.students.length;
    const totalGroups = groupsStore.groups.length;

    const highRiskStudents = predictionsStore.predictions.filter(p => p.risk_level === 'high').length;
    const mediumRiskStudents = predictionsStore.predictions.filter(p => p.risk_level === 'medium').length;

    const isLoading = studentsStore.isLoading || groupsStore.isLoading || predictionsStore.isLoading;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Дашборд успеваемости</h1>
                <div className="text-sm text-muted-foreground">Последнее обновление: {new Date().toLocaleTimeString()}</div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Всего студентов</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold">{totalStudents}</div>}
                        <p className="text-xs text-muted-foreground">В {totalGroups} группах</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Высокий риск отчисления</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold text-destructive">{highRiskStudents}</div>}
                        <p className="text-xs text-muted-foreground">Студентов в зоне риска</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Средний риск отчисления</CardTitle>
                        <TrendingUp className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold text-amber-500">{mediumRiskStudents}</div>}
                        <p className="text-xs text-muted-foreground">Требуют внимания</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Мониторинг охватывает</CardTitle>
                        <UserCheck className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold">100%</div>}
                        <p className="text-xs text-muted-foreground">студентов с актуальными прогнозами</p>
                    </CardContent>
                </Card>
            </div>

            {/* Tables & Deep Dive sections will be added here */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-1 border-border shadow-sm">
                    <CardHeader>
                        <CardTitle>Недавние прогнозы с высоким риском</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {predictionsStore.predictions
                                    .filter(p => p.risk_level === 'high')
                                    .slice(0, 5)
                                    .map(pred => (
                                        <div key={pred.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                            <div>
                                                <div className="font-medium">{pred.student_name}</div>
                                                <div className="text-sm text-muted-foreground flex items-center gap-2">
                                                    <span>Группа {pred.group_name}</span>
                                                    <span className="w-1 h-1 rounded-full bg-border" />
                                                    <span>Балл: {pred.risk_score}</span>
                                                </div>
                                            </div>
                                            <Badge className={RISK_COLORS['high']} variant="outline">{RISK_LABELS['high']}</Badge>
                                        </div>
                                    ))}
                                {highRiskStudents === 0 && (
                                    <div className="text-center text-muted-foreground py-8">
                                        Студентов с высоким риском не найдено
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-1 border-border shadow-sm">
                    <CardHeader>
                        <CardTitle>Сводка групп риска</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {groupsStore.groups.slice(0, 5).map(g => {
                                    const summary = groupsStore.summaries[g.id];
                                    if (!summary) return null;
                                    return (
                                        <div key={g.id} className="flex flex-col space-y-2 border-b pb-4 last:border-0 last:pb-0">
                                            <div className="flex justify-between font-medium">
                                                <span>{g.name}</span>
                                                <span>{summary.students_count} студ.</span>
                                            </div>
                                            <div className="flex w-full h-2 rounded-full overflow-hidden bg-muted">
                                                <div className="bg-emerald-500 h-full" style={{ width: `${(summary.low_risk_count / summary.students_count) * 100}%` }} />
                                                <div className="bg-amber-500 h-full" style={{ width: `${(summary.medium_risk_count / summary.students_count) * 100}%` }} />
                                                <div className="bg-destructive h-full" style={{ width: `${(summary.high_risk_count / summary.students_count) * 100}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

        </div>
    );
});
