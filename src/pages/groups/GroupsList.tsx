import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/app/providers/StoreProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export const GroupsList = observer(() => {
    const { groupsStore } = useStore();

    useEffect(() => {
        groupsStore.fetchAllSummaries();
    }, [groupsStore]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Учебные группы</h1>
                <p className="text-muted-foreground mt-1">
                    Сводка по рискам и составу групп
                </p>
            </div>

            {groupsStore.isLoading && groupsStore.groups.length === 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {groupsStore.groups.map(group => {
                        const summary = groupsStore.summaries[group.id];

                        return (
                            <Card key={group.id} className="border-border hover:shadow-md transition-shadow">
                                <CardHeader className="pb-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-xl">{group.name}</CardTitle>
                                            <CardDescription>
                                                {group.course} курс
                                            </CardDescription>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold">
                                            {group.students_count}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-md border border-border">
                                            <UserIcon className="w-4 h-4" />
                                            Куратор: {group.curator_username}
                                        </div>

                                        {summary ? (
                                            <div className="space-y-2 mt-4">
                                                <div className="text-sm font-medium mb-2">Уровни риска в группе:</div>
                                                <div className="flex w-full h-3 rounded-full overflow-hidden bg-muted">
                                                    <div className="bg-emerald-500 h-full" style={{ width: `${(summary.low_risk_count / summary.students_count) * 100}%` }} />
                                                    <div className="bg-amber-500 h-full" style={{ width: `${(summary.medium_risk_count / summary.students_count) * 100}%` }} />
                                                    <div className="bg-destructive h-full" style={{ width: `${(summary.high_risk_count / summary.students_count) * 100}%` }} />
                                                </div>
                                                <div className="flex justify-between text-xs text-muted-foreground pt-1">
                                                    <span className="text-emerald-500 font-medium">{summary.low_risk_count} низ.</span>
                                                    <span className="text-amber-500 font-medium">{summary.medium_risk_count} ср.</span>
                                                    <span className="text-destructive font-medium">{summary.high_risk_count} выс.</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-sm text-muted-foreground text-center py-4">Сводка загружается...</div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
});
