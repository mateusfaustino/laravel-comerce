Esta documentação estabelece diretrizes para a implementação da Heurística de Nielsen nº 1: Visibilidade do Status do Sistema em um ambiente de desenvolvimento utilizando Laravel 12, Inertia.js e React. O objetivo é garantir que o sistema mantenha o usuário informado sobre o que está acontecendo por meio de feedback apropriado e em tempo razoável
.

--------------------------------------------------------------------------------
Diretrizes de Desenvolvimento: Visibilidade do Status do Sistema
1. Indicações de Localização (Onde estou?)
O sistema deve responder claramente à pergunta "onde estou?" para evitar que o usuário se sinta perdido
.
Menus de Navegação: Destaque visualmente a opção de menu ativa ou a seção atual do site utilizando cores ou marcações distintas
.
Breadcrumbs e Títulos: Utilize indicadores que mostrem o caminho percorrido ou a tela específica em que o usuário se encontra
.
Implementação técnica: No React, utilize o estado das rotas do Inertia para aplicar classes de "active" em links e componentes de navegação.
2. Feedback de Interação Imediata
Toda ação do usuário deve gerar um reconhecimento imediato pelo sistema para confirmar que a interação foi registrada
.
Estados de Botões: Ao clicar em um botão, mude sua cor, exiba um ícone de "check" ou altere seu estado visual para evitar cliques duplos e reduzir incertezas
.
Manipulação Direta: Se o usuário arrastar um item ou alterar uma ordem (ex: listas), o sistema deve refletir essa mudança instantaneamente
.
Confirmação de Sucesso: Forneça mensagens claras quando itens forem adicionados ao carrinho, formulários forem enviados ou configurações forem alteradas
.
3. Indicadores de Progresso e Carregamento
Para operações que não são instantâneas, o sistema deve comunicar que está trabalhando na solicitação
.
Operações curtas (< 10 segundos): Utilize indicadores de carregamento infinitos, como spinners ou ícones animados
.
Operações longas (> 10 segundos): Utilize barras de progresso que mostrem o avanço da tarefa ou o tempo estimado restante
.
Skeleton Screens: Durante o carregamento inicial de páginas ou componentes de dados, utilize "telas esqueleto" para mitigar a percepção de espera e mostrar onde o conteúdo aparecerá
.
Inertia Progress: Certifique-se de que a barra de progresso padrão do Inertia.js esteja habilitada para todas as trocas de página.
4. Notificações e Mudanças de Estado
Mantenha o usuário informado sobre eventos importantes ou alterações automáticas no sistema
.
Validação de Formulários: Utilize validação inline para informar erros em tempo real enquanto o usuário preenche os campos, facilitando a correção imediata
.
Alertas de Inventário/Estado: Se um item não estiver mais disponível ou o status de um pedido mudar, comunique isso explicitamente (ex: "apenas 2 itens restam" ou "fora de estoque") em vez de simplesmente remover a informação
.
Comunicação de Erros: Se uma ação falhar, explique o motivo em termos simples e compreensíveis, permitindo que o usuário decida o próximo passo
.
5. Filtragem de Informações Relevantes
Embora a visibilidade seja crucial, não sobrecarregue o usuário com informações técnicas desnecessárias
.
Foco no Usuário: Comunique apenas o que é útil para a tomada de decisão ou que forneça segurança
.
Backstage vs. Frontstage: Detalhes técnicos internos (como carregamento de arquivos JavaScript específicos ou logs de servidor) não devem ser exibidos ao usuário final, a menos que afetem diretamente sua ação
.

--------------------------------------------------------------------------------
Princípio Fundamental para a IA:
Ao gerar código ou componentes, a IA deve priorizar a previsibilidade e o controle
. O sistema deve agir como um diálogo aberto: cada ação do usuário exige uma resposta do sistema para construir confiança na marca e na interface
. Nunca deixe o usuário "vendado" sobre o resultado de suas escolhas
.