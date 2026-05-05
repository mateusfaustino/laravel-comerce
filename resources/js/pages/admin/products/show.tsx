import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

interface Foto {
    id: number;
    path: string;
    productId: number;
    descricao: string | null;
    ordem: number;
}

interface Props {
    product: Product;
    fotos: Foto[];
}

const tipoProdutoLabels: Record<string, string> = {
    ROUPA_ADULTO: 'Roupa Adulto',
    'ROUPA_CRIANCA': 'Roupa Crianca',
    CALCADO: 'Calcado',
};

const estoqueTipoLabels: Record<string, string> = {
    INFINITO: 'Infinito',
    LIMITADO: 'Limitado',
};

export default function ProductsShow({ product, fotos }: Props) {
    const categoryNames = Object.values(product.categoryNames || {});

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin/dashboard' },
            { title: 'Produtos', href: '/admin/products' },
            { title: product.nome, href: `/admin/products/${product.id}` },
        ]}>
            <Head title={product.nome} />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/admin/products">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <h1 className="text-2xl font-bold">{product.nome}</h1>
                    </div>
                    <Button asChild>
                        <Link href={`/admin/products/${product.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                        </Link>
                    </Button>
                </div>

                {/* Basic Info */}
                <Card className="max-w-3xl">
                    <CardHeader>
                        <CardTitle>Informacoes Basicas</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Nome</p>
                                <p className="font-medium">{product.nome}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Identificador da URL</p>
                                <p className="font-medium">{product.slug}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Tipo de Produto</p>
                                <Badge variant="outline">{tipoProdutoLabels[product.tipoProduto] || product.tipoProduto}</Badge>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Tipo de Estoque</p>
                                <Badge variant="outline">{estoqueTipoLabels[product.estoqueTipo] || product.estoqueTipo}</Badge>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                <Badge className={product.active ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300' : 'border-gray-300 bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-400'}>
                                    {product.active ? 'Ativo' : 'Inativo'}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Variacoes</p>
                                <p className="font-medium">{product.variacoesCount}</p>
                            </div>
                            {product.descricao && (
                                <div className="col-span-2">
                                    <p className="text-sm text-muted-foreground">Descricao</p>
                                    <p className="font-medium">{product.descricao}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Identification */}
                <Card className="max-w-3xl">
                    <CardHeader>
                        <CardTitle>Identificacao</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">SKU</p>
                                <p className="font-medium">{product.sku || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Codigo de Barras</p>
                                <p className="font-medium">{product.codigoBarras || '-'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Dimensions */}
                <Card className="max-w-3xl">
                    <CardHeader>
                        <CardTitle>Dimensoes e Peso</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Peso (kg)</p>
                                <p className="font-medium">{product.peso ?? '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Largura (cm)</p>
                                <p className="font-medium">{product.largura ?? '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Altura (cm)</p>
                                <p className="font-medium">{product.altura ?? '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Comprimento (cm)</p>
                                <p className="font-medium">{product.comprimento ?? '-'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Categories */}
                {categoryNames.length > 0 && (
                    <Card className="max-w-3xl">
                        <CardHeader>
                            <CardTitle>Categorias</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {categoryNames.map((name, index) => (
                                    <Badge key={index} variant="secondary">{name}</Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Photos */}
                {fotos.length > 0 && (
                    <Card className="max-w-3xl">
                        <CardHeader>
                            <CardTitle>Fotos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                {fotos.map((foto) => (
                                    <div key={foto.id} className="relative overflow-hidden rounded-md border">
                                        <img
                                            src={`/storage/${foto.path}`}
                                            alt={foto.descricao || `Foto ${foto.ordem}`}
                                            className="aspect-square w-full object-cover"
                                        />
                                        {product.thumbnailFotoId === foto.id && (
                                            <Badge className="absolute bottom-1 left-1 text-xs">
                                                Capa
                                            </Badge>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Timestamps */}
                <Card className="max-w-3xl">
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Criado em</p>
                                <p className="font-medium">
                                    {product.createdAt ? new Date(product.createdAt).toLocaleDateString('pt-BR') : '-'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Atualizado em</p>
                                <p className="font-medium">
                                    {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString('pt-BR') : '-'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
