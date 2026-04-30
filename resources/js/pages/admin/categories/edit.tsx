import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useCallback, useState } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Badge } from '@/components/ui/badge';
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

interface Category {
    id: number;
    name: string;
    slug: string;
    parentId: number | null;
    isSubcategory: boolean;
    active: boolean;
}

interface RootCategory {
    id: number;
    name: string;
}

interface Subcategory {
    id: number;
    name: string;
    active: boolean;
}

interface Props {
    category: Category;
    rootCategories: RootCategory[];
    subcategories: Subcategory[];
}

export default function CategoriesEdit({ category, rootCategories, subcategories }: Props) {
    const [categoryType, setCategoryType] = useState<'category' | 'subcategory'>(
        category.isSubcategory ? 'subcategory' : 'category'
    );

    const { data, setData, put, processing, errors } = useForm({
        name: category.name,
        slug: category.slug,
        parent_id: category.parentId ? String(category.parentId) : '',
        active: category.active,
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
        setData('name', value);
        setData('slug', slugify(value));
    }, [setData, slugify]);

    const handleTypeChange = (type: 'category' | 'subcategory') => {
        setCategoryType(type);
        if (type === 'category') {
            setData('parent_id', '');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (categoryType === 'category') {
            setData('parent_id', '');
        }
        put(`/admin/categories/${category.id}`);
    };

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin/dashboard' },
            { title: 'Categorias', href: '/admin/categories' },
            { title: 'Editar Categoria', href: `/admin/categories/${category.id}/edit` },
        ]}>
            <Head title="Editar Categoria" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/categories">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Editar Categoria</h1>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Dados da Categoria</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="name">Nome *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                />
                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="slug">Identificador da URL</Label>
                                <Input
                                    id="slug"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    placeholder="Gerado automaticamente a partir do nome"
                                />
                                <p className="text-xs text-muted-foreground">Texto que aparecerá na URL da categoria. Preenchido automaticamente pelo nome.</p>
                                {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label>Tipo *</Label>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant={categoryType === 'category' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => handleTypeChange('category')}
                                    >
                                        Categoria
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={categoryType === 'subcategory' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => handleTypeChange('subcategory')}
                                    >
                                        Sub-categoria
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {categoryType === 'category'
                                        ? 'Categorias aparecem no menu principal do site.'
                                        : 'Sub-categorias ficam dentro de uma categoria pai.'}
                                </p>
                            </div>

                            {categoryType === 'subcategory' && (
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="parent_id">Categoria Pai *</Label>
                                    <Select
                                        value={data.parent_id}
                                        onValueChange={(value) => setData('parent_id', value)}
                                    >
                                        <SelectTrigger id="parent_id">
                                            <SelectValue placeholder="Selecione uma categoria pai" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {rootCategories
                                                .filter((cat) => cat.id !== category.id)
                                                .map((cat) => (
                                                    <SelectItem key={cat.id} value={String(cat.id)}>
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.parent_id && <p className="text-sm text-destructive">{errors.parent_id}</p>}
                                </div>
                            )}

                            {categoryType === 'category' && subcategories.length > 0 && (
                                <div className="flex flex-col gap-2">
                                    <Label>Sub-categorias</Label>
                                    <div className="flex flex-col gap-1 rounded-md border p-3">
                                        {subcategories.map((sub) => (
                                            <div key={sub.id} className="flex items-center justify-between py-1">
                                                <Link
                                                    href={`/admin/categories/${sub.id}`}
                                                    className="text-sm text-primary hover:underline"
                                                >
                                                    {sub.name}
                                                </Link>
                                                <Badge className={sub.active ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300' : 'border-gray-300 bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-400'}>
                                                    {sub.active ? 'Ativa' : 'Inativa'}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                    <Label htmlFor="active">Categoria ativa</Label>
                                    <p className="text-xs text-muted-foreground">Categorias inativas não aparecem no site.</p>
                                </div>
                                <Switch
                                    id="active"
                                    checked={data.active}
                                    onCheckedChange={(checked) => setData('active', checked)}
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button variant="outline" asChild>
                                    <Link href="/admin/categories">Cancelar</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Salvar
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
