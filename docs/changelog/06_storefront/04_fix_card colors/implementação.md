# Implementação — Corrigir cores no card do produto

## Resumo
As cores nos cards de produto mostravam apenas o código RGB hex como tooltip, e o background das bolinhas não aparecia. Causa raiz: o banco armazena `cod_rgb` sem o prefixo `#` (ex: `FF0000`), mas CSS exige `#FF0000`. Correção: adicionar `#` no backend ao montar o DTO, e usar `color.nome` no tooltip em vez do código.

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
- Antes: `$colors[] = $variation->getCorCodRgb()` → array de strings hex sem `#`
- Depois: `$colors[] = ['nome' => getCorNome(), 'codRgb' => '#' . getCorCodRgb()]` → array de objetos com `#` prefix
- O banco armazena `cod_rgb` como `varchar(6)` sem `#`, então `'#' .` é necessário para CSS válido
- Deduplicação mudou de `in_array($codRgb, $colors)` para `in_array($codRgb, array_column($colors, 'codRgb'))`

### Frontend
- Antes: `style={{ backgroundColor: color }}` + `title={color}` (mostrava #FF0000)
- Depois: `style={{ backgroundColor: color.codRgb }}` + `title={color.nome}` (mostra "Vermelho")
- Heurística 2 (Compatibilidade sistema/mundo real): nome da cor em vez de código técnico

## Comando de Commit

```bash
git add -A && git commit -m "fix(storefront): fix color background and show color name on product cards

- Add # prefix to codRgb for valid CSS backgroundColor
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
