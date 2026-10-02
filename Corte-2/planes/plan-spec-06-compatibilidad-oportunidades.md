# Implementation Plan: SPEC-06

**Date**: 2026-10-02
**Spec**: [spec-06-compatibilidad-oportunidades](FASE-4-Prototipar/specs/spec-06-compatibilidad-oportunidades)

## Summary

SPEC-06 cubre el cálculo de compatibilidad entre solicitudes (SPEC-04) y perfiles de Prestador (SPEC-05), el tablero de oportunidades con filtros, la consulta de detalle de una oportunidad, y las notificaciones de nuevas oportunidades compatibles. No introduce entidades de negocio propias más allá de la representación de "oportunidad" y "notificación"; su lógica central es un servicio de cálculo que lee de `Solicitud` (SPEC-04) y `PerfilProfesional`/`Disponibilidad` (SPEC-05).

## Technical Context

**Language/Version**: Java 21 (LTS) — reutilizado de SPEC-01
**Primary Dependencies**: Spring Boot 3.3.x (Web, Data JPA, Validation), Flyway — reutilizados de SPEC-01. No se agregan dependencias de framework nuevas.
**Build tool**: Maven
**Storage**: PostgreSQL 16 — una tabla nueva para notificaciones; el cálculo de compatibilidad se realiza sobre `Solicitud`, `PerfilProfesional` y `Disponibilidad` ya existentes (SPEC-04/SPEC-05), sin tabla propia de "compatibilidad" (ver Data Model)
**Testing**: JUnit 5 + Mockito, Spring Boot Test + Testcontainers (PostgreSQL), MockMvc/WebTestClient — reutilizados de SPEC-01
**Target Platform**: VPS Hostinger (Docker Compose) — reutilizado de SPEC-01
**Project Type**: Web + Mobile (backend único) — reutilizado de SPEC-01
**Performance Goals**: RNF-003 (el tablero debe cargar en un tiempo que permita revisión ágil) — sin cifra numérica definida en los documentos entregados 
**Constraints**: RNF-003 (rendimiento del tablero), RNF-004 (no exponer datos privados del Cliente ni dirección exacta), RNF-007 (notificaciones en tiempo casi real), RNF-008 (escalabilidad del cálculo de compatibilidad)
**Scale/Scope**: ~50–100 Prestadores, ~200–500 Clientes (piloto) — reutilizado de SPEC-01

## Data Model

Este SPEC no agrega entidades persistentes de "oportunidad" ni de "criterio de compatibilidad": según sus propias Key Entities, una oportunidad es "una solicitud publicada por un Cliente vista desde la perspectiva de un Prestador compatible" — es decir, una proyección calculada de `Solicitud` (SPEC-04), no una tabla nueva.

| Entidad | Campos clave |
|---|---|
| `Solicitud` *(SPEC-04, reutilizada)* | usada como fuente de categoría, zona, urgencia, estado |
| `PerfilProfesional` *(SPEC-05, reutilizada)* | usada junto a `PerfilCategoria`/`PerfilZonaAtencion` como criterio de categoría/zona |
| `Disponibilidad` *(SPEC-05, reutilizada)* | usada como criterio de disponibilidad |
| `NotificacionOportunidad` *(nueva)* | `id`, `prestadorId` (FK Usuario), `solicitudId` (FK Solicitud), `fechaGeneracion`, `estado` (PENDIENTE, ENTREGADA), `fechaEntrega` |



## API Contracts

| Método | Endpoint | Request body / Query params | Respuesta éxito | Errores |
|---|---|---|---|---|
| GET | `/api/v1/oportunidades` | query params de filtro opcionales (categoría, urgencia) | `200 [ { solicitudId, categoria, zonaAproximada, urgencia, ... } ]` *(puede ser vacío)* | `401` sin rol Prestador |
| GET | `/api/v1/oportunidades/{solicitudId}` | — | `200 { ...detalle completo, sin datos privados del Cliente ni dirección exacta }` | `404` no compatible o inexistente (sin distinguir causa) |
| GET | `/api/v1/notificaciones/oportunidades` | — | `200 [ { solicitudId, fechaGeneracion, estado } ]` | `401` sin rol Prestador |

Todos los endpoints restringidos a rol PRESTADOR mediante el filtro de autorización por rol de SPEC-01 (T018). No se expone un endpoint de "push" en tiempo real en esta tabla porque el mecanismo de entrega (polling vs. WebSocket vs. push) no está definido — ver Notes.

## Testing Strategy

- **Contract tests**: uno por endpoint de la tabla anterior.
- **Integration tests**: uno por Acceptance Scenario del SPEC (10 escenarios entre las 2 historias), con Testcontainers, incluyendo tablero vacío, filtro sin coincidencias, solicitud no evaluable, y notificación pendiente mientras el Prestador no tiene sesión activa (edge case).
- **Unit tests**: lógica de `CompatibilidadService` (coincidencia de categoría, zona y disponibilidad; marcado de no evaluable ante datos insuficientes), lógica de filtrado adicional sin alterar el cálculo base.

## Project Structure

```text
backend/src/main/java/com/aliado/
├── auth/              # SPEC-01 (reutilizado)
├── catalogo/          # SPEC-04 (reutilizado)
├── solicitudes/       # SPEC-04 (reutilizado, sin cambios)
├── perfiles/          # SPEC-05 (reutilizado, sin cambios)
├── oportunidades/     # nuevo
│   ├── controller/    OportunidadController, NotificacionOportunidadController
│   ├── service/       CompatibilidadService, NotificacionOportunidadService
│   ├── repository/    NotificacionOportunidadRepository
│   └── model/         NotificacionOportunidad
└── common/            # SPEC-01/SPEC-04 (reutilizado)
    ├── config/
    ├── security/
    └── exception/
```

**Structure Decision**: se mantiene el patrón modular por funcionalidad. `oportunidades/` no duplica `Solicitud` ni `PerfilProfesional`: `CompatibilidadService` los consulta directamente vía los repositorios ya existentes de `solicitudes/` y `perfiles/` (inyectados como dependencias), calculando la compatibilidad en tiempo de consulta en vez de materializarla en una tabla propia. Esto evita el riesgo de que una tabla de "oportunidades" quede desincronizada cuando una solicitud o un perfil cambian. Solo `NotificacionOportunidad` es una entidad nueva, porque sí necesita persistir el evento de notificación (incluyendo el caso de entrega pendiente mientras el Prestador no tiene sesión activa).

---

## Phase 1: Setup

- [ ] T001 Crear el paquete `oportunidades/` con sus subcarpetas en capas
- [ ] T002 Migración Flyway: tabla `notificaciones_oportunidad`

---

## Phase 2: Foundational

No se requieren tareas fundacionales nuevas: autenticación/roles (SPEC-01), `Solicitud` (SPEC-04) y `PerfilProfesional`/`Disponibilidad` (SPEC-05) ya existen y se consumen directamente.

**Checkpoint**: sin bloqueo adicional más allá de que SPEC-04 y SPEC-05 estén completos (ambos son prerrequisito funcional, no solo de infraestructura, porque este SPEC calcula sobre sus datos).

---

## Phase 3: User Story 1 - Ver y filtrar el tablero de oportunidades compatibles [UC034, UC035, UC036, UC038] (Priority: P1)

**Goal**: un Prestador puede ver su tablero de oportunidades compatibles, filtrarlo, y ser notificado cuando aparece una nueva oportunidad.

**Independent Test**: con perfil configurado y solicitudes publicadas en distintas categorías/zonas, consultar el tablero y verificar que solo aparecen las compatibles; aplicar un filtro y verificar que se acota; publicar una nueva solicitud compatible y verificar que se genera la notificación.

### Tests

- [ ] T003 [P] [US1] Contract test `GET /oportunidades`, `GET /notificaciones/oportunidades` (200, 401) — `tests/contract/test_oportunidades_tablero.java`
- [ ] T004 [P] [US1] Integration test: tablero con oportunidades compatibles, tablero vacío, filtro que acota resultados, filtro sin coincidencias, solicitud sin datos suficientes marcada no evaluable, notificación generada al publicar solicitud compatible, notificación pendiente sin sesión activa, actor no autorizado — `tests/integration/test_tablero_oportunidades.java`

### Implementation

- [ ] T005 [P] [US1] Modelo `NotificacionOportunidad` — `oportunidades/model`
- [ ] T006 [US1] `NotificacionOportunidadRepository` — `oportunidades/repository`
- [ ] T007 [US1] `CompatibilidadService.calcularTablero(prestadorId)`: consulta `Solicitud` (SPEC-04) y `PerfilProfesional`/`Disponibilidad` (SPEC-05) vía sus repositorios; compara categoría, zona y disponibilidad (FR-034); marca como no evaluable toda solicitud sin datos suficientes, excluyéndola del resultado (FR-034); devuelve lista vacía sin error cuando no hay coincidencias (FR-035) (depends on T005, dependencias externas: `SolicitudRepository` de SPEC-04, `PerfilProfesionalRepository`/`DisponibilidadRepository` de SPEC-05)
- [ ] T008 [US1] `CompatibilidadService.filtrarTablero(prestadorId, criterios)`: aplica filtros adicionales (categoría, urgencia) sobre el resultado de T007 sin alterar el cálculo base (FR-036); devuelve vacío sin error si ningún resultado cumple (depends on T007)
- [ ] T009 [US1] `NotificacionOportunidadService.notificarNuevaOportunidad()`: se invoca cuando una nueva `Solicitud` publicada resulta compatible con un perfil (FR-038); registra la notificación con estado PENDIENTE si el Prestador no tiene sesión activa, y ENTREGADA en caso contrario (depends on T006, T007)
- [ ] T010 [US1] Endpoints `GET /api/v1/oportunidades` (con query params de filtro), `GET /api/v1/notificaciones/oportunidades` — `oportunidades/controller`

**Checkpoint**: el Prestador puede ver, filtrar y recibir notificaciones de su tablero de oportunidades de forma independiente.

---

## Phase 4: User Story 2 - Consultar el detalle de una oportunidad [UC037] (Priority: P1)

**Goal**: el Prestador puede consultar el detalle completo de una oportunidad de su tablero.

**Independent Test**: con una oportunidad compatible visible, consultar su detalle y verificar que muestra la información completa sin exponer datos privados del Cliente.

### Tests

- [ ] T011 [P] [US2] Contract test `GET /oportunidades/{solicitudId}` (200, 404) — `tests/contract/test_oportunidad_detalle.java`
- [ ] T012 [P] [US2] Integration test: detalle disponible sin datos privados ni dirección exacta, oportunidad no compatible o inexistente (rechazo unificado), actor no autorizado — `tests/integration/test_detalle_oportunidad.java`

### Implementation

- [ ] T013 [US2] `CompatibilidadService.obtenerDetalle(prestadorId, solicitudId)`: reutiliza la verificación de compatibilidad de T007 para esa solicitud puntual; si no es compatible o no existe, rechaza sin distinguir la causa (FR-037); construye la respuesta a partir de `Solicitud` (SPEC-04) excluyendo explícitamente dirección exacta y datos privados del Cliente (depends on T007)
- [ ] T014 [US2] Endpoint `GET /api/v1/oportunidades/{solicitudId}` — `oportunidades/controller`

**Checkpoint**: el Prestador puede consultar el detalle de una oportunidad específica de forma independiente.

---

## Dependencies & Execution Order

- **Setup (Phase 1)** → depende de SPEC-01 (auth/roles), SPEC-04 (`Solicitud`) y SPEC-05 (`PerfilProfesional`, `Disponibilidad`) ya completos.
- **Foundational (Phase 2)** → no aplica como fase de infraestructura propia; funcionalmente, todo este plan depende de que SPEC-04 y SPEC-05 estén implementados.
- **User Story 1 (Phase 3)** → depende de Setup.
- **User Story 2 (Phase 4)** → depende de User Story 1 (reutiliza `CompatibilidadService.calcularTablero`/su lógica de verificación).

## Notes

- Este plan no crea una tabla de "oportunidades": calcula sobre `Solicitud` (SPEC-04) y `PerfilProfesional`/`Disponibilidad` (SPEC-05) en tiempo de consulta, para evitar un estado duplicado que pueda desincronizarse.
- Pendientes de aclaración: umbral de rendimiento concreto para RNF-003 (el tablero "debe cargar en un tiempo que permita revisión ágil" no da una cifra); si "no evaluable" es un cálculo en tiempo de consulta o un flag persistente en `Solicitud`; el disparador y mecanismo de entrega en tiempo casi real de las notificaciones (RNF-007): WebSocket, push nativo (FCM, ya contemplado como alternativa de infraestructura en la Plantilla del Proyecto para la Alternativa B, pero no confirmado como decisión final) o polling.
- Si el disparador de notificaciones termina requiriendo un mecanismo de eventos (ej. tras guardar una `Solicitud` en SPEC-04), ese enganche debe hacerse sin modificar `SolicitudService` de SPEC-04 más allá de lo estrictamente necesario para no romper su independencia ya probada.
