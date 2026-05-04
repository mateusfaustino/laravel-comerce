# Configuracao de Acesso a Fotos - Storage Link

## Problema

Ao cadastrar fotos no sistema, o Laravel salva os arquivos em `storage/app/public/products/` atraves do `Storage::disk('public')`. Porem, o diretorio `public/storage` nao existe como symlink, impossibilitando o acesso via URL.

## Causa

O Laravel utiliza um symlink (atalho simbolico) de `public/storage` apontando para `storage/app/public` para que arquivos armazenados pelo disco `public` fiquem acessiveis via web. Sem esse link, o servidor web nao consegue servir os arquivos.

## Solucao

Execute o comando Artisan para criar o symlink:

```bash
php artisan storage:link