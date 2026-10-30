# Implementation Plan: SPEC-04

**Date**: 2026-10-02
**Spec**: [spec-04-gestion-solicitudes-servicio](../../FASE-4-Prototipar/specs/spec-04-gestion-solicitudes-servicio.md)

## Summary

SPEC-04 cubre la publicación, edición, cancelación y consulta de solicitudes de servicio por parte del Cliente. Es el primer plan que depende de la infraestructura de SPEC-01 (autenticación, roles, manejo de errores) y, a su vez, introduce infraestructura de catálogo (categorías y zonas) y un contrato de almacenamiento de archivos que SPEC-05 y SPEC-06 deberán reutilizar.

## Technical Context

**Language/Version**: Java 21 (LTS)- reutilizado de SPEC-01
**Primary Dependencies**: Spring Boot 3.3.x (Web, Data JPA, Validation), Flyway - reutilizados de SPEC-01. No se agregan dependencias de framework nuevas.
**Build tool**: Maven
**Storage**: PostgreSQL 16, nuevas tablas de este módulo, más un mecanismo de almacenamiento de archivos para fotos `[NEEDS CLARIFICATION: proveedor o mecanismo concreto de almacenamiento de archivo`
**Testing**: JUnit 5 + Mockito, Spring Boot Test + Testcontainers (PostgreSQL), MockMvc/WebTestClient  reutilizados de SPEC-01
**Target Platform**: VPS Hostinger (Docker Compose) - reutilizado de SPEC-01
**Project Type**: Web + Mobile (backend único)-  reutilizado de SPEC-01
**Performance Goals**: sin metas específicas nuevas de este SPEC
**Constraints**: RNF-001 (operable con conectividad intermitente- edge case de pérdida de conexión), RNF-002 (usabilidad para baja alfabetización digital), RNF-004 (zona aproximada vs. dirección exacta), RNF-006 (integridad transaccional en cambios de estado), RNF-010 (Ley 1581)
**Scale/Scope**: ~200–500 Clientes (piloto) - reutilizado de SPEC-01

## Data Model

| Entidad | Campos clave |
|---|---|
| `CategoriaServicio` *(catálogo compartido, nuevo)* | `id`, `nombre`, `estado` (activo/inactivo) |
| `Zona` *(catálogo compartido, nuevo)* | `id`, `nombre`, `estado` (activo/inactivo) |
| `Solicitud` | `id`, `clienteId` (FK Usuario), `categoriaId` (FK CategoriaServicio), `descripcion`, `zonaId` (FK Zona), `urgencia` (enum), `estado` (enum: BORRADOR, PUBLICADA, CANCELADA, CONTRATADA*), `fechaCreacion`, `fechaActualizacion` |
| `FotoSolicitud` | `id`, `solicitudId` (FK), `url`, `orden` |
| `HistorialEstadoSolicitud` | `id`, `solicitudId` (FK), `estadoAnterior`, `estadoNuevo`, `fecha` |

Relaciones: `Usuario` 1—N `Solicitud`, `Solicitud` 1—N `FotoSolicitud`, `Solicitud` 1—N `HistorialEstadoSolicitud`, `Solicitud` N—1 `CategoriaServicio`, `Solicitud` N—1 `Zona`.



## API Contracts

| Método | Endpoint                            | Request body                                                             | Respuesta éxito                                   | Errores                                                                               |
| ------ | ----------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------- | ------------------------------------------------------------------------------------- |
| POST   | `/api/v1/solicitudes`               | `{ categoriaId, descripcion, zonaId, urgencia, fotos[], estadoDeseado }` | `201 { id, estado }`                              | `400` falta zona/urgencia/categoría                                                   |
| PUT    | `/api/v1/solicitudes/{id}`          | campos editables de la solicitud                                         | `200 { id, estado }`                              | `400` datos inválidos; `403/404` no pertenece o no existe; `409` ya no admite cambios |
| POST   | `/api/v1/solicitudes/{id}/cancelar` | *(sin body)*                                                             | `200 { estado: "CANCELADA" }`                     | `403/404` no pertenece o no existe; `409` ya no estaba abierta                        |
| GET    | `/api/v1/solicitudes/mias`          | —                                                                        | `200 [ { id, estado, ... } ]` *(puede ser vacío)* | `401` sin rol Cliente                                                                 |
| GET    | `/api/v1/solicitudes/mias/{id}`     | —                                                                        | `200 { ...detalle }`                              | `404` inexistente o ajena (sin distinguir causa)                                      |

Todos los endpoints restringidos a rol CLIENTE mediante el filtro de autorización por rol de SPEC-01 (T018).

## Testing Strategy

- **Arquitectura**: comprobar `Service implements UseCase`, constructores de entrada con interfaces, ausencia de Spring/JPA/HTTP en dominio/aplicación, mappers separados y transacciones verificadas con PostgreSQL cuando aplique.

- **Contract tests**: uno por endpoint de la tabla anterior.
- **Integration tests**: uno por Acceptance Scenario del SPEC (16 escenarios en total entre las 3 historias), con Testcontainers.
- **Unit tests**: validación de datos obligatorios al publicar, lógica de "estado abierto" para editar/cancelar, idempotencia ante reintento por pérdida de conexión.

## Project Structure

```text
backend/src/main/java/com/aliado/
├── catalogo/
│   ├── domain/
│   │   ├── model/
│   │   │   CategoriaServicio, Zona
│   │   └── repository/
│   │       CategoriaServicioRepository, ZonaRepository
│   ├── application/
│   │   ├── usecase/
│   │   │   ConsultarCategoriasUseCase, ConsultarZonasUseCase
│   │   ├── service/
│   │   │   ConsultarCategoriasService, ConsultarZonasService
│   │   ├── dto/
│   │   │   Command/Query/Result de las operaciones del módulo (sin HTTP/JPA)
│   │   └── port/
│   │       ArchivoStorageService (contrato compartido)
│   └── infrastructure/
│       ├── persistence/
│       │   ├── entity/
│       │   │   CategoriaServicioEntity, ZonaEntity
│       │   ├── mapper/
│       │   │   CategoriaServicioMapper, ZonaMapper
│       │   ├── jpa/
│       │   │   CategoriaServicioJpaRepository, ZonaJpaRepository
│       │   └── adapter/
│       │       CategoriaServicioPersistenceAdapter, ZonaPersistenceAdapter
│       └── adapter/
│           Adaptadores de puertos requeridos; reutilizar contratos existentes
└── solicitudes/
    ├── domain/
    │   ├── model/
    │   │   Solicitud, FotoSolicitud, HistorialEstadoSolicitud
    │   └── repository/
    │       SolicitudRepository, FotoSolicitudRepository, HistorialEstadoSolicitudRepository
    ├── application/
    │   ├── usecase/
    │   │   CrearSolicitudUseCase, EditarSolicitudUseCase, CancelarSolicitudUseCase, ListarSolicitudesPropiasUseCase,
    │   │   ConsultarSolicitudPropiaUseCase
    │   ├── service/
    │   │   CrearSolicitudService, EditarSolicitudService, CancelarSolicitudService, ListarSolicitudesPropiasService,
    │   │   ConsultarSolicitudPropiaService
    │   ├── dto/
    │   │   Command/Query/Result de las operaciones del módulo (sin HTTP/JPA)
    │   └── port/
    │       ArchivoStorageService (contrato compartido)
    ├── infrastructure/
    │   ├── persistence/
    │   │   ├── entity/
    │   │   │   SolicitudEntity, FotoSolicitudEntity, HistorialEstadoSolicitudEntity
    │   │   ├── mapper/
    │   │   │   SolicitudMapper, FotoSolicitudMapper, HistorialEstadoSolicitudMapper
    │   │   ├── jpa/
    │   │   │   SolicitudJpaRepository, FotoSolicitudJpaRepository, HistorialEstadoSolicitudJpaRepository
    │   │   └── adapter/
    │   │       SolicitudPersistenceAdapter, FotoSolicitudPersistenceAdapter, HistorialEstadoSolicitudPersistenceAdapter
    │   └── adapter/
    │       Adaptadores de puertos requeridos; reutilizar contratos existentes
    └── presentation/
        ├── controller/
        │   SolicitudController
        ├── dto/
        │   Request/Response HTTP según API Contracts
        └── mapper/
            Conversión HTTP ↔ Command/Query/Result
```

**Contrato de arquitectura**: cada operación tiene una interfaz `application/usecase/*UseCase` y una implementación `application/service/*Service implements *UseCase`. Controllers, filtros, gateways y workers inyectan las interfaces por constructor; no servicios concretos ni repositorios JPA. Los servicios coordinan dominio y puertos sin importar Spring, JPA o HTTP. Dominio contiene modelos, reglas, excepciones de negocio y repositorios propios; infraestructura implementa los puertos y configura transacciones. Los DTO HTTP y sus mappers pertenecen a presentación; Command/Query/Result de aplicación son independientes del transporte.

Los contratos entre módulos son interfaces públicas de aplicación; no se accede a Service concreto, repositorio interno o entidad JPA de otro módulo. Cuando se requiera persistencia se separan `domain/repository`, `infrastructure/persistence/entity`, `mapper`, `jpa` y `adapter`. La configuración de Spring conecta puertos y adaptadores, y conserva la transacción completa del caso de uso. Solo crear clases/carpetas con responsabilidad real. `common` contiene infraestructura/contratos transversales acotados; el contexto de Spring Security no entra a aplicación. `SesionAutenticada` es contrato puro en `auth/application/port`; generación aleatoria segura del token y huella SHA-256 son responsabilidades separadas.

### Interfaces de entrada e implementaciones

| Módulo | UseCase (interfaz) | Service (implementación) |
|---|---|---|
| `catalogo` | `ConsultarCategoriasUseCase` | `ConsultarCategoriasService` |
| `catalogo` | `ConsultarZonasUseCase` | `ConsultarZonasService` |
| `solicitudes` | `CrearSolicitudUseCase` | `CrearSolicitudService` |
| `solicitudes` | `EditarSolicitudUseCase` | `EditarSolicitudService` |
| `solicitudes` | `CancelarSolicitudUseCase` | `CancelarSolicitudService` |
| `solicitudes` | `ListarSolicitudesPropiasUseCase` | `ListarSolicitudesPropiasService` |
| `solicitudes` | `ConsultarSolicitudPropiaUseCase` | `ConsultarSolicitudPropiaService` |

Puertos de salida: ArchivoStorageService y consultas de catálogo; notificaciones por interfaz del módulo propietario. Las interfaces de entrada no crean endpoints nuevos; mantener API Contracts y las condiciones Could/Future. Las tareas existentes conservan IDs, historias, dependencias y orden: los nombres de servicio agrupado de origen se descomponen en estas operaciones, sin añadir tareas funcionales.

Persistencia de referencia: `categorias_servicio`, `zonas`, `solicitudes`, `fotos_solicitud`, `historial_estado_solicitud`. El [manual entregado](../../tasks/fuentes/manual-base-de-datos-aliado.md) detalla el modelo MVP; no implica que los scripts V1–V6 ya estén disponibles o ejecutados.

**Structure Decision**: se mantiene el patrón modular por funcionalidad de SPEC-01 (`solicitudes/` sigue la misma organización en capas que `auth/`). Se introduce `catalogo/` como módulo de datos de referencia — no es un módulo de negocio propio, sino un catálogo compartido para `CategoriaServicio` y `Zona`, conceptos que tanto este SPEC como SPEC-05 (categorías/zonas del Prestador) y SPEC-06 (criterios de compatibilidad) necesitan sin duplicar su definición. El contrato `ArchivoStorageService` se ubica en `common/storage/` porque SPEC-05 también lo necesitará para el portafolio de servicios.

---

## Phase 1: Setup

- [ ] T001 Crear el paquete `catalogo/` (`domain/model`, `domain/repository` y adaptadores de persistencia) y el paquete `solicitudes/` con interfaces UseCase, implementaciones Service y puertos/adaptadores de Arquitectura Limpia (según Project Structure)
- [ ] T002 Migración Flyway: tablas `categorias_servicio`, `zonas`, `solicitudes`, `fotos_solicitud`, `historial_estado_solicitud`

---

## Phase 2: Foundational

- [ ] T003 Modelos `CategoriaServicio` y `Zona` (catálogo compartido) - `catalogo/domain/model`
- [ ] T004 `CategoriaServicioRepository`, `ZonaRepository` - `catalogo/domain/repository`
- [ ] T005 Seed inicial de categorías y zonas vía migración Flyway.
- [ ] T006 Definir interfaz `ArchivoStorageService` (contrato para subir/asociar archivos, reutilizable por el portafolio de SPEC-05) - `common/storage` 

**Checkpoint**: catálogo compartido y contrato de almacenamiento listos. A partir de aquí pueden implementarse las historias de usuario de este plan, y queda disponible la base para SPEC-05/SPEC-06.

---

## Phase 3: User Story 1 - Publicar una solicitud de servicio [UC016, UC017, UC018, UC019] (Priority: P1)

**Goal**: un Cliente puede crear una solicitud con categoría, zona y urgencia obligatorios, fotos opcionales, y decidir publicarla o conservarla como borrador.

**Independent Test**: publicar sin fotos, repetir adjuntando una foto, repetir conservando como borrador; verificar que cada camino produce el estado correcto sin duplicar el registro.

### Tests

- [ ] T007 [P] [US1] Contract test `POST /solicitudes` (201, 400) — `tests/contract/test_solicitudes_crear.java`
- [ ] T008 [P] [US1] Integration test: publicación completa, falta zona/urgencia, con/sin fotos, guardar como borrador, pérdida de conexión (no duplica), actor no autorizado — `tests/integration/test_publicar_solicitud.java`

### Implementation

- [ ] T009 [P] [US1] Modelos `Solicitud`, `FotoSolicitud` — `solicitudes/domain/model` (depends on T003)
- [ ] T010 [US1] `SolicitudRepository`, `FotoSolicitudRepository` — `solicitudes/domain/repository`
- [ ] T011 [US1] `CrearSolicitudUseCase.ejecutar()`: valida categoría, zona y urgencia obligatorios (FR-017), asocia fotos opcionales vía `ArchivoStorageService` (FR-016), decide estado BORRADOR/PUBLICADA (FR-019), idempotente ante reintento por pérdida de conexión (depends on T009, T010, T006)
- [ ] T012 [US1] Endpoint `POST /api/v1/solicitudes` restringido a rol CLIENTE (reutiliza filtro de SPEC-01 T018) — `solicitudes/presentation/controller`
- [ ] T013 [US1] Registrar entrada inicial en `HistorialEstadoSolicitud` al crear (depends on T011)

**Checkpoint**: un Cliente puede publicar o guardar como borrador una solicitud completa de forma independiente.

---

## Phase 4: User Story 2 - Gestionar una solicitud abierta [UC020, UC021] (Priority: P1)

**Goal**: el Cliente puede editar o cancelar una solicitud propia mientras esté abierta.

**Independent Test**: editar un campo de una solicitud abierta y verificar el cambio; cancelar otra y verificar que deja de ser visible; repetir ambas sobre una solicitud ya cerrada y verificar el rechazo.

### Tests

- [ ] T014 [P] [US2] Contract test `PUT /solicitudes/{id}`, `POST /solicitudes/{id}/cancelar` (200, 400, 403, 404, 409) - `tests/contract/test_solicitudes_gestionar.java`
- [ ] T015 [P] [US2] Integration test: editar abierta, editar ya cerrada (rechazo), cancelar abierta, cancelar ya cancelada (rechazo), solicitud ajena/no autorizado - `tests/integration/test_gestionar_solicitud.java`

### Implementation

- [ ] T016 [US2] `EditarSolicitudUseCase.ejecutar()`: valida estado abierto (BORRADOR/PUBLICADA) y propiedad, rechaza en caso contrario (FR-020) (depends on T010)
- [ ] T017 [US2] `CancelarSolicitudUseCase.ejecutar()`: valida estado abierto y propiedad, transiciona a CANCELADA, registra en historial (FR-021) (depends on T010, T013)
- [ ] T018 [US2] Endpoints `PUT /api/v1/solicitudes/{id}`, `POST /api/v1/solicitudes/{id}/cancelar` - `solicitudes/presentation/controller`
- [ ] T019 [US2] Bloqueo de edición/cancelación sobre solicitudes en estado CONTRATADA 

**Checkpoint**: el Cliente solo puede editar/cancelar sus propias solicitudes abiertas.

---

## Phase 5: User Story 3 - Consultar mis solicitudes [UC022, UC023] (Priority: P1)

**Goal**: el Cliente puede listar sus solicitudes y ver el detalle y estado de cada una.

**Independent Test**: con dos solicitudes propias en distintos estados, listar y verificar que aparecen solo las propias; abrir el detalle de una y verificar que refleja su estado actual.

### Tests

- [ ] T020 [P] [US3] Contract test `GET /solicitudes/mias`, `GET /solicitudes/mias/{id}` (200, 404) - `tests/contract/test_solicitudes_consultar.java`
- [ ] T021 [P] [US3] Integration test: listar propias (no ajenas), lista vacía, detalle propio, detalle inexistente/ajeno sin revelar la causa, no autorizado- `tests/integration/test_consultar_solicitudes.java`

### Implementation

- [ ] T022 [US3] ListarSolicitudesPropiasUseCase y ConsultarSolicitudPropiaUseCase con sus Service: filtrar por propietario y unificar respuesta de recurso inexistente/ajeno (FR-022, FR-023) (depends on T010).
- [ ] T023 [US3] Endpoints `GET /api/v1/solicitudes/mias`, `GET /api/v1/solicitudes/mias/{id}` - `solicitudes/presentation/controller`

**Checkpoint**: el Cliente tiene visibilidad completa de sus propias solicitudes.

---

## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F04-FE-01** Formulario de categoría, descripción, zona y urgencia; fotos opcionales con progreso, límites y errores reales.
- [ ] **F04-FE-02** Guardar borrador, retomar, publicar y confirmar cancelación; conservar datos locales transitorios ante pérdida de conexión.
- [ ] **F04-FE-03** Lista y detalle de solicitudes propias con estado e historial visible cuando esté previsto por el contrato.
- [ ] **F04-FE-04** Reutilizar Idempotency-Key al reintentar el mismo envío y renovarla para una nueva intención; no declarar éxito antes del servidor.

Aplicar [estados y contrato de cliente](../../tasks/01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación de la feature

- [ ] **F04-QA-01** Publicar sin fotos y rechazar publicación sin zona/urgencia; borrador nunca visible en oportunidades.
- [ ] **F04-QA-02** Reintentar tras timeout y recargar: una solicitud, un historial y fotos asociadas.
- [ ] **F04-QA-03** Validar firma MIME, propiedad de archivos y compensación si storage falla después de cargar.
- [ ] **F04-QA-04** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Dependencies & Execution Order

- **Setup (Phase 1)** → depende de SPEC-01 completo (auth, roles, manejo de errores).
- **Foundational (Phase 2)** → bloquea Phases 3-5 de este plan, y es prerrequisito para el catálogo y el almacenamiento que SPEC-05 y SPEC-06 reutilizarán.
- **User Story 1 (Phase 3)** → depende de Foundational.
- **User Story 2 (Phase 4)** → depende de User Story 1 (requiere solicitudes ya creadas).
- **User Story 3 (Phase 5)** → depende de User Story 1; puede avanzar en paralelo a User Story 2.

## Notes

- Este plan introduce infraestructura compartida (`CategoriaServicio`, `Zona`, `ArchivoStorageService`) que SPEC-05 y SPEC-06 deben reutilizar, no volver a crear.
- Pendientes de aclaración: seed de categorías/zonas, proveedor de almacenamiento de archivos, definición completa de los estados futuros de `Solicitud` (en particular CONTRATADA), y quién administra el catálogo de categorías/zonas (probablemente un SPEC de Administración aún no entregado).
