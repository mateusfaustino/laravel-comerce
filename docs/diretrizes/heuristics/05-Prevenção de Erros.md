Esta documentação estabelece diretrizes para que a Inteligência Artificial, durante o desenvolvimento do sistema em Laravel 12, Inertia e React (TypeScript), implemente a Heurística de Nielsen nº 5: Prevenção de Erros. O objetivo central é que o design impeça a ocorrência de problemas antes mesmo que eles aconteçam, o que é superior a qualquer mensagem de erro bem projetada
.
1. Princípios Fundamentais de Prevenção
A IA deve distinguir e tratar dois tipos de erros
:
Deslizes (Slips): Erros acidentais cometidos por usuários que conhecem a tarefa (ex: digitar algo errado)
.
Enganos (Mistakes): Decisões erradas baseadas em modelos mentais incompletos ou informações insuficientes
.

--------------------------------------------------------------------------------
2. Diretrizes Técnicas para a IA
A. Eliminação de Condições Propensas a Erros
Ao gerar componentes React e rotas Laravel, a IA deve:
Restringir inputs: Use tipos de dados específicos e máscaras (ex: formatar automaticamente números de cartão com espaços para evitar erros de digitação)
.
Oferecer sugestões: Ao criar formulários, forneça guias em tempo real, como requisitos de senha ou validação de ID de usuário enquanto ele digita
.
Valores padrão seguros: Configure formulários com padrões que evitem escolhas desastrosas por descuido.
B. Implementação de "Lombadas" (Fricção Deliberada)
Para ações críticas (exclusões, transferências financeiras), a IA deve inserir fricção para forçar a reflexão do usuário
:
Diálogos de Confirmação: Use modais do Inertia para ações destrutivas, perguntando explicitamente "Você tem certeza?"
.
Confirmação de Identidade: Para deleções permanentes, exija que o usuário digite o nome do recurso (ex: nome do projeto) antes de habilitar o botão de exclusão
.
Verificações de Segurança: Em ações com consequências físicas ou graves (como o exemplo da JBL), utilize avisos visuais grandes e temporizadores que impeçam o clique imediato antes da leitura
.
C. Suporte à Reversibilidade (Desfazer)
Sempre que possível, a IA deve implementar mecanismos de recuperação
:
Botão Undo (Desfazer): Implemente uma janela de tempo (ex: 5-10 segundos) após ações como "enviar" ou "excluir" para que o usuário possa reverter a ação
.
Lixeira (Soft Deletes): No Laravel, utilize SoftDeletes em modelos importantes para permitir a recuperação de dados excluídos acidentalmente
.
D. Visibilidade e Feedback Proativo
Status do Sistema: Certifique-se de que o usuário saiba exatamente onde está e o que está fazendo (ex: barras de progresso em formulários longos) para evitar confusão que leve ao erro
.
Avisos de Contexto: Antes que o usuário execute uma ação que desabilite outras funcionalidades (ex: arquivar um projeto que corta o acesso de clientes), exiba claramente as consequências futuras
.

--------------------------------------------------------------------------------
3. Checklist para Geração de Código pela IA
Validação TypeScript/Laravel: O código gerado inclui validação rigorosa tanto no frontend (tipos e schemas) quanto no backend (Request Validation) para impedir dados inválidos?
.
Tratamento de Ações Destrutivas: Existe um modal de confirmação ou um "speed bump" para ações irreversíveis?
.
Auxílio ao Usuário: O sistema oferece máscaras de input, dicas de preenchimento ou mensagens preventivas (ex: "o código é sensível a maiúsculas")?
.
Recuperação de Erros: Existe uma rota ou funcionalidade para "Desfazer" ou restaurar dados de uma lixeira?
.
Ao seguir estas diretrizes, a IA garantirá que a aplicação não apenas trate erros, mas atue como uma rede de segurança, antecipando falhas humanas e protegendo o fluxo de trabalho do usuário
.