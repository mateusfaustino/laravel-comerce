🏗️ Guia de Arquitetura: Monolito Modular + DDD no Laravel 12
Este documento descreve como estruturar um sistema Laravel 12 utilizando Domain-Driven Design (DDD) dentro de uma arquitetura de Monolito Modular, utilizando Inertia.js e React no frontend.
O objetivo desta arquitetura é:
Organizar o sistema de acordo com regras de negócio reais
Manter o código desacoplado e fácil de evoluir
Permitir crescimento do sistema sem perda de organização
Facilitar manutenção e testes
Possibilitar, no futuro, a extração de módulos para microserviços, se necessário
Apesar de ser um monolito, o sistema deve ser estruturado como um conjunto de módulos independentes, cada um responsável por um contexto de negócio específico.
--------------------------------------------------------------------------------
1. Conceitos Fundamentais da Arquitetura
1.1 Monolito Modular
Um Monolito Modular é uma aplicação que roda como um único sistema, mas internamente é dividida em módulos independentes.
Cada módulo representa uma capacidade de negócio, por exemplo:
Usuários
Pedidos
Faturamento
Produtos
Estoque
Cada módulo deve:
Ter responsabilidades claras
Possuir sua própria lógica de negócio
Ser o mais independente possível dos outros módulos
Isso reduz acoplamento e facilita a evolução do sistema.
Mesmo sendo um único projeto Laravel, a organização deve simular pequenos sistemas dentro do sistema.
--------------------------------------------------------------------------------
1.2 Domain-Driven Design (DDD)
O DDD (Domain-Driven Design) é uma abordagem de arquitetura que organiza o software em torno do domínio de negócio.
Ou seja, o código deve refletir como o negócio realmente funciona.
Alguns princípios importantes:
Linguagem Onipresente (Ubiquitous Language)
Os nomes usados no código devem refletir a linguagem utilizada pelos especialistas do negócio.
Exemplo:
Se no negócio existe o conceito de Pedido, então o código deve usar:
Order
PlaceOrder
CancelOrder
OrderItem
Evite nomes genéricos como:
ProcessData
HandleThing
ManagerService
--------------------------------------------------------------------------------
Contextos Delimitados (Bounded Contexts)
Cada módulo do sistema representa um contexto delimitado.
Isso significa que:
Cada módulo possui suas próprias regras
Cada módulo possui seu próprio modelo de dados
Cada módulo controla seu próprio domínio
Exemplo:
O conceito de User no módulo de autenticação pode ser diferente do conceito de Customer no módulo de pedidos.
--------------------------------------------------------------------------------
Isolamento da Lógica de Negócio
A lógica de negócio não deve depender diretamente de frameworks, banco de dados ou interface.
Ou seja:
❌ Errado:
Controller -> regra de negócio
✅ Correto:
Controller -> Application Service -> Domain
O domínio deve conter apenas regras de negócio puras.
--------------------------------------------------------------------------------
2. Estrutura de Pastas
Os módulos devem ficar dentro de:
app/Modules
Cada módulo representa um Bounded Context.
Estrutura base:
app/
├── Modules/
│   └── NomeDoModulo/
│       ├── Docs/
│       ├── Domain/
│       ├── Application/
│       ├── Infrastructure/
│       └── Presentation/
│
├── Shared/
└── Infrastructure/
--------------------------------------------------------------------------------
3. Estrutura Interna de um Módulo
Exemplo de módulo:
Billing
Inventory
Orders
Users
Estrutura completa:
app/
├── Modules/
│   └── Orders/
│       ├── Docs/
│       ├── Domain/
│       │   ├── Entities/
│       │   ├── ValueObjects/
│       │   ├── Services/
│       │   ├── Events/
│       │   └── Repositories/
│       │
│       ├── Application/
│       │   ├── DTOs/
│       │   └── Services/
│       │
│       ├── Infrastructure/
│       │   ├── Persistence/
│       │   └── External/
│       │
│       └── Presentation/
│           ├── Http/
│           │   ├── Controllers/
│           │   ├── Requests/
│           │   └── routes.php
│           │
│           └── Resources/
--------------------------------------------------------------------------------
4. Camadas da Arquitetura
4.1 Camada de Domínio (Domain)
A camada de domínio é o coração do sistema.
Ela contém as regras de negócio puras, sem dependência de:
Laravel
Banco de dados
APIs externas
Interface de usuário
Componentes principais:
Entidades (Entities)
São objetos que possuem identidade própria.
Exemplo:
User
Order
Product
Invoice
Uma entidade continua sendo a mesma mesmo que seus dados mudem.
Exemplo:
Order #123
Mesmo que o status mude de pending para paid, continua sendo o mesmo pedido.
--------------------------------------------------------------------------------
Objetos de Valor (Value Objects)
Objetos que não possuem identidade, apenas valor.
Eles devem ser imutáveis.
Exemplos:
Money
Email
Address
CPF
Eles também devem conter validações internas.
--------------------------------------------------------------------------------
Agregados (Aggregates)
Um Agregado é um conjunto de entidades tratadas como uma unidade.
Todo agregado possui uma Raiz de Agregado (Aggregate Root).
Exemplo:
Order
 ├─ OrderItem
 └─ Payment
A entidade Order é a raiz.
Somente ela pode ser acessada externamente.
--------------------------------------------------------------------------------
Repositórios
Repositórios encapsulam a persistência de dados.
No DDD:
O Domínio define apenas a interface
A Infraestrutura implementa
Exemplo:
No domínio:
OrderRepositoryInterface
Na infraestrutura:
EloquentOrderRepository
--------------------------------------------------------------------------------
Eventos de Domínio
Eventos registram algo importante que aconteceu no negócio.
Exemplos:
OrderPlaced
UserRegistered
PaymentApproved
Eventos permitem que outros módulos reajam a mudanças sem acoplamento direto.
--------------------------------------------------------------------------------
5. Camada de Aplicação (Application)
A camada de aplicação contém casos de uso do sistema.
Ela orquestra as regras de negócio, utilizando o domínio.
Exemplo de caso de uso:
CreateOrder
CancelOrder
RegisterUser
ApprovePayment
Ela não contém lógica complexa de negócio.
Seu papel é:
receber dados
chamar entidades
chamar repositórios
coordenar o fluxo
--------------------------------------------------------------------------------
DTOs (Data Transfer Objects)
DTOs são objetos usados para transportar dados entre camadas.
Eles ajudam a evitar o uso direto de entidades em controllers ou APIs.
--------------------------------------------------------------------------------
6. Camada de Infraestrutura
A infraestrutura contém detalhes técnicos.
Exemplos:
Eloquent
Integrações externas
APIs
Mensageria
Cache
Estrutura típica:
Infrastructure/
 ├── Persistence
 └── External
Persistence:
Implementação dos repositórios
External:
APIs externas
gateways
serviços externos
--------------------------------------------------------------------------------
7. Camada de Apresentação
A camada de apresentação conecta o sistema com o mundo externo.
Ela utiliza Laravel + Inertia + React.
Estrutura:
Presentation/
 ├── Http/
 │   ├── Controllers
 │   ├── Requests
 │   └── routes.php
 └── Resources
--------------------------------------------------------------------------------
Controllers
Controllers devem ser finos (Thin Controllers).
Eles devem:
Validar a requisição
Chamar um serviço da camada de aplicação
Retornar resposta
Eles não devem conter lógica de negócio.
--------------------------------------------------------------------------------
Form Requests
Responsáveis por validar dados de entrada.
--------------------------------------------------------------------------------
API Resources
Responsáveis por transformar dados para resposta da API.
Isso evita expor entidades diretamente.
--------------------------------------------------------------------------------
8. Comunicação Entre Módulos
Para manter o baixo acoplamento, siga estas regras.
--------------------------------------------------------------------------------
8.1 Comunicação via Interfaces
Se o módulo A precisa acessar algo do módulo B, ele deve utilizar uma interface pública do módulo B.
Nunca acessar diretamente:
classes internas
modelos Eloquent
tabelas do banco
--------------------------------------------------------------------------------
8.2 Comunicação via Eventos
Eventos permitem comunicação desacoplada entre módulos.
Exemplo:
OrderPlaced
Módulos que podem reagir:
faturamento
estoque
notificações
--------------------------------------------------------------------------------
8.3 Isolamento de Dados
Um módulo nunca deve acessar diretamente as tabelas de outro módulo.
Sempre usar:
serviços
interfaces
eventos
--------------------------------------------------------------------------------
9. Integração com Laravel + Inertia + React
Fluxo típico:
React Page
   ↓
Controller
   ↓
Application Service
   ↓
Domain
   ↓
Repository
   ↓
Database
Os componentes React devem ser apenas de apresentação.
Eles recebem dados já preparados via:
DTOs
API Resources
--------------------------------------------------------------------------------
10. Boas Práticas Técnicas
Imutabilidade
Objetos de valor devem ser imutáveis.
--------------------------------------------------------------------------------
Injeção de Dependência
Use o Service Container do Laravel para mapear interfaces para implementações.
Exemplo no AppServiceProvider:
$this->app->bind(
    OrderRepositoryInterface::class,
    EloquentOrderRepository::class
);
--------------------------------------------------------------------------------
Testes
Cada módulo deve possuir seus próprios testes:
testes unitários
testes de integração
O ideal é validar processos completos do domínio.
--------------------------------------------------------------------------------
Linguagem Publicada
Para integrações complexas entre módulos, documente contratos claros de dados.
--------------------------------------------------------------------------------
11. Benefícios desta Arquitetura
Essa abordagem oferece:
Organização baseada no negócio
Baixo acoplamento
Alta manutenibilidade
Código mais testável
Facilidade para escalar o sistema
Possibilidade futura de migração para microserviços
Ela mantém a simplicidade operacional de um monolito, mas com a disciplina arquitetural de sistemas distribuídos.
--------------------------------------------------------------------------------
✅ Resultado: um sistema Laravel escalável, organizado e preparado para crescer.
--------------------------------------------------------------------------------