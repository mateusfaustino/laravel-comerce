import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, ImageOff, Loader2, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface Tag {
    id: number;
    description: string;
    createdAt: string | null;
    updatedAt: string | null;
}

interface Produto {
    id: number;
    nome: string;
    slug: string;
    image: string | null;
}

interface ProdutoSuggestion {
    id: number;
    nome: string;
}

interface Props {
    tag: Tag;
    produtos: Produto[];
    totalProdutos: number;
}

export default function TagsShow({ tag, produtos, totalProdutos }: Props) {
    const [detachId, setDetachId] = useState<number | null>(null);
    const [detaching, setDetaching] = useState(false);
    const [productSearch, setProductSearch] = useState('');
    const [suggestions, setSuggestions] = useState<ProdutoSuggestion[]>([]);
    const [searching, setSearching] = useState(false);
    const [attaching, setAttaching] = useState(false);
    const debounceRef = useRef<number | null>(null);

    useEffect(() => {
        if (debounceRef.current !== null) {
            window.clearTimeout(debounceRef.current);
        }
        const term = productSearch.trim();
        if (term === '') {
            setSuggestions([]);
            return;
        }
        debounceRef.current = window.setTimeout(async () => {
            setSearching(true);
            try {
                const res = await fetch(
                    `/admin/tags/products/search?q=${encodeURIComponent(term)}&limit=8`,
                    { headers: { Accept: 'application/json' } },
                );
                if (res.ok) {
                    const json = await res.json().catch(() => null);
                    if (json && Array.isArray(json.data)) {
                        setSuggestions(
                            json.data.map((p: { id: number; nome: string }) => ({
                                id: p.id,
                                nome: p.nome,
                            })),
                        );
                    } else {
                        setSuggestions([]);
                    }
                }
            } catch {
                setSuggestions([]);
            } finally {
                setSearching(false);
            }
        }, 300);
        return () => {
            if (debounceRef.current !== null) {
                window.clearTimeout(debounceRef.current);
            }
        };
    }, [productSearch]);

    const handleAttach = (productId: number) => {
        setAttaching(true);
        router.post(
            `/admin/tags/${tag.id}/products`,
            { product_id: productId },
            {
                onFinish: () => {
                    setAttaching(false);
                    setProductSearch('');
                    setSuggestions([]);
                },
            },
        );
    };

    const handleDetach = (productId: number) => {
        setDetaching(true);
        router.delete(`/admin/tags/${tag.id}/products/${productId}`, {
            onSuccess: () => {
                setDetachId(null);
                setDetaching(false);
            },
            onError: () => {
                setDetaching(false);
            },
        });
    };

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin/dashboard' },
            { title: 'Tags', href: '/admin/tags' },
            { title: tag.description, href: `/admin/tags/${tag.id}` },
        ]}>
            <Head title={`Tag: ${tag.description}`} />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/admin/tags">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <h1 className="text-2xl font-bold truncate">{tag.description}</h1>
                        <Badge variant="secondary">{totalProdutos} produto{totalProdutos === 1 ? '' : 's'}</Badge>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={`/admin/tags/${tag.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Vincular produto</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        <Input
                            type="search"
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            placeholder="Buscar produto pelo nome..."
                            aria-label="Buscar produto"
                        />
                        {searching && (
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                Buscando...
                            </div>
                        )}
                        {suggestions.length > 0 && (
                            <ul className="rounded-md border divide-y">
                                {suggestions.map((p) => (
                                    <li key={p.id} className="flex items-center justify-between p-2">
                                        <span className="truncate">{p.nome}</span>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={attaching}
                                            onClick={() => handleAttach(p.id)}
                                        >
                                            Vincular
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Produtos vinculados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {produtos.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Nenhum produto vinculado a esta tag.</p>
                        ) : (
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {produtos.map((p) => (
                                    <div
                                        key={p.id}
                                        className="flex items-center gap-3 rounded-md border p-3"
                                    >
                                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-muted flex items-center justify-center">
                                            {p.image ? (
                                                <img src={p.image} alt={p.nome} className="h-full w-full object-cover" />
                                            ) : (
                                                <ImageOff className="h-5 w-5 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={`/admin/products/${p.id}`}
                                                className="block truncate font-medium hover:underline"
                                            >
                                                {p.nome}
                                            </Link>
                                            <p className="truncate text-xs text-muted-foreground">/{p.slug}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 shrink-0"
                                            onClick={() => setDetachId(p.id)}
                                            aria-label={`Desvincular ${p.nome}`}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Dialog open={detachId !== null} onOpenChange={() => { setDetachId(null); setDetaching(false); }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Desvincular produto</DialogTitle>
                            <DialogDescription>
                                Tem certeza que deseja desvincular este produto da tag? A tag e o produto continuarao existindo.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDetachId(null)}>
                                Cancelar
                            </Button>
                            <Button
                                variant="destructive"
                                disabled={detaching}
                                onClick={() => detachId && handleDetach(detachId)}
                            >
                                {detaching ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Desvinculando...
                                    </>
                                ) : (
                                    'Desvincular'
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
