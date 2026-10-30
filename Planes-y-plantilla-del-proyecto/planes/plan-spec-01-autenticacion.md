# Implementation Plan: SPEC-01 

**Date**: 2026-09-18
**Spec**: [spec-01-autenticacion-registro-control-acceso](../../FASE-4-Prototipar/specs/spec-01-autenticacion-registro-control-acceso.md)

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

- **Arquitectura**: comprobar `Service implements UseCase`, constructores de entrada con interfaces, ausencia de Spring/JPA/HTTP en dominio/aplicación, mappers separados y transacciones verificadas con PostgreSQL cuando aplique.

- **Contract tests**: uno por endpoint de la tabla anterior: status code y forma del body.
- **Integration tests**: uno por Acceptance Scenario del SPEC, con Testcontainers.
- **Unit tests**: hashing/verificación de contraseña, generación y expiración de un solo uso del `TokenRecuperacion`.

## Project Structure

```text
backend/src/main/java/com/aliado/
├── auth/
│   ├── domain/
│   │   ├── model/
│   │   │   Usuario, RolUsuario, Consentimiento, Sesion, TokenRecuperacion
│   │   ├── repository/
│   │   │   UsuarioRepository, ConsentimientoRepository, SesionRepository, TokenRecuperacionRepository
│   │   └── exception/
│   │       CorreoYaRegistradoException, TerminosNoAceptadosException, CredencialesInvalidasException,
│   │       TokenRecuperacionInvalidoException, CuentaBloqueadaException
│   ├── application/
│   │   ├── usecase/
│   │   │   RegistrarUsuarioUseCase, IniciarSesionUseCase, CerrarSesionUseCase, ResolverSesionUseCase,
│   │   │   SolicitarRecuperacionAccesoUseCase, ConfirmarRecuperacionAccesoUseCase, ConsultarUsuarioActualUseCase
│   │   ├── service/
│   │   │   RegistrarUsuarioService, IniciarSesionService, CerrarSesionService, ResolverSesionService,
│   │   │   SolicitarRecuperacionAccesoService, ConfirmarRecuperacionAccesoService, ConsultarUsuarioActualService
│   │   ├── dto/
│   │   │   RegistroCommand, ResultadoRegistro, LoginCommand, ResultadoLogin, UsuarioActual, RecuperacionCommand,
│   │   │   ConfirmarRecuperacionCommand
│   │   └── port/
│   │       HasheadorPassword, GeneradorTokenSesion, HuellaToken, NotificadorRecuperacion, UsuarioConsultaPort,
│   │       SesionAutenticada
│   ├── infrastructure/
│   │   ├── persistence/
│   │   │   ├── entity/
│   │   │   │   UsuarioEntity, ConsentimientoEntity, SesionEntity, TokenRecuperacionEntity
│   │   │   ├── mapper/
│   │   │   │   UsuarioMapper, ConsentimientoMapper, SesionMapper, TokenRecuperacionMapper
│   │   │   ├── jpa/
│   │   │   │   UsuarioJpaRepository, ConsentimientoJpaRepository, SesionJpaRepository, TokenRecuperacionJpaRepository
│   │   │   └── adapter/
│   │   │       UsuarioPersistenceAdapter, ConsentimientoPersistenceAdapter, SesionPersistenceAdapter,
│   │   │       TokenRecuperacionPersistenceAdapter
│   │   └── adapter/
│   │       BCryptHasheadorAdapter, GeneradorTokenSeguroAdapter, HuellaTokenSha256Adapter, CorreoRecuperacionAdapter,
│   │       SesionAutenticadaAdapter, UsuarioConsultaAdapter
│   └── presentation/
│       ├── controller/
│       │   AuthController
│       ├── dto/
│       │   Request/Response HTTP según API Contracts
│       └── mapper/
│           Conversión HTTP ↔ Command/Query/Result
└── common/
    ├── config/
    │   PasswordConfig, ApplicationConfig (composición y transacciones)
    ├── security/
    │   SecurityConfig, AutorizacionRolFilter (depende de ResolverSesionUseCase), @RequiereRol, CurrentUser
    ├── exception/
    │   GlobalExceptionHandler, ErrorResponse
    ├── idempotency/
    │   IdempotencyService, IdempotencyFilter
    └── observability/
        TraceIdFilter
```

**Contrato de arquitectura**: cada operación tiene una interfaz `application/usecase/*UseCase` y una implementación `application/service/*Service implements *UseCase`. Controllers, filtros, gateways y workers inyectan las interfaces por constructor; no servicios concretos ni repositorios JPA. Los servicios coordinan dominio y puertos sin importar Spring, JPA o HTTP. Dominio contiene modelos, reglas, excepciones de negocio y repositorios propios; infraestructura implementa los puertos y configura transacciones. Los DTO HTTP y sus mappers pertenecen a presentación; Command/Query/Result de aplicación son independientes del transporte.

Los contratos entre módulos son interfaces públicas de aplicación; no se accede a Service concreto, repositorio interno o entidad JPA de otro módulo. Cuando se requiera persistencia se separan `domain/repository`, `infrastructure/persistence/entity`, `mapper`, `jpa` y `adapter`. La configuración de Spring conecta puertos y adaptadores, y conserva la transacción completa del caso de uso. Solo crear clases/carpetas con responsabilidad real. `common` contiene infraestructura/contratos transversales acotados; el contexto de Spring Security no entra a aplicación. `SesionAutenticada` es contrato puro en `auth/application/port`; generación aleatoria segura del token y huella SHA-256 son responsabilidades separadas.

### Interfaces de entrada e implementaciones

| Módulo | UseCase (interfaz) | Service (implementación) |
|---|---|---|
| `auth` | `RegistrarUsuarioUseCase` | `RegistrarUsuarioService` |
| `auth` | `IniciarSesionUseCase` | `IniciarSesionService` |
| `auth` | `CerrarSesionUseCase` | `CerrarSesionService` |
| `auth` | `ResolverSesionUseCase` | `ResolverSesionService` |
| `auth` | `SolicitarRecuperacionAccesoUseCase` | `SolicitarRecuperacionAccesoService` |
| `auth` | `ConfirmarRecuperacionAccesoUseCase` | `ConfirmarRecuperacionAccesoService` |
| `auth` | `ConsultarUsuarioActualUseCase` | `ConsultarUsuarioActualService` |

Puertos de salida: HasheadorPassword, GeneradorTokenSesion, HuellaToken, NotificadorRecuperacion, UsuarioConsultaPort, SesionAutenticada. Las interfaces de entrada no crean endpoints nuevos; mantener API Contracts y las condiciones Could/Future. Las tareas existentes conservan IDs, historias, dependencias y orden: los nombres de servicio agrupado de origen se descomponen en estas operaciones, sin añadir tareas funcionales.

Persistencia de referencia: `usuarios`, `consentimientos`, `sesiones`, `tokens_recuperacion`. El [manual entregado](../../tasks/fuentes/manual-base-de-datos-aliado.md) detalla el modelo MVP; no implica que los scripts V1–V6 ya estén disponibles o ejecutados.

**Structure Decision**: Se utilizará una estructura modular por funcionalidad, separando el módulo `auth/` de la infraestructura transversal ubicada en `common/`. El módulo `auth/` encapsulará toda la lógica relacionada con registro, autenticación, sesiones, recuperación de acceso y control de roles.

---

## Phase 1: Setup

- [ ] T001 Crear el paquete `auth/` con interfaces UseCase, implementaciones Service y puertos/adaptadores de Arquitectura Limpia (según Project Structure)
- [ ] T002 Migración Flyway inicial: tablas `usuarios`, `consentimientos`, `sesiones`, `tokens_recuperacion`

---

## Phase 2: Foundational


- [ ] T003 Configurar Spring Security 
- [ ] T004 Configurar `PasswordEncoder` BCrypt en `common/config/PasswordConfig`, implementar `HasheadorPassword` mediante `BCryptHasheadorAdapter` y conectar el puerto en ApplicationConfig.
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

- [ ] T009 [P] [US1] Modelo `Usuario` y `Consentimiento` - `auth/domain/model`
- [ ] T010 [US1] `RegistrarUsuarioService implements RegistrarUsuarioUseCase`: valida unicidad de correo (FR-003), exige términos (FR-002) y usa HasheadorPassword; puertos y transacción según el árbol de auth (depends on T009, T004).
- [ ] T011 [US1] Endpoint `POST /api/v1/auth/registro`: AuthController recibe RegistrarUsuarioUseCase; AuthPresentationMapper convierte RegistroRequest a RegistroCommand y resultado a respuesta HTTP.
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

- [ ] T015 [P] [US2] Modelo `Sesion` y `TokenRecuperacion`  -`auth/domain/model` (depends on T009)
- [ ] T016 [US2] `IniciarSesionService implements IniciarSesionUseCase`, `CerrarSesionService implements CerrarSesionUseCase` y `ResolverSesionService implements ResolverSesionUseCase` — `auth/application/service`; sesión opaca y revocación por puertos.
- [ ] T017 [US2] SolicitarRecuperacionAccesoUseCase y ConfirmarRecuperacionAccesoUseCase con sus Service; GeneradorTokenSesion/HuellaToken/NotificadorRecuperacion abstraen aleatoriedad segura, hash, expiración, un solo uso y correo — `auth/application`.
- [ ] T018 [US2] AutorizacionRolFilter en common/security recibe ResolverSesionUseCase; SesionAutenticada es contrato puro en auth/application/port y SesionAutenticadaAdapter traduce contexto técnico. No pasar Spring Security a servicios o dominio.
- [ ] T019 [US2] Endpoints login, logout, recuperacion y recuperacion/confirmar: AuthController recibe interfaces UseCase por constructor y usa AuthPresentationMapper; ningún Service concreto en presentación.

**Checkpoint**: `auth` queda completo. Este es el punto en el que cualquier otro SPEC del proyecto puede empezar a depender de `Usuario` autenticado.

---

## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F01-FE-01** Registro, consentimiento, inicio/cierre y recuperación en app; login exclusivo para Administrador en panel.
- [ ] **F01-FE-02** Persistir sesión en almacenamiento seguro del dispositivo; panel usa sesión en memoria con política de reautenticación documentada, sin localStorage para tokens.
- [ ] **F01-FE-03** Navegación según rol, expiración y revocación; mostrar el mismo mensaje para correo inexistente y recuperación válida.
- [ ] **F01-FE-04** Sustituir acceso rápido por rol y correo simulado de la demo por API y correo de desarrollo real.

Aplicar [estados y contrato de cliente](../../tasks/01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación de la feature

- [ ] **F01-QA-01** Probar registro duplicado concurrente y recuperación usada dos veces.
- [ ] **F01-QA-02** Revocar sesiones previas según política acordada; verificar acceso cruzado de los tres roles.
- [ ] **F01-QA-03** E2E registrar ambos roles, login, logout, recuperar y volver a entrar sin revelar hashes.
- [ ] **F01-QA-04** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Dependencies & Execution Order

- **Setup (Phase 1)** → sin dependencias.
- **Foundational (Phase 2)** → bloquea Phases 3-4 de este plan **y el inicio de todos los demás planes del proyecto**.
- **User Story 1 (Phase 3)** → depende solo de Foundational.
- **User Story 2 (Phase 4)** → depende de Phase 3.

## Notes

- Este es el plan fundacional del proyecto: su Fase 2 y su Fase 4 son el prerrequisito bloqueante de **todos** los demás planes (SPEC-02 a SPEC-20). Ningún otro plan debe volver a listar estas tareas; deben referenciarlas como dependencia externa.
- La decisión JWT vs. sesión (T003) es la única pendiente técnica real de este plan y debe cerrarse antes de iniciar Phase 2.
