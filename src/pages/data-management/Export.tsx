import { observer } from 'mobx-react-lite';
import { useStore } from '@/app/providers/StoreProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Table as TableIcon } from 'lucide-react';
import type { EntityType } from '@/shared/api/dataManagementApi';
import { useState } from 'react';

const ENTITIES: Array<{ id: EntityType; title: string; desc: string }> = [
    { id: 'groups', title: 'Группы', desc: 'Учебные группы (курсы и кураторы)' },
    { id: 'subjects', title: 'Дисциплины', desc: 'Предметы и курсы' },
    { id: 'students', title: 'Студенты', desc: 'Личные дела студентов' },
    { id: 'grades', title: 'Оценки', desc: 'Успеваемость по предметам' },
    { id: 'attendance', title: 'Посещаемость', desc: 'Журнал присутствия' },
    { id: 'predictions', title: 'Прогнозы риска', desc: 'Результаты анализа ИИ (только экспорт)' },
];

export const ExportDataView = observer(() => {
    const { dataManagementStore } = useStore();
    const [loadingEntity, setLoadingEntity] = useState<string | null>(null);

    const handleDownloadTemplate = async (entity: EntityType, format: 'csv' | 'xlsx') => {
        setLoadingEntity(`template-${entity}-${format}`);
        await dataManagementStore.downloadTemplate(entity, format);
        setLoadingEntity(null);
    };

    const handleExportData = async (entity: EntityType, format: 'csv' | 'xlsx') => {
        setLoadingEntity(`export-${entity}-${format}`);
        await dataManagementStore.exportData(entity, format);
        setLoadingEntity(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col space-y-2">
                <h3 className="text-2xl font-semibold tracking-tight">Шаблоны и Экспорт</h3>
                <p className="text-muted-foreground">
                    Скачивайте пустые шаблоны для корректного массового импорта или выгружайте текущие данные системы для внешнего анализа.
                </p>
            </div>

            {dataManagementStore.error && (
                <div className="bg-destructive/15 text-destructive p-4 rounded-md text-sm font-medium">
                    {dataManagementStore.error}
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {ENTITIES.map((entity) => (
                    <Card key={entity.id} className="flex flex-col bg-card/50 backdrop-blur-sm border-border/60 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <TableIcon className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg">{entity.title}</CardTitle>
                            </div>
                            <CardDescription>{entity.desc}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-end space-y-4">
                            {entity.id !== 'predictions' && (
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold uppercase text-muted-foreground">Шаблоны импорта</p>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full flex items-center justify-center gap-2"
                                            onClick={() => handleDownloadTemplate(entity.id, 'csv')}
                                            disabled={!!loadingEntity}
                                        >
                                            <Download className="h-3.5 w-3.5" /> CSV
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full flex items-center justify-center gap-2"
                                            onClick={() => handleDownloadTemplate(entity.id, 'xlsx')}
                                            disabled={!!loadingEntity}
                                        >
                                            <Download className="h-3.5 w-3.5" /> XLSX
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <p className="text-xs font-semibold uppercase text-muted-foreground">Экспорт данных (БД)</p>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="w-full flex items-center justify-center gap-2"
                                        onClick={() => handleExportData(entity.id, 'csv')}
                                        disabled={!!loadingEntity}
                                    >
                                        <Download className="h-3.5 w-3.5" /> CSV
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="w-full flex items-center justify-center gap-2 border-primary/20 hover:bg-primary/10"
                                        onClick={() => handleExportData(entity.id, 'xlsx')}
                                        disabled={!!loadingEntity}
                                    >
                                        <Download className="h-3.5 w-3.5 text-primary" /> XLSX
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
});
