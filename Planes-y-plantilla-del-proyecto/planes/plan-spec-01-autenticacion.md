# Implementation Plan: SPEC-01 

**Date**: 2026-09-18
**Spec**:  [spec-01-autenticacion-registro-control-acceso](FASE-4-Prototipar/specs/spec-01-autenticacion-registro-control-acceso)

## Summary

SPEC-01 cubre el registro por rol, la autenticación y control de sesión, la recuperación de acceso y la restricción de capacidades por rol. Es el primer plan de todo el proyecto: su Fase 2no es solo la base de este SPEC, sino **la base de infraestructura compartida de todos los módulos del sistema** (seguridad, manejo de errores, configuración de entorno).

## Technical Context

**Language/Version**: Java 21 (LTS)
**Primary Dependencies**: Spring Boot 3.3.x — Spring Web, Spring Data JPA, Spring Security, Spring Validation, Flyway, BCrypt
**Build tool**: Maven
**Storage**: PostgreSQL 16 — tablas `usuarios`, `consentimientos`, `sesiones`, `tokens_recuperacion`
**Testing**: JUnit 5 + Mockito (servicios), Spring Boot Test + Testcontainers con PostgreSQL real (integración), MockMvc/WebTestClient (contratos de API)
**Target Platform**: VPS Hostinger (Docker Compose)
**Project Type**: Web + Mobile (backend único consumido por `app-movil` y `panel-admin`)
**Performance Goals**: login debe responder en p95 < 300 ms bajo la carga del piloto.
**Constraints**: RNF-004 (cifrado de credenciales y sesión), RNF-010 (Ley 1581, consentimiento explícito antes de registrar datos personales)
**Scale/Scope**: ~50–100 Prestadores y ~200–500 Clientes (piloto)

## Data Model

| Entidad | Campos clave |
|---|---|
| `Usuario` | `id`, `email` (único), `passwordHash`, `rol` (CLIENTE/PRESTADOR), `estadoCuenta`, `fechaCreacion` |
| `Consentimiento` | `id`, `usuarioId` (FK), `versionTerminos`, `fechaAceptacion` |
| `Sesion` | `id`, `usuarioId` (FK), `tokenHash`, `fechaInicio`, `fechaExpiracion`, `fechaCierre`, `estado` |
| `TokenRecuperacion` | `id`, `usuarioId` (FK), `codigoHash`, `fechaCreacion`, `fechaExpiracion`, `usado` (boolean) |

Relaciones: `Usuario` 1—N `Sesion`, `Usuario` 1—N `TokenRecuperacion`, `Usuario` 1—1 `Consentimiento` (por versión aceptada).

## API Contracts

| Método | Endpoint | Request body | Respuesta éxito | Errores |
|---|---|---|---|---|
| POST | `/api/v1/auth/registro` | `{ email, password, rol, aceptaTerminos, versionTerminos }` | `201 { id, email, rol }` | `400` datos inválidos/términos no aceptados; `409` correo ya registrado (sin revelar rol) |
| POST | `/api/v1/auth/login` | `{ email, password }` | `200 { sessionToken, rol }` | `401` credenciales inválidas (mensaje genérico) |
| POST | `/api/v1/auth/logout` | *(header Authorization)* | `204` | `401` sin sesión activa |
| POST | `/api/v1/auth/recuperacion` | `{ email }` | `202 { mensaje }` *(idéntico exista o no la cuenta)* | — |
| POST | `/api/v1/auth/recuperacion/confirmar` | `{ token, nuevaPassword }` | `200 { mensaje }` | `400/410` token inválido, usado o expirado |

## Testing Strategy

- **Contract tests**: uno por endpoint de la tabla anterior: status code y forma del body.
- **Integration tests**: uno por Acceptance Scenario del SPEC, con Testcontainers.
- **Unit tests**: hashing/verificación de contraseña, generación y expiración de un solo uso del `TokenRecuperacion`.

## Project Structure

```text
backend/src/main/java/com/aliado/
├── auth/
│   ├── controller/ AuthController
│   ├── service/    AuthService, TokenService
│   ├── repository/ UsuarioRepository, SesionRepository,   TokenRecuperacionRepository, ConsentimientoRepository
│   └── model/      Usuario, Sesion, TokenRecuperacion, Consentimiento
└── common/
    ├── config/
    ├── security/
    └── exception/
```

**Structure Decision**: Se utilizará una estructura modular por funcionalidad, separando el módulo `auth/` de la infraestructura transversal ubicada en `common/`. El módulo `auth/` encapsulará toda la lógica relacionada con registro, autenticación, sesiones, recuperación de acceso y control de roles.

---

## Phase 1: Setup

- [ ] T001 Crear el paquete `auth/` con sus subcarpetas en capas
- [ ] T002 Migración Flyway inicial: tablas `usuarios`, `consentimientos`, `sesiones`, `tokens_recuperacion`

---

## Phase 2: Foundational


- [ ] T003 Configurar Spring Security 
- [ ] T004 Configurar `PasswordEncoder` (BCrypt) como bean compartido por todo el sistema
- [ ] T005 Configurar manejo de errores global (`@ControllerAdvice`) con el formato de respuesta de error estándar del proyecto
- [ ] T006 Configurar perfiles de entorno (`dev`/`prod`) y variables sensibles fuera del repositorio

**Checkpoint**: infraestructura base lista. A partir de aquí, cualquier otro SPEC puede empezar a implementarse en paralelo, siempre que dependa de `Usuario` solo después de completar la Fase 4 de este plan.

---

## Phase 3: User Story 1 - Registro por rol [UC001, UC002, UC007] (Priority: P1)

**Goal**: cualquier persona puede crear una cuenta Cliente o Prestador aceptando términos.

**Independent Test**: registrar una cuenta de cada rol con datos válidos y verificar rol + consentimiento almacenados.

### Tests

- [ ] T007 [P] [US1] Contract test `POST /auth/registro` (201, 400, 409) — `tests/contract/test_auth_registro.java`
- [ ] T008 [P] [US1] Integration test: registro exitoso Cliente/Prestador, términos no aceptados, correo duplicado - `tests/integration/test_registro.java`

### Implementation

- [ ] T009 [P] [US1] Modelo `Usuario` y `Consentimiento` - `auth/model`
- [ ] T010 [US1] `AuthService.registrar()`: valida unicidad de correo (FR-003), exige aceptación de términos (FR-002), hashea password (depends on T009, T004)
- [ ] T011 [US1] Endpoint `POST /api/v1/auth/registro` -`auth/controller`
- [ ] T012 [US1] Manejo transaccional del edge case "pérdida de conexión durante el registro"

**Checkpoint**: una persona puede registrarse como Cliente o Prestador de forma independiente.

---

## Phase 4: User Story 2 - Autenticación y acceso seguro [UC003, UC004, UC005, UC006] (Priority: P1)

**Goal**: un usuario registrado puede iniciar/cerrar sesión, recuperar su acceso, y el sistema restringe capacidades por rol.

**Independent Test**: login válido/inválido, logout, recuperación, y acceso cruzado de rol denegado.

### Tests

- [ ] T013 [P] [US2] Contract tests `POST /auth/login`, `/logout`, `/recuperacion`, `/recuperacion/confirmar` -`tests/contract/test_auth_sesion.java`
- [ ] T014 [P] [US2] Integration test: login válido/inválido sin filtrar cuál dato falló (FR-004), token de recuperación usado dos veces, acceso restringido por rol (FR-007)  -`tests/integration/test_autenticacion.java`

### Implementation

- [ ] T015 [P] [US2] Modelo `Sesion` y `TokenRecuperacion`  -`auth/model` (depends on T009)
- [ ] T016 [US2] `AuthService.login()` / `logout()`  - `auth/service`
- [ ] T017 [US2] `TokenService`: generación, expiración y verificación de un solo uso del token de recuperación  - `auth/service`
- [ ] T018 [US2] Interceptor/filtro de autorización por rol, reutilizable por todos los demás SPEC del sistema  - `auth/service` + `common/security`
- [ ] T019 [US2] Endpoints `login`, `logout`, `recuperacion`, `recuperacion/confirmar`  - `auth/controller`

**Checkpoint**: `auth` queda completo. Este es el punto en el que cualquier otro SPEC del proyecto puede empezar a depender de `Usuario` autenticado.

---

## Dependencies & Execution Order

- **Setup (Phase 1)** → sin dependencias.
- **Foundational (Phase 2)** → bloquea Phases 3-4 de este plan **y el inicio de todos los demás planes del proyecto**.
- **User Story 1 (Phase 3)** → depende solo de Foundational.
- **User Story 2 (Phase 4)** → depende de Phase 3.

## Notes

- Este es el plan fundacional del proyecto: su Fase 2 y su Fase 4 son el prerrequisito bloqueante de **todos** los demás planes (SPEC-02 a SPEC-20). Ningún otro plan debe volver a listar estas tareas; deben referenciarlas como dependencia externa.
- La decisión JWT vs. sesión (T003) es la única pendiente técnica real de este plan y debe cerrarse antes de iniciar Phase 2.

