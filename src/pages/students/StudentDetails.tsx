import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/app/providers/StoreProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RiskBadge } from '@/shared/ui/RiskBadge';
import { ArrowLeft, RefreshCw, Mail, GraduationCap, Calendar, BookOpen, Clock, Users, AlertTriangle, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { api } from '@/shared/api/api';

export const StudentDetails = observer(() => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { studentsStore } = useStore();

    const [subjects, setSubjects] = useState<any[]>([]);

    // Grade Form State
    const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
    const [gradeSubject, setGradeSubject] = useState('');
    const [gradeValue, setGradeValue] = useState('5');
    const [gradeType, setGradeType] = useState('homework');
    const [gradeDate, setGradeDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [isSubmittingGrade, setIsSubmittingGrade] = useState(false);

    // Attendance Form State
    const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
    const [attSubject, setAttSubject] = useState('');
    const [attStatus, setAttStatus] = useState('present');
    const [attDate, setAttDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [isSubmittingAtt, setIsSubmittingAtt] = useState(false);

    useEffect(() => {
        if (id) {
            studentsStore.fetchStudentDetails(parseInt(id, 10));
        }
        api.get('/api/subjects/').then(r => setSubjects(r.data)).catch(console.error);
    }, [id, studentsStore]);

    const handleRecalculate = async () => {
        if (id) {
            await studentsStore.recalculatePrediction(parseInt(id, 10));
        }
    };

    const handleAddGrade = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !gradeSubject) return;
        setIsSubmittingGrade(true);
        try {
            await studentsStore.addGrade({
                student: parseInt(id, 10),
                subject: parseInt(gradeSubject, 10),
                value: parseInt(gradeValue, 10),
                grade_type: gradeType,
                graded_at: gradeDate,
                comment: 'Введено вручную'
            });
            setIsGradeModalOpen(false);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmittingGrade(false);
        }
    };

    const handleAddAttendance = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !attSubject) return;
        setIsSubmittingAtt(true);
        try {
            await studentsStore.addAttendance({
                student: parseInt(id, 10),
                subject: parseInt(attSubject, 10),
                lesson_date: attDate,
                status: attStatus,
                comment: 'Введено вручную'
            });
            setIsAttendanceModalOpen(false);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmittingAtt(false);
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

                        {/* GRADES TAB */}
                        <TabsContent value="grades" className="mt-4">
                            <Card>
                                <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between border-b pb-4 mb-4">
                                    <CardTitle className="text-lg">Журнал оценок</CardTitle>
                                    <Dialog open={isGradeModalOpen} onOpenChange={setIsGradeModalOpen}>
                                        <DialogTrigger asChild>
                                            <Button size="sm" className="gap-1 h-8"><Plus className="w-4 h-4" /> Добавить</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <form onSubmit={handleAddGrade}>
                                                <DialogHeader>
                                                    <DialogTitle>Добавить оценку</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Дисциплина</label>
                                                        <Select required value={gradeSubject} onValueChange={setGradeSubject}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Выберите дисциплину" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {subjects.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Оценка</label>
                                                        <Select required value={gradeValue} onValueChange={setGradeValue}>
                                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="5">Отлично (5)</SelectItem>
                                                                <SelectItem value="4">Хорошо (4)</SelectItem>
                                                                <SelectItem value="3">Удовлетворительно (3)</SelectItem>
                                                                <SelectItem value="2">Неуд (2)</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Тип работы</label>
                                                        <Select required value={gradeType} onValueChange={setGradeType}>
                                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="quiz">Самостоятельная</SelectItem>
                                                                <SelectItem value="homework">ДЗ</SelectItem>
                                                                <SelectItem value="exam">Экзамен</SelectItem>
                                                                <SelectItem value="project">Проект</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Дата</label>
                                                        <Input type="date" required value={gradeDate} onChange={e => setGradeDate(e.target.value)} max={new Date().toISOString().split('T')[0]} />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button type="submit" disabled={isSubmittingGrade}>{isSubmittingGrade ? 'Добавление...' : 'Добавить оценку'}</Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </CardHeader>
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

                        {/* ATTENDANCE TAB */}
                        <TabsContent value="attendance" className="mt-4">
                            <Card>
                                <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between border-b pb-4 mb-4">
                                    <CardTitle className="text-lg">Журнал посещаемости</CardTitle>
                                    <Dialog open={isAttendanceModalOpen} onOpenChange={setIsAttendanceModalOpen}>
                                        <DialogTrigger asChild>
                                            <Button size="sm" className="gap-1 h-8"><Plus className="w-4 h-4" /> Отметить</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <form onSubmit={handleAddAttendance}>
                                                <DialogHeader>
                                                    <DialogTitle>Отметить посещаемость</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Дисциплина</label>
                                                        <Select required value={attSubject} onValueChange={setAttSubject}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Выберите дисциплину" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {subjects.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Статус</label>
                                                        <Select required value={attStatus} onValueChange={setAttStatus}>
                                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="present">Присутствовал</SelectItem>
                                                                <SelectItem value="absent">Прогул</SelectItem>
                                                                <SelectItem value="late">Опоздание</SelectItem>
                                                                <SelectItem value="excused">Уважительная</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Дата занятия</label>
                                                        <Input type="date" required value={attDate} onChange={e => setAttDate(e.target.value)} max={new Date().toISOString().split('T')[0]} />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button type="submit" disabled={isSubmittingAtt}>{isSubmittingAtt ? 'Сохранение...' : 'Отметить'}</Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </CardHeader>
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
