# Red Social de Artes Marciales - Backend

## 1. Contexto General del Proyecto

Este repositorio contiene el **Backend (API REST)** para un proyecto full-stack de la materia **Programación IV** de la Tecnicatura Universitaria en Programación (UTN Avellaneda).

El proyecto completo es una "Red Social" que consiste en:
* **Backend (Este repo):** API REST desarrollada en **NestJS**.
* **Frontend:** Aplicación SPA (Single Page Application) desarrollada en **Angular**.

La temática específica de esta implementación es una **red social enfocada en artistas marciales**.

## 2. Descripción Funcional y Requisitos del TP

El backend está diseñado para cumplir con los siguientes requisitos funcionales:

* **Autenticación (Sprints 1, 3):**
    * Registro de usuarios (con campos como nombre, apellido, correo, usuario, contraseña, fecha de nacimiento, imagen de perfil).
    * Login de usuarios.
    * Uso de **JWT (JSON Web Tokens)** con una expiración de 15 minutos.
    * Una ruta `POST /api/v1/auth/authorize` para validar el token al inicio de la app.
    * Una ruta `POST /api/v1/auth/refresh` para renovar el token.
    * El frontend debe mostrar un modal a los 10 minutos para "extender la sesión".

* **Usuarios y Perfiles (Sprints 1, 2, 5):**
    * Roles de usuario: `usuario` (por defecto) y `administrador`.
    * Los usuarios pueden ver y editar su propio perfil.
    * Los usuarios pueden ver los perfiles de otros usuarios (datos y últimas 3 publicaciones).
    * Gestión de seguidores (no implementado en Sprint 1, pero parte de la idea general).

* **Publicaciones (Sprints 2, 6):**
    * CRUD de publicaciones (título, mensaje, imagen opcional).
    * Baja lógica (soft delete) de publicaciones.
    * Listado de publicaciones paginado (offset/limit), que luego evoluciona a **scroll infinito** en el frontend (Sprint 5).
    * Ordenamiento por fecha (defecto) o por cantidad de "me gusta".
    * Ordenamientos adicionales (Sprint 6): por veces guardada y veces compartida.

* **Interacciones (Sprints 2, 3, 6):**
    * **Me Gusta:** Dar y quitar "me gusta". Un usuario solo puede dar un "me gusta" por publicación.
    * **Comentarios:**
        * Agregar comentarios a una publicación.
        * Editar comentarios propios (marcando como `modificado: true`).
        * Carga paginada de comentarios ("cargar más").
    * **Guardados (Sprint 6):** Guardar y quitar publicaciones de una lista personal.
    * **Compartir (Sprint 6):** Compartir una publicación con otro usuario específico.

* **Panel de Administrador (Sprints 4, 5):**
    * Dashboard de **Usuarios**: Listar, crear, habilitar y deshabilitar (baja lógica) usuarios.
    * Dashboard de **Estadísticas**: Rutas GET protegidas para alimentar gráficos en el frontend. Estadísticas requeridas:
        * Publicaciones por usuario (en un lapso de tiempo).
        * Comentarios totales (en un lapso de tiempo).
        * Comentarios por publicación (en un lapso de tiempo).
        * Ingresos (log in) por usuario.
        * Visitas a perfiles (por otros usuarios).
        * "Me gusta" otorgados por día.

## 3. Tecnologías (Backend)

* **NestJS** - Framework backend]
* **MongoDB** - Base de datos NoSQL
* **Mongoose** - ODM para MongoDB]
* **JWT** - Autenticación]
* **Bcrypt** - Encriptación de contraseñas
* **Cloudinary** - Almacenamiento de imágenes
* **Swagger** - Documentación de API]
* **TypeScript** - Lenguaje tipado
* **Class-Validator** - Validación de DTOs]

## 4. Arquitectura (Domain-Driven Design)

El proyecto sigue **Domain-Driven Design (DDD)** con la siguiente estructura:
```
src/
├── core/                    # Funcionalidad compartida
│   ├── constants/           # Constantes globales
│   ├── decorators/          # Decoradores personalizados
│   ├── guards/              # Guards de autenticación (AuthGuard, RolesGuard)
│   ├── interceptors/        # Interceptores (ResponseInterceptor)
│   ├── filters/             # Filtros de excepciones (HttpExceptionFilter)
│   └── interfaces/          # Interfaces compartidas (JwtPayload)
│
├── shared/                  # Módulos compartidos
│   ├── database/            # Configuración de BD
│   ├── upload/              # Servicio de subida (Cloudinary)
│   └── utils/               # Utilidades
│
├── modules/                 # Módulos de dominio
│   ├── authentication/      # Autenticación (Login, Register, Refresh, Authorize)
│   ├── users/               # Usuarios (Perfiles, Admin de usuarios)
│   ├── publications/        # Publicaciones (Posts, Comentarios, Likes)
│   └── analytics/           # Estadísticas (Módulo para el dashboard)
│
└── config/                  # Configuración (Variables de entorno, JWT, DB)
```

### Capas DDD

Cada módulo de dominio está dividido en 3 capas:

1.  **Domain Layer**: Entidades, Value Objects, Enums, Interfaces de Repositorio.
2.  **Application Layer**: Casos de Uso (Use Cases), DTOs, Servicios de Aplicación (lógica de negocio).
3.  **Infrastructure Layer**: Controllers (API endpoints), Repositorios (implementación con Mongoose), Schemas de BD.

## 5. Documentación API

Una vez iniciado el servidor, accede a:

**Swagger UI** : [http://localhost:3000/api/docs](http://localhost:3000/api/docs) || https://oss-api.onrender.com/api/docs

Aquí encontrarás toda la documentación interactiva de la API.

## 6. Flujo de Autenticación

La API usa **JWT (JSON Web Tokens)** almacenados en cookies HTTP-only.

### Flujo de autenticación:

1.  **Registro** : `POST /api/v1/auth/register`
2.  **Login** : `POST /api/v1/auth/login`
3.  **Autorizar** : `POST /api/v1/auth/authorize` (verifica token en cada recarga de la app)
4.  **Refrescar** : `POST /api/v1/auth/refresh` (renueva token antes de que expire)

Los tokens expiran en 15 minutos y pueden refrescarse.

## 7. Estado del Proyecto (Sprints 1-3 Completados)

### Sprint 1 - Completado

**Backend implementado:**
* [X] Módulo de autenticación (registro, login)
* [X] Módulo de usuarios (perfil, actualización)
* [X] Encriptación de contraseñas con bcrypt
* [X] Validaciones robustas con class-validator
* [X] Subida de imágenes a Cloudinary
* [X] Guards de autenticación y roles
* [X] Documentación con Swagger
* [X] Filtros de excepciones globales
* [X] Arquitectura DDD limpia y escalable

**Endpoints disponibles (Sprint 1):**
* `POST /api/v1/auth/register` - Registrar usuario
* `POST /api/v1/auth/login` - Iniciar sesión
* `GET /api/v1/users/profile` - Ver mi perfil
* `GET /api/v1/users/:id` - Ver perfil de usuario
* `PUT /api/v1/users/profile` - Actualizar mi perfil
* `GET /api/v1/users` - Listar usuarios (paginado)

---

### Sprint 2 - Completado

**Backend implementado:**
* [X] Módulo de Publicaciones (CRUD básico)
* [X] Lógica de 'Me Gusta' (Like/Unlike)
* [X] Baja lógica para publicaciones (solo por creador o admin)
* [X] Endpoints de listado con paginación (offset/limit)
* [X] Endpoints de listado con ordenamiento (fecha, me gusta)
* [X] Endpoints de listado con filtro por usuario
* [X] Lógica para asegurar un solo 'me gusta' por usuario/publicación

**Endpoints disponibles (Sprint 2):**
* `POST /api/v1/publications` - Crear nueva publicación
* `GET /api/v1/publications` - Listar publicaciones (con queries para paginación, orden y filtro)
* `DELETE /api/v1/publications/:id` - Eliminar publicación (baja lógica)
* `POST /api/v1/publications/:id/like` - Dar "me gusta" a una publicación
* `DELETE /api/v1/publications/:id/like` - Quitar "me gusta"

---

### Sprint 3 - Completado

**Backend implementado:**
* [X] Módulo de Comentarios (CRUD)
* [X] Lógica para editar comentarios (marcando con `modificado: true`)
* [X] Paginación para comentarios
* [X] Ordenamiento de comentarios (más recientes primero)
* [X] Generación de JWT en Login/Registro (con payload de rol y ID)
* [X] Expiración de Token (15 minutos)

**Endpoints disponibles (Sprint 3):**
* `POST /api/v1/auth/authorize` - Validar token (devuelve datos de usuario si es válido)
* `POST /api/v1/auth/refresh` - Renovar token (devuelve un nuevo token)
* `GET /api/v1/publications/:id/comments` - Listar comentarios de un post (con paginación)
* `POST /api/v1/publications/:id/comments` - Agregar un comentario
* `PUT /api/v1/comments/:id` - Modificar un comentario

### Pendiente (Sprints 4-6)

#### Sprint 4 - Pendiente
**Backend (Módulo Usuarios):**
* [ ] Proteger endpoints de admin con `RolesGuard` (validar token de admin).
* [ ] `GET /api/v1/admin/users` - Listar todos los usuarios.
* [ ] `POST /api/v1/admin/users` - Crear nuevo usuario (permitiendo definir rol).
* [ ] `DELETE /api/v1/admin/users/:id` - Deshabilitar usuario (baja lógica).
* [ ] `POST /api/v1/admin/users/:id/rehabilitate` - Rehabilitar usuario (alta lógica).

* **Backend (Módulo Analytics/Estadísticas):**
* [ ] Crear `EstadisticasController`.
* [ ] Proteger todos los endpoints de estadísticas (solo admin).
* [ ] `GET /api/v1/analytics/posts-per-user` - (Stat 1: Publicaciones por usuario)[cite: 169, 192].
* [ ] `GET /api/v1/analytics/comments-by-range` - (Stat 2: Comentarios en lapso de tiempo).
* [ ] `GET /api/v1/analytics/comments-per-post` - (Stat 3: Comentarios por publicación).

---

#### Sprint 5 - Pendiente
**Backend (Módulo Analytics/Estadísticas):**
* [ ] Implementar lógica para nuevas estadísticas[cite: 214].
* [ ] `GET /api/v1/analytics/logins-per-user` - (Stat 4: Ingresos por usuario)[cite: 211].
* [ ] `GET /api/v1/analytics/profile-visits` - (Stat 5: Visitas a perfiles)[cite: 212].
* [ ] `GET /api/v1/analytics/likes-per-day` - (Stat 6: Me gusta otorgados por día)[cite: 213].
* **Backend (Módulo Publicaciones):**
* [ ] Modificar `GET /api/v1/publications` para que funcione con scroll infinito (el frontend dejará de enviar `offset` y enviará `page`)[cite: 206].

---

#### Sprint 6 - Pendiente
**Backend (Módulo Publicaciones):**
* [ ] `POST /api/v1/publications/:id/save` - Guardar una publicación (usando token).
* [ ] `DELETE /api/v1/publications/:id/save` - Quitar publicación de guardados.
* [ ] `POST /api/v1/publications/:id/share` - Compartir con otro usuario (ID de usuario en el body).
* [ ] `GET /api/v1/publications/saved` - Listar mis publicaciones guardadas.
* [ ] `GET /api/v1/publications/shared-with-me` - Listar publicaciones compartidas conmigo (y quién la compartió).
* [ ] Agregar lógica a `GET /api/v1/publications` para los nuevos ordenamientos (por "saves" y "shares").

---

## 8. Buenas Prácticas Implementadas

* **DDD**: Separación clara de responsabilidades
* **SOLID**: Principios de diseño orientado a objetos
* **DTOs**: Validación de entrada/salida
* **Repository Pattern**: Abstracción de acceso a datos
* **Use Cases**: Lógica de negocio encapsulada
* **Error Handling**: Manejo centralizado de errores
* **Security**: Hashing, JWT, validaciones
* **Documentation**: Swagger completo
* **Clean Code**: Nombres semánticos, código legible

## 9. Convenciones de Código

### Nombres de archivos
* **Entities**: `user.entity.ts`
* **DTOs**: `create-user.dto.ts`
* **Services**: `users.service.ts`
* **Controllers**: `users.controller.ts`
* **Use Cases**: `register-user.use-case.ts`

### Estructura de commits

```
tipo(alcance): descripción
feat(auth): agregar endpoint de registro 
fix(users): corregir validación de email 
docs(readme): actualizar documentación
```

## 10. Deploy

### Variables de entorno en producción
Asegúrate de configurar todas las variables en tu servicio de hosting:
* Render (Hosting Backend)
* MongoDB Atlas para la base de datos
* Cloudinary para imágenes

### Links
* **Frontend Deploy**: https://oss-eta.vercel.app/
* **Backend Deploy**: https://oss-api.onrender.com/api/docs

## 11. Estructura de un nuevo módulo

#### Crear estructura
```
mkdir -p src/modules/nuevo-modulo/{domain,application,infrastructure}
mkdir -p src/modules/nuevo-modulo/domain/{entities,enums,interfaces}
mkdir -p src/modules/nuevo-modulo/application/{use-cases,dto,services}
mkdir -p src/modules/nuevo-modulo/infrastructure/{controllers,repositories,schemas}
```

## 12. Objetivo de este Archivo

El objetivo de este GEMINI.md es proveer un contexto completo a Google Gemini Code Assist. Úsalo para entender la relación entre el frontend y el backend, la arquitectura DDD implementada, y cómo las funcionalidades del código se alinean con los requisitos del Trabajo Práctico (TP#2).
