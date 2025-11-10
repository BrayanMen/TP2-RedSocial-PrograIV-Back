# Red Social de Artes Marciales - Backend

API REST profesional para una red social enfocada en artistas marciales, desarrollada con NestJS y siguiendo principios de Domain-Driven Design (DDD).

Descripción

Backend completo para una red social donde los usuarios pueden:

* Registrarse y autenticarse con JWT
* Gestionar su perfil (imagen, biografía, artes marciales, nivel, redes sociales)
* Publicar contenido sobre entrenamiento, técnicas, consejos
* Seguir a otros usuarios y dar likes/comentarios
* Sistema de roles (usuario y administrador)
* Dashboard de estadísticas

## Tecnologías

* **NestJS** - Framework backend
* **MongoDB** - Base de datos NoSQL
* **Mongoose** - ODM para MongoDB
* **JWT** - Autenticación
* **Bcrypt** - Encriptación de contraseñas
* **Cloudinary** - Almacenamiento de imágenes
* **Swagger** - Documentación de API
* **TypeScript** - Lenguaje tipado

## Arquitectura

El proyecto sigue **Domain-Driven Design (DDD)** con la siguiente estructura:

src/
├── core/                    # Funcionalidad compartida
│   ├── constants/          # Constantes globales
│   ├── decorators/         # Decoradores personalizados
│   ├── guards/             # Guards de autenticación
│   ├── interceptors/       # Interceptores
│   ├── filters/            # Filtros de excepciones
│   └── interfaces/         # Interfaces compartidas
│
├── shared/                  # Módulos compartidos
│   ├── database/           # Configuración de BD
│   ├── upload/             # Servicio de subida
│   └── utils/              # Utilidades
│
├── modules/                # Módulos de dominio
│   ├── authentication/     # Autenticación
│   │   ├── domain/        # Entidades y lógica de negocio
│   │   ├── application/   # Casos de uso y DTOs
│   │   └── infrastructure/# Controllers y estrategias
│   │
│   └── users/             # Usuarios
│   |   ├── domain/        # Entidades, enums, interfaces
│   |   ├── application/   # use-cases y DTOs
│   |   └── infrastructure/# Controllers, repos, schemas
|   |
│   └──publications
│   |   ├── domain/        # Entidades, enums, interfaces
│   |   ├── application/   # use-cases y DTOs
│   |   └── infrastructure/# Controllers, repos, schemas
|   |
│   └──analytics
│   |   ├── domain/        # Entidades, enums, interfaces
│   |   ├── application/   # use-cases y DTOs
│   |   └── infrastructure/# Controllers, repos, schemas
|
└── config/                 # Configuración

### Capas DDD

Cada módulo está dividido en 3 capas:

1. **Domain Layer** : Entidades, value objects, interfaces de repositorio
2. **Application Layer** : Casos de uso, DTOs, servicios de aplicación
3. **Infrastructure Layer** : Controllers, repositorios, schemas de BD

### Prerrequisitos

* Node.js >= 18
* MongoDB >= 6
* Cuenta en Cloudinary (para imágenes)

## Documentación API

Una vez iniciado el servidor, accede a:

 **Swagger UI** : [http://localhost:3000/api/docs](http://localhost:3000/api/docs) || https://oss-api.onrender.com/api/docs

Aquí encontrarás toda la documentación interactiva de la API.

## Autenticación

La API usa **JWT (JSON Web Tokens)** almacenados en cookies HTTP-only.

### Flujo de autenticación:

1. **Registro** : `POST /api/v1/auth/register`
2. **Login** : `POST /api/v1/auth/login`
3. **Autorizar** : `POST /api/v1/auth/authorize` (verifica token)
4. **Refrescar** : `POST /api/v1/auth/refresh` (renueva token)

Los tokens expiran en 15 minutos y pueden refrescarse.

## Sprint 1 - Completado

### Backend implementado:

* [X] Módulo de autenticación (registro, login)
* [X] Módulo de usuarios (perfil, actualización)
* [X] Encriptación de contraseñas con bcrypt
* [X] Validaciones robustas con class-validator
* [X] Subida de imágenes a Cloudinary
* [X] JWT con refresh tokens
* [X] Guards de autenticación y roles
* [X] Documentación con Swagger
* [X] Filtros de excepciones globales
* [X] Arquitectura DDD limpia y escalable

### Endpoints disponibles:

#### Autenticación

* `POST /api/v1/auth/register` - Registrar usuario
* `POST /api/v1/auth/login` - Iniciar sesión

#### Usuarios

* `GET /api/v1/users/profile` - Ver mi perfil
* `GET /api/v1/users/:id` - Ver perfil de usuario
* `PUT /api/v1/users/profile` - Actualizar mi perfil
* `GET /api/v1/users` - Listar usuarios (paginado)

## Buenas Prácticas Implementadas

* **DDD** : Separación clara de responsabilidades
* **SOLID** : Principios de diseño orientado a objetos
* **DTOs** : Validación de entrada/salida
* **Repository Pattern** : Abstracción de acceso a datos
* **Use Cases** : Lógica de negocio encapsulada
* **Error Handling** : Manejo centralizado de errores
* **Security** : Hashing, JWT, validaciones
* **Documentation** : Swagger completo
* **Clean Code** : Nombres semánticos, código legible

## Convenciones de Código

### Nombres de archivos

* **Entities** : `user.entity.ts`
* **DTOs** : `create-user.dto.ts`
* **Services** : `users.service.ts`
* **Controllers** : `users.controller.ts`
* **Use Cases** : `register-user.use-case.ts`

### Estructura de commits

```
tipo(alcance): descripción

feat(auth): agregar endpoint de registro
fix(users): corregir validación de email
docs(readme): actualizar documentación
```

## Deploy

### Variables de entorno en producción

Asegúrate de configurar todas las variables en tu servicio de hosting:

* Render
* MongoDB Atlas para la base de datos
* Cloudinary para imágenes

### Estructura de un nuevo módulo

#### Crear estructura

mkdir -p src/modules/nuevo-modulo/{domain,application,infrastructure}
mkdir -p src/modules/nuevo-modulo/domain/{entities,enums,interfaces}
mkdir -p src/modules/nuevo-modulo/application/{use-cases,dto,services}
mkdir -p src/modules/nuevo-modulo/infrastructure/{controllers,repositories,schemas}
