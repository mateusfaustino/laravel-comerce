import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, Plus, Trash2, Upload } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Checkbox } from '@/components/ui/checkbox';
import { TagPicker, type TagPickerValue } from '@/components/tag-picker';

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

interface Cor {
    id: number;
    nome: string;
    codRgb: string;
}

interface VariationRow {
    cor_id: string;
    tamanho_roupa_adulto: string;
    tamanho_roupa_crianca: string;
    tamanho_calcado: string;
    quantidade_estoque: string;
    sku: string;
    preco_venda: string;
    preco_promocional: string;
    custo: string;
    active: boolean;
}

interface Props {
    categories: Category[];
    subcategories: Subcategory[];
    cores: Cor[];
}

const tamanhoRoupaAdultoOptions = ['PP', 'P', 'M', 'G', 'GG', 'XG'];
const tamanhoRoupaCriancaOptions = ['2', '4', '6', '8', '10', '12', '14'];
const tamanhoCalcadoOptions = ['32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48'];

const emptyVariation = (): VariationRow => ({
    cor_id: '',
    tamanho_roupa_adulto: '',
    tamanho_roupa_crianca: '',
    tamanho_calcado: '',
    quantidade_estoque: '0',
    sku: '',
    preco_venda: '',
    preco_promocional: '',
    custo: '',
    active: true,
});

export default function ProductsCreate({ categories, subcategories, cores }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        nome: '',
        slug: '',
        tipo_produto: '' as string,
        estoque_tipo: '' as string,
        descricao: '' as string,
        sku: '' as string,
        codigo_barras: '' as string,
        peso: '' as string,
        largura: '' as string,
        altura: '' as string,
        comprimento: '' as string,
        active: true,
        category_ids: [] as number[],
        tags: [] as (number | string)[],
        variations: [] as VariationRow[],
        fotos: [] as File[],
    });

    const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
    const [tagsValue, setTagsValue] = useState<TagPickerValue[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    // Variation helpers
    const addVariation = () => {
        setData('variations', [...data.variations, emptyVariation()]);
    };

    const removeVariation = (index: number) => {
        setData('variations', data.variations.filter((_, i) => i !== index));
    };

    const updateVariation = (index: number, field: keyof VariationRow, value: string | boolean) => {
        const updated = [...data.variations];
        updated[index] = { ...updated[index], [field]: value };
        setData('variations', updated);
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

    const getSizeField = (): keyof VariationRow => {
        switch (data.tipo_produto) {
            case 'ROUPA_ADULTO':
                return 'tamanho_roupa_adulto';
            case 'ROUPA_CRIANCA':
                return 'tamanho_roupa_crianca';
            case 'CALCADO':
                return 'tamanho_calcado';
            default:
                return 'tamanho_roupa_adulto';
        }
    };

    // File helpers
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setData('fotos', [...data.fotos, ...Array.from(files)]);
        }
    };

    const removeFile = (index: number) => {
        setData('fotos', data.fotos.filter((_, i) => i !== index));
    };

    // Keep Inertia form data 'tags' in sync with TagPicker local state to avoid stale closure on submit.
    useEffect(() => {
        const payload: (number | string)[] = tagsValue.map((t) => (t.id !== undefined ? t.id : t.description));
        setData('tags', payload);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tagsValue]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/products');
    };

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin/dashboard' },
            { title: 'Produtos', href: '/admin/products' },
            { title: 'Novo Produto', href: '/admin/products/create' },
        ]}>
            <Head title="Novo Produto" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/products">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Novo Produto</h1>
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
                                        placeholder="Ex: Camiseta Basica"
                                    />
                                    {errors.nome && <p className="text-sm text-destructive">{errors.nome}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="slug">Identificador da URL</Label>
                                    <Input
                                        id="slug"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        placeholder="Gerado automaticamente"
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
                                    placeholder="Descricao do produto"
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
                                        placeholder="Ex: CAM-BAS-001"
                                    />
                                    {errors.sku && <p className="text-sm text-destructive">{errors.sku}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="codigo_barras">Codigo de Barras</Label>
                                    <Input
                                        id="codigo_barras"
                                        value={data.codigo_barras}
                                        onChange={(e) => setData('codigo_barras', e.target.value)}
                                        placeholder="Ex: 7891234567890"
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
                                    <Input
                                        id="peso"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.peso}
                                        onChange={(e) => setData('peso', e.target.value)}
                                        placeholder="0.00"
                                    />
                                    {errors.peso && <p className="text-sm text-destructive">{errors.peso}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="largura">Largura (cm)</Label>
                                    <Input
                                        id="largura"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.largura}
                                        onChange={(e) => setData('largura', e.target.value)}
                                        placeholder="0.00"
                                    />
                                    {errors.largura && <p className="text-sm text-destructive">{errors.largura}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="altura">Altura (cm)</Label>
                                    <Input
                                        id="altura"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.altura}
                                        onChange={(e) => setData('altura', e.target.value)}
                                        placeholder="0.00"
                                    />
                                    {errors.altura && <p className="text-sm text-destructive">{errors.altura}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="comprimento">Comprimento (cm)</Label>
                                    <Input
                                        id="comprimento"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.comprimento}
                                        onChange={(e) => setData('comprimento', e.target.value)}
                                        placeholder="0.00"
                                    />
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
                                                    {isExpanded ? ' \u25B2' : ' \u25BC'}
                                                </Button>
                                            )}
                                        </div>
                                        {isExpanded && children.length > 0 && (
                                            <div className="border-t bg-muted/30 px-6 py-2">
                                                <div className="mb-2 flex gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => selectAllSubcategories(category.id)}
                                                    >
                                                        Selecionar todas
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => deselectAllSubcategories(category.id)}
                                                    >
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

                    {/* Tags */}
                    <Card className="max-w-3xl">
                        <CardHeader>
                            <CardTitle>Tags</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TagPicker
                                value={tagsValue}
                                onChange={setTagsValue}
                                error={errors.tags as string | undefined}
                            />
                        </CardContent>
                    </Card>

                    {/* Variations */}
                    <Card className="max-w-3xl">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Variacoes</CardTitle>
                            <Button type="button" onClick={addVariation} disabled={!data.tipo_produto}>
                                <Plus className="mr-2 h-4 w-4" />
                                Nova Variacao
                            </Button>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            {!data.tipo_produto && (
                                <p className="text-sm text-muted-foreground">Selecione o tipo de produto para adicionar variacoes.</p>
                            )}
                            {data.variations.length === 0 && data.tipo_produto && (
                                <p className="text-sm text-muted-foreground">Nenhuma variacao adicionada. Clique em "Nova Variacao" para adicionar.</p>
                            )}
                            {data.variations.map((variation, index) => (
                                <div key={index} className="rounded-md border p-4">
                                    <div className="mb-3 flex items-center justify-between">
                                        <span className="text-sm font-medium">Variacao {index + 1}</span>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeVariation(index)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                            <div className="flex flex-col gap-2">
                                                <Label>Preco de Venda *</Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={variation.preco_venda}
                                                    onChange={(e) => updateVariation(index, 'preco_venda', e.target.value)}
                                                    placeholder="0.00"
                                                />
                                                {errors[`variations.${index}.preco_venda`] && (
                                                    <p className="text-sm text-destructive">{errors[`variations.${index}.preco_venda`]}</p>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label>Preco Promocional</Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={variation.preco_promocional}
                                                    onChange={(e) => updateVariation(index, 'preco_promocional', e.target.value)}
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label>Custo</Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={variation.custo}
                                                    onChange={(e) => updateVariation(index, 'custo', e.target.value)}
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                            <div className="flex flex-col gap-2">
                                                <Label>Cor</Label>
                                                <Select
                                                    value={variation.cor_id}
                                                    onValueChange={(value) => updateVariation(index, 'cor_id', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione a cor" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {cores.map((cor) => (
                                                            <SelectItem key={cor.id} value={String(cor.id)}>
                                                                <div className="flex items-center gap-2">
                                                                    <div
                                                                        className="h-3 w-3 rounded-full border"
                                                                        style={{ backgroundColor: `#${cor.codRgb}` }}
                                                                    />
                                                                    {cor.nome}
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            {getSizeOptions().length > 0 && (
                                                <div className="flex flex-col gap-2">
                                                    <Label>{getSizeLabel()} *</Label>
                                                    <Select
                                                        value={variation[getSizeField()] as string}
                                                        onValueChange={(value) => updateVariation(index, getSizeField(), value)}
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
                                                </div>
                                            )}
                                            <div className="flex flex-col gap-2">
                                                <Label>Quantidade em Estoque</Label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={variation.quantidade_estoque}
                                                    onChange={(e) => updateVariation(index, 'quantidade_estoque', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div className="flex flex-col gap-2">
                                                <Label>SKU</Label>
                                                <Input
                                                    value={variation.sku}
                                                    onChange={(e) => updateVariation(index, 'sku', e.target.value)}
                                                    placeholder="Ex: CAM-BAS-001-P"
                                                />
                                            </div>
                                            <div className="flex items-end gap-2 pb-1">
                                                <Switch
                                                    checked={variation.active}
                                                    onCheckedChange={(checked) => updateVariation(index, 'active', checked)}
                                                />
                                                <Label>Variacao ativa</Label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Photos */}
                    <Card className="max-w-3xl">
                        <CardHeader>
                            <CardTitle>Fotos</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Selecionar Arquivos
                                </Button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>
                            {data.fotos.length > 0 && (
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                    {data.fotos.map((file, index) => (
                                        <div key={index} className="relative overflow-hidden rounded-md border">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`Preview ${index + 1}`}
                                                className="aspect-square w-full object-cover"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute bottom-1 right-1 h-6 w-6 bg-black/50 text-white hover:text-red-400"
                                                onClick={() => removeFile(index)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
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
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Salvar
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
