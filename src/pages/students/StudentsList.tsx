import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/app/providers/StoreProvider';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RiskBadge } from '@/shared/ui/RiskBadge';
import { RefreshCw, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export const StudentsList = observer(() => {
    const { studentsStore, groupsStore } = useStore();
    const navigate = useNavigate();

    const [search, setSearch] = useState(studentsStore.filters.search);

    useEffect(() => {
        groupsStore.fetchGroups();
        studentsStore.fetchStudents();
    }, [groupsStore, studentsStore]);

    const handleSearch = () => {
        studentsStore.setFilters({ search });
        studentsStore.fetchStudents();
    };

    const handleGroupFilter = (val: string | null) => {
        studentsStore.setFilters({ group: val === 'all' || !val ? '' : val });
        studentsStore.fetchStudents();
    };

    const handleStatusFilter = (val: string | null) => {
        studentsStore.setFilters({ status: val === 'all' || !val ? '' : val });
        studentsStore.fetchStudents();
    };

    const handleRecalculateAll = async () => {
        try {
            await studentsStore.recalculateAll();
        } catch (e) { /* handle error */ }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Студенты</h1>
                    <p className="text-muted-foreground mt-1">
                        Управление и анализ успеваемости студентов
                    </p>
                </div>
                <Button onClick={handleRecalculateAll} disabled={studentsStore.isLoading}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${studentsStore.isLoading ? 'animate-spin' : ''}`} />
                    Пересчитать все прогнозы
                </Button>
            </div>

            <Card>
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Поиск по ФИО или зачетке..."
                                className="pl-9"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <Select value={studentsStore.filters.group || 'all'} onValueChange={handleGroupFilter}>
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
                        <Select value={studentsStore.filters.status || 'all'} onValueChange={handleStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Все статусы" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Все статусы</SelectItem>
                                <SelectItem value="active">Активные</SelectItem>
                                <SelectItem value="graduated">Выпускники</SelectItem>
                                <SelectItem value="academic_leave">Академ. отпуск</SelectItem>
                                <SelectItem value="expelled">Отчислены</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded-md border border-border overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>Студент</TableHead>
                                    <TableHead>Группа</TableHead>
                                    <TableHead>Статус</TableHead>
                                    <TableHead>Уровень риска</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {studentsStore.isLoading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-[100px] rounded-full" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : studentsStore.students.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            Студенты не найдены. Попробуйте изменить фильтры.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    studentsStore.students.map((student) => (
                                        <TableRow
                                            key={student.id}
                                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                                            onClick={() => navigate(`/students/${student.id}`)}
                                        >
                                            <TableCell>
                                                <div className="font-medium">{student.full_name}</div>
                                                <div className="text-sm text-muted-foreground">{student.record_book_number}</div>
                                            </TableCell>
                                            <TableCell>{student.group_name}</TableCell>
                                            <TableCell>
                                                {student.status === 'active' ? 'Активный' : 'Неактивный'}
                                            </TableCell>
                                            <TableCell>
                                                <RiskBadge level={student.current_risk_level} score={student.current_risk_score} />
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
