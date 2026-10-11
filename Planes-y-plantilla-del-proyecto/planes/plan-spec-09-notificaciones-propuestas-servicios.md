# Implementation Plan: SPEC-09

**Date**: 2026-10-02
**Spec**: [spec-09-notificaciones-propuestas-servicios](FASE-4-Prototipar/specs/spec-09-notificaciones-propuestas-servicios)
**Depends on**: `plan-spec-01-autenticacion.md` (roles Cliente/Prestador), `plan-spec-08-contratacion-ciclo-servicio.md` (eventos de aceptación de propuesta y de cada transición de estado del servicio, que este plan debe enganchar sin modificarlos)

## Summary

SPEC-09 cubre dos tipos de notificación automática, siempre disparadas por un evento real y nunca como acción independiente: la aceptación de una propuesta (hacia el Prestador) y los cambios de estado del servicio contratado (hacia la contraparte de quien ejecuta la transición). A diferencia de SPEC-06 y SPEC-07, que persistieron cada una su propio tipo de notificación de forma puntual, este SPEC describe explícitamente un actor "Proveedor de notificaciones" y un "Canal de entrega", lo que indica una infraestructura de notificación genérica. Este plan la introduce para los dos tipos que cubre este SPEC, y deja explícita la inconsistencia frente a lo ya construido en SPEC-06/SPEC-07 (ver Notes) en lugar de refactorizarlo sin que el usuario lo pida.

## Technical Context

**Language/Version**: Java 21 (LTS) — reutilizado de SPEC-01
**Primary Dependencies**: Spring Boot 3.3.x (Web, Data JPA, Validation), Flyway — reutilizados de SPEC-01
**Build tool**: Maven
**Storage**: PostgreSQL 16 — nuevas tablas de este módulo
**Testing**: JUnit 5 + Mockito, Spring Boot Test + Testcontainers (PostgreSQL), MockMvc/WebTestClient — reutilizados de SPEC-01
**Target Platform**: VPS Hostinger (Docker Compose) — reutilizado de SPEC-01
**Project Type**: Web + Mobile (backend único) — reutilizado de SPEC-01
**Performance Goals**: sin metas específicas nuevas de este SPEC
**Constraints**: RNF-007 (notificaciones en tiempo casi real), RNF-006 (no duplicar avisos ante fallas y reintentos del canal de entrega)
**Scale/Scope**: ~50–100 Prestadores, ~200–500 Clientes (piloto) — reutilizado de SPEC-01

## Data Model

| Entidad | Campos clave |
|---|---|
| `Notificacion` | `id`, `destinatarioId` (FK Usuario), `tipo` (ACEPTACION_PROPUESTA, CAMBIO_ESTADO_SERVICIO), `servicioId` (FK `ServicioContratado` de SPEC-08), `detalle` (ej. nuevo estado), `estadoEntrega` (PENDIENTE, ENTREGADA, FALLIDA), `fechaGeneracion`, `fechaEntrega` |

Restricción de unicidad: `(tipo, servicioId, destinatarioId, detalle)` o equivalente que identifique el evento de origen de forma única — garantiza que un reintento de entrega no cree una segunda fila (SC-003), solo actualice `estadoEntrega`/`fechaEntrega` de la fila existente.




## API Contracts

| Método | Endpoint | Request body | Respuesta éxito | Errores |
|---|---|---|---|---|
| GET | `/api/v1/notificaciones` | — | `200 [ { tipo, servicioId, detalle, estadoEntrega, fechaGeneracion }, ... ]` *(propias del actor autenticado)* | `401` sin sesión |

No se expone ningún endpoint de creación: por diseño (FR del SPEC exige que una notificación nunca se genere sin un evento real asociado), `Notificacion` solo se crea internamente desde `ServicioService` de SPEC-08, nunca a través de la API pública. Esto es lo que garantiza SC-004 a nivel de contrato, no solo de validación de negocio.

## Testing Strategy

- **Contract tests**: el único endpoint de la tabla anterior, más una verificación explícita de que no existe ruta de creación pública.
- **Integration tests**: uno por Acceptance Scenario del SPEC (7 escenarios entre las 2 historias), con Testcontainers, incluyendo falla simulada del canal de entrega (el evento permanece consultable y no se duplica al reintentar) y el intento de generar una notificación sin evento real (debe ser imposible, no solo rechazado).
- **Unit tests**: `NotificacionService.notificar()` no crea una segunda fila para el mismo evento (unicidad), `CanalEntregaNotificacion` reintenta sin duplicar, disparo exclusivo desde los puntos de extensión de `ServicioService` (SPEC-08).

## Project Structure

```text
backend/src/main/java/com/aliado/
├── auth/              # SPEC-01 (reutilizado)
├── servicios/         # SPEC-08 (reutilizado — ServicioContratado, puntos de extensión de aceptación y transición)
├── notificaciones/    # nuevo
│   ├── controller/    NotificacionController
│   ├── service/       NotificacionService, CanalEntregaNotificacion (interfaz + implementación mínima)
│   ├── repository/    NotificacionRepository
│   └── model/         Notificacion
└── common/            # SPEC-01/SPEC-04 (reutilizado)
```

**Structure Decision**: se introduce `notificaciones/` como módulo genérico, en vez de repetir el patrón puntual de `NotificacionOportunidad` (SPEC-06) y `NotificacionPropuestaRecibida` (SPEC-07). `NotificacionService.notificar()` se invoca directamente desde `ServicioService` (SPEC-08) en el mismo método que ejecuta la aceptación de propuesta (T008 de SPEC-08) y cada transición de estado (T018-T021 de SPEC-08), dentro de la misma transacción, para que el evento de dominio y el registro de notificación sean atómicos — así se cumple el edge case de "el evento permanece consultable y no se duplica" incluso si el canal de entrega externo falla después. `CanalEntregaNotificacion` queda como interfaz separada de `NotificacionService` para que la lógica de negocio (qué notificar, a quién, una sola vez) no dependa del mecanismo real de entrega, que queda pendiente de definir.

---

## Phase 1: Setup

- [ ] T001 Crear el paquete `notificaciones/` con sus subcarpetas en capas
- [ ] T002 Migración Flyway: tabla `notificaciones` con restricción de unicidad `(tipo, servicio_id, destinatario_id, detalle)`

---

## Phase 2: Foundational

- [ ] T003 Definir interfaz `CanalEntregaNotificacion` (contrato de entrega, con una implementación mínima que registra el intento sin proveedor externo real) — `notificaciones/service` 
- [ ] T004 `NotificacionService.notificar(destinatarioId, tipo, servicioId, detalle)`: crea una `Notificacion` solo si no existe ya una fila con la misma clave de unicidad (idempotencia ante reintentos), delega la entrega a `CanalEntregaNotificacion` sin bloquear la transacción de origen (depends on T003)

**Checkpoint**: el mecanismo genérico de notificación está listo para que SPEC-08 lo invoque desde sus puntos de extensión.

---

## Phase 3: User Story 1 - Notificar la aceptación de una propuesta [UC057] (Priority: P1)

**Goal**: el Prestador es notificado automáticamente cuando su propuesta es aceptada.

**Independent Test**: aceptar una propuesta (SPEC-08) y verificar que el Prestador recibe la notificación; simular una falla en el canal y verificar que el evento sigue consultable sin duplicar el aviso al recuperarse.

### Tests

- [ ] T005 [P] [US1] Contract test `GET /notificaciones` filtrando tipo ACEPTACION_PROPUESTA (200) — `tests/contract/test_notificacion_aceptacion.java`
- [ ] T006 [P] [US1] Integration test: notificación disparada por aceptación real, falla de canal seguida de recuperación sin duplicado, intento de generar notificación de aceptación sin una aceptación real (debe ser imposible porque no existe endpoint de creación) — `tests/integration/test_notificar_aceptacion.java`

### Implementation

- [ ] T007 [P] [US1] Modelo `Notificacion` — `notificaciones/model`
- [ ] T008 [US1] `NotificacionRepository` — `notificaciones/repository`
- [ ] T009 [US1] Enganchar `NotificacionService.notificar()` dentro de `ServicioService.aceptarPropuesta()` (T008 de SPEC-08), notificando al Prestador cuya propuesta fue aceptada (FR-057) (depends on T004, T008, dependencia externa: `ServicioService.aceptarPropuesta()` de SPEC-08 — modificación mínima de ese método para invocar el punto de extensión, sin alterar su lógica transaccional ya probada)
- [ ] T010 [US1] Endpoint `GET /api/v1/notificaciones` (propias del actor autenticado) — `notificaciones/controller`

**Checkpoint**: el Prestador recibe notificación automática de aceptación, sin que ningún actor deba solicitarla.

---

## Phase 4: User Story 2 - Notificar cambios de estado del servicio [UC058] (Priority: P1)

**Goal**: la contraparte del servicio es notificada automáticamente ante cada transición de estado.

**Independent Test**: marcar en ejecución y verificar que el Cliente es notificado; repetir para terminado, confirmación de finalización y cancelación, verificando que se notifica a la contraparte de quien ejecutó la acción.

### Tests

- [ ] T011 [P] [US2] Contract test `GET /notificaciones` filtrando tipo CAMBIO_ESTADO_SERVICIO (200) — `tests/contract/test_notificacion_cambio_estado.java`
- [ ] T012 [P] [US2] Integration test: notificación por transición del Prestador (en ejecución, terminado) hacia el Cliente, notificación por transición del Cliente (confirmar finalización) hacia el Prestador, notificación por cancelación (de cualquiera de las dos partes) hacia la contraparte, falla de canal seguida de recuperación sin duplicado — `tests/integration/test_notificar_cambio_estado.java`

### Implementation

- [ ] T013 [US2] Enganchar `NotificacionService.notificar()` dentro de `ServicioService.marcarEnEjecucion()`, `marcarTerminado()`, `confirmarFinalizacion()` y `cancelar()` (T018-T021 de SPEC-08), notificando en cada caso a la contraparte de quien ejecutó la transición (FR-058) (depends on T004, T008, dependencia externa: esos cuatro métodos de `ServicioService` de SPEC-08)

**Checkpoint**: ambas partes del servicio quedan siempre informadas de los cambios de estado que no ejecutaron ellas mismas.

---

## Dependencies & Execution Order

- **Setup (Phase 1)** → depende de SPEC-01 y SPEC-08 ya completos.
- **Foundational (Phase 2)** → bloquea Phases 3-4 de este plan.
- **User Story 1 (Phase 3)** → depende de Foundational. Requiere modificar `ServicioService.aceptarPropuesta()` de SPEC-08 para invocar el punto de extensión.
- **User Story 2 (Phase 4)** → depende de Foundational; puede avanzar en paralelo a User Story 1. Requiere modificar los cuatro métodos de transición de `ServicioService` de SPEC-08.

## Notes

- **Inconsistencia arquitectónica pendiente de decisión explícita** (no resuelta unilateralmente por este plan): SPEC-06 (`NotificacionOportunidad`) y SPEC-07 (`NotificacionPropuestaRecibida`) persisten cada uno su propio tipo de notificación de forma puntual, mientras que este plan introduce `notificaciones/` como módulo genérico para los dos tipos que cubre SPEC-09. El equipo debe decidir si migra las notificaciones de SPEC-06/SPEC-07 a este modelo genérico en una iteración posterior, o si el sistema queda con dos patrones de notificación coexistiendo. Este plan no modifica SPEC-06 ni SPEC-07 para no alterar arquitectura ya establecida sin instrucción explícita.
- Este plan modifica mínimamente cuatro métodos ya implementados en `plan-spec-08-contratacion-ciclo-servicio.md` (T008, T018, T019, T020, T021) para invocar `NotificacionService.notificar()`. Esa modificación debe hacerse como un punto de extensión (ej. una línea de llamada al final del método, dentro de la misma transacción), no como una reescritura de la lógica ya probada de SPEC-08.
- Pendiente de aclaración real: mecanismo concreto de `CanalEntregaNotificacion` (push, SMS, correo) y si el actor "Proveedor de notificaciones" es un servicio externo a integrar — ninguna fuente entregada lo define.
