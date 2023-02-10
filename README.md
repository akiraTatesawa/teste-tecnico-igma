# Desafio Técnico: IGMA API

## 📌 Descrição

Este é um projeto proposto como desafio técnico para uma posição de dev back-end na [igma](https://www.linkedin.com/company/igma-digital-product/?src=polymer.co). Trata-se de uma API responsável pelo cadastro e listagem de clientes.

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

## 🧭 Endpoints

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
```

Nesta rota, é possível buscar um cliente através do seu CPF.

- É possível utilizar os dois formatos de CPF para buscar o cliente:

  ```http
  GET /customers/400.200.840-13
  GET /customers/40020084013
  ```
  
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
