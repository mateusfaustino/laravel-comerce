import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface Cor {
    id: number;
    nome: string;
    codRgb: string;
    createdAt: string | null;
    updatedAt: string | null;
}

interface Props {
    cores: Cor[];
    total: number;
    perPage: number;
    currentPage: number;
}

export default function CoresIndex({ cores, total, perPage, currentPage }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);
    const totalPages = Math.ceil(total / perPage);

    const handleDelete = (id: number) => {
        setDeleting(true);
        router.delete(`/admin/cores/${id}`, {
            onSuccess: () => {
                setDeleteId(null);
                setDeleting(false);
            },
            onError: () => {
                setDeleting(false);
            },
        });
    };

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin/dashboard' },
            { title: 'Cores', href: '/admin/cores' },
        ]}>
            <Head title="Cores" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Cores</h1>
                    <Button asChild>
                        <Link href="/admin/cores/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Nova Cor
                        </Link>
                    </Button>
                </div>

                {cores.length === 0 && (
                    <div className="rounded-md border py-8 text-center text-muted-foreground">
                        Nenhuma cor encontrada.
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    {cores.map((cor) => (
                        <div
                            key={cor.id}
                            className="flex items-center justify-between gap-3 rounded-md border bg-card p-4 text-card-foreground"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div
                                    className="h-8 w-8 shrink-0 rounded-full border"
                                    style={{ backgroundColor: `#${cor.codRgb}` }}
                                />
                                <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                                    <span className="truncate font-medium">{cor.nome}</span>
                                    <Badge variant="outline" className="text-xs font-mono">
                                        #{cor.codRgb}
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex shrink-0 gap-1">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                            <Link href={`/admin/cores/${cor.id}/edit`}>
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Editar</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeleteId(cor.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Excluir</TooltipContent>
                                </Tooltip>
                            </div>
                        </div>
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-end gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage <= 1}
                            onClick={() => router.get('/admin/cores', { page: currentPage - 1 })}
                        >
                            <ChevronLeft className="mr-1 h-4 w-4" />
                            Anterior
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            Pagina {currentPage} de {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage >= totalPages}
                            onClick={() => router.get('/admin/cores', { page: currentPage + 1 })}
                        >
                            Proxima
                            <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                    </div>
                )}

                <Dialog open={deleteId !== null} onOpenChange={() => { setDeleteId(null); setDeleting(false); }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirmar exclusao</DialogTitle>
                            <DialogDescription>
                                Tem certeza que deseja excluir esta cor? Esta acao nao pode ser desfeita.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteId(null)}>
                                Cancelar
                            </Button>
                            <Button variant="destructive" disabled={deleting} onClick={() => deleteId && handleDelete(deleteId)}>
                                {deleting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Excluindo...
                                    </>
                                ) : (
                                    'Excluir'
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
