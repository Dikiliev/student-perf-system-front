import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Database, Upload } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExportDataView } from './Export';
import { BulkImportView } from './BulkImport';
// import { ManualEntryView } from './ManualEntry';

export const DataManagement = observer(() => {
    const [activeTab, setActiveTab] = useState('import');

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Управление данными</h2>
                <p className="text-muted-foreground mt-2">
                    Центр интеграции и ввода данных. Создавайте записи вручную, загружайте крупные наборы таблиц (CSV/XLSX) или выгружайте резервные копии.
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
                <TabsList className="bg-card border border-border shadow-sm p-1 rounded-lg">
                    <TabsTrigger value="import" className="rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary gap-2">
                        <Upload className="h-4 w-4" /> Массовый импорт
                    </TabsTrigger>
                    {/* <TabsTrigger value="manual" className="rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary gap-2">
                        <PenTool className="h-4 w-4" /> Ручной ввод
                    </TabsTrigger> */}
                    <TabsTrigger value="export" className="rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary gap-2">
                        <Database className="h-4 w-4" /> Шаблоны и экспорт
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="import" className="min-h-[400px] border-none p-0 outline-none">
                    <BulkImportView />
                </TabsContent>

                {/* <TabsContent value="manual" className="border-none p-0 outline-none">
                    <ManualEntryView />
                </TabsContent> */}

                <TabsContent value="export" className="border-none p-0 outline-none">
                    <ExportDataView />
                </TabsContent>
            </Tabs>
        </div>
    );
});
