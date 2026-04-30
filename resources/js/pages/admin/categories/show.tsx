import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Category {
    id: number;
    name: string;
    slug: string;
    parentId: number | null;
    parentName: string | null;
    isSubcategory: boolean;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

interface Subcategory {
    id: number;
    name: string;
    active: boolean;
}

interface Props {
    category: Category;
    subcategories: Subcategory[];
}

export default function CategoriesShow({ category, subcategories }: Props) {
    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin/dashboard' },
            { title: 'Categorias', href: '/admin/categories' },
            { title: category.name, href: `/admin/categories/${category.id}` },
        ]}>
            <Head title={category.name} />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/admin/categories">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <h1 className="text-2xl font-bold">{category.name}</h1>
                    </div>
                    <Button asChild>
                        <Link href={`/admin/categories/${category.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                        </Link>
                    </Button>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Detalhes da Categoria</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Nome</p>
                                <p className="font-medium">{category.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Identificador da URL</p>
                                <p className="font-medium">{category.slug}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Tipo</p>
                                <Badge variant={category.isSubcategory ? 'secondary' : 'default'}>
                                    {category.isSubcategory ? 'Sub-categoria' : 'Categoria'}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                <Badge className={category.active ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300' : 'border-gray-300 bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-400'}>
                                    {category.active ? 'Ativa' : 'Inativa'}
                                </Badge>
                            </div>
                            {category.isSubcategory && category.parentName && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Categoria Pai</p>
                                    <p className="font-medium">{category.parentName}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-muted-foreground">Criado em</p>
                                <p className="font-medium">
                                    {new Date(category.createdAt).toLocaleDateString('pt-BR')}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Atualizado em</p>
                                <p className="font-medium">
                                    {new Date(category.updatedAt).toLocaleDateString('pt-BR')}
                                </p>
                            </div>
                        </div>

                        {!category.isSubcategory && subcategories.length > 0 && (
                            <div className="mt-4 flex flex-col gap-2">
                                <h3 className="font-medium">Sub-categorias</h3>
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
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
