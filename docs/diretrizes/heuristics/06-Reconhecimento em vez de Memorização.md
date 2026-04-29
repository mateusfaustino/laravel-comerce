Esta documentação estabelece diretrizes para a aplicação da Heurística de Nielsen nº 6: Reconhecimento em vez de Memorização no desenvolvimento de um sistema utilizando Laravel 12, Inertia.js, React e TypeScript. O objetivo central é minimizar a carga cognitiva do usuário, garantindo que elementos, ações e opções estejam visíveis e acessíveis sem a necessidade de recuperação de informações da memória de curto prazo
.

--------------------------------------------------------------------------------
📘 Diretrizes de Desenvolvimento: Heurística #6
1. Visibilidade e Acessibilidade de Opções
A interface deve atuar como um auxílio à memória, exibindo o que é possível fazer em vez de exigir que o usuário decore comandos
.
Implementação em React: Utilize componentes de menu (dropdowns, sidebars) em vez de interfaces baseadas estritamente em comandos de texto
.
Diretriz para IA: Ao gerar componentes de navegação, certifique-se de que todas as funções principais do sistema estejam representadas visualmente através de ícones claros acompanhados de rótulos textuais, o que fornece pistas extras para o cérebro
.
2. Redução da Carga de Memória em Formulários
O usuário não deve ser interrompido ou forçado a lembrar o que estava preenchendo se houver uma distração
.
Labels Persistentes: Nunca substitua rótulos (labels) apenas por placeholders. Os rótulos devem permanecer visíveis durante e após o preenchimento do campo
.
Mensagens Contextuais: Utilize mensagens de ajuda personalizadas e sugestões de formato (ex: máscaras de telefone) diretamente no campo, em vez de tutoriais externos
.
Diretriz para IA: Ao criar formulários com React e TypeScript, utilize estados que validem e forneçam feedback imediato, mantendo o contexto do campo sempre visível
.
3. Facilitação através de Sugestões e Histórico
Transforme tarefas de "recuperação" (lembrar do zero) em tarefas de "reconhecimento" (escolher entre opções)
.
Autocomplete e Pesquisa: Implemente funcionalidades de autocompletar em campos de busca para que o sistema sugira termos baseados em entradas parciais
.
Itens Recentes: Exiba históricos de páginas visitadas recentemente ou pesquisas anteriores para facilitar a retomada de tarefas incompletas
.
Diretriz para IA: No backend Laravel, crie endpoints que retornem os "últimos itens acessados" ou "pesquisas frequentes" e os exiba na interface React através do Inertia
.
4. Continuidade de Informação entre Telas
O design deve garantir que informações cruciais não precisem ser lembradas de uma parte da interface para outra
.
Migalhas de Pão (Breadcrumbs): Utilize caminhos de navegação (breadcrumbs) para que o usuário reconheça sua localização atual no sistema sem precisar memorizar o caminho percorrido
.
Persistência de Dados: Ao transicionar entre páginas via Inertia, mantenha visíveis dados de referência que o usuário possa precisar para a ação atual (ex: exibir o resumo de um pedido durante a fase de pagamento)
.
5. Auxílio no Contexto (In-Context Help)
Ofereça ajuda exatamente onde e quando ela for necessária
.
Tooltips e Dicas: Em vez de manuais extensos, use pequenas dicas contextuais que apareçam ao interagir com elementos complexos
.
Diretriz para IA: Implemente componentes de ajuda flutuantes ou modais de informação que carreguem conteúdo específico sobre a funcionalidade da tela atual
.

--------------------------------------------------------------------------------
📝 Checklist para a Inteligência Artificial
Ao gerar código ou designs, a IA deve validar se:
[ ] O usuário consegue identificar as ações disponíveis apenas olhando para a tela, sem precisar de instruções externas?
[ ] As informações necessárias para usar o sistema (como rótulos de campos e itens de menu) estão visíveis ou são facilmente recuperáveis?
[ ] O sistema fornece pistas visuais (ícones, cores, textos) que ajudem o usuário a associar funções a objetivos?
[ ] Foram evitados códigos ou termos técnicos que o usuário precise decorar para operar o sistema?
[ ] Existe um histórico ou exibição de arquivos/itens recentes para acelerar a produtividade?
Nota: Esta documentação baseia-se nos princípios estabelecidos por Jakob Nielsen, onde o reconhecimento é superior à recordação por fornecer mais pistas contextuais que facilitam a recuperação de informações da memória humana