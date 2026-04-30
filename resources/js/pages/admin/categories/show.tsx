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
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

interface Props {
    category: Category;
}

export default function CategoriesShow({ category }: Props) {
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
                                <p className="text-sm text-muted-foreground">Slug</p>
                                <p className="font-medium">{category.slug}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                <Badge variant={category.active ? 'default' : 'secondary'}>
                                    {category.active ? 'Ativa' : 'Inativa'}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Categoria Pai</p>
                                <p className="font-medium">
                                    {category.parentId ? `ID: ${category.parentId}` : 'Nenhuma'}
                                </p>
                            </div>
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
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
