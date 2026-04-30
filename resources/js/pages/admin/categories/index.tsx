import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Eye, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
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

interface Category {
    id: number;
    name: string;
    slug: string;
    parentId: number | null;
    isSubcategory: boolean;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

interface Props {
    categories: Category[];
    total: number;
    perPage: number;
    currentPage: number;
}

export default function CategoriesIndex({ categories, total, perPage, currentPage }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);
    const totalPages = Math.ceil(total / perPage);

    const handleDelete = (id: number) => {
        setDeleting(true);
        router.delete(`/admin/categories/${id}`, {
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
            { title: 'Categorias', href: '/admin/categories' },
        ]}>
            <Head title="Categorias" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Categorias</h1>
                    <Button asChild>
                        <Link href="/admin/categories/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Nova Categoria
                        </Link>
                    </Button>
                </div>

                <div className="rounded-md border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Nome</th>
                                <th className="px-4 py-3 text-left font-medium">Tipo</th>
                                <th className="px-4 py-3 text-left font-medium">Status</th>
                                <th className="px-4 py-3 text-right font-medium">Acoes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                                        Nenhuma categoria encontrada.
                                    </td>
                                </tr>
                            )}
                            {categories.map((category) => (
                                <tr key={category.id} className="border-t">
                                    <td className="px-4 py-3 font-medium">{category.name}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={category.isSubcategory ? 'secondary' : 'default'}>
                                            {category.isSubcategory ? 'Sub-categoria' : 'Categoria'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge className={category.active ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300' : 'border-gray-300 bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-400'}>
                                            {category.active ? 'Ativa' : 'Inativa'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={`/admin/categories/${category.id}`}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Ver detalhes</TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={`/admin/categories/${category.id}/edit`}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Editar</TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(category.id)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Desativar</TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-end gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage <= 1}
                            onClick={() => router.get('/admin/categories', { page: currentPage - 1 })}
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
                            onClick={() => router.get('/admin/categories', { page: currentPage + 1 })}
                        >
                            Proxima
                            <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                    </div>
                )}

                <Dialog open={deleteId !== null} onOpenChange={() => { setDeleteId(null); setDeleting(false); }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirmar desativação</DialogTitle>
                            <DialogDescription>
                                Tem certeza que deseja desativar esta categoria? Ela deixará de aparecer no site.
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
                                        Desativando...
                                    </>
                                ) : (
                                    'Desativar'
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
