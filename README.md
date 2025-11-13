## Sistema de Emissão de Notas Fiscais

Projeto técnico desenvolvido para a vaga de Desenvolvedor(a) Júnior — C# ou Go + Angular.
O sistema consiste em um conjunto de microsserviços que gerenciam produtos e notas fiscais, permitindo cadastro, impressão e controle de estoque.

Principais funcionalidades:

- Cadastro de produtos com código, descrição e saldo.
- Cadastro de notas fiscais com múltiplos produtos.
- Impressão de notas fiscais, atualizando status e estoque.
- Tratamento de falhas entre microsserviços.
- Controle de concorrência em operações simultâneas (Lock Otimista).
- Funcionalidade de Idempotência para evitar efeitos colaterais em operações repetidas.

Tecnologias Utilizadas

Frontend:
- Angular
- RxJS (para gerenciamento de requisições assíncronas)
Angular Material (componentes visuais)

Backend (C# .NET 8):
- ASP.NET Core Web API
- Entity Framework Core (com InMemoryDatabase para testes)
- HttpClientFactory + Polly (para comunicação resiliente entre microsserviços)
- LINQ para consultas e manipulação de dados

Estrutura do Projeto:
- Controllers: Endpoints de cada microsserviço
- Models: Entidades de negócio
- DTOs: Objetos de transferência entre frontend e backend
- Data: Contexto do banco e configuração do EF Core

Estrutura de Microsserviços
- Serviço de Estoque – gerencia produtos.
- Serviço de Faturamento – gerencia notas fiscais.

Comunicação entre microsserviços via HttpClientFactory, com políticas de retry implementadas pelo Polly.

# Funcionalidades Implementadas:

Produtos: 
- Cadastro de novos produtos com validação de campos obrigatórios.
- Visualização e listagem de produtos cadastrados.

Notas Fiscais:
- Criação de notas com múltiplos produtos e quantidades.
- Impressão de notas: atualiza status para Fechada e ajusta estoque.
- Mensagens de erro amigáveis para falhas no serviço de estoque.

Concorrência:
- Controle de concorrência usando Lock Otimista (RowVersion) para evitar conflitos no estoque.

Idempotência:
- Evita que operações repetidas causem efeitos indesejados.

# Como Rodar o Projeto:
Pré-requisitos:
- .NET 8 SDK
- Node.js 20+
- Angular CLI

Backend:

Abrir o terminal na pasta do projeto e rodar:

```
dotnet run --project backend/FaturamentoService
dotnet run --project backend/EstoqueService
```

Frontend:

Navegar até a pasta frontend.

Instalar dependências:
```
npm install
```

Rodar o servidor:
```
ng serve
```

Abrir no navegador: http://localhost:4200
