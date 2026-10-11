# Implementation Plan: SPEC-07

**Date**: 2026-10-02
**Spec**: [spec-07-creacion-gestion-propuestas](FASE-4-Prototipar/specs/spec-07-creacion-gestion-propuestas)
**Depends on**: `plan-spec-01-autenticacion.md` (rol Prestador autenticado, interceptor de autorización), `plan-spec-04-gestion-solicitudes-servicio.md` (`Solicitud` — una propuesta se vincula a una solicitud abierta), `plan-spec-06-compatibilidad-oportunidades.md` (`CompatibilidadService` — una propuesta solo puede crearse sobre una solicitud compatible con el perfil del Prestador)

## Summary

SPEC-07 cubre la creación, edición y retiro de propuestas que un Prestador hace sobre una solicitud publicada, y la notificación automática al Cliente cuando recibe una nueva propuesta. Es el primer plan que convierte una oportunidad (SPEC-06) en un compromiso potencial, y su entidad `Propuesta` es la que SPEC-08 usará para registrar la contratación.

## Technical Context

**Language/Version**: Java 21 (LTS) - reutilizado de SPEC-01
**Primary Dependencies**: Spring Boot 3.3.x (Web, Data JPA, Validation), Flyway - reutilizados de SPEC-01
**Build tool**: Maven
**Storage**: PostgreSQL 16 - nuevas tablas de este módulo
**Testing**: JUnit 5 + Mockito, Spring Boot Test + Testcontainers (PostgreSQL), MockMvc/WebTestClient - reutilizados de SPEC-01
**Target Platform**: VPS Hostinger (Docker Compose) - reutilizado de SPEC-01
**Project Type**: Web + Mobile (backend único) - reutilizado de SPEC-01
**Performance Goals**: sin metas específicas nuevas de este SPEC
**Constraints**: RNF-006 (integridad transaccional - creación de propuesta + notificación en una sola operación consistente), RNF-007 (notificación casi en tiempo real)
**Scale/Scope**: ~50–100 Prestadores, ~200–500 Clientes (piloto) - reutilizado de SPEC-01

## Data Model

| Entidad | Campos clave |
|---|---|
| `Propuesta` | `id`, `solicitudId` (FK `Solicitud` de SPEC-04), `prestadorId` (FK Usuario), `disponibilidad`, `mensaje` (nullable), `estado` (ACTIVA, RETIRADA, ACEPTADA, CERRADA), `fechaCreacion`, `fechaActualizacion` |
| `NotificacionPropuestaRecibida` | `id`, `clienteId` (FK Usuario), `propuestaId` (FK Propuesta), `fechaGeneracion` |

Relaciones: `Solicitud` (SPEC-04) 1—N `Propuesta`, `Usuario` (Prestador) 1—N `Propuesta`, `Propuesta` 1—1 `NotificacionPropuestaRecibida`.


## API Contracts

| Método | Endpoint | Request body | Respuesta éxito | Errores |
|---|---|---|---|---|
| POST | `/api/v1/propuestas` | `{ solicitudId, disponibilidad, mensaje? }` | `201 { id, estado: "ACTIVA" }` | `400` falta disponibilidad; `404` solicitud inexistente; `409` solicitud no abierta o no compatible |
| PUT | `/api/v1/propuestas/{id}` | `{ disponibilidad?, mensaje? }` | `200 { id, estado }` | `403/404` no pertenece o no existe; `409` propuesta ya no activa |
| POST | `/api/v1/propuestas/{id}/retirar` | — | `200 { estado: "RETIRADA" }` | `403/404` no pertenece o no existe; `409` propuesta ya no activa |

Todos los endpoints restringidos a rol PRESTADOR mediante el filtro de autorización por rol de SPEC-01 (T018). No se expone un endpoint de listado de "mis propuestas": el SPEC no lo exige (el Prestador llega al `id` de su propuesta desde la respuesta de creación o desde el tablero de SPEC-06); se deja anotado por si una fase posterior lo requiere.

## Testing Strategy

- **Contract tests**: uno por endpoint de la tabla anterior.
- **Integration tests**: uno por Acceptance Scenario del SPEC (9 escenarios entre las 3 historias), con Testcontainers, incluyendo el edge case de pérdida de conexión durante edición/retiro (no duplica ni deja estado ambiguo).
- **Unit tests**: validación de disponibilidad obligatoria, validación de solicitud abierta y compatible al crear (reutilizando `CompatibilidadService` de SPEC-06), transición de estado válida para editar/retirar.

## Project Structure

```text
backend/src/main/java/com/aliado/
├── auth/              # SPEC-01 (reutilizado)
├── solicitudes/       # SPEC-04 (reutilizado)
├── perfiles/          # SPEC-05 (reutilizado)
├── oportunidades/      # SPEC-06 (reutilizado — CompatibilidadService)
├── propuestas/        # nuevo
│   ├── controller/    PropuestaController
│   ├── service/       PropuestaService
│   ├── repository/    PropuestaRepository, NotificacionPropuestaRecibidaRepository
│   └── model/         Propuesta, NotificacionPropuestaRecibida
└── common/            # SPEC-01/SPEC-04 (reutilizado)
```

**Structure Decision**: se mantiene el patrón modular ya usado. `PropuestaService` reutiliza `CompatibilidadService` de SPEC-06 (inyectado) para validar que la solicitud sigue abierta y es compatible con el Prestador antes de crear la propuesta, en vez de duplicar esa lógica de verificación. `NotificacionPropuestaRecibida` se modela como entidad propia del módulo, siguiendo el mismo patrón puntual que `NotificacionOportunidad` de SPEC-06 — ver Notes sobre la inconsistencia que esto genera frente a SPEC-09.

---

## Phase 1: Setup

- [ ] T001 Crear el paquete `propuestas/` con sus subcarpetas en capas
- [ ] T002 Migración Flyway: tablas `propuestas`, `notificaciones_propuesta_recibida`

---

## Phase 2: Foundational

No se requieren tareas fundacionales nuevas: autenticación/roles (SPEC-01), `Solicitud` (SPEC-04) y `CompatibilidadService` (SPEC-06) ya existen y se consumen directamente.

**Checkpoint**: sin bloqueo adicional — las historias de usuario de este plan dependen funcionalmente de que SPEC-04 y SPEC-06 estén completos.

---

## Phase 3: User Story 1 - Crear una propuesta para una solicitud [UC039, UC040, UC041, UC044] (Priority: P1)

**Goal**: un Prestador crea una propuesta sobre una solicitud abierta y compatible, indicando disponibilidad obligatoria y mensaje opcional, y el Cliente es notificado automáticamente.

**Independent Test**: crear una propuesta con disponibilidad sin mensaje y verificar creación + notificación; repetir con mensaje; intentar sin disponibilidad y verificar rechazo.

### Tests

- [ ] T003 [P] [US1] Contract test `POST /propuestas` (201, 400, 404, 409) — `tests/contract/test_propuestas_crear.java`
- [ ] T004 [P] [US1] Integration test: creación completa con/sin mensaje, sin disponibilidad (rechazo), solicitud no abierta (rechazo), notificación generada al Cliente, actor no autorizado — `tests/integration/test_crear_propuesta.java`

### Implementation

- [ ] T005 [P] [US1] Modelos `Propuesta`, `NotificacionPropuestaRecibida` — `propuestas/model`
- [ ] T006 [US1] `PropuestaRepository`, `NotificacionPropuestaRecibidaRepository` — `propuestas/repository`
- [ ] T007 [US1] `PropuestaService.crear()`: valida disponibilidad obligatoria (FR-040), valida que la solicitud esté abierta y compatible reutilizando `CompatibilidadService.obtenerDetalle()` de SPEC-06 (FR-039), asocia mensaje opcional (FR-041), crea `Propuesta` en estado ACTIVA y la `NotificacionPropuestaRecibida` asociada en una sola transacción (FR-044, RNF-006) (depends on T005, T006, dependencia externa: `CompatibilidadService` de SPEC-06)
- [ ] T008 [US1] Endpoint `POST /api/v1/propuestas` restringido a rol PRESTADOR — `propuestas/controller`

**Checkpoint**: un Prestador puede crear una propuesta completa de forma independiente, y el Cliente queda notificado.

---

## Phase 4: User Story 2 - Editar una propuesta activa [UC042] (Priority: P1)

**Goal**: el Prestador puede editar disponibilidad o mensaje de una propuesta propia mientras esté activa.

**Independent Test**: editar un dato de una propuesta activa propia y verificar el cambio; intentar editar una ya retirada/aceptada/cerrada y verificar el rechazo.

### Tests

- [ ] T009 [P] [US2] Contract test `PUT /propuestas/{id}` (200, 403, 404, 409) — `tests/contract/test_propuestas_editar.java`
- [ ] T010 [P] [US2] Integration test: edición exitosa, edición de propuesta no activa (rechazo), propuesta ajena (rechazo), actor no autorizado, pérdida de conexión durante edición (edge case) — `tests/integration/test_editar_propuesta.java`

### Implementation

- [ ] T011 [US2] `PropuestaService.editar()`: valida propiedad y estado ACTIVA, rechaza en caso contrario (FR-042) (depends on T006)
- [ ] T012 [US2] Endpoint `PUT /api/v1/propuestas/{id}` — `propuestas/controller`

**Checkpoint**: el Prestador puede mantener actualizada una propuesta activa de forma independiente.

---

## Phase 5: User Story 3 - Retirar una propuesta [UC043] (Priority: P1)

**Goal**: el Prestador puede retirar una propuesta propia activa.

**Independent Test**: retirar una propuesta activa propia y verificar que deja de estar disponible para el Cliente; intentar retirarla de nuevo y verificar el rechazo.

### Tests

- [ ] T013 [P] [US3] Contract test `POST /propuestas/{id}/retirar` (200, 403, 404, 409) — `tests/contract/test_propuestas_retirar.java`
- [ ] T014 [P] [US3] Integration test: retiro exitoso, retiro de propuesta ya inactiva (rechazo), propuesta ajena (rechazo), actor no autorizado — `tests/integration/test_retirar_propuesta.java`

### Implementation

- [ ] T015 [US3] `PropuestaService.retirar()`: valida propiedad y estado ACTIVA, transiciona a RETIRADA, rechaza en caso contrario (FR-043); asegura que ninguna notificación de "propuesta nueva" se genere sobre una propuesta ya retirada (edge case del SPEC) (depends on T006)
- [ ] T016 [US3] Endpoint `POST /api/v1/propuestas/{id}/retirar` — `propuestas/controller`

**Checkpoint**: el Prestador puede retirar una propuesta que ya no puede cumplir, de forma independiente.

---

## Dependencies & Execution Order

- **Setup (Phase 1)** → depende de SPEC-01, SPEC-04 y SPEC-06 ya completos.
- **Foundational (Phase 2)** → no aplica como fase propia; funcionalmente este plan depende de SPEC-04 y SPEC-06.
- **User Story 1 (Phase 3)** → depende de Setup. Es prerrequisito de User Story 2 y 3 (requieren una propuesta ya creada).
- **User Story 2 (Phase 4)** → depende de User Story 1.
- **User Story 3 (Phase 5)** → depende de User Story 1; puede avanzar en paralelo a User Story 2.
- **Dependencia hacia adelante**: `plan-spec-08-contratacion-ciclo-servicio.md` (aún no escrito) dependerá de `Propuesta` (estado ACEPTADA, CERRADA) y de `PropuestaRepository` de este plan.

## Notes

- Este plan introduce `NotificacionPropuestaRecibida` como entidad puntual del módulo, siguiendo el mismo patrón que `NotificacionOportunidad` de SPEC-06 (cada módulo persiste su propio tipo de notificación). El SPEC-09 (Notificaciones de propuestas y servicios), que el usuario indicó que se entregará después de SPEC-08, describe un actor "Proveedor de notificaciones" y un "Canal de entrega" que sugieren una infraestructura de notificación genérica y compartida. **Esto es una inconsistencia arquitectónica real a resolver**: cuando se planee SPEC-09, debe decidirse explícitamente si `NotificacionOportunidad` (SPEC-06) y `NotificacionPropuestaRecibida` (este plan) se mantienen como están o se migran a la infraestructura genérica que SPEC-09 introduzca. Este plan no toma esa decisión por su cuenta para no modificar arbitrariamente lo ya construido en SPEC-06.
- Los estados ACEPTADA y CERRADA de `Propuesta` están reservados en el enum pero ninguna tarea de este plan los asigna: esa transición pertenece a SPEC-08 (aceptación de propuesta), que debe tratar `Propuesta` como entidad ya existente y no redefinirla.
