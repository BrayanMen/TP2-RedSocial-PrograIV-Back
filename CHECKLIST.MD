## BACKEND (NestJS)

### Sprint 1

#### Módulo `authentication`

- [ ] **POST /register**
  - [ ] Validar DTO y datos del usuario.
  - [ ] Encriptar contraseña (`PasswordService`).
  - [ ] Guardar imagen de perfil y almacenar URL (`UploadService`).
  - [ ] Guardar usuario en MongoDB (`UserRepository`).
- [ ] **POST /login**
  - [ ] Validar credenciales (correo o username).
  - [ ] Comparar contraseña encriptada.
  - [ ] Generar token JWT (`JwtService`).
  - [ ] Devolver `AuthResponseDTO` con datos del usuario y token.

#### Infraestructura

- [ ] Crear `authentication.controller.ts`
- [ ] Configurar módulo global de JWT (`jwt.module.ts` o integración en `authentication.module.ts`)
- [ ] Conexión MongoDB (`config/db-config`)
- [ ] Validaciones con `class-validator` en DTOs

---

### Sprint 2

#### Módulo `publications`

- [ ] **POST /posts**
  - [ ] Crear publicación con título, descripción, imagen (opcional).
  - [ ] Asociar usuario.
  - [ ] Guardar imagen en servidor o servicio de uploads.
- [ ] **DELETE /posts/:id**
  - [ ] Baja lógica (solo autor o admin).
- [ ] **GET /posts**
  - [ ] Listar publicaciones con paginación (offset, limit).
  - [ ] Ordenar por fecha o cantidad de likes.
  - [ ] Filtrar por usuario (query param).
- [ ] **POST /posts/:id/like**
  - [ ] Agregar “me gusta” (solo 1 por usuario).
- [ ] **DELETE /posts/:id/unlike**
  - [ ] Quitar “me gusta”.

#### 🧱Estructura recomendada

- `application/use-cases/posts/create-post.use-case.ts`
- `application/use-cases/posts/delete-post.use-case.ts`
- `application/use-cases/posts/get-feed.use-case.ts`
- `application/use-cases/likes/like-post.use-case.ts`
- `application/use-cases/likes/unlike-post.use-case.ts`
- `infrastructure/controllers/posts.controller.ts`
- `infrastructure/controllers/likes.controller.ts`

---

### Sprint 3

#### 💬 Módulo `comments` (dentro de `publications`)

- [ ] **POST /posts/:id/comments**
  - [ ] Crear comentario vinculado al post y usuario.
- [ ] **PUT /comments/:id**
  - [ ] Editar comentario → marcar `modified: true`.
- [ ] **GET /posts/:id/comments**
  - [ ] Listar comentarios (paginados, recientes primero).

#### Módulo `authentication`

- [ ] Generar JWT con payload (`uuid | email | username | role`).
- [ ] Duración: 15 min.
- [ ] **POST /authorize**
  - [ ] Validar token (401 si inválido o expirado).
- [ ] **POST /refresh**
  - [ ] Refrescar token si sigue válido (nuevo token 15 min más).

---

### Sprint 4

#### 👥Módulo `users`

- [ ] **GET /users**
  - [ ] Listar usuarios (solo admin).
- [ ] **POST /users**
  - [ ] Alta nuevo usuario (rol `usuario` o `admin`).
- [ ] **DELETE /users/:id**
  - [ ] Baja lógica (deshabilitar usuario).
- [ ] **POST /users/:id/enable**
  - [ ] Reactivar usuario.
- [ ] Validar que el token pertenezca a un admin.

#### Módulo `analytics`

- [ ] **GET /analytics/posts**
  - [ ] Cantidad de publicaciones por usuario en un lapso.
- [ ] **GET /analytics/comments**
  - [ ] Cantidad de comentarios en un lapso.
- [ ] **GET /analytics/posts/comments**
  - [ ] Comentarios por publicación en un lapso.
- [ ] Validar token admin en todas las rutas.

---
