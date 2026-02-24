# UserVault — CRUD de Usuários

Stack: **Node.js + Fastify + MongoDB** (backend) · **React + TypeScript + Tailwind CSS** (frontend)

---

## 📁 Estrutura do Projeto

```
crud-app/
├── backend/
│   ├── src/
│   │   ├── config/       # database.js
│   │   ├── controllers/  # user.controller.js, pet.controller.js
│   │   ├── models/       # user.model.js, pet.model.js
│   │   ├── routes/       # user.routes.js, pet.routes.js
│   │   └── server.js
│   ├── tests/
│   │   └── user.controller.test.js
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/   # UserTable, UserModal, ConfirmDialog
│   │   ├── hooks/        # useUsers.ts
│   │   ├── pages/        # UsersPage.tsx
│   │   ├── services/     # userService.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
└── docker-compose.yml
```

---

## 🚀 Opção 1 — Execução com Docker (recomendada)

### Pré-requisitos
- Docker + Docker Compose instalados

### Passo a passo

```bash
# 1. Clone ou copie o projeto
cd crud-app

# 2. Suba tudo com um comando
docker-compose up --build

# Acesse:
#   Frontend: http://localhost:5173
#   Backend:  http://localhost:3001
#   Health:   http://localhost:3001/health
```

---

## 🛠️ Opção 2 — Execução Manual (desenvolvimento)

### Pré-requisitos
- Node.js >= 20
- MongoDB rodando localmente (porta 27017)
  ```bash
  # Com Docker apenas para o Mongo:
  docker run -d -p 27017:27017 --name mongo mongo:7.0
  ```

### Backend

```bash
cd backend

# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Edite .env se necessário

# 3. Iniciar em modo desenvolvimento
npm run dev

# A API estará disponível em: http://localhost:3001
```

### Frontend

```bash
cd frontend

# 1. Instalar dependências
npm install

# 2. Iniciar o servidor de desenvolvimento
npm run dev

# O app estará em: http://localhost:5173
```

---

## 🧪 Testes

```bash
cd backend

# Instalar dependência de teste (in-memory mongo)
npm install --save-dev mongodb-memory-server

# Executar testes com cobertura
npm test
```

---

## 📡 API REST — Endpoints

### Usuários

| Método   | Endpoint           | Descrição                     |
|----------|--------------------|-------------------------------|
| `GET`    | `/api/users`       | Listar usuários (paginado)    |
| `GET`    | `/api/users/:id`   | Buscar usuário por ID         |
| `POST`   | `/api/users`       | Criar novo usuário            |
| `PUT`    | `/api/users/:id`   | Atualizar usuário             |
| `DELETE` | `/api/users/:id`   | Excluir usuário               |
| `GET`    | `/health`          | Health check                  |

#### Query params — GET /api/users
| Param    | Tipo    | Exemplo            |
|----------|---------|--------------------|
| `page`   | integer | `?page=1`          |
| `limit`  | integer | `?limit=10`        |
| `role`   | string  | `?role=admin`      |
| `active` | string  | `?active=true`     |

#### Payload — POST /api/users
```json
{
  "name": "João Silva",
  "email": "joao@empresa.com",
  "role": "editor",
  "active": true
}
```

#### Resposta — GET /api/users/:id
```json
{
  "id": "65f1a2b3c4d5e6f7a8b9c0d1",
  "name": "João Silva",
  "email": "joao@empresa.com",
  "role": "editor",
  "active": true,
  "createdAt": "2024-03-13T10:00:00.000Z",
  "updatedAt": "2024-03-13T10:00:00.000Z"
}
```

---

### Pets

| Método   | Endpoint                       | Descrição                           |
|----------|--------------------------------|-------------------------------------|
| `GET`    | `/api/pets`                    | Listar pets (paginado)              |
| `GET`    | `/api/pets/user/:user_id`      | Listar pets de um usuário específico|
| `GET`    | `/api/pets/:id`                | Buscar pet por ID                   |
| `POST`   | `/api/pets`                    | Criar novo pet                      |
| `PUT`    | `/api/pets/:id`                | Atualizar pet                       |
| `DELETE` | `/api/pets/:id`                | Excluir pet                         |

#### Query params — GET /api/pets
| Param     | Tipo    | Exemplo                             |
|-----------|---------|-------------------------------------|
| `page`    | integer | `?page=1`                           |
| `limit`   | integer | `?limit=10`                         |
| `user_id` | string  | `?user_id=65f1a2b3c4d5e6f7a8b9c0d1` |

#### Query params — GET /api/pets/user/:user_id
| Param   | Tipo    | Exemplo     |
|---------|---------|-------------|
| `page`  | integer | `?page=1`   |
| `limit` | integer | `?limit=10` |

#### Exemplo — GET /api/pets/user/:user_id
```
GET /api/pets/user/65f1a2b3c4d5e6f7a8b9c0d1
GET /api/pets/user/65f1a2b3c4d5e6f7a8b9c0d1?page=1&limit=5
```

#### Payload — POST /api/pets
```json
{
  "user_id": "65f1a2b3c4d5e6f7a8b9c0d1",
  "name": "Rex"
}
```

#### Payload — PUT /api/pets/:id
```json
{
  "name": "Max"
}
```

#### Resposta — GET /api/pets e GET /api/pets/:id
> O campo `user_id` é substituído por `user_name` (nome do dono) via populate.

```json
{
  "id": "66a3c1e2d7f8b9e0a1b2c3d4",
  "user_name": "João Silva",
  "name": "Rex",
  "createdAt": "2024-03-13T10:00:00.000Z",
  "updatedAt": "2024-03-13T10:00:00.000Z"
}
```

#### Resposta paginada — GET /api/pets
```json
{
  "data": [
    {
      "id": "66a3c1e2d7f8b9e0a1b2c3d4",
      "user_name": "João Silva",
      "name": "Rex",
      "createdAt": "2024-03-13T10:00:00.000Z",
      "updatedAt": "2024-03-13T10:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "pages": 1
}
```

---

## 🏗️ Arquitetura & Padrões

### Backend
- **Fastify** com plugins `@fastify/cors`, `@fastify/helmet`, `@fastify/sensible`
- **JSON Schema** nativo do Fastify para validação de entrada
- **Mongoose** com schema tipado, índices e transform para serialização limpa
- **Separation of Concerns**: routes → controllers → models
- **Error handling** centralizado com status codes semânticos

### Frontend
- **React + TypeScript** com Vite
- **Custom Hook** `useUsers` encapsula todo o estado e side-effects
- **Service Layer** `userService.ts` isola chamadas HTTP via Axios
- **Tailwind CSS** com tema customizado (dark mode, paleta de cores, tipografia)
- Componentes: `UserTable`, `UserModal`, `ConfirmDialog`

---

## 🔒 Segurança
- Helmet para headers HTTP seguros
- CORS configurado por origem
- Validação de schema em todas as rotas
- Sem exposição de stack traces em produção
