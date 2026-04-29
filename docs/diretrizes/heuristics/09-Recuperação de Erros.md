Diretrizes de Desenvolvimento: Heurística #9 (Recuperação de Erros)
Esta documentação visa instruir a IA a criar interfaces que ajudem os usuários a reconhecer, diagnosticar e recuperar-se de erros de maneira eficiente
.
1. Reconhecimento do Erro (Visibilidade e Estética)
A IA deve garantir que o usuário perceba instantaneamente que algo deu errado, sem ambiguidades
.
Destaque Visual: Utilize cores convencionais de erro (como vermelho) e fontes em negrito para mensagens de erro
.
Acessibilidade: Não dependa apenas da cor. A IA deve incluir ícones de suporte (como um "X" ou um sinal de exclamação) para auxiliar usuários daltônicos a identificar a falha
.
Contextualização: No React, os erros de validação de formulários devem aparecer imediatamente abaixo ou ao lado do campo correspondente, e não apenas no topo da página, para facilitar a associação
.
2. Diagnóstico do Erro (Linguagem e Clareza)
O sistema deve explicar o problema em termos humanos, não técnicos
.
Linguagem Simples: Proibir o uso de códigos de erro internos (ex: "Error 500"), jargões de programação ou mensagens brutas do banco de dados
.
Precisão: A IA deve gerar mensagens que indiquem exatamente o que deu errado. Em vez de "Entrada inválida", use "O formato do e-mail não é reconhecido"
.
Tom Construtivo: A linguagem deve ser gentil e não condenar o usuário pelo erro cometido
.
3. Recuperação do Erro (Ação e Solução)
A interface deve fornecer uma "saída de emergência" ou um caminho claro para corrigir a situação
.
Sugestão de Solução: Sempre que possível, a mensagem de erro deve ser acompanhada de uma instrução detalhada sobre como corrigir o problema
.
Atalhos de Recuperação: Inclua botões de "Desfazer" (Undo) ou "Voltar" dentro do contexto do erro
.
Exemplos Práticos:
Páginas 404: Não exiba apenas "Página não encontrada". A IA deve sugerir links úteis para o usuário navegar para outras partes do sistema
.
Pesquisas: Se uma busca não retornar resultados, sugira termos alternativos ou correções ortográficas (ex: "Você quis dizer...?")
.

--------------------------------------------------------------------------------
Especificações Técnicas para o Stack (Laravel/Inertia/React)
Para que a IA aplique isso no seu código, instrua-a com os seguintes comandos:
Validação via Laravel: "Sempre utilize as Form Requests do Laravel para validar dados. As mensagens de erro no arquivo lang devem seguir as diretrizes de 'Linguagem Simples' (sem jargões)."
Feedback no React: "Utilize o hook useForm do Inertia.js para capturar o objeto errors. Renderize as mensagens de erro dinamicamente nos componentes de input assim que o estado de erro for detectado."
Alertas Globais: "Para erros de sistema ou de conexão, implemente um componente de 'Toast' ou 'Banner' altamente visível que inclua um botão de 'Tentar Novamente' (Retry)
."
Prevenção Adicional: "Embora o foco seja a recuperação, aplique também a Heurística #5 (Prevenção), solicitando confirmação antes de ações irreversíveis (como deletar dados), para evitar que o erro sequer ocorra
."