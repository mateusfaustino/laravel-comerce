# Fix: Fotos e Variacoes na tela de editar produto

## Problema

Na tela de editar produto (`/admin/products/{id}/edit`), as variacoes nao apareciam e o dialogo de nova variacao usava um campo de texto para cor em vez de um select. As fotos ja eram buscadas e exibidas, mas as variacoes nao eram carregadas do backend nem listadas no frontend.

### Causas raiz

1. **Variacoes nao buscadas no backend**: O metodo `ProductController::edit()` nao buscava variacoes do repositorio, nem as passava para a view.
2. **Cores nao disponiveis**: O metodo `edit()` nao passava dados de cores para o frontend, impossibilitando o uso de um select de cores no dialogo de variacao.
3. **Variacoes nao listadas no frontend**: A secao de variacoes no `edit.tsx` mostrava apenas uma contagem (`product.variacoesCount`), sem listar as variacoes existentes com seus detalhes.
4. **Dialogo de cor**: O campo de cor no dialogo de nova variacao usava `<Input>` com placeholder "ID da cor", em vez de um `<Select>` com as cores disponiveis.

## Solucao

1. Adicionado `findByProductId()` e `corRepository->findAll()` no `edit()` do `ProductController`, passando `variations` e `cores` para a view.
2. Substituida a secao de variacoes no `edit.tsx` por uma listagem completa com: cor (swatch RGB + nome), tamanho, status ativo/inativo, preco de venda, estoque, SKU e botao de excluir.
3. Substituido o `<Input>` de cor_id por um `<Select>` com as cores disponiveis, exibindo swatch de cor e nome.

## Arquivos alterados

| Arquivo | Alteracao |
|---------|-----------|
| `app/Modules/ProductManagement/Presentation/Http/Controllers/ProductController.php` | Adicionado `variations` e `cores` no metodo `edit()` |
| `resources/js/pages/admin/products/edit.tsx` | Adicionado interfaces `Variation` e `Cor`; adicionado props `variations` e `cores`; substituida secao de variacoes por listagem; substituido Input de cor por Select |

## Commit

```bash
git add app/Modules/ProductManagement/Presentation/Http/Controllers/ProductController.php resources/js/pages/admin/products/edit.tsx
git commit -m "fix(product-management): show variations and use cor select on product edit page

- Fetch variations and cores in ProductController edit() method
- Replace variation count text with full variation listing
- Replace cor_id text input with cor select dropdown
- Each variation row shows color swatch, size, price, stock, SKU"
```

## Comandos para aplicar as mudancas

```bash
# Limpar cache de rotas
php artisan route:clear

# Limpar cache da aplicacao
php artisan cache:clear

# Rebuild dos assets do frontend
npm run build
```
