# Implementation Plan: SPEC-04

**Date**: 2026-10-02
**Spec**: [spec-04-gestion-solicitudes-servicio](FASE-4-Prototipar/specs/spec-04-gestion-solicitudes-servicio)

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

- **Contract tests**: uno por endpoint de la tabla anterior.
- **Integration tests**: uno por Acceptance Scenario del SPEC (16 escenarios en total entre las 3 historias), con Testcontainers.
- **Unit tests**: validación de datos obligatorios al publicar, lógica de "estado abierto" para editar/cancelar, idempotencia ante reintento por pérdida de conexión.

## Project Structure

```text
backend/src/main/java/com/aliado/
├── auth/            # SPEC-01 (reutilizado, sin cambios)
├── catalogo/        # nuevo — compartido, reutilizable por SPEC-05 y SPEC-06
│   ├── model/       CategoriaServicio, Zona
│   └── repository/  CategoriaServicioRepository, ZonaRepository
├── solicitudes/     # nuevo
│   ├── controller/  SolicitudController
│   ├── service/     SolicitudService
│   ├── repository/  SolicitudRepository, FotoSolicitudRepository, HistorialEstadoSolicitudRepository
│   └── model/       Solicitud, FotoSolicitud, HistorialEstadoSolicitud
└── common/          # SPEC-01 (reutilizado)
    ├── config/
    ├── security/
    ├── exception/
    └── storage/     ArchivoStorageService (interfaz, nuevo)
```

**Structure Decision**: se mantiene el patrón modular por funcionalidad de SPEC-01 (`solicitudes/` sigue la misma organización en capas que `auth/`). Se introduce `catalogo/` como módulo de datos de referencia — no es un módulo de negocio propio, sino un catálogo compartido para `CategoriaServicio` y `Zona`, conceptos que tanto este SPEC como SPEC-05 (categorías/zonas del Prestador) y SPEC-06 (criterios de compatibilidad) necesitan sin duplicar su definición. El contrato `ArchivoStorageService` se ubica en `common/storage/` porque SPEC-05 también lo necesitará para el portafolio de servicios.

---

## Phase 1: Setup

- [ ] T001 Crear el paquete `catalogo/` (model, repository) y el paquete `solicitudes/` con sus subcarpetas en capas
- [ ] T002 Migración Flyway: tablas `categorias_servicio`, `zonas`, `solicitudes`, `fotos_solicitud`, `historial_estado_solicitud`

---

## Phase 2: Foundational

- [ ] T003 Modelos `CategoriaServicio` y `Zona` (catálogo compartido) - `catalogo/model`
- [ ] T004 `CategoriaServicioRepository`, `ZonaRepository` - `catalogo/repository`
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

- [ ] T009 [P] [US1] Modelos `Solicitud`, `FotoSolicitud` — `solicitudes/model` (depends on T003)
- [ ] T010 [US1] `SolicitudRepository`, `FotoSolicitudRepository` — `solicitudes/repository`
- [ ] T011 [US1] `SolicitudService.crear()`: valida categoría, zona y urgencia obligatorios (FR-017), asocia fotos opcionales vía `ArchivoStorageService` (FR-016), decide estado BORRADOR/PUBLICADA (FR-019), idempotente ante reintento por pérdida de conexión (depends on T009, T010, T006)
- [ ] T012 [US1] Endpoint `POST /api/v1/solicitudes` restringido a rol CLIENTE (reutiliza filtro de SPEC-01 T018) — `solicitudes/controller`
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

- [ ] T016 [US2] `SolicitudService.editar()`: valida estado abierto (BORRADOR/PUBLICADA) y propiedad, rechaza en caso contrario (FR-020) (depends on T010)
- [ ] T017 [US2] `SolicitudService.cancelar()`: valida estado abierto y propiedad, transiciona a CANCELADA, registra en historial (FR-021) (depends on T010, T013)
- [ ] T018 [US2] Endpoints `PUT /api/v1/solicitudes/{id}`, `POST /api/v1/solicitudes/{id}/cancelar` - `solicitudes/controller`
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

- [ ] T022 [US3] `SolicitudService.listarPorCliente()`, `obtenerDetalle()`: filtra por propietario; el detalle unifica la respuesta para solicitud inexistente o ajena (FR-022, FR-023) (depends on T010)
- [ ] T023 [US3] Endpoints `GET /api/v1/solicitudes/mias`, `GET /api/v1/solicitudes/mias/{id}` - `solicitudes/controller`

**Checkpoint**: el Cliente tiene visibilidad completa de sus propias solicitudes.

---

## Dependencies & Execution Order

- **Setup (Phase 1)** → depende de SPEC-01 completo (auth, roles, manejo de errores).
- **Foundational (Phase 2)** → bloquea Phases 3-5 de este plan, y es prerrequisito para el catálogo y el almacenamiento que SPEC-05 y SPEC-06 reutilizarán.
- **User Story 1 (Phase 3)** → depende de Foundational.
- **User Story 2 (Phase 4)** → depende de User Story 1 (requiere solicitudes ya creadas).
- **User Story 3 (Phase 5)** → depende de User Story 1; puede avanzar en paralelo a User Story 2.

## Notes

- Este plan introduce infraestructura compartida (`CategoriaServicio`, `Zona`, `ArchivoStorageService`) que SPEC-05 y SPEC-06 deben reutilizar, no volver a crear.
- Pendientes de aclaración: seed de categorías/zonas, proveedor de almacenamiento de archivos, definición completa de los estados futuros de `Solicitud` (en particular CONTRATADA), y quién administra el catálogo de categorías/zonas (probablemente un SPEC de Administración aún no entregado).
