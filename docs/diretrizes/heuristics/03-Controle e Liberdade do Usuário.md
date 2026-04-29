Esta documentação estabelece diretrizes para que a Inteligência Artificial aplique a Heurística de Nielsen nº 3: Controle e Liberdade do Usuário no desenvolvimento do seu sistema com Laravel 12, Inertia e React. O objetivo central é garantir que os usuários sintam que têm o "comando supremo" sobre as interações, permitindo-lhes corrigir erros e navegar sem medo de ficarem presos
.

--------------------------------------------------------------------------------
Diretrizes de Desenvolvimento: Heurística #3
1. Implementação de "Saídas de Emergência" Claras
Todo estado indesejado ou fluxo de tarefa deve oferecer uma forma óbvia de saída sem exigir diálogos extensos
.
Cancelamento de Ações: Forneça links ou botões de "Cancelar" em todos os formulários e processos de várias etapas
. Isso permite que o usuário desista de uma tarefa a qualquer momento
.
Fechamento de Modais e Overlays: Certifique-se de que modais (lighboxes) possuam um ícone "X" visível no canto superior direito
.
Navegação de Retorno: Inclua links de "Voltar" que levem o usuário exatamente ao estado ou página anterior, atendendo às suas expectativas de navegação
.
2. Suporte a Desfazer (Undo) e Refazer (Redo)
A interface deve encorajar a exploração, tornando as consequências dos erros menos graves através da reversão de ações
.
Ações Transientes (Snackbars): Para ações como exclusão ou arquivamento, utilize o padrão de "Snackbar" (comum no Gmail e Google Drive) que confirma a ação e oferece um botão "Desfazer" imediato
.
Histórico de Edição: Em sistemas de entrada de dados complexos, suporte múltiplos níveis de Undo e Redo para permitir que o usuário retorne a estados anteriores do sistema
.
Gestão de Lixeira: Para itens excluídos, considere implementar um mecanismo de "Lixeira" ou "Exclusão Lógica", permitindo a restauração de itens removidos acidentalmente
.
3. Preservação do Controle na Navegação (Inertia/React)
Em aplicações SPA com Inertia, o comportamento do navegador deve ser respeitado para evitar frustração.
Compatibilidade com o Botão "Voltar" do Navegador: Nunca desabilite ou bloqueie o botão de voltar do browser
. O sistema deve ser construído de forma que o uso do botão "Voltar" retorne o usuário ao passo anterior sem perda de dados ou mensagens de erro de timeout
.
Sincronia de Overlays: Ao abrir um overlay em tela cheia, o botão "Voltar" do navegador deve ter o mesmo efeito que o botão "Fechar" (fechar o overlay), em vez de tirar o usuário da página atual inteiramente
.
4. Visibilidade e Descoberta de Controles
As opções de saída e controle devem ser fáceis de encontrar e bem sinalizadas
.
Padrões de Design: Posicione botões de fechar, sair ou cancelar em locais convencionais onde os usuários esperam encontrá-los
.
Rótulos Claros: Use ícones universais acompanhados de rótulos de texto ou substitua ícones ambíguos por texto explícito (ex: use "Cancelar" em vez de apenas um "X" quando a ação puder ser confundida com "Fechar")
.
Botões de Interrupção: Para operações longas (como uploads no Google Drive), forneça um botão de "Interromper" ou "Cancelar" visível junto à barra de progresso
.
5. Prevenção de Estados de "Encurralamento"
Evite Diálogos Excessivos: Não force o usuário a passar por longas sequências de perguntas para sair de uma função escolhida por engano
.
Exploração Livre: Garanta que o usuário possa "vasculhar" a interface e experimentar funcionalidades sem medo de ficar preso em um "canto" do sistema
. Se ele se perder, forneça um caminho fácil e óbvio de volta para a "Home" ou visualização padrão
.

--------------------------------------------------------------------------------
Nota Técnica para a IA: Ao gerar código React, utilize estados que permitam a reversão (como undo hooks) e, no Laravel/Inertia, garanta que as rotas e o gerenciamento de sessão não quebrem a navegação histórica do usuário
. Além disso, considere o uso de Soft Deletes no Eloquent para facilitar a implementação da função "Desfazer" em exclusões.