📄 Documento de Requisitos – E-commerce de Moda Íntima
1. Introdução
1.1 Objetivo
Este documento descreve os requisitos funcionais e não funcionais do sistema de E-commerce de Moda Íntima, cujo objetivo é permitir a venda de produtos através de catálogo online, carrinho de compras e fluxo de finalização de pedido com redirecionamento para WhatsApp, onde a operadora (admin) conclui a venda manualmente.
1.2 Escopo do Sistema
O sistema permitirá:
Clientes navegarem, selecionarem produtos e criarem pedidos.


Administração completa de produtos, categorias, variações, estoque, pedidos e clientes.


Comunicação entre cliente e admin via mensagens associadas ao pedido.


Gerenciamento manual do status de pagamento e entrega (sem gateway de pagamento).


Não está no escopo:
Integração com gateways de pagamento.


Automação de envio/logística.


Emissão de notas fiscais.


1.3 Stakeholders
Cliente final (comprador)


Administrador / Operadora de vendas


Time de desenvolvimento (Mateus)


Dono do negócio (Fabiana)



2. Visão Geral do Sistema
2.1 Atores
Cliente: Usuário que navega, compra e acompanha pedidos.


Administrador (Admin): Usuário que gerencia catálogo, pedidos, clientes e atendimento.


2.2 Principais Módulos
Catálogo de produtos


Carrinho e pedido


Checkout com redirecionamento para WhatsApp


Gestão administrativa (produtos, categorias, pedidos, clientes)


Atendimento por mensagens


Gestão de estoque e variações


2.3 Diagrama de classes


3. Requisitos Funcionais
3.1 Requisitos do Cliente
 RF-C01 – O cliente deve poder navegar pelo catálogo de produtos.
 RF-C02 – O cliente deve poder pesquisar produtos por nome.
 RF-C03 – O cliente deve poder filtrar produtos por categoria.
 RF-C04 – O cliente deve poder visualizar detalhes do produto (descrição, preço, fotos, variações).
 RF-C05 – O cliente deve poder selecionar variação do produto (tamanho/cor).
 RF-C06 – O cliente deve poder adicionar produtos ao carrinho.
 RF-C07 – O cliente deve poder visualizar o carrinho.
 RF-C08 – O cliente deve poder alterar quantidades e remover itens do carrinho.
 RF-C09 – O cliente deve poder informar ou selecionar um endereço de entrega.
 RF-C10 – O cliente deve poder revisar o pedido antes de finalizar.
 RF-C11 – O cliente deve poder finalizar o pedido, gerando um Pedido no sistema.
 RF-C12 – Após finalizar o pedido, o cliente deve ser redirecionado para o WhatsApp.
 RF-C13 – O cliente deve poder se cadastrar e se autenticar no sistema.
 RF-C14 – O cliente deve poder gerenciar seus dados de perfil.
 RF-C15 – O cliente deve poder gerenciar seus endereços de entrega.
 RF-C16 – O cliente deve poder acompanhar seus pedidos e seus status (pagamento e entrega).
 RF-C17 – O cliente deve poder visualizar os detalhes de um pedido.
 RF-C18 – O cliente deve poder enviar mensagens relacionadas a um pedido.
 RF-C19 – O cliente deve poder visualizar mensagens relacionadas a um pedido.

3.2 Requisitos do Administrador (Admin)
3.2.1 Gestão de Produtos
RF-A01 – O admin deve poder cadastrar produtos.
 RF-A02 – O admin deve poder editar produtos.
 RF-A03 – O admin deve poder ativar/inativar produtos.
 RF-A04 – O admin deve poder gerenciar fotos dos produtos.
 RF-A05 – O admin deve poder gerenciar variações de produtos (tamanho/cor).
 RF-A06 – O admin deve poder gerenciar o estoque por variação.
 RF-A07 – O admin deve poder definir preços (venda, promocional e custo).
3.2.2 Gestão de Categorias
RF-A08 – O admin deve poder cadastrar categorias.
 RF-A09 – O admin deve poder editar categorias.
 RF-A10 – O admin deve poder organizar categorias em hierarquia (pai/filhas).
 RF-A11 – O admin deve poder vincular e desvincular produtos a categorias.
3.2.3 Gestão de Cores
RF-A12 – O admin deve poder cadastrar cores.
RF-A13 – O admin deve poder editar cores.
RF-A14 – O admin deve poder vincular cores às variações de produto.
3.2.4 Gestão de Pedidos
RF-A15 – O admin deve poder listar pedidos.
RF-A16 – O admin deve poder visualizar detalhes de um pedido.
RF-A17 – O admin deve poder atualizar o status de pagamento do pedido.
RF-A18 – O admin deve poder atualizar o status de entrega do pedido.
RF-A19 – O admin deve poder registrar descontos no pedido.
 RF-A20 – O admin deve poder registrar descontos em itens do pedido.
 RF-A21 – O admin deve poder confirmar a compra após atendimento via WhatsApp.
3.2.5 Gestão de Clientes
RF-A22 – O admin deve poder listar clientes.
 RF-A23 – O admin deve poder visualizar os dados de um cliente.
 RF-A24 – O admin deve poder visualizar e gerenciar os endereços do cliente.
3.2.6 Atendimento por Mensagens
RF-A25 – O admin deve poder visualizar mensagens associadas a um pedido.
RF-A26 – O admin deve poder responder mensagens em um pedido.
RF-A27 – O admin deve poder marcar mensagens como lidas ou não lidas.
RF-A28 – O admin deve poder excluir mensagens (moderação).

4. Requisitos Não Funcionais
RNF-01 – O sistema deve ter autenticação e controle de acesso por perfil (Cliente/Admin).
RNF-02 – O sistema deve garantir integridade dos dados de pedidos, itens e estoque.
RNF-03 – O sistema deve registrar status de pagamento e entrega conforme os enums definidos no modelo.
RNF-04 – O sistema deve ser responsivo para uso em dispositivos móveis.
RNF-05 – O sistema deve possuir interface administrativa separada da interface do cliente.
RNF-06 – O sistema deve permitir rastreabilidade das mensagens por pedido.
RNF-07 – O sistema deve seguir boas práticas de segurança para dados sensíveis (CPF, CNPJ, telefone, e-mail).
 RNF-08 – O sistema deve ser preparado para futura integração com gateway de pagamento.

5. Regras de Negócio
RN-01 – Um Pedido deve conter pelo menos um ItemPedido.
 RN-02 – Um ItemPedido deve sempre estar associado a uma ProdutoVariacao.
 RN-03 – O status inicial de pagamento de um pedido deve ser CARRINHO ou PAGAMENTO_NAO_REALIZADO.
 RN-04 – O status de pagamento e o status de entrega devem ser atualizados apenas pelo Admin.
 RN-05 – Produtos inativos não devem aparecer no catálogo para o cliente.
 RN-06 – O controle de estoque deve respeitar o tipo de estoque (INFINITO ou LIMITADO).
 RN-07 – Mensagens devem estar sempre associadas a um Pedido e a um Usuário (autor).
 RN-08 – A finalização do pedido pelo cliente não confirma pagamento; apenas inicia o processo via WhatsApp.

6. Rastreabilidade com os Diagramas
Os Requisitos Funcionais estão diretamente mapeados aos Casos de Uso do Cliente e do Admin.


As Entidades e Relacionamentos (Pedido, ItemPedido, Produto, ProdutoVariacao, Mensagem, etc.) estão alinhados ao Diagrama de Classes UML.


As Regras de Negócio refletem os enums e associações do modelo (StatusPagamentoPedido, StatusEntregaPedido, EstoqueTipo, etc.).












[RQXX] Automação do E-commerce 
Projeto:
Automação do E-commerce
Objetivo:
Implantar o E-commerce 
Solicitante:
Fabulosa Stores
Analista de Requisitos:
Fabiana Peixoto
Time Desenvolvimento:
Mateus Faustino


HISTÓRICO DE REVISÃO
Data
Versão
Descrição
Solicitante
Responsável
01/03/2026
1.0
Lançamento
Fabiana Peixoto
Fabiana Peixoto

Visão Geral
Este documento detalha os requisitos técnicos e funcionais para o desenvolvimento de um site de comércio eletrônico (e-commerce) voltado para o consumidor final (B2C). O objetivo é criar uma plataforma web responsiva, segura e performática, capaz de gerenciar todo o ciclo de venda online: desde a navegação no catálogo de produtos, passando pela gestão do carrinho de compras, até o checkout integrado com gateways de pagamento e operadoras de logística. A plataforma deve prever a integração com o ERP legado da empresa para sincronização de estoque e envio de pedidos para faturamento.
Escopo de versões

Tipo 
 Detalhamento
Inclusões V1
Front-end: Clientes navegarem, selecionarem produtos e criarem pedidos.


Back-end: (Admin) Painel Administrativo de Gestão.


Módulos Core:
Catálogo Dinâmico de Produtos (cores, tamanhos, fotos) e Categorias.
Carrinho de Compras Persistente.
Gestão Completa de Clientes (Cadastro, Login, Perfil, Endereços).
Checkout Transparente e Seguro. (SSL)


Carrinho de compras e gestão de endereços do cliente.


Comunicação entre cliente e admin via mensagens associadas ao pedido, redirecionamento dinâmico para WhatsApp.


Gerenciamento manual do status de pagamento e entrega (sem gateway de pagamento).


Controle de estoque manual (Limitado/Infinito).


Tipo 
 Detalhamento
Inclusões V2
Integrações Externas:
Gateway de Pagamento (Cartão de Crédito, PIX, Boleto).
Cálculo de Frete e Prazo (Correios/Transportadoras).


Emissão automática de Nota Fiscal (NFe/NFSe).


Rastreamento automático de postagem.


Gestão Operacional: Painel Administrativo para gestão de vendas, clientes e relatórios operacionais.



REQUISITOS
Épico 01: Efetivação da venda V1
Épico
1.0
Acesso ao portal
História de usuário
US 1.1
 
Requisitos
Código
Detalhamento
Catálogo de Produtos
RF 1.1
O sistema deve exibir produtos ativos (RN-05), permitindo busca por nome (RF-C02) e filtro por categoria (RF-C03).
Gestão de Variações (Grade)
RF 1.2
O Admin deve poder gerenciar cores (RF-A12) e tamanhos, vinculando-os às variações do produto (RF-A05). A seleção é obrigatória para o cliente (RF-C05).
Controle de Estoque
RF 1.3
O estoque deve ser controlado por variação (RF-A06). Se o tipo for LIMITADO, o sistema deve decrementar a quantidade na criação do pedido e impedir a venda se qtd < 1.
Finalização e Redirecionamento
RF 1.4
Ao finalizar (RF-C11), o sistema deve gerar um número de pedido único. Em seguida, deve disparar a API do WhatsApp (RF-C12) montando a mensagem com: "Olá, gostaria de concluir o pedido #[NUMERO_PEDIDO]. Cliente: [NOME]".
Gestão Manual de Status
RF 1.5
O Admin deve poder alterar manualmente o Status de Pagamento (Carrinho, Pago, Não Realizado) (RF-A17) e o Status de Entrega (Pendente, Despachado, Entregue, Cancelado) (RF-A18).
Registro de Descontos
RF 1.6
O Admin deve poder aplicar descontos (valor fixo) no total do pedido (RF-A19) ou em itens específicos (RF-A20) durante o atendimento manual.
Mensagens Internas
RF 1.7
Permitir que Cliente (RF-C18) e Admin (RF-A26) troquem mensagens dentro da página do pedido para histórico, independente do WhatsApp.


Épico 02: Financeiro
Épico
3.0
Protheus
História de usuário
US 1.1
 
Requisitos
Código
Detalhamento
Registro automático do boleto
RF 1.1
Se a forma de pagamento for boleto, o Protheus deverá gerar e registrar automaticamente o boleto no Protheus.

O banco para registro de boleto deve seguir os seguintes critérios:







Geração de Fatura de débito
RF 1.2
Atualmente, não há emissão de Nota Fiscal para faturamentos classificados como “Outras Receitas”. Dessa forma, torna-se necessária a geração de Fatura de Débito.

Anexo 1 - Fatura de Débito.

Todas as informações de Fatura de débito devem ser trazidas do pedido de venda.

Campos: 
C5_NOTA = Número da RPS
C5_EMISSAO = Data
C5_FILIAL = Unidade executora
C5_CGCINT= CNPJ
Produto (Campo dinãmico) = Discriminação
XNUMPRO (Campo dinãmico) = Discriminação
X = Valor 
C5_XOBSERV= Observação


Envio de e-mail automático
RF 1.3
O parâmetro que delimita os e-mails que são enviados de forma automática deverá ser alterado para que as vendas que contém XNUMPRO “OR” também sejam enviadas.
Envio automático da Fatura e boleto para o cliente
RF 1.4
Após a emissão da Fatura e, se aplicável, do boleto, ambos devem ser enviados automaticamente ao cliente, por e-mail. 
O e-mail deve ser enviado pelo e-mail de X.


Os campos destacados de vermelho devem ser dinâmicos.

E-mail:
     Prezado(a) cliente,

           Seguem anexos o boleto e a NF referentes ao produto X.

            Informações complementares com relação à fatura, por gentileza, manter contato com a equipe do faturamento.

            Por gentileza, confirmar o recebimento e encaminhar ao responsável financeiro.

            Atenciosamente, 
            Equipe de Faturamento

Obs: Se a forma de pagamento não for boleto, apenas a fatura será enviada.

Obs: Incluir uma trava para que não envie o boleto enquanto a fatura não estiver pronta, ou vice-versa.




ANEXO
Inserir anexos. 
Anexo 1 - Fatura de Débito





