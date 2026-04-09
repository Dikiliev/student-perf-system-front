import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/app/providers/StoreProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RiskBadge } from '@/shared/ui/RiskBadge';
import { ArrowLeft, RefreshCw, Mail, GraduationCap, Calendar, BookOpen, Clock, Users, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const StudentDetails = observer(() => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { studentsStore } = useStore();

    useEffect(() => {
        if (id) {
            studentsStore.fetchStudentDetails(parseInt(id, 10));
        }
    }, [id, studentsStore]);

    const handleRecalculate = async () => {
        if (id) {
            await studentsStore.recalculatePrediction(parseInt(id, 10));
        }
    };

    const student = studentsStore.selectedStudent;
    const isLoading = studentsStore.isDetailsLoading;
    const prediction = studentsStore.studentPrediction;

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-32" />
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <Skeleton className="h-8 w-[300px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!student) {
        return <div className="text-center p-12">Студент не найден</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="ghost" className="-ml-4" onClick={() => navigate(-1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Назад к списку
                </Button>
                <Button onClick={handleRecalculate} variant="outline" className="border-primary/20 hover:bg-primary/5">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Пересчитать прогноз
                </Button>
            </div>

            {/* Main Info Header */}
            <h1 className="text-3xl font-bold tracking-tight">{student.full_name}</h1>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Left Column: Student Info */}
                <Card className="md:col-span-1 border-border shadow-sm h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg">Информация</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <GraduationCap className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-xs">Зачетная книжка</p>
                                    <p className="font-medium">{student.record_book_number}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Users className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-xs">Группа</p>
                                    <p className="font-medium">{student.group_name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-xs">Email</p>
                                    <p className="font-medium">{student.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-xs">Год поступления</p>
                                    <p className="font-medium">{student.enrollment_year}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Right Column: Prediction Data */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="border-border shadow-sm overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-xl">Анализ рисков</CardTitle>
                                    <CardDescription>
                                        Детальная сводка последнего прогноза
                                    </CardDescription>
                                </div>
                                {prediction ? (
                                    <RiskBadge
                                        level={prediction.risk_level}
                                        score={prediction.risk_score}
                                        className="text-base px-3 py-1"
                                    />
                                ) : (
                                    <RiskBadge level={student.current_risk_level} score={student.current_risk_score} />
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {prediction ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-muted/50 p-4 rounded-lg">
                                            <div className="text-muted-foreground text-xs mb-1 flex items-center gap-1">
                                                <BookOpen className="w-3 h-3" /> Ср. балл
                                            </div>
                                            <div className="text-2xl font-bold">{prediction.average_grade}</div>
                                        </div>
                                        <div className="bg-muted/50 p-4 rounded-lg">
                                            <div className="text-muted-foreground text-xs mb-1 flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> Посещаемость
                                            </div>
                                            <div className="text-2xl font-bold">{prediction.attendance_percent}%</div>
                                        </div>
                                        <div className="bg-muted/50 p-4 rounded-lg">
                                            <div className="text-muted-foreground text-xs mb-1">Пропусков</div>
                                            <div className="text-2xl font-bold">{prediction.missed_count}</div>
                                        </div>
                                        <div className="bg-muted/50 p-4 rounded-lg">
                                            <div className="text-muted-foreground text-xs mb-1">Долгов</div>
                                            <div className="text-2xl font-bold text-destructive">{prediction.debt_count}</div>
                                        </div>
                                    </div>

                                    {prediction.factors.length > 0 && (
                                        <div>
                                            <h4 className="font-medium mb-3">Ключевые факторы риска</h4>
                                            <ul className="space-y-2">
                                                {prediction.factors.map((f, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground bg-destructive/5 p-3 rounded-md border border-destructive/10">
                                                        <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                                                        <span>{f}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {prediction.recommendations.length > 0 && (
                                        <div>
                                            <h4 className="font-medium mb-3 text-emerald-600 dark:text-emerald-400">Рекомендации куратору</h4>
                                            <ul className="space-y-2">
                                                {prediction.recommendations.map((r, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-foreground bg-emerald-500/5 p-3 rounded-md border border-emerald-500/20">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                                                        <span>{r}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="py-8 text-center text-muted-foreground">
                                    Нет данных прогнозирования для этого студента.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Tabs defaultValue="grades" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="grades">Успеваемость</TabsTrigger>
                            <TabsTrigger value="attendance">Посещаемость</TabsTrigger>
                        </TabsList>
                        <TabsContent value="grades" className="mt-4">
                            <Card>
                                <CardContent className="p-0">
                                    {studentsStore.studentGrades.length > 0 ? (
                                        <div className="border-b last:border-0 p-4 space-y-3">
                                            {studentsStore.studentGrades.map(g => (
                                                <div key={g.id} className="flex justify-between items-center bg-muted/30 p-3 rounded-md border border-border/50">
                                                    <div>
                                                        <div className="font-medium">{g.subject_name}</div>
                                                        <div className="text-xs text-muted-foreground">{g.grade_type} &middot; {g.graded_at}</div>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-primary/10 text-primary">
                                                        {g.value}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : <div className="p-8 text-center text-muted-foreground">Оценок пока нет</div>}
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="attendance" className="mt-4">
                            <Card>
                                <CardContent className="p-0">
                                    {studentsStore.studentAttendance.length > 0 ? (
                                        <div className="border-b last:border-0 p-4 space-y-3">
                                            {studentsStore.studentAttendance.map(a => (
                                                <div key={a.id} className="flex justify-between items-center bg-muted/30 p-3 rounded-md border border-border/50">
                                                    <div>
                                                        <div className="font-medium">{a.subject_name}</div>
                                                        <div className="text-xs text-muted-foreground">{a.lesson_date}</div>
                                                    </div>
                                                    <Badge variant={a.status === 'present' ? 'default' : 'destructive'} className={a.status === 'excused' ? 'bg-amber-500' : ''}>
                                                        {a.status === 'present' ? 'Присутствовал' : a.status === 'absent' ? 'Прогул' : 'Уважительная'}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    ) : <div className="p-8 text-center text-muted-foreground">Записей посещаемости нет</div>}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
});
