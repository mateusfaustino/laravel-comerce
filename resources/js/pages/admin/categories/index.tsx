import { Head, Link, router } from '@inertiajs/react';
import { ChevronDown, ChevronLeft, ChevronRight, Eye, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [subcategoryPage, setSubcategoryPage] = useState<SubcategoryPage | null>(null);
    const [loadingSubcategories, setLoadingSubcategories] = useState(false);
    const totalPages = Math.ceil(total / perPage);

    const fetchSubcategories = useCallback(async (parentId: number, page: number = 1) => {
        setLoadingSubcategories(true);
        try {
            const response = await fetch(`/admin/categories/${parentId}/subcategories?page=${page}`, {
                headers: { Accept: 'application/json' },
                credentials: 'same-origin',
            });
            const data = await response.json();
            setSubcategoryPage(data);
        } catch {
            setSubcategoryPage(null);
        } finally {
            setLoadingSubcategories(false);
        }
    }, []);

    const handleToggleExpand = useCallback((category: Category) => {
        if (expandedId === category.id) {
            setExpandedId(null);
            setSubcategoryPage(null);
        } else {
            setExpandedId(category.id);
            fetchSubcategories(category.id);
        }
    }, [expandedId, fetchSubcategories]);

    const handleSubcategoryPage = useCallback((page: number) => {
        if (expandedId !== null) {
            fetchSubcategories(expandedId, page);
        }
    }, [expandedId, fetchSubcategories]);

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
                                <th className="px-4 py-3 text-left font-medium">Sub-categorias</th>
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
                                <Collapsible
                                    key={category.id}
                                    open={expandedId === category.id}
                                    onOpenChange={() => handleToggleExpand(category)}
                                >
                                    <tr className="border-t">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {category.childrenCount > 0 && (
                                                    <CollapsibleTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6">
                                                            <ChevronDown
                                                                className={`h-4 w-4 transition-transform ${expandedId === category.id ? 'rotate-180' : ''}`}
                                                            />
                                                        </Button>
                                                    </CollapsibleTrigger>
                                                )}
                                                <span className="font-medium">{category.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant="secondary">
                                                {category.childrenCount}
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
                                    {category.childrenCount > 0 && (
                                        <tr className="border-t bg-muted/30">
                                            <td colSpan={4} className="p-0">
                                                <CollapsibleContent>
                                                    <div className="px-6 py-3">
                                                        {loadingSubcategories && (
                                                            <div className="flex items-center gap-2 py-4 text-muted-foreground">
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                                Carregando sub-categorias...
                                                            </div>
                                                        )}
                                                        {!loadingSubcategories && subcategoryPage && subcategoryPage.subcategories.length === 0 && (
                                                            <p className="py-4 text-sm text-muted-foreground">
                                                                Nenhuma sub-categoria encontrada.
                                                            </p>
                                                        )}
                                                        {!loadingSubcategories && subcategoryPage && subcategoryPage.subcategories.length > 0 && (
                                                            <div className="flex flex-col gap-2">
                                                                <div className="flex flex-col divide-y">
                                                                    {subcategoryPage.subcategories.map((sub) => (
                                                                        <div key={sub.id} className="flex items-center justify-between py-2">
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="text-sm">{sub.name}</span>
                                                                                <Badge className={sub.active ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300' : 'border-gray-300 bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-400'}>
                                                                                    {sub.active ? 'Ativa' : 'Inativa'}
                                                                                </Badge>
                                                                            </div>
                                                                            <div className="flex gap-1">
                                                                                <Tooltip>
                                                                                    <TooltipTrigger asChild>
                                                                                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                                                            <Link href={`/admin/categories/${sub.id}`}>
                                                                                                <Eye className="h-3.5 w-3.5" />
                                                                                            </Link>
                                                                                        </Button>
                                                                                    </TooltipTrigger>
                                                                                    <TooltipContent>Ver detalhes</TooltipContent>
                                                                                </Tooltip>
                                                                                <Tooltip>
                                                                                    <TooltipTrigger asChild>
                                                                                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                                                            <Link href={`/admin/categories/${sub.id}/edit`}>
                                                                                                <Pencil className="h-3.5 w-3.5" />
                                                                                            </Link>
                                                                                        </Button>
                                                                                    </TooltipTrigger>
                                                                                    <TooltipContent>Editar</TooltipContent>
                                                                                </Tooltip>
                                                                                <Tooltip>
                                                                                    <TooltipTrigger asChild>
                                                                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeleteId(sub.id)}>
                                                                                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                                                                        </Button>
                                                                                    </TooltipTrigger>
                                                                                    <TooltipContent>Desativar</TooltipContent>
                                                                                </Tooltip>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                {Math.ceil(subcategoryPage.total / subcategoryPage.perPage) > 1 && (
                                                                    <div className="flex items-center justify-between pt-2">
                                                                        <span className="text-xs text-muted-foreground">
                                                                            {subcategoryPage.total} sub-categoria{subcategoryPage.total !== 1 ? 's' : ''}
                                                                        </span>
                                                                        <div className="flex items-center gap-2">
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                disabled={subcategoryPage.currentPage <= 1}
                                                                                onClick={() => handleSubcategoryPage(subcategoryPage.currentPage - 1)}
                                                                            >
                                                                                <ChevronLeft className="h-3 w-3" />
                                                                            </Button>
                                                                            <span className="text-xs text-muted-foreground">
                                                                                {subcategoryPage.currentPage}/{Math.ceil(subcategoryPage.total / subcategoryPage.perPage)}
                                                                            </span>
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                disabled={subcategoryPage.currentPage >= Math.ceil(subcategoryPage.total / subcategoryPage.perPage)}
                                                                                onClick={() => handleSubcategoryPage(subcategoryPage.currentPage + 1)}
                                                                            >
                                                                                <ChevronRight className="h-3 w-3" />
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </CollapsibleContent>
                                            </td>
                                        </tr>
                                    )}
                                </Collapsible>
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
