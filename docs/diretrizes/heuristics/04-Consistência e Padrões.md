Esta documentação fornece diretrizes específicas para que o desenvolvimento assistido por IA do sistema em Laravel 12, Inertia e React com TypeScript siga rigorosamente a Heurística de Nielsen nº 4: Consistência e Padrões. O objetivo é garantir que a interface seja previsível, reduza a carga cognitiva e aproveite o conhecimento prévio do usuário
.
1. Princípios Fundamentais (Lei de Jakob)
A IA deve operar sob a premissa de que os usuários passam a maior parte do tempo em outros sites
. Portanto:
Não "reinvente a roda": Evite termos ou interações excessivamente criativas que desviem das convenções consagradas do setor
.
Previsibilidade: O sistema deve comportar-se de forma que o usuário não precise se perguntar se palavras ou ações diferentes significam a mesma coisa
.
2. Diretrizes de Consistência Externa (Padrões de Mercado)
A IA deve aplicar padrões amplamente aceitos na web e em aplicações SaaS para facilitar o aprendizado
:
Posicionamento de Elementos Chave:
Logotipo: Sempre no canto superior esquerdo, funcionando como link para a página inicial
.
Utilidades (Busca/Perfil/Carrinho): Localizados no canto superior direito
.
Navegação Principal: Em menus no topo ou lateral esquerda
.
Iconografia Padrão:
Use a lupa para busca, o carrinho para compras e o ícone de hambúrguer (três linhas) para menus em telas menores
.
Evite ícones ambíguos ou personalizados que exijam "decodificação" pelo usuário
.
Entrada de Dados:
Utilize seletores de data (date pickers) e campos com máscaras (telefone, CPF) que sigam os padrões de UI do setor
.
3. Diretrizes de Consistência Interna (Dentro do Sistema)
A IA deve manter a uniformidade em todas as páginas e componentes React desenvolvidos para a aplicação
:
Linguagem e Terminologia:
Use os mesmos nomes para as mesmas ações em todo o sistema (ex: se usar "Salvar" em um formulário, não use "Gravar" ou "Atualizar" em outro para a mesma função)
.
Tratamento Visual e Design System:
Cores de Ação: Defina e utilize consistentemente cores para botões primários (ex: um tom específico de azul/verde para CTAs) e não as use para elementos estáticos
.
Tipografia e Estilos: Mantenha tamanhos de fonte, pesos e tratamentos de bordas idênticos para elementos da mesma hierarquia (títulos, links, botões)
.
Layout de Componentes:
Modais e Diálogos: A disposição dos botões deve ser fixa (ex: "Cancelar" sempre à esquerda e "Confirmar" à direita, ou vice-versa, mas nunca alternando)
.
Formulários: O alinhamento de rótulos (labels) e a indicação de campos obrigatórios devem seguir um único padrão em todo o Laravel Inertia app
.
4. Instruções Técnicas para a IA (TypeScript e React)
Para garantir a aplicação programática dessas diretrizes:
Componentização: Crie componentes reutilizáveis (botões, inputs, cards) para garantir que a implementação de UI seja idêntica em todas as rotas da aplicação
.
TypeScript Types: Utilize Enums ou Union Types para definir variantes de estilo (ex: variant: 'primary' | 'secondary'), impedindo a criação de estilos fora do padrão definido.
Design Review: A IA deve realizar uma "revisão de consistência" a cada novo componente ou página gerada, comparando-a com os padrões já estabelecidos no projeto
.
Tom de Voz: O conteúdo gerado (mensagens de erro, labels) deve manter um tom uniforme (ex: profissional e direto, evitando alternar entre casual e robótico)
.
Nota importante: Embora a consistência seja prioridade, ela deve ser equilibrada com outras heurísticas; não padronize ao ponto de prejudicar o reconhecimento visual rápido de funções distintas
.