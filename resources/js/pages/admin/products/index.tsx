import { Head, Link, router } from '@inertiajs/react';
import { ChevronDown, ChevronLeft, ChevronRight, Eye, Loader2, Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react';
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

interface Product {
    id: number;
    nome: string;
    slug: string;
    tipoProduto: string;
    estoqueTipo: string;
    descricao: string | null;
    precoVenda: number;
    precoPromocional: number | null;
    custo: number | null;
    sku: string | null;
    codigoBarras: string | null;
    peso: number | null;
    largura: number | null;
    altura: number | null;
    comprimento: number | null;
    active: boolean;
    thumbnailFotoId: number | null;
    variacoesCount: number;
    categoryIds: number[];
    categoryNames: Record<number, string>;
    createdAt: string | null;
    updatedAt: string | null;
}

interface Variation {
    id: number;
    produtoId: number;
    corId: number | null;
    corNome: string | null;
    corCodRgb: string | null;
    tamanhoRoupaAdulto: string | null;
    tamanhoRoupaCrianca: string | null;
    tamanhoCalcado: string | null;
    active: boolean;
    quantidadeEstoque: number;
    sku: string | null;
    fotoIds: number[];
}

interface VariationPage {
    variations: Variation[];
    total: number;
    perPage: number;
    currentPage: number;
}

interface Props {
    products: Product[];
    total: number;
    perPage: number;
    currentPage: number;
    inactiveProducts: Product[];
}

const tipoProdutoLabels: Record<string, string> = {
    ROUPA_ADULTO: 'Roupa Adulto',
    'ROUPA_CRIANCA': 'Roupa Crianca',
    CALÇADO: 'Calcado',
};

const estoqueTipoLabels: Record<string, string> = {
    INFINITO: 'Infinito',
    LIMITADO: 'Limitado',
};

export default function ProductsIndex({ products, total, perPage, currentPage, inactiveProducts }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [forceDeleteId, setForceDeleteId] = useState<number | null>(null);
    const [forceDeleting, setForceDeleting] = useState(false);
    const [reactivateId, setReactivateId] = useState<number | null>(null);
    const [reactivating, setReactivating] = useState(false);
    const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
    const [variationPages, setVariationPages] = useState<Record<number, VariationPage | null>>({});
    const [loadingIds, setLoadingIds] = useState<Set<number>>(new Set());
    const totalPages = Math.ceil(total / perPage);

    const fetchVariations = useCallback(async (productId: number, page: number = 1) => {
        setLoadingIds((prev) => new Set(prev).add(productId));
        try {
            const response = await fetch(`/admin/products/${productId}/variations?page=${page}`, {
                headers: { Accept: 'application/json' },
                credentials: 'same-origin',
            });
            const data = await response.json();
            setVariationPages((prev) => ({ ...prev, [productId]: data }));
        } catch {
            setVariationPages((prev) => ({ ...prev, [productId]: null }));
        } finally {
            setLoadingIds((prev) => {
                const next = new Set(prev);
                next.delete(productId);
                return next;
            });
        }
    }, []);

    const handleToggleExpand = useCallback((product: Product) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(product.id)) {
                next.delete(product.id);
            } else {
                next.add(product.id);
                if (!variationPages[product.id]) {
                    fetchVariations(product.id);
                }
            }
            return next;
        });
    }, [fetchVariations, variationPages]);

    const handleVariationPage = useCallback((productId: number, page: number) => {
        fetchVariations(productId, page);
    }, [fetchVariations]);

    const handleDelete = (id: number) => {
        setDeleting(true);
        router.delete(`/admin/products/${id}`, {
            onSuccess: () => {
                setDeleteId(null);
                setDeleting(false);
            },
            onError: () => {
                setDeleting(false);
            },
        });
    };

    const handleForceDelete = (id: number) => {
        setForceDeleting(true);
        router.delete(`/admin/products/${id}/force`, {
            onSuccess: () => {
                setForceDeleteId(null);
                setForceDeleting(false);
            },
            onError: () => {
                setForceDeleting(false);
            },
        });
    };

    const handleReactivate = (id: number) => {
        setReactivating(true);
        router.put(`/admin/products/${id}/activate`, {}, {
            onSuccess: () => {
                setReactivateId(null);
                setReactivating(false);
            },
            onError: () => {
                setReactivating(false);
            },
        });
    };

    const isExpanded = (id: number) => expandedIds.has(id);
    const isLoading = (id: number) => loadingIds.has(id);

    const formatCurrency = (value: number | null) => {
        if (value === null) return '-';
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const getVariationSize = (variation: Variation): string => {
        if (variation.tamanhoRoupaAdulto) return variation.tamanhoRoupaAdulto;
        if (variation.tamanhoRoupaCrianca) return variation.tamanhoRoupaCrianca;
        if (variation.tamanhoCalcado) return variation.tamanhoCalcado;
        return '-';
    };

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin/dashboard' },
            { title: 'Produtos', href: '/admin/products' },
        ]}>
            <Head title="Produtos" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Produtos</h1>
                    <Button asChild>
                        <Link href="/admin/products/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Produto
                        </Link>
                    </Button>
                </div>

                {products.length === 0 && (
                    <div className="rounded-md border py-8 text-center text-muted-foreground">
                        Nenhum produto encontrado.
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    {products.map((product) => {
                        const expanded = isExpanded(product.id);
                        const loading = isLoading(product.id);
                        const varPage = variationPages[product.id];
                        const categoryNames = Object.values(product.categoryNames || {});

                        return (
                            <div
                                key={product.id}
                                className="rounded-md border bg-card text-card-foreground"
                            >
                                {/* Header row */}
                                <div className="flex items-center justify-between gap-3 p-4">
                                    <div className="flex items-center gap-3 min-w-0">
                                        {product.variacoesCount > 0 ? (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 shrink-0"
                                                onClick={() => handleToggleExpand(product)}
                                            >
                                                <ChevronDown
                                                    className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
                                                />
                                            </Button>
                                        ) : (
                                            <div className="h-7 w-7 shrink-0" />
                                        )}
                                        <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                                            <span className="truncate font-medium">{product.nome}</span>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Badge variant="outline" className="text-xs">
                                                    {tipoProdutoLabels[product.tipoProduto] || product.tipoProduto}
                                                </Badge>
                                                <Badge variant="outline" className="text-xs">
                                                    {formatCurrency(product.precoVenda)}
                                                </Badge>
                                                {product.variacoesCount > 0 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {product.variacoesCount} variacao{product.variacoesCount !== 1 ? 'es' : ''}
                                                    </Badge>
                                                )}
                                                {categoryNames.length > 0 && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        {categoryNames.join(', ')}
                                                    </Badge>
                                                )}
                                                <Badge className={product.active ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300' : 'border-gray-300 bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-400'}>
                                                    {product.active ? 'Ativo' : 'Inativo'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 gap-1">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                    <Link href={`/admin/products/${product.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Ver detalhes</TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                    <Link href={`/admin/products/${product.id}/edit`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Editar</TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeleteId(product.id)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Desativar</TooltipContent>
                                        </Tooltip>
                                    </div>
                                </div>

                                {/* Expandable variations */}
                                {expanded && product.variacoesCount > 0 && (
                                    <div className="border-t bg-muted/30 px-4 py-3 sm:px-6">
                                        {loading && (
                                            <div className="flex items-center gap-2 py-4 text-muted-foreground">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Carregando variacoes...
                                            </div>
                                        )}
                                        {!loading && varPage && varPage.variations.length === 0 && (
                                            <p className="py-4 text-sm text-muted-foreground">
                                                Nenhuma variacao ativa encontrada.
                                            </p>
                                        )}
                                        {!loading && varPage && varPage.variations.length > 0 && (
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col divide-y">
                                                    {varPage.variations.map((variation) => (
                                                        <div key={variation.id} className="flex items-center justify-between gap-3 py-2">
                                                            <div className="flex min-w-0 items-center gap-2">
                                                                {variation.corCodRgb && (
                                                                    <div
                                                                        className="h-4 w-4 shrink-0 rounded-full border"
                                                                        style={{ backgroundColor: `#${variation.corCodRgb}` }}
                                                                    />
                                                                )}
                                                                <span className="truncate text-sm">
                                                                    {variation.corNome || '-'} / {getVariationSize(variation)}
                                                                </span>
                                                                <Badge variant="outline" className="text-xs">
                                                                    Estoque: {variation.quantidadeEstoque}
                                                                </Badge>
                                                                {variation.sku && (
                                                                    <Badge variant="outline" className="text-xs">
                                                                        SKU: {variation.sku}
                                                                    </Badge>
                                                                )}
                                                                <Badge className={variation.active ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300' : 'border-gray-300 bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-400'}>
                                                                    {variation.active ? 'Ativa' : 'Inativa'}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                {Math.ceil(varPage.total / varPage.perPage) > 1 && (
                                                    <div className="flex items-center justify-between pt-2">
                                                        <span className="text-xs text-muted-foreground">
                                                            {varPage.total} variacao{varPage.total !== 1 ? 'es' : ''}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                disabled={varPage.currentPage <= 1}
                                                                onClick={() => handleVariationPage(product.id, varPage.currentPage - 1)}
                                                            >
                                                                <ChevronLeft className="h-3 w-3" />
                                                            </Button>
                                                            <span className="text-xs text-muted-foreground">
                                                                {varPage.currentPage}/{Math.ceil(varPage.total / varPage.perPage)}
                                                            </span>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                disabled={varPage.currentPage >= Math.ceil(varPage.total / varPage.perPage)}
                                                                onClick={() => handleVariationPage(product.id, varPage.currentPage + 1)}
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
                            onClick={() => router.get('/admin/products', { page: currentPage - 1 })}
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
                            onClick={() => router.get('/admin/products', { page: currentPage + 1 })}
                        >
                            Proxima
                            <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                    </div>
                )}

                {inactiveProducts.length > 0 && (
                    <div className="flex flex-col gap-3">
                        <h2 className="text-lg font-semibold text-muted-foreground">Produtos desativados</h2>
                        {inactiveProducts.map((product) => (
                            <div
                                key={product.id}
                                className="rounded-md border border-dashed bg-muted/30 text-card-foreground"
                            >
                                <div className="flex items-center justify-between gap-3 p-4">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="h-7 w-7 shrink-0" />
                                        <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                                            <span className="truncate font-medium text-muted-foreground">{product.nome}</span>
                                            <Badge className="border-gray-300 bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-400">
                                                Inativo
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 gap-1">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setReactivateId(product.id)}>
                                                    <RotateCcw className="h-4 w-4 text-green-600" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Reativar</TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                    <Link href={`/admin/products/${product.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Ver detalhes</TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                    <Link href={`/admin/products/${product.id}/edit`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Editar</TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setForceDeleteId(product.id)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Excluir permanentemente</TooltipContent>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Deactivate dialog */}
                <Dialog open={deleteId !== null} onOpenChange={() => { setDeleteId(null); setDeleting(false); }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirmar desativacao</DialogTitle>
                            <DialogDescription>
                                Tem certeza que deseja desativar este produto? Ele deixara de aparecer no site.
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

                {/* Force delete dialog */}
                <Dialog open={forceDeleteId !== null} onOpenChange={() => { setForceDeleteId(null); setForceDeleting(false); }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirmar exclusao permanente</DialogTitle>
                            <DialogDescription>
                                Tem certeza que deseja excluir este produto permanentemente? Esta acao nao pode ser desfeita e todas as variacoes e fotos serao removidas.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setForceDeleteId(null)}>
                                Cancelar
                            </Button>
                            <Button variant="destructive" disabled={forceDeleting} onClick={() => forceDeleteId && handleForceDelete(forceDeleteId)}>
                                {forceDeleting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Excluindo...
                                    </>
                                ) : (
                                    'Excluir permanentemente'
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Reactivate dialog */}
                <Dialog open={reactivateId !== null} onOpenChange={() => { setReactivateId(null); setReactivating(false); }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirmar reativacao</DialogTitle>
                            <DialogDescription>
                                Tem certeza que deseja reativar este produto? Ele voltara a aparecer no site.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setReactivateId(null)}>
                                Cancelar
                            </Button>
                            <Button variant="default" disabled={reactivating} onClick={() => reactivateId && handleReactivate(reactivateId)}>
                                {reactivating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Reativando...
                                    </>
                                ) : (
                                    'Reativar'
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
