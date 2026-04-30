import { Head, Link, router } from '@inertiajs/react';
import { ChevronDown, ChevronLeft, ChevronRight, Eye, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';
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
    childrenCount: number;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

interface Subcategory {
    id: number;
    name: string;
    slug: string;
    parentId: number | null;
    isSubcategory: boolean;
    childrenCount: number;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

interface SubcategoryPage {
    subcategories: Subcategory[];
    total: number;
    perPage: number;
    currentPage: number;
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
    const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
    const [subcategoryPages, setSubcategoryPages] = useState<Record<number, SubcategoryPage | null>>({});
    const [loadingIds, setLoadingIds] = useState<Set<number>>(new Set());
    const totalPages = Math.ceil(total / perPage);

    const fetchSubcategories = useCallback(async (parentId: number, page: number = 1) => {
        setLoadingIds((prev) => new Set(prev).add(parentId));
        try {
            const response = await fetch(`/admin/categories/${parentId}/subcategories?page=${page}`, {
                headers: { Accept: 'application/json' },
                credentials: 'same-origin',
            });
            const data = await response.json();
            setSubcategoryPages((prev) => ({ ...prev, [parentId]: data }));
        } catch {
            setSubcategoryPages((prev) => ({ ...prev, [parentId]: null }));
        } finally {
            setLoadingIds((prev) => {
                const next = new Set(prev);
                next.delete(parentId);
                return next;
            });
        }
    }, []);

    const handleToggleExpand = useCallback((category: Category) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(category.id)) {
                next.delete(category.id);
            } else {
                next.add(category.id);
                if (!subcategoryPages[category.id]) {
                    fetchSubcategories(category.id);
                }
            }
            return next;
        });
    }, [fetchSubcategories, subcategoryPages]);

    const handleSubcategoryPage = useCallback((parentId: number, page: number) => {
        fetchSubcategories(parentId, page);
    }, [fetchSubcategories]);

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

    const isExpanded = (id: number) => expandedIds.has(id);
    const isLoading = (id: number) => loadingIds.has(id);

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

                {categories.length === 0 && (
                    <div className="rounded-md border py-8 text-center text-muted-foreground">
                        Nenhuma categoria encontrada.
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    {categories.map((category) => {
                        const expanded = isExpanded(category.id);
                        const loading = isLoading(category.id);
                        const subPage = subcategoryPages[category.id];

                        return (
                            <div
                                key={category.id}
                                className="rounded-md border bg-card text-card-foreground"
                            >
                                {/* Header row */}
                                <div className="flex items-center justify-between gap-3 p-4">
                                    <div className="flex items-center gap-3 min-w-0">
                                        {category.childrenCount > 0 ? (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 shrink-0"
                                                onClick={() => handleToggleExpand(category)}
                                            >
                                                <ChevronDown
                                                    className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
                                                />
                                            </Button>
                                        ) : (
                                            <div className="h-7 w-7 shrink-0" />
                                        )}
                                        <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                                            <span className="truncate font-medium">{category.name}</span>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs">
                                                    {category.childrenCount} sub-categoria{category.childrenCount !== 1 ? 's' : ''}
                                                </Badge>
                                                <Badge className={category.active ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300' : 'border-gray-300 bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-400'}>
                                                    {category.active ? 'Ativa' : 'Inativa'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 gap-1">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                    <Link href={`/admin/categories/${category.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Ver detalhes</TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                    <Link href={`/admin/categories/${category.id}/edit`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Editar</TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeleteId(category.id)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Desativar</TooltipContent>
                                        </Tooltip>
                                    </div>
                                </div>

                                {/* Expandable subcategories */}
                                {expanded && category.childrenCount > 0 && (
                                    <div className="border-t bg-muted/30 px-4 py-3 sm:px-6">
                                        {loading && (
                                            <div className="flex items-center gap-2 py-4 text-muted-foreground">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Carregando sub-categorias...
                                            </div>
                                        )}
                                        {!loading && subPage && subPage.subcategories.length === 0 && (
                                            <p className="py-4 text-sm text-muted-foreground">
                                                Nenhuma sub-categoria ativa encontrada.
                                            </p>
                                        )}
                                        {!loading && subPage && subPage.subcategories.length > 0 && (
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col divide-y">
                                                    {subPage.subcategories.map((sub) => (
                                                        <div key={sub.id} className="flex items-center justify-between gap-3 py-2">
                                                            <div className="flex min-w-0 items-center gap-2">
                                                                <span className="truncate text-sm">{sub.name}</span>
                                                                <Badge className={sub.active ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300' : 'border-gray-300 bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-400'}>
                                                                    {sub.active ? 'Ativa' : 'Inativa'}
                                                                </Badge>
                                                            </div>
                                                            <div className="flex shrink-0 gap-1">
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                                                                            <Link href={`/admin/categories/${sub.id}`}>
                                                                                <Eye className="h-3.5 w-3.5" />
                                                                            </Link>
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>Ver detalhes</TooltipContent>
                                                                </Tooltip>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                                                                            <Link href={`/admin/categories/${sub.id}/edit`}>
                                                                                <Pencil className="h-3.5 w-3.5" />
                                                                            </Link>
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>Editar</TooltipContent>
                                                                </Tooltip>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDeleteId(sub.id)}>
                                                                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>Desativar</TooltipContent>
                                                                </Tooltip>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                {Math.ceil(subPage.total / subPage.perPage) > 1 && (
                                                    <div className="flex items-center justify-between pt-2">
                                                        <span className="text-xs text-muted-foreground">
                                                            {subPage.total} sub-categoria{subPage.total !== 1 ? 's' : ''}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                disabled={subPage.currentPage <= 1}
                                                                onClick={() => handleSubcategoryPage(category.id, subPage.currentPage - 1)}
                                                            >
                                                                <ChevronLeft className="h-3 w-3" />
                                                            </Button>
                                                            <span className="text-xs text-muted-foreground">
                                                                {subPage.currentPage}/{Math.ceil(subPage.total / subPage.perPage)}
                                                            </span>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                disabled={subPage.currentPage >= Math.ceil(subPage.total / subPage.perPage)}
                                                                onClick={() => handleSubcategoryPage(category.id, subPage.currentPage + 1)}
                                                            >
                                                                <ChevronRight className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
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
                            <DialogTitle>Confirmar desativacao</DialogTitle>
                            <DialogDescription>
                                Tem certeza que deseja desativar esta categoria? Ela deixara de aparecer no site.
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
