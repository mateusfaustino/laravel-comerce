import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { home } from '@/routes';

export default function AdminUnauthorized() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Head title="Pagina nao encontrada" />
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">
                        Pagina nao encontrada
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6">
                    <p className="text-center text-muted-foreground">
                        A pagina que voce esta procurando nao existe ou voce nao tem permissao para acessa-la.
                    </p>
                    <Button asChild variant="outline">
                        <Link href={home()}>Voltar para a loja</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
