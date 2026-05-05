import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
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

interface Category {
    id: number;
    name: string;
}

interface Subcategory {
    id: number;
    name: string;
    parentId: number;
    parentName: string;
}

interface Foto {
    id: number;
    path: string;
    url: string;
    productId: number;
    descricao: string | null;
    ordem: number;
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
    precoVenda: string | null;
    precoPromocional: string | null;
    custo: string | null;
    fotoIds: number[];
}

interface Cor {
    id: number;
    nome: string;
    codRgb: string;
}

interface Props {
    product: Product;
    categories: Category[];
    subcategories: Subcategory[];
    fotos: Foto[];
    variations: Variation[];
    cores: Cor[];
    selectedCategoryIds: number[];
}

const tamanhoRoupaAdultoOptions = ['PP', 'P', 'M', 'G', 'GG', 'XG'];
const tamanhoRoupaCriancaOptions = ['2', '4', '6', '8', '10', '12', '14'];
const tamanhoCalcadoOptions = ['32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48'];

export default function ProductsEdit({ product, categories, subcategories, fotos, variations, cores, selectedCategoryIds }: Props) {
    const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
    const [showVariationDialog, setShowVariationDialog] = useState(false);
    const [deleteVariationId, setDeleteVariationId] = useState<number | null>(null);
    const [deletingVariation, setDeletingVariation] = useState(false);
    const [deleteFotoId, setDeleteFotoId] = useState<number | null>(null);
    const [deletingFoto, setDeletingFoto] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        nome: product.nome,
        slug: product.slug,
        tipo_produto: product.tipoProduto,
        estoque_tipo: product.estoqueTipo,
        descricao: product.descricao || '',
        sku: product.sku || '',
        codigo_barras: product.codigoBarras || '',
        peso: product.peso !== null ? String(product.peso) : '',
        largura: product.largura !== null ? String(product.largura) : '',
        altura: product.altura !== null ? String(product.altura) : '',
        comprimento: product.comprimento !== null ? String(product.comprimento) : '',
        active: product.active,
        category_ids: selectedCategoryIds as number[],
        thumbnail_foto_id: product.thumbnailFotoId !== null ? String(product.thumbnailFotoId) : '',
    });

    const { data: variationData, setData: setVariationData, post: postVariation, processing: processingVariation, errors: variationErrors, reset: resetVariation } = useForm({
        cor_id: '' as string,
        tamanho_roupa_adulto: '' as string,
        tamanho_roupa_crianca: '' as string,
        tamanho_calcado: '' as string,
        quantidade_estoque: '0' as string,
        sku: '' as string,
        preco_venda: '' as string,
        preco_promocional: '' as string,
        custo: '' as string,
        active: true,
    });

    const { data: fotoUploadData, setData: setFotoUploadData, post: postFoto, processing: processingFoto, reset: resetFotoUpload } = useForm({
        foto: null as File | null,
        product_id: String(product.id),
        descricao: '' as string,
        ordem: '0' as string,
    });

    const slugify = useCallback((text: string): string => {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }, []);

    const handleNameChange = useCallback((value: string) => {
        setData('nome', value);
        setData('slug', slugify(value));
    }, [setData, slugify]);

    const toggleCategory = (id: number) => {
        const current = data.category_ids;
        if (current.includes(id)) {
            setData('category_ids', current.filter((cid) => cid !== id));
        } else {
            setData('category_ids', [...current, id]);
        }
    };

    const toggleCategoryGroup = (categoryId: number) => {
        setExpandedCategories((prev) => {
            const next = new Set(prev);
            if (next.has(categoryId)) {
                next.delete(categoryId);
            } else {
                next.add(categoryId);
            }
            return next;
        });
    };

    const selectAllSubcategories = (parentId: number) => {
        const childIds = subcategories
            .filter((sub) => sub.parentId === parentId)
            .map((sub) => sub.id);
        const withoutChildren = data.category_ids.filter((id) => !childIds.includes(id));
        setData('category_ids', [...withoutChildren, ...childIds]);
    };

    const deselectAllSubcategories = (parentId: number) => {
        const childIds = subcategories
            .filter((sub) => sub.parentId === parentId)
            .map((sub) => sub.id);
        setData('category_ids', data.category_ids.filter((id) => !childIds.includes(id)));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/products/${product.id}`);
    };

    const handleVariationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postVariation(`/admin/products/${product.id}/variations`, {
            onSuccess: () => {
                setShowVariationDialog(false);
                resetVariation();
                router.reload({ only: [] });
            },
        });
    };

    const handleDeleteVariation = (id: number) => {
        setDeletingVariation(true);
        router.delete(`/admin/products/${product.id}/variations/${id}`, {
            onSuccess: () => {
                setDeleteVariationId(null);
                setDeletingVariation(false);
            },
            onError: () => {
                setDeletingVariation(false);
            },
        });
    };

    const handleFotoUpload = (e: React.FormEvent) => {
        e.preventDefault();
        postFoto('/admin/fotos', {
            onSuccess: () => {
                resetFotoUpload();
                router.reload({ only: [] });
            },
        });
    };

    const handleDeleteFoto = (id: number) => {
        setDeletingFoto(true);
        router.delete(`/admin/fotos/${id}`, {
            onSuccess: () => {
                setDeleteFotoId(null);
                setDeletingFoto(false);
            },
            onError: () => {
                setDeletingFoto(false);
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFotoUploadData('foto', file);
        }
    };

    const getSizeOptions = () => {
        switch (data.tipo_produto) {
            case 'ROUPA_ADULTO':
                return tamanhoRoupaAdultoOptions;
            case 'ROUPA_CRIANCA':
                return tamanhoRoupaCriancaOptions;
            case 'CALCADO':
                return tamanhoCalcadoOptions;
            default:
                return [];
        }
    };

    const getSizeLabel = () => {
        switch (data.tipo_produto) {
            case 'ROUPA_ADULTO':
                return 'Tamanho Roupa Adulto';
            case 'ROUPA_CRIANCA':
                return 'Tamanho Roupa Crianca';
            case 'CALCADO':
                return 'Tamanho Calcado';
            default:
                return 'Tamanho';
        }
    };

    const getSizeField = () => {
        switch (data.tipo_produto) {
            case 'ROUPA_ADULTO':
                return 'tamanho_roupa_adulto';
            case 'ROUPA_CRIANCA':
                return 'tamanho_roupa_crianca';
            case 'CALCADO':
                return 'tamanho_calcado';
            default:
                return '';
        }
    };

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin/dashboard' },
            { title: 'Produtos', href: '/admin/products' },
            { title: 'Editar Produto', href: `/admin/products/${product.id}/edit` },
        ]}>
            <Head title="Editar Produto" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/products">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Editar Produto</h1>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Basic Info */}
                    <Card className="max-w-3xl">
                        <CardHeader>
                            <CardTitle>Informacoes Basicas</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="nome">Nome *</Label>
                                    <Input
                                        id="nome"
                                        value={data.nome}
                                        onChange={(e) => handleNameChange(e.target.value)}
                                    />
                                    {errors.nome && <p className="text-sm text-destructive">{errors.nome}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="slug">Identificador da URL</Label>
                                    <Input
                                        id="slug"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                    />
                                    {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="tipo_produto">Tipo de Produto *</Label>
                                    <Select value={data.tipo_produto} onValueChange={(value) => setData('tipo_produto', value)}>
                                        <SelectTrigger id="tipo_produto">
                                            <SelectValue placeholder="Selecione o tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ROUPA_ADULTO">Roupa Adulto</SelectItem>
                                            <SelectItem value="ROUPA_CRIANCA">Roupa Crianca</SelectItem>
                                            <SelectItem value="CALCADO">Calcado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.tipo_produto && <p className="text-sm text-destructive">{errors.tipo_produto}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="estoque_tipo">Tipo de Estoque *</Label>
                                    <Select value={data.estoque_tipo} onValueChange={(value) => setData('estoque_tipo', value)}>
                                        <SelectTrigger id="estoque_tipo">
                                            <SelectValue placeholder="Selecione o tipo de estoque" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="INFINITO">Infinito</SelectItem>
                                            <SelectItem value="LIMITADO">Limitado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.estoque_tipo && <p className="text-sm text-destructive">{errors.estoque_tipo}</p>}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="descricao">Descricao</Label>
                                <Input
                                    id="descricao"
                                    value={data.descricao}
                                    onChange={(e) => setData('descricao', e.target.value)}
                                />
                                {errors.descricao && <p className="text-sm text-destructive">{errors.descricao}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Identification */}
                    <Card className="max-w-3xl">
                        <CardHeader>
                            <CardTitle>Identificacao</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="sku">SKU</Label>
                                    <Input
                                        id="sku"
                                        value={data.sku}
                                        onChange={(e) => setData('sku', e.target.value)}
                                    />
                                    {errors.sku && <p className="text-sm text-destructive">{errors.sku}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="codigo_barras">Codigo de Barras</Label>
                                    <Input
                                        id="codigo_barras"
                                        value={data.codigo_barras}
                                        onChange={(e) => setData('codigo_barras', e.target.value)}
                                    />
                                    {errors.codigo_barras && <p className="text-sm text-destructive">{errors.codigo_barras}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dimensions */}
                    <Card className="max-w-3xl">
                        <CardHeader>
                            <CardTitle>Dimensoes e Peso</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="peso">Peso (kg)</Label>
                                    <Input id="peso" type="number" step="0.01" min="0" value={data.peso} onChange={(e) => setData('peso', e.target.value)} />
                                    {errors.peso && <p className="text-sm text-destructive">{errors.peso}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="largura">Largura (cm)</Label>
                                    <Input id="largura" type="number" step="0.01" min="0" value={data.largura} onChange={(e) => setData('largura', e.target.value)} />
                                    {errors.largura && <p className="text-sm text-destructive">{errors.largura}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="altura">Altura (cm)</Label>
                                    <Input id="altura" type="number" step="0.01" min="0" value={data.altura} onChange={(e) => setData('altura', e.target.value)} />
                                    {errors.altura && <p className="text-sm text-destructive">{errors.altura}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="comprimento">Comprimento (cm)</Label>
                                    <Input id="comprimento" type="number" step="0.01" min="0" value={data.comprimento} onChange={(e) => setData('comprimento', e.target.value)} />
                                    {errors.comprimento && <p className="text-sm text-destructive">{errors.comprimento}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Categories */}
                    <Card className="max-w-3xl">
                        <CardHeader>
                            <CardTitle>Categorias</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            {categories.length === 0 && (
                                <p className="text-sm text-muted-foreground">Nenhuma categoria disponivel.</p>
                            )}
                            {categories.map((category) => {
                                const children = subcategories.filter((sub) => sub.parentId === category.id);
                                const isExpanded = expandedCategories.has(category.id);
                                const isCategorySelected = data.category_ids.includes(category.id);

                                return (
                                    <div key={category.id} className="rounded-md border">
                                        <div className="flex items-center gap-2 p-3">
                                            <Checkbox
                                                id={`cat-${category.id}`}
                                                checked={isCategorySelected}
                                                onCheckedChange={() => toggleCategory(category.id)}
                                            />
                                            <Label htmlFor={`cat-${category.id}`} className="cursor-pointer font-medium">
                                                {category.name}
                                            </Label>
                                            {children.length > 0 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="ml-auto"
                                                    onClick={() => toggleCategoryGroup(category.id)}
                                                >
                                                    {children.length} sub-categoria{children.length !== 1 ? 's' : ''}
                                                    {isExpanded ? ' ▲' : ' ▼'}
                                                </Button>
                                            )}
                                        </div>
                                        {isExpanded && children.length > 0 && (
                                            <div className="border-t bg-muted/30 px-6 py-2">
                                                <div className="mb-2 flex gap-2">
                                                    <Button type="button" variant="outline" size="sm" onClick={() => selectAllSubcategories(category.id)}>
                                                        Selecionar todas
                                                    </Button>
                                                    <Button type="button" variant="outline" size="sm" onClick={() => deselectAllSubcategories(category.id)}>
                                                        Desmarcar todas
                                                    </Button>
                                                </div>
                                                {children.map((sub) => (
                                                    <div key={sub.id} className="flex items-center gap-2 py-1">
                                                        <Checkbox
                                                            id={`sub-${sub.id}`}
                                                            checked={data.category_ids.includes(sub.id)}
                                                            onCheckedChange={() => toggleCategory(sub.id)}
                                                        />
                                                        <Label htmlFor={`sub-${sub.id}`} className="cursor-pointer text-sm">
                                                            {sub.name}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            {errors.category_ids && <p className="text-sm text-destructive">{errors.category_ids}</p>}
                        </CardContent>
                    </Card>

                    {/* Active */}
                    <Card className="max-w-3xl">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                    <Label htmlFor="active">Produto ativo</Label>
                                    <p className="text-xs text-muted-foreground">Produtos inativos nao aparecem no site.</p>
                                </div>
                                <Switch
                                    id="active"
                                    checked={data.active}
                                    onCheckedChange={(checked) => setData('active', checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <div className="flex justify-end gap-2 max-w-3xl">
                        <Button variant="outline" asChild>
                            <Link href="/admin/products">Cancelar</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Salvar
                        </Button>
                    </div>
                </form>

                {/* Photos Section */}
                <Card className="max-w-3xl">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Fotos</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        {/* Upload form */}
                        <form onSubmit={handleFotoUpload} className="flex flex-col gap-3 rounded-md border p-4">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="foto-file">Arquivo</Label>
                                    <Input
                                        id="foto-file"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="foto-descricao">Descricao</Label>
                                    <Input
                                        id="foto-descricao"
                                        value={fotoUploadData.descricao}
                                        onChange={(e) => setFotoUploadData('descricao', e.target.value)}
                                        placeholder="Descricao da foto"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="foto-ordem">Ordem</Label>
                                    <Input
                                        id="foto-ordem"
                                        type="number"
                                        value={fotoUploadData.ordem}
                                        onChange={(e) => setFotoUploadData('ordem', e.target.value)}
                                    />
                                </div>
                            </div>
                            <Button type="submit" disabled={processingFoto} className="self-start">
                                {processingFoto ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Enviar Foto
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Existing photos */}
                        {fotos.length > 0 && (
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                {fotos.map((foto) => (
                                    <div key={foto.id} className="relative overflow-hidden rounded-md border">
                                        <img
                                            src={foto.url}
                                            alt={foto.descricao || `Foto ${foto.ordem}`}
                                            className="aspect-square w-full object-cover"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-black/50 px-2 py-1">
                                            <div className="flex items-center gap-1">
                                                <input
                                                    type="radio"
                                                    name="thumbnail"
                                                    checked={data.thumbnail_foto_id === String(foto.id)}
                                                    onChange={() => setData('thumbnail_foto_id', String(foto.id))}
                                                    className="h-3 w-3"
                                                />
                                                <span className="text-xs text-white">Capa</span>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-white hover:text-red-400"
                                                onClick={() => setDeleteFotoId(foto.id)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {fotos.length === 0 && (
                            <p className="text-sm text-muted-foreground">Nenhuma foto cadastrada.</p>
                        )}
                    </CardContent>
                </Card>

                {/* Variations Section */}
                <Card className="max-w-3xl">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Variacoes ({variations.length})</CardTitle>
                        <Button type="button" onClick={() => setShowVariationDialog(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Nova Variacao
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {variations.length === 0 && (
                            <p className="text-sm text-muted-foreground">Nenhuma variacao cadastrada.</p>
                        )}
                        {variations.length > 0 && (
                            <div className="flex flex-col gap-3">
                                {variations.map((variation) => {
                                    const size = variation.tamanhoRoupaAdulto || variation.tamanhoRoupaCrianca || variation.tamanhoCalcado || null;
                                    const cor = variation.corId ? cores.find((c) => c.id === variation.corId) : null;
                                    return (
                                        <div key={variation.id} className="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex flex-wrap items-center gap-2">
                                                {cor && (
                                                    <div className="flex items-center gap-1.5">
                                                        <span
                                                            className="inline-block h-4 w-4 rounded-full border"
                                                            style={{ backgroundColor: cor.codRgb }}
                                                        />
                                                        <span className="text-sm font-medium">{cor.nome}</span>
                                                    </div>
                                                )}
                                                {variation.corNome && !cor && (
                                                    <span className="text-sm font-medium">{variation.corNome}</span>
                                                )}
                                                {size && (
                                                    <Badge variant="outline">{size}</Badge>
                                                )}
                                                <Badge className={variation.active ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300' : 'border-gray-300 bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-400'}>
                                                    {variation.active ? 'Ativo' : 'Inativo'}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                                    {variation.precoVenda && (
                                                        <span>R$ {Number(variation.precoVenda).toFixed(2)}</span>
                                                    )}
                                                    {variation.quantidadeEstoque > 0 && (
                                                        <span>Estoque: {variation.quantidadeEstoque}</span>
                                                    )}
                                                    {variation.sku && (
                                                        <span>SKU: {variation.sku}</span>
                                                    )}
                                                </div>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 text-muted-foreground hover:text-red-500"
                                                            onClick={() => setDeleteVariationId(variation.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Excluir variacao</TooltipContent>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Add Variation Dialog */}
            <Dialog open={showVariationDialog} onOpenChange={setShowVariationDialog}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Nova Variacao</DialogTitle>
                        <DialogDescription>
                            Adicione uma nova variacao ao produto. Os campos exibidos dependem do tipo de produto.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleVariationSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label>Cor</Label>
                            <Select
                                value={variationData.cor_id}
                                onValueChange={(value) => setVariationData('cor_id', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione a cor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {cores.map((cor) => (
                                        <SelectItem key={cor.id} value={String(cor.id)}>
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="inline-block h-3 w-3 rounded-full border"
                                                    style={{ backgroundColor: cor.codRgb }}
                                                />
                                                {cor.nome}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {variationErrors.cor_id && <p className="text-sm text-destructive">{variationErrors.cor_id}</p>}
                        </div>

                        {getSizeField() && (
                            <div className="flex flex-col gap-2">
                                <Label>{getSizeLabel()} *</Label>
                                <Select
                                    value={variationData[getSizeField() as keyof typeof variationData] as string}
                                    onValueChange={(value) => setVariationData(getSizeField() as 'tamanho_roupa_adulto' | 'tamanho_roupa_crianca' | 'tamanho_calcado', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={`Selecione o ${getSizeLabel().toLowerCase()}`} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {getSizeOptions().map((size) => (
                                            <SelectItem key={size} value={size}>{size}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {variationErrors[getSizeField() as keyof typeof variationErrors] && (
                                    <p className="text-sm text-destructive">{variationErrors[getSizeField() as keyof typeof variationErrors]}</p>
                                )}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="var-quantidade">Quantidade em Estoque</Label>
                                <Input
                                    id="var-quantidade"
                                    type="number"
                                    min="0"
                                    value={variationData.quantidade_estoque}
                                    onChange={(e) => setVariationData('quantidade_estoque', e.target.value)}
                                />
                                {variationErrors.quantidade_estoque && <p className="text-sm text-destructive">{variationErrors.quantidade_estoque}</p>}
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="var-sku">SKU</Label>
                                <Input
                                    id="var-sku"
                                    value={variationData.sku}
                                    onChange={(e) => setVariationData('sku', e.target.value)}
                                />
                                {variationErrors.sku && <p className="text-sm text-destructive">{variationErrors.sku}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="var-preco-venda">Preco de Venda *</Label>
                                <Input
                                    id="var-preco-venda"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={variationData.preco_venda}
                                    onChange={(e) => setVariationData('preco_venda', e.target.value)}
                                    placeholder="0.00"
                                />
                                {variationErrors.preco_venda && <p className="text-sm text-destructive">{variationErrors.preco_venda}</p>}
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="var-preco-promocional">Preco Promocional</Label>
                                <Input
                                    id="var-preco-promocional"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={variationData.preco_promocional}
                                    onChange={(e) => setVariationData('preco_promocional', e.target.value)}
                                    placeholder="0.00"
                                />
                                {variationErrors.preco_promocional && <p className="text-sm text-destructive">{variationErrors.preco_promocional}</p>}
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="var-custo">Custo</Label>
                                <Input
                                    id="var-custo"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={variationData.custo}
                                    onChange={(e) => setVariationData('custo', e.target.value)}
                                    placeholder="0.00"
                                />
                                {variationErrors.custo && <p className="text-sm text-destructive">{variationErrors.custo}</p>}
                            </div>
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <Label htmlFor="var-active">Variacao ativa</Label>
                            <Switch
                                id="var-active"
                                checked={variationData.active}
                                onCheckedChange={(checked) => setVariationData('active', checked)}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowVariationDialog(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={processingVariation}>
                                {processingVariation ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    'Salvar'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Variation Dialog */}
            <Dialog open={deleteVariationId !== null} onOpenChange={() => { setDeleteVariationId(null); setDeletingVariation(false); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar exclusao da variacao</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja excluir esta variacao? Esta acao nao pode ser desfeita.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteVariationId(null)}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" disabled={deletingVariation} onClick={() => deleteVariationId && handleDeleteVariation(deleteVariationId)}>
                            {deletingVariation ? (
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

            {/* Delete Foto Dialog */}
            <Dialog open={deleteFotoId !== null} onOpenChange={() => { setDeleteFotoId(null); setDeletingFoto(false); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar exclusao da foto</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja excluir esta foto? Esta acao nao pode ser desfeita.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteFotoId(null)}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" disabled={deletingFoto} onClick={() => deleteFotoId && handleDeleteFoto(deleteFotoId)}>
                            {deletingFoto ? (
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
        </AdminLayout>
    );
}
