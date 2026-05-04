import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2 } from 'lucide-react';
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

interface Product {
    id: number;
    nome: string;
}

interface Props {
    products: Product[];
}

export default function FotosCreate({ products }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        foto: null as File | null,
        product_id: '' as string,
        descricao: '' as string,
        ordem: '0' as string,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('foto', file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/fotos');
    };

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin/dashboard' },
            { title: 'Fotos', href: '/admin/fotos' },
            { title: 'Enviar Foto', href: '/admin/fotos/create' },
        ]}>
            <Head title="Enviar Foto" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/fotos">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Enviar Foto</h1>
                </div>

                <Card className="max-w-lg">
                    <CardHeader>
                        <CardTitle>Dados da Foto</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="foto">Arquivo *</Label>
                                <Input
                                    id="foto"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <p className="text-xs text-muted-foreground">Imagem com no maximo 5MB.</p>
                                {errors.foto && <p className="text-sm text-destructive">{errors.foto}</p>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="product_id">Produto *</Label>
                                <Select value={data.product_id} onValueChange={(value) => setData('product_id', value)}>
                                    <SelectTrigger id="product_id">
                                        <SelectValue placeholder="Selecione o produto" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map((product) => (
                                            <SelectItem key={product.id} value={String(product.id)}>
                                                {product.nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.product_id && <p className="text-sm text-destructive">{errors.product_id}</p>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="descricao">Descricao</Label>
                                <Input
                                    id="descricao"
                                    value={data.descricao}
                                    onChange={(e) => setData('descricao', e.target.value)}
                                    placeholder="Descricao opcional da foto"
                                />
                                {errors.descricao && <p className="text-sm text-destructive">{errors.descricao}</p>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="ordem">Ordem</Label>
                                <Input
                                    id="ordem"
                                    type="number"
                                    min="0"
                                    value={data.ordem}
                                    onChange={(e) => setData('ordem', e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">Ordem de exibicao. Menor valor aparece primeiro.</p>
                                {errors.ordem && <p className="text-sm text-destructive">{errors.ordem}</p>}
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button variant="outline" asChild>
                                    <Link href="/admin/fotos">Cancelar</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Enviando...
                                        </>
                                    ) : (
                                        'Enviar'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
