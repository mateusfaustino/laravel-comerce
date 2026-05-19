import { Link, usePage } from '@inertiajs/react';
import { ChevronRight, Home, LayoutGrid, List, Palette, PlusCircle, Tag, Tags, Image } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { NavUser } from '@/components/nav-user';
import { useCurrentUrl } from '@/hooks/use-current-url';

export function AdminSidebar() {
    const { isCurrentUrl, isCurrentOrParentUrl } = useCurrentUrl();
    const { url } = usePage();

    const isCategoriesOpen = url.startsWith('/admin/categories');
    const isProductsOpen = url.startsWith('/admin/products');
    const isCoresOpen = url.startsWith('/admin/cores');
    const isFotosOpen = url.startsWith('/admin/fotos');
    const isTagsOpen = url.startsWith('/admin/tags');

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            isActive={isCurrentUrl('/admin/dashboard')}
                            tooltip={{ children: 'Dashboard' }}
                        >
                            <Link href="/admin/dashboard" prefetch>
                                <Home />
                                <span>Dashboard</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <Collapsible defaultOpen={isCategoriesOpen} className="group/collapsible">
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton
                                    tooltip={{ children: 'Categorias' }}
                                    isActive={isCurrentOrParentUrl('/admin/categories')}
                                >
                                    <Tag />
                                    <span>Categorias</span>
                                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton
                                            asChild
                                            isActive={isCurrentUrl('/admin/categories')}
                                        >
                                            <Link href="/admin/categories" prefetch>
                                                <List />
                                                <span>Listar Categorias</span>
                                            </Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton
                                            asChild
                                            isActive={isCurrentUrl('/admin/categories/create')}
                                        >
                                            <Link href="/admin/categories/create" prefetch>
                                                <PlusCircle />
                                                <span>Adicionar Categoria</span>
                                            </Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>

                    <Collapsible defaultOpen={isProductsOpen} className="group/collapsible">
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton
                                    tooltip={{ children: 'Produtos' }}
                                    isActive={isCurrentOrParentUrl('/admin/products')}
                                >
                                    <LayoutGrid />
                                    <span>Produtos</span>
                                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton
                                            asChild
                                            isActive={isCurrentUrl('/admin/products')}
                                        >
                                            <Link href="/admin/products" prefetch>
                                                <List />
                                                <span>Listar Produtos</span>
                                            </Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton
                                            asChild
                                            isActive={isCurrentUrl('/admin/products/create')}
                                        >
                                            <Link href="/admin/products/create" prefetch>
                                                <PlusCircle />
                                                <span>Adicionar Produto</span>
                                            </Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>

                    <Collapsible defaultOpen={isCoresOpen} className="group/collapsible">
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton
                                    tooltip={{ children: 'Cores' }}
                                    isActive={isCurrentOrParentUrl('/admin/cores')}
                                >
                                    <Palette />
                                    <span>Cores</span>
                                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton
                                            asChild
                                            isActive={isCurrentUrl('/admin/cores')}
                                        >
                                            <Link href="/admin/cores" prefetch>
                                                <List />
                                                <span>Listar Cores</span>
                                            </Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton
                                            asChild
                                            isActive={isCurrentUrl('/admin/cores/create')}
                                        >
                                            <Link href="/admin/cores/create" prefetch>
                                                <PlusCircle />
                                                <span>Adicionar Cor</span>
                                            </Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>

                    <Collapsible defaultOpen={isFotosOpen} className="group/collapsible">
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton
                                    tooltip={{ children: 'Fotos' }}
                                    isActive={isCurrentOrParentUrl('/admin/fotos')}
                                >
                                    <Image />
                                    <span>Fotos</span>
                                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton
                                            asChild
                                            isActive={isCurrentUrl('/admin/fotos')}
                                        >
                                            <Link href="/admin/fotos" prefetch>
                                                <List />
                                                <span>Listar Fotos</span>
                                            </Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton
                                            asChild
                                            isActive={isCurrentUrl('/admin/fotos/create')}
                                        >
                                            <Link href="/admin/fotos/create" prefetch>
                                                <PlusCircle />
                                                <span>Adicionar Foto</span>
                                            </Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>

                    <Collapsible defaultOpen={isTagsOpen} className="group/collapsible">
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton
                                    tooltip={{ children: 'Tags' }}
                                    isActive={isCurrentOrParentUrl('/admin/tags')}
                                >
                                    <Tags />
                                    <span>Tags</span>
                                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton
                                            asChild
                                            isActive={isCurrentUrl('/admin/tags')}
                                        >
                                            <Link href="/admin/tags" prefetch>
                                                <List />
                                                <span>Listar Tags</span>
                                            </Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton
                                            asChild
                                            isActive={isCurrentUrl('/admin/tags/create')}
                                        >
                                            <Link href="/admin/tags/create" prefetch>
                                                <PlusCircle />
                                                <span>Criar Tag</span>
                                            </Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
