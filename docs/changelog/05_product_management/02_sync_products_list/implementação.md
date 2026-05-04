# Implementacao do Comando de Sincronizacao de Cores Padroes

## Visao Geral

Comando Artisan para sincronizar as cores padroes definidas no arquivo de configuracao `app/Modules/ProductManagement/Infrastructure/Config/Colors.php` com a tabela `cores` do banco de dados.

---

## Arquivos Criados/Modificados

### 1. Comando Artisan
**Arquivo:** `app/Modules/ProductManagement/Infrastructure/Commands/SyncDefaultColorsCommand.php`

- Assinatura: `product:sync-default-colors`
- Le o arquivo `Colors.php` (array com nome e cod_rgb)
- Para cada cor, executa `firstOrCreate` na tabela `cores` pelo campo `nome`
- Se a cor ja existir, atualiza o `cod_rgb`
- Se for nova, cria o registro
- Retorna mensagens no console informando criacao/atualizacao de cada cor

### 2. ServiceProvider
**Arquivo:** `app/Modules/ProductManagement/Infrastructure/Providers/ProductManagementServiceProvider.php`

- Registro do comando Artisan adicionado no metodo `boot()` via `$this->commands()`
- Condicional `runningInConsole()` para evitar overhead em requisicoes HTTP

### 3. Script de Sincronizacao
**Arquivo:** `scripts/sync.sh`

- Adicionada chamada ao comando `php artisan product:sync-default-colors`
- O script agora sincroniza: permissoes, categorias e cores

---

## Configuracao de Cores Padroes

As cores padroes estao definidas em `app/Modules/ProductManagement/Infrastructure/Config/Colors.php`:

| Chave | Nome | Codigo RGB |
|-------|------|------------|
| red | vermelho paixao | FF0000 |
| wine | vinho | 800020 |
| black | preto | 000000 |
| white | branco | FFFFFF |
| nude | nude | E3BC9A |
| rose | rosa | FFC0CB |
| baby_pink | rosa bebe | F4C2C2 |
| magenta | magenta | FF00FF |
| lilac | lilas | C8A2C8 |
| purple | roxo | 800080 |
| navy | azul marinho | 000080 |
| emerald | verde esmeralda | 50C878 |
| gold | dourado | FFD700 |
| silver | prata | C0C0C0 |
| champagne | champagne | F7E7CE |
| chocolate | marrom chocolate | 7B3F00 |

---

## Sugestoes de Mensagem para Commit

Seguindo as boas praticas de commits atomicos e descritivos:

### Opcao 1 (Commit unico)
```
feat(product-management): add default colors sync command

Create SyncDefaultColorsCommand to synchronize default colors
from config (Colors.php) to the database cores table.

- Add product:sync-default-colors artisan command
- Register command in ProductManagementServiceProvider
- Include command in scripts/sync.sh
- Follow existing category sync pattern
```

### Opcao 2 (Commits separados)

**Commit 1:**
```
feat(product-management): create SyncDefaultColorsCommand

Add artisan command product:sync-default-colors that reads
app/Modules/ProductManagement/Infrastructure/Config/Colors.php
and synchronizes entries with the cores database table using
firstOrCreate + update pattern.
```

**Commit 2:**
```
chore(product-management): register sync command in ServiceProvider

Register SyncDefaultColorsCommand in ProductManagementServiceProvider
boot() method under runningInConsole() guard.
```

**Commit 3:**
```
chore(scripts): add colors sync to sync.sh

Include php artisan product:sync-default-colors in the sync
script alongside roles/permissions and categories sync.
```
