
# Arquitetura Laravel 12 (Monolito Modular + DDD)

## 🎯 OBJETIVO DO SISTEMA

Construir um sistema utilizando:

* Laravel 12 (backend)
* Inertia.js
* React + TypeScript (frontend)

Seguindo:

* Monolito Modular
* Domain-Driven Design (DDD)

---

## 🧱 ARQUITETURA GERAL

### Regra principal

O sistema DEVE ser organizado em **módulos independentes por domínio de negócio**.

Cada módulo representa um **Bounded Context**.

---

## 📦 ESTRUTURA DE MÓDULOS

### Exemplo de módulos

* Users
* Orders
* Products
* Inventory
* Billing

---

## 📁 ESTRUTURA DE PASTAS (OBRIGATÓRIA)

```
app/
 └── Modules/
      └── {ModuleName}/
           ├── Domain/
           ├── Application/
           ├── Infrastructure/
           ├── Interfaces/
```

---

## 🧠 REGRAS DE DDD

### 1. Domain (regra mais importante)

Contém:

* Entities
* Value Objects
* Domain Services
* Domain Events
* Regras de negócio

❗ REGRAS:

* NÃO pode depender de Laravel
* NÃO pode acessar banco diretamente
* NÃO pode usar Eloquent

---

### 2. Application

Contém:

* Use Cases (Actions)
* DTOs

Responsável por:

* Orquestrar o fluxo da aplicação
* Chamar Domain

❗ REGRAS:

* NÃO contém regra de negócio complexa
* NÃO acessa banco diretamente

---

### 3. Infrastructure

Contém:

* Repositories (implementação)
* Eloquent Models
* Integrações externas

❗ REGRAS:

* Pode usar Laravel
* Implementa interfaces definidas no Domain

---

### 4. Interfaces

Contém:

* Controllers
* Requests
* API Resources

❗ REGRAS:

* Apenas entrada/saída (HTTP)
* NÃO contém regra de negócio

---

## 🔗 COMUNICAÇÃO ENTRE CAMADAS

Fluxo obrigatório:

```
Controller → UseCase → Domain → Repository
```

🚫 PROIBIDO:

* Controller acessar Model direto
* Controller acessar Repository direto
* UseCase acessar Eloquent direto

---

## 🧾 NOMENCLATURA (OBRIGATÓRIA)

### Entities

* Order
* User
* Product

### Use Cases

* CreateOrder
* CancelOrder
* UpdateUser

### Repositories

* OrderRepository (interface no Domain)
* EloquentOrderRepository (implementação no Infrastructure)

---

## 🗣️ LINGUAGEM ONIPRESENTE

Usar nomes do domínio real.

✔️ Correto:

* Order
* OrderItem
* Checkout

❌ Errado:

* DataHandler
* ProcessManager
* GenericService

---

## ⚙️ REGRAS DE DEPENDÊNCIA

```
Interfaces → Application → Domain
Infrastructure → Domain
```

Domain NÃO depende de nada.

---

## 🧩 EXEMPLO DE FLUXO

### Criar pedido

1. Controller recebe request
2. Valida dados
3. Chama UseCase (CreateOrder)
4. UseCase:

   * cria entidade Order
   * aplica regras
   * chama repository
5. Repository salva no banco

---

## 🚫 PROIBIÇÕES

* ❌ Lógica de negócio em Controller
* ❌ Lógica de negócio em Model Eloquent
* ❌ Acesso direto ao banco fora do Repository
* ❌ Módulos acessando internamente outros módulos sem interface
* ❌ Classes genéricas (Helper, Utils sem contexto)

---

## ✅ BOAS PRÁTICAS

* Cada módulo deve ser independente
* Usar DTOs para comunicação
* Usar interfaces no Domain
* Usar injeção de dependência
* Criar testes por módulo

---

## 🔮 ESCALABILIDADE

A arquitetura DEVE permitir:

* Extração de módulos para microserviços no futuro
* Substituição de infraestrutura sem afetar o domínio
* Crescimento sem acoplamento

---

## 🎯 REGRA FINAL (CRÍTICA)

Sempre que implementar qualquer funcionalidade:

1. Identificar o módulo
2. Criar ou usar entidade do Domain
3. Criar UseCase
4. Criar interface de repositório
5. Implementar repositório no Infrastructure
6. Expor via Controller

---