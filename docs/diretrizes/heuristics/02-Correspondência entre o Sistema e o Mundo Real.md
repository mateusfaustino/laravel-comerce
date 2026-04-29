Esta documentação estabelece diretrizes para que a Inteligência Artificial (IA) implemente a Heurística de Nielsen nº 02: Correspondência entre o Sistema e o Mundo Real no desenvolvimento do seu sistema com Laravel 12, Inertia e React. O objetivo central é garantir que a interface fale a linguagem do usuário e siga convenções do mundo físico
.

--------------------------------------------------------------------------------
Diretrizes de Desenvolvimento para a IA
1. Linguagem e Comunicação Familiar
A IA deve priorizar termos, frases e conceitos que sejam familiares ao usuário final, evitando jargões técnicos ou orientados ao sistema
.
Evite Termos de Sistema: Substitua termos de banco de dados ou backend por conceitos de negócio. Por exemplo, em vez de "Processando Query", utilize "Buscando informações"
.
Acrônimos e Abreviações: Nunca utilize siglas sem explicá-las previamente, a menos que sejam de conhecimento universal no nicho do usuário
.
Mensagens de Erro: Devem ser escritas em linguagem clara, explicando o problema e como resolvê-lo, sem exibir códigos internos de erro
.
2. Mapeamento Natural e Convenções Visuais
A interface deve aproveitar o conhecimento prévio que o usuário possui de objetos e atividades do mundo físico (modelos mentais)
.
Ícones Representativos: Utilize ícones que remetam a objetos reais para suas respectivas funções:
Lixeira: Para apagar ou excluir itens
.
Casa: Para retornar à página inicial
.
Lupa: Para buscas
.
Envelope: Para mensagens ou e-mail
.
Mapeamento de Controles: Posicione controles de forma lógica. Por exemplo, botões de aumentar volume devem ficar acima dos de diminuir, seguindo a metáfora visual de "mais é para cima"
.
Componentes de Interface (UI): Utilize componentes que imitem o comportamento físico, como o botão de alternância (toggle), que deve funcionar e parecer visualmente com um interruptor de luz real
.
3. Ordem Lógica e Fluxo Natural
As informações e processos devem aparecer em uma sequência que faça sentido para o usuário, respeitando o fluxo natural de uma tarefa no mundo real
.
Sequenciamento de Dados: Em formulários, organize os campos de forma lógica (ex: Nome > E-mail > Endereço), evitando notificações ou pedidos de dados fora de contexto
.
Metáforas de Interação: Implemente interações que simulem ações físicas, como o gesto de "folhear" páginas em leitores digitais ou o ato de "destacar" texto como se usasse um marcador físico
.
4. Feedback Visual com Significado Cultural
Aproveite convenções culturais estabelecidas para comunicar estados do sistema
.
Cores e Significados:
Vermelho: Utilize para alertas, erros ou ações que exigem atenção imediata (parar/perigo)
.
Verde: Utilize para sucesso, confirmação ou prosseguimento (ir/bom)
.
