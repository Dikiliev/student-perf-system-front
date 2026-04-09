import { observer } from 'mobx-react-lite';
import { useStore } from '@/app/providers/StoreProvider';
import type { EntityType, ImportMode } from '@/shared/api/dataManagementApi';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertCircle, CheckCircle2, FileUp, Play, UploadCloud } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const BulkImportView = observer(() => {
    const { dataManagementStore } = useStore();

    const handleEntityChange = (val: string | null) => {
        if (val) dataManagementStore.setEntity(val as EntityType);
    };

    const handleModeChange = (val: string | null) => {
        if (val) dataManagementStore.setImportMode(val as ImportMode);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            dataManagementStore.setFile(e.target.files[0]);
        }
    };

    const handlePreview = () => {
        dataManagementStore.previewImport();
    };

    const handleCommit = () => {
        dataManagementStore.commitImport();
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* LEFT COLUMN: SETUP */}
            <div className="space-y-6">
                <Card className="bg-card shadow-sm border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UploadCloud className="h-5 w-5 text-primary" />
                            Параметры импорта
                        </CardTitle>
                        <CardDescription>
                            Выберите тип данных, режим обработки дубликатов и загрузите файл (.csv или .xlsx).
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Тип данных (Сущность)</label>
                            <Select value={dataManagementStore.selectedEntity} onValueChange={handleEntityChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Выберите сущность" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="students">Студенты</SelectItem>
                                    <SelectItem value="groups">Группы</SelectItem>
                                    <SelectItem value="subjects">Дисциплины</SelectItem>
                                    <SelectItem value="grades">Оценки</SelectItem>
                                    <SelectItem value="attendance">Посещаемость</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Режим импорта</label>
                            <Select value={dataManagementStore.importMode} onValueChange={handleModeChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Выберите режим" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="upsert">Обновление и создание (Upsert)</SelectItem>
                                    <SelectItem value="create_only">Только создание (Пропуск дублей)</SelectItem>
                                    <SelectItem value="update_only">Только обновление (Пропуск новых)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Файл данных (CSV/XLSX)</label>
                            <Input
                                type="file"
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                onChange={handleFileChange}
                                className="cursor-pointer"
                            />
                        </div>

                        {dataManagementStore.error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Ошибка</AlertTitle>
                                <AlertDescription>{dataManagementStore.error}</AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button
                            onClick={handlePreview}
                            disabled={!dataManagementStore.selectedFile || dataManagementStore.isLoading || !!dataManagementStore.commitSummary}
                            className="w-full"
                        >
                            {dataManagementStore.isLoading ? 'Загрузка...' : 'Проверить файл (Dry Run)'}
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            {/* RIGHT COLUMN: PREVIEW & COMMIT RESULTS */}
            <div className="space-y-6">
                {(dataManagementStore.previewSummary || dataManagementStore.commitSummary) ? (
                    <Card className="bg-card shadow-sm border-border">
                        <CardHeader>
                            <CardTitle>
                                {dataManagementStore.commitSummary ? 'Результат импорта' : 'Результат проверки'}
                            </CardTitle>
                            <CardDescription>
                                {dataManagementStore.commitSummary
                                    ? 'Данные успешно сохранены в систему.'
                                    : 'Ознакомьтесь с результатами проверки перед сохранением.'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Summary Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                {(() => {
                                    const sum = dataManagementStore.commitSummary || dataManagementStore.previewSummary!;
                                    return (
                                        <>
                                            <div className="flex flex-col bg-muted/50 p-3 rounded-md">
                                                <span className="text-sm text-muted-foreground">Всего строк</span>
                                                <span className="text-xl font-semibold">{sum.total_rows}</span>
                                            </div>
                                            <div className="flex flex-col bg-muted/50 p-3 rounded-md">
                                                <span className="text-sm text-muted-foreground">Валидных</span>
                                                <span className={`text-xl font-semibold ${sum.valid_rows > 0 ? 'text-green-600' : ''}`}>
                                                    {sum.valid_rows}
                                                </span>
                                            </div>
                                            <div className="flex flex-col bg-muted/50 p-3 rounded-md">
                                                <span className="text-sm text-muted-foreground">Ошибок</span>
                                                <span className={`text-xl font-semibold ${sum.invalid_rows > 0 ? 'text-destructive' : ''}`}>
                                                    {sum.invalid_rows}
                                                </span>
                                            </div>
                                            <div className="flex flex-col bg-muted/50 p-3 rounded-md">
                                                <span className="text-sm text-muted-foreground">Новых / Обновлено</span>
                                                <span className="text-xl font-semibold">
                                                    {sum.created_candidates} / {sum.update_candidates}
                                                </span>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>

                            {/* Errors Log */}
                            {((dataManagementStore.commitSummary || dataManagementStore.previewSummary)?.row_errors?.length ?? 0) > 0 && (
                                <div className="space-y-2">
                                    <label className="text-destructive font-semibold">Ошибки в строках</label>
                                    <ul className="text-sm text-destructive space-y-1 bg-destructive/10 p-3 rounded-md max-h-40 overflow-y-auto">
                                        {(dataManagementStore.commitSummary || dataManagementStore.previewSummary)!.row_errors.slice(0, 50).map((err, i) => (
                                            <li key={i}>Строка {err.row}: [{err.field}] {err.message}</li>
                                        ))}
                                        {(dataManagementStore.commitSummary || dataManagementStore.previewSummary)!.row_errors.length > 50 && (
                                            <li>...и другие ошибки</li>
                                        )}
                                    </ul>
                                </div>
                            )}

                            {/* Warnings Log */}
                            {((dataManagementStore.commitSummary || dataManagementStore.previewSummary)?.row_warnings?.length ?? 0) > 0 && (
                                <div className="space-y-2">
                                    <label className="text-amber-500 font-semibold">Предупреждения</label>
                                    <ul className="text-sm text-amber-600 space-y-1 bg-amber-500/10 p-3 rounded-md max-h-40 overflow-y-auto">
                                        {(dataManagementStore.commitSummary || dataManagementStore.previewSummary)!.row_warnings.slice(0, 50).map((w, i) => (
                                            <li key={i}>Строка {w.row}: {w.message}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Commited Alert */}
                            {dataManagementStore.commitSummary && (
                                <Alert className="border-green-500/50 bg-green-500/10 text-green-600">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    <AlertTitle>Успешно</AlertTitle>
                                    <AlertDescription>
                                        Импорт завершен.
                                        {dataManagementStore.commitSummary.predictions_recalculated !== undefined && (
                                            <span className="block mt-1">
                                                Пересчитаны прогнозы для {dataManagementStore.commitSummary.predictions_recalculated} студентов.
                                            </span>
                                        )}
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>

                        {!dataManagementStore.commitSummary && dataManagementStore.previewSummary && (
                            <CardFooter>
                                <Button
                                    onClick={handleCommit}
                                    disabled={dataManagementStore.isLoading || dataManagementStore.previewSummary.invalid_rows > 0}
                                    className="w-full gap-2"
                                >
                                    <Play className="h-4 w-4" />
                                    Сохранить в базу данных
                                </Button>
                            </CardFooter>
                        )}
                    </Card>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-muted/20 border-2 border-dashed border-border rounded-xl">
                        <FileUp className="h-10 w-10 text-muted-foreground mb-4" />
                        <h4 className="text-lg font-medium text-foreground">Загрузите файл</h4>
                        <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                            Выберите файл слева и нажмите «Проверить», чтобы увидеть статистику перед импортом.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
});
