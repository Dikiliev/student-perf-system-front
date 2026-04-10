import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/app/providers/StoreProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle2, UserPlus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const ManualEntryView = observer(() => {
    const { studentsStore, groupsStore } = useStore();

    // Form state
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [recordBookNumber, setRecordBookNumber] = useState('');
    const [email, setEmail] = useState('');
    const [groupId, setGroupId] = useState('');
    const [enrollmentYear, setEnrollmentYear] = useState(new Date().getFullYear().toString());
    const [status, setStatus] = useState('active');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (groupsStore.groups.length === 0) {
            groupsStore.fetchGroups();
        }
    }, [groupsStore]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            await studentsStore.createStudent({
                last_name: lastName,
                first_name: firstName,
                middle_name: middleName,
                record_book_number: recordBookNumber,
                email,
                group: parseInt(groupId),
                enrollment_year: parseInt(enrollmentYear),
                status
            });
            setSuccessMsg('Студент успешно добавлен');

            // Clear form
            setLastName('');
            setFirstName('');
            setMiddleName('');
            setRecordBookNumber('');
            setEmail('');
            setGroupId('');
        } catch (e: any) {
            setErrorMsg(e.response?.data?.detail || e.response?.data?.error || 'Произошла ошибка при добавлении студента');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="bg-card shadow-sm border-border max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-primary" />
                    Добавить студента
                </CardTitle>
                <CardDescription>
                    Вручную добавьте нового студента в систему
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Фамилия</label>
                            <Input required value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Иванов" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Имя</label>
                            <Input required value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Иван" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Отчество</label>
                            <Input value={middleName} onChange={e => setMiddleName(e.target.value)} placeholder="Иванович" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Номер зачетки</label>
                            <Input required value={recordBookNumber} onChange={e => setRecordBookNumber(e.target.value)} placeholder="123456" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ivan@example.com" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Группа</label>
                            <Select required value={groupId} onValueChange={(val) => { if (val) setGroupId(val) }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Выберите группу" />
                                </SelectTrigger>
                                <SelectContent>
                                    {groupsStore.groups.map(g => (
                                        <SelectItem key={g.id} value={g.id.toString()}>{g.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Год поступления</label>
                            <Input type="number" required value={enrollmentYear} onChange={e => setEnrollmentYear(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Статус</label>
                            <Select required value={status} onValueChange={(val) => { if (val) setStatus(val) }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Выберите статус" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Активен</SelectItem>
                                    <SelectItem value="expelled">Отчислен</SelectItem>
                                    <SelectItem value="graduated">Выпустился</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {errorMsg && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Ошибка</AlertTitle>
                            <AlertDescription>{errorMsg}</AlertDescription>
                        </Alert>
                    )}

                    {successMsg && (
                        <Alert className="border-green-500/50 bg-green-500/10 text-green-600">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertTitle>Успешно</AlertTitle>
                            <AlertDescription>{successMsg}</AlertDescription>
                        </Alert>
                    )}

                    <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
                        {isSubmitting ? 'Сохранение...' : 'Добавить студента'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
});
