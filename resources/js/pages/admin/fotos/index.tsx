import { Head, Link, router } from '@inertiajs/react';
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
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

interface Product {
    id: number;
    nome: string;
}

interface FotoWithProduct {
    id: number;
    path: string;
    url: string;
    productId: number;
    descricao: string | null;
    ordem: number;
    productName?: string;
}

interface Props {
    products: Product[];
}

export default function FotosIndex({ products }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [fotosByProduct, setFotosByProduct] = useState<Record<number, FotoWithProduct[]>>({});
    const [loadingProducts, setLoadingProducts] = useState<Set<number>>(new Set());
    const [expandedProducts, setExpandedProducts] = useState<Set<number>>(new Set());

    const fetchFotosForProduct = async (productId: number) => {
        setLoadingProducts((prev) => new Set(prev).add(productId));
        try {
            const response = await fetch(`/admin/fotos/by-product/${productId}`, {
                headers: { Accept: 'application/json' },
                credentials: 'same-origin',
            });
            const data = await response.json();
            setFotosByProduct((prev) => ({
                ...prev,
                [productId]: (data.fotos || []).map((f: FotoWithProduct) => ({
                    ...f,
                    productName: products.find((p) => p.id === productId)?.nome,
                })),
            }));
        } catch {
            setFotosByProduct((prev) => ({ ...prev, [productId]: [] }));
        } finally {
            setLoadingProducts((prev) => {
                const next = new Set(prev);
                next.delete(productId);
                return next;
            });
        }
    };

    const toggleProduct = (productId: number) => {
        setExpandedProducts((prev) => {
            const next = new Set(prev);
            if (next.has(productId)) {
                next.delete(productId);
            } else {
                next.add(productId);
                if (!fotosByProduct[productId]) {
                    fetchFotosForProduct(productId);
                }
            }
            return next;
        });
    };

    const handleDelete = (id: number) => {
        setDeleting(true);
        router.delete(`/admin/fotos/${id}`, {
            onSuccess: () => {
                setDeleteId(null);
                setDeleting(false);
                // Refresh fotos for expanded products
                expandedProducts.forEach((productId) => fetchFotosForProduct(productId));
            },
            onError: () => {
                setDeleting(false);
            },
        });
    };

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin/dashboard' },
            { title: 'Fotos', href: '/admin/fotos' },
        ]}>
            <Head title="Fotos" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Fotos</h1>
                    <Button asChild>
                        <Link href="/admin/fotos/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Enviar Foto
                        </Link>
                    </Button>
                </div>

                {products.length === 0 && (
                    <div className="rounded-md border py-8 text-center text-muted-foreground">
                        Nenhum produto disponivel para exibir fotos.
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    {products.map((product) => {
                        const isExpanded = expandedProducts.has(product.id);
                        const isLoading = loadingProducts.has(product.id);
                        const fotos = fotosByProduct[product.id];

                        return (
                            <div key={product.id} className="rounded-md border bg-card text-card-foreground">
                                <div className="flex items-center justify-between gap-3 p-4">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 shrink-0"
                                            onClick={() => toggleProduct(product.id)}
                                        >
                                            <svg
                                                className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </Button>
                                        <span className="truncate font-medium">{product.nome}</span>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="border-t bg-muted/30 px-4 py-3 sm:px-6">
                                        {isLoading && (
                                            <div className="flex items-center gap-2 py-4 text-muted-foreground">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Carregando fotos...
                                            </div>
                                        )}
                                        {!isLoading && fotos && fotos.length === 0 && (
                                            <p className="py-4 text-sm text-muted-foreground">
                                                Nenhuma foto cadastrada para este produto.
                                            </p>
                                        )}
                                        {!isLoading && fotos && fotos.length > 0 && (
                                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                                {fotos.map((foto) => (
                                                    <div key={foto.id} className="group relative overflow-hidden rounded-md border">
                                                        <img
                                                            src={foto.url}
                                                            alt={foto.descricao || `Foto ${foto.ordem}`}
                                                            className="aspect-square w-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 flex items-end justify-between bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
                                                            <div className="px-2 py-1">
                                                                {foto.descricao && (
                                                                    <span className="text-xs text-white">{foto.descricao}</span>
                                                                )}
                                                            </div>
                                                            <div className="flex gap-1 p-1">
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-6 w-6 text-white hover:text-red-400"
                                                                            onClick={() => setDeleteId(foto.id)}
                                                                        >
                                                                            <Trash2 className="h-3 w-3" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>Excluir</TooltipContent>
                                                                </Tooltip>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <Dialog open={deleteId !== null} onOpenChange={() => { setDeleteId(null); setDeleting(false); }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirmar exclusao</DialogTitle>
                            <DialogDescription>
                                Tem certeza que deseja excluir esta foto? Esta acao nao pode ser desfeita.
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
