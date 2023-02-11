# Desafio Técnico: IGMA API

## 📌 Descrição

Este é um projeto proposto como desafio técnico para uma posição de dev back-end na [igma](https://www.linkedin.com/company/igma-digital-product/?src=polymer.co). Trata-se de uma API responsável pelo cadastro e listagem de clientes.

## 📑 Índice

- [🧰 Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [🧭 Referências da API](#-referências-da-api)
  - [Cadastro de Cliente](#cadastro-de-cliente)
  - [Listagem de Cliente por CPF](#listagem-de-cliente-por-cpf)
  - [Listagem de múltiplos Clientes](#listagem-de-múltiplos-clientes)
- [🗂 Estrutura das pastas](#-estrutura-das-pastas)
- [🚀 Rodando a Aplicação](#-rodando-a-aplicação)
- [🧪 Testes Automatizados](#-testes-automatizados)

## 🧰 Tecnologias Utilizadas

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![Insomnia](https://img.shields.io/badge/Insomnia-black?style=for-the-badge&logo=insomnia&logoColor=5849BE)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

## 🧭 Referências da API

Para importar todos os endpoints e testar a aplicação localmente, clique no botão abaixo:

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Arthur%20Akira%20-%20IGMA%20API&uri=https%3A%2F%2Fraw.githubusercontent.com%2FakiraTatesawa%2Fteste-tecnico-igma%2Fmain%2Finsomnia%2Figma_api_insomnia.json)

Para acessar a documentação escrita em [Swagger](https://swagger.io/), acesse o endpoint `/api-docs`

----

### Cadastro de Cliente

```http
POST /customers
```

Nesta rota é possível realizar o cadastro de um cliente fornecendo os dados: `name`, `cpf` e `birthday`.

- `name` deve ser composto por apenas letras e ter no máximo 60 caracteres;
- `cpf` deve ser único para cada cliente e possuir um dos dois formatos a seguir:
  - com máscara: `111.222.333-99`;
  - sem máscara: `11122233399`;
- `birthday` deve estar no formato `DD/MM/YYYY`;

#### Requisição

```json
{
    "name": "Nome Falso",
    "cpf": "40020084013",
    "birthday": "09/07/1999"
}
```

#### Resposta

```http
HTTP/1.1 201 Created
```

```json
{
 "customer": {
  "id": "3d82be1d-4ecc-4a29-befb-0bb5cb666c2c",
  "name": "Nome Falso",
  "cpf": "400.200.840-13",
  "birthday": "09/07/1999",
  "registrationDate": "10/02/2023 21:07:19"
 }
}
```

| Body             |  Code      |  Description                        |
| :--------------- | :-------   | :--------------------------------- |
| `json`           |   `201`    | **Created**          |
| `json`           |   `409`    | **Conflict**, CPF já está cadastrado no sistema |
| `json`           |   `400`    | **Bad Request**, corpo da requisição inválido, ex.: nome de um campo escrito errado |
| `json`           |   `422`    | **Unprocessable Entity**, dados inválidos, ex.: CPF com um formato não permitido |

### Listagem de Cliente por CPF

```http
GET /customers/:customerCPF
GET /customers/400.200.840-13
GET /customers/40020084013
```

Nesta rota, é possível buscar um cliente através do seu CPF.
  
#### Resposta

```http
HTTP/1.1 200 OK
```

```json
{
 "customer": {
  "id": "3d82be1d-4ecc-4a29-befb-0bb5cb666c2c",
  "name": "Nome Falso",
  "cpf": "400.200.840-13",
  "birthday": "09/07/1999",
  "registrationDate": "10/02/2023 21:07:19"
 }
}
```

| Body             |  Code      |  Description                        |
| :--------------- | :-------   | :--------------------------------- |
| `json`           |   `200`    | **OK**          |
| `json`           |   `404`    | **Not Found**, cliente não encontrado |
| `json`           |   `422`    | **Unprocessable Entity**, dados inválidos, ex.: CPF com um formato não permitido |

### Listagem de múltiplos Clientes

```http
GET /customers
GET /customers?limit=$
GET /customers?offset=$
```

Nesta rota, é possível listar múltiplos clientes, havendo a opção de utilizar a paginação através das **query params** `limit` e `offset`.

#### Resposta

```http
HTTP/1.1 200 OK
```

```json
{
 "customers": [
    {
      "id": "c39ecfae-f487-4d35-9254-fb5301525728",
      "name": "Nome Falso Dois",
      "cpf": "241.877.890-81",
      "birthday": "09/07/1999",
      "registrationDate": "10/02/2023 21:25:02"
    },
    {
      "id": "fdc79c70-e3ba-4ca1-afcc-6991ab5d60a3",
      "name": "Nome Falso Um",
      "cpf": "512.902.810-41",
      "birthday": "09/07/1999",
      "registrationDate": "10/02/2023 21:24:42"
    }
 ]
}
```

| Body             |  Code      |  Description                        |
| :--------------- | :-------   | :--------------------------------- |
| `json`           |   `200`    | **OK**          |
| `json`           |   `400`    | **Bad Request**, `limit` ou `offset` inválidos |

## 🗂 Estrutura das pastas

| Diretório       | Conteúdo                                           |
|---------------- |--------------------------------------------------- |
| `requirements/`  | descrição das features em Gherkin                  |
| `tests/`          | testes e2e, factories, repositórios in-memory      |
| `src/`           | código da aplicação                                |
| `src/core`       | abstrações e monads                                |
| `src/domain`    | entidades e value objects                          |
| `src/app`         | use cases, ports, DTOs, application errors         |
| `src/infra`       | bibliotecas externas, banco de dados               |
| `src/infra/http`  | controllers, middlewares, presenters, view models  |
| `src/infra/data`  | repositórios, data mappers, orm                    |

## 🚀 Rodando a Aplicação

1. Clone e navegue até o repositório:

    ```bash
      git clone https://github.com/akiraTatesawa/teste-tecnico-igma.git

      cd teste-tecnico-igma/
    ```

2. Crie um arquivo `.env.development` seguindo o exemplo descrito em `.env.sample`:

    | Nome                 | Descrição                         |
    |--------------------- |---------------------------------- |
    | `PORT`               | porta onde a aplicação vai rodar  |
    | `POSTGRES_USERNAME`  | username do postgres              |
    | `POSTGRES_PASSWORD`  | senha do postgres                 |
    | `POSTGRES_HOST`      | host do postgres                  |
    | `POSTGRES_PORT`      | porta do postgres                 |
    | `POSTGRES_DATABASE`  | nome do banco de dados            |
    | `DATABASE_URL`       | URL de conexão do postgres        |

    - É importante manter a variável `POSTGRES_HOST` como sendo igual a `igma-postgres-development`.

3. Instale as dependências do projeto:

    ```bash
      npm i
    ```

4. Rode o projeto em modo de desenvolvimento:

    ```bash
      npm run dev:docker
    ```

## 🧪 Testes Automatizados

1. Crie um arquivo `.env.test` seguindo o exemplo abaixo:

    | Nome                 | Descrição                         |
    |--------------------- |---------------------------------- |
    | `POSTGRES_USERNAME`  | username do postgres              |
    | `POSTGRES_PASSWORD`  | senha do postgres                 |
    | `POSTGRES_HOST`      | host do postgres                  |
    | `POSTGRES_PORT`      | porta do postgres                 |
    | `POSTGRES_DATABASE`  | nome do banco de dados de teste   |
    | `DATABASE_URL`       | URL de conexão do postgres        |

    - É importante manter a variável `POSTGRES_HOST` como sendo igual a `igma-postgres-test`.

2. Rode o comando de testes:

    ```bash
      npm run test:docker
    ```
