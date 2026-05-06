# Implementação — Corrigir cores no card do produto

## Resumo
As cores nos cards de produto mostravam apenas o código RGB hex como tooltip. Agora as cores são exibidas como bolinhas com background correto (via `codRgb`) e ao passar o mouse mostra o **nome da cor** (via `nome`) em vez do código RGB.

## Arquivos Modificados

| Arquivo | Alteração |
|---------|-----------|
| `app/Modules/Storefront/Application/DTOs/StorefrontProductDTO.php` | `colors` de `array<string>` para `array<array{nome, codRgb}>` |
| `app/Modules/Storefront/Application/DTOs/StorefrontProductDetailDTO.php` | `colors` de `array<string>` para `array<array{nome, codRgb}>` |
| `app/Modules/Storefront/Application/Services/ListStorefrontHomeService.php` | Coleta `{nome, codRgb}` em vez de apenas hex code |
| `app/Modules/Storefront/Application/Services/ListStorefrontCategoryService.php` | Coleta `{nome, codRgb}` em vez de apenas hex code |
| `app/Modules/Storefront/Application/Services/GetStorefrontProductService.php` | Coleta `{nome, codRgb}` em vez de apenas hex code (2 ocorrências) |
| `resources/js/components/store/product-card.tsx` | `colors: {nome, codRgb}[]`, `backgroundColor: color.codRgb`, `title: color.nome` |
| `resources/js/pages/store-homepage.tsx` | Interface `colors: {nome, codRgb}[]` |
| `resources/js/pages/product-page.tsx` | Interface + UI de seleção de cor com `color.nome` no title/aria-label |
| `resources/js/pages/category-page.tsx` | Interface `colors: {nome, codRgb}[]` |

## Alteração Detalhada

### Backend
- Antes: `$colors[] = $variation->getCorCodRgb()` → array de strings hex
- Depois: `$colors[] = ['nome' => $variation->getCorNome(), 'codRgb' => $variation->getCorCodRgb()]` → array de objetos
- Deduplicação mudou de `in_array($codRgb, $colors)` para `in_array($codRgb, array_column($colors, 'codRgb'))`

### Frontend
- Antes: `style={{ backgroundColor: color }}` + `title={color}` (mostrava #FF0000)
- Depois: `style={{ backgroundColor: color.codRgb }}` + `title={color.nome}` (mostra "Vermelho")
- Heurística 2 (Compatibilidade sistema/mundo real): nome da cor em vez de código técnico

## Comando de Commit

```bash
git add -A && git commit -m "fix(storefront): show color name instead of hex code in product cards

- Change colors from string[] to {nome, codRgb}[] in DTOs and services
- Display color name on hover (title) instead of RGB hex code
- Use codRgb for background color, nome for tooltip and aria-label
- Applies Nielsen Heuristic 2: match real-world conventions"
```

## Comandos de Deploy

```bash
php artisan route:clear
php artisan config:clear
npm run build
```
