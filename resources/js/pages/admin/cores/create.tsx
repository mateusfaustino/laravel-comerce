import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function CoresCreate() {
    const [colorPreview, setColorPreview] = useState('#000000');

    const { data, setData, post, processing, errors } = useForm({
        nome: '',
        cod_rgb: '',
    });

    const handleRgbChange = (value: string) => {
        const sanitized = value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6);
        setData('cod_rgb', sanitized);
        if (sanitized.length === 6) {
            setColorPreview(`#${sanitized}`);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/cores');
    };

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin/dashboard' },
            { title: 'Cores', href: '/admin/cores' },
            { title: 'Nova Cor', href: '/admin/cores/create' },
        ]}>
            <Head title="Nova Cor" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/cores">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Nova Cor</h1>
                </div>

                <Card className="max-w-lg">
                    <CardHeader>
                        <CardTitle>Dados da Cor</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="nome">Nome *</Label>
                                <Input
                                    id="nome"
                                    value={data.nome}
                                    onChange={(e) => setData('nome', e.target.value)}
                                    placeholder="Ex: Azul Marinho"
                                />
                                {errors.nome && <p className="text-sm text-destructive">{errors.nome}</p>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="cod_rgb">Codigo RGB *</Label>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <Input
                                            id="cod_rgb"
                                            value={data.cod_rgb}
                                            onChange={(e) => handleRgbChange(e.target.value)}
                                            placeholder="Ex: 1A2B3C"
                                            maxLength={6}
                                        />
                                    </div>
                                    <div
                                        className="h-10 w-10 shrink-0 rounded-md border"
                                        style={{ backgroundColor: colorPreview }}
                                    />
                                    <input
                                        type="color"
                                        value={colorPreview}
                                        onChange={(e) => {
                                            const hex = e.target.value.replace('#', '');
                                            setData('cod_rgb', hex);
                                            setColorPreview(e.target.value);
                                        }}
                                        className="h-10 w-10 cursor-pointer shrink-0 rounded border"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">Codigo hexadecimal de 6 caracteres (sem #).</p>
                                {errors.cod_rgb && <p className="text-sm text-destructive">{errors.cod_rgb}</p>}
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button variant="outline" asChild>
                                    <Link href="/admin/cores">Cancelar</Link>
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
