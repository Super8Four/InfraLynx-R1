
'use client'

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { uploadConfigBackup } from "../actions"
import { Loader2, UploadCloud, FileText, Download } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ConfigBackupProps {
    deviceId: string;
    configBackup: string | null;
}

export default function ConfigBackup({ deviceId, configBackup }: ConfigBackupProps) {
    const { toast } = useToast();
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        
        try {
            const configText = await file.text();
            const result = await uploadConfigBackup({ id: deviceId, config: configText });

            if(result.success) {
                toast({ title: "Success", description: result.message });
            } else {
                toast({ title: "Error", description: result.message, variant: "destructive" });
            }
        } catch (error) {
            console.error("Failed to read file or upload config:", error);
            toast({ title: "Error", description: "Could not read or upload file.", variant: "destructive" });
        } finally {
            setIsUploading(false);
        }
    };
    
    const handleDownload = () => {
        if (!configBackup) return;
        const blob = new Blob([configBackup], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${deviceId}-config-backup.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Configuration Backup</CardTitle>
                    <CardDescription>Upload or view the config backup.</CardDescription>
                </div>
                {configBackup && (
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                {configBackup ? (
                    <ScrollArea className="h-64 w-full rounded-md border bg-muted p-4">
                        <pre className="text-xs font-mono whitespace-pre-wrap break-all">
                            <code>{configBackup}</code>
                        </pre>
                    </ScrollArea>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed rounded-lg text-center">
                        <FileText className="h-10 w-10 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">No configuration backup found.</p>
                    </div>
                )}
                
                <div className="mt-4">
                    <Input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".txt,.conf,.cfg,text/plain"
                    />
                    <Button 
                        className="w-full" 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <UploadCloud className="mr-2 h-4 w-4" />
                        )}
                        {isUploading ? 'Uploading...' : (configBackup ? 'Upload New Backup' : 'Upload Backup')}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

