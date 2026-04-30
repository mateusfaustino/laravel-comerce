import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle } from 'lucide-react';

export function FlashMessages() {
    const { flash } = usePage<{
        flash: { success?: string; error?: string };
    }>().props;

    const [visible, setVisible] = useState<{ success?: string; error?: string }>({});

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setVisible({
                success: flash.success,
                error: flash.error,
            });
            const timer = setTimeout(() => setVisible({}), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    if (!visible.success && !visible.error) {
        return null;
    }

    return (
        <div className="flex flex-col gap-2">
            {visible.success && (
                <Alert variant="default" className="border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertDescription>{visible.success}</AlertDescription>
                </Alert>
            )}
            {visible.error && (
                <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>{visible.error}</AlertDescription>
                </Alert>
            )}
        </div>
    );
}
