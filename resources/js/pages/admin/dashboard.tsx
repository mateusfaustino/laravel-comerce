import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { home } from '@/routes';

export default function AdminDashboard() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Head title="Painel Administrativo" />
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">
                        Painel Administrativo
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6">
                    <p className="text-center text-lg text-muted-foreground">
                        Voce esta logado
                    </p>
                    <Button asChild variant="outline">
                        <Link href={home()}>Voltar para a loja</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
