# Implementation Plan: SPEC-02 

**Date**: 2026-09-18
**Spec**: [spec-02-gestion-perfil-privacidad](FASE-4-Prototipar/specs/spec-02-gestion-perfil-privacidad)
**Depends on**: `plan-spec-01-autenticacion.md` (Phase 2 Foundational + Phase 4 User Story 2 deben estar completas  este plan requiere `Usuario` autenticado)

## Summary

SPEC-02 cubre la administración de datos personales, la separación entre zona aproximada y dirección exacta, y la eliminación de cuenta. No define infraestructura nueva: reutiliza por completo la Fase Foundational ya establecida en `plan-spec-01-autenticacion.md` (seguridad, manejo de errores, configuración de entorno). Por eso este plan **no tiene una Fase 2 propia**.

## Technical Context

**Language/Version**: Java 21 (LTS)
**Primary Dependencies**: Spring Boot 3.3.x — Spring Web, Spring Data JPA, Spring Security, Spring Validation, Flyway, BCrypt
**Build tool**: Maven
**Storage**: tablas `perfiles`, `ubicaciones`, `solicitudes_eliminacion`
**Constraints**: RNF-004 (cifrado en reposo de `direccionExacta` y datos de contacto), RNF-010 (Ley 1581)
**Performance Goals**: consulta de perfil propio en p95 < 300 ms (heredado de RNF-003)

## Data Model

| Entidad | Campos clave |
|---|---|
| `PerfilUsuario` | `usuarioId` (FK 1:1 con `Usuario` de SPEC-01), `nombre`, `telefono`, `preferenciaVisibilidad` |
| `Ubicacion` | `usuarioId` (FK 1:1), `zonaAproximada`, `direccionExacta` (cifrada, nullable) |
| `SolicitudEliminacion` | `id`, `usuarioId` (FK), `fechaSolicitud`, `estado` (PENDIENTE/CONFIRMADA/EXPIRADA/RECHAZADA), `fechaConfirmacion`, `fechaExpiracion` |

Relaciones: `Usuario` (SPEC-01) 1—1 `PerfilUsuario`, 1—1 `Ubicacion`, 1—N `SolicitudEliminacion` (solo una activa a la vez).

## API Contracts

| Método | Endpoint | Request body | Respuesta éxito | Errores |
|---|---|---|---|---|
| GET | `/api/v1/perfil/me` | — | `200` perfil propio completo (incluye dirección exacta propia) | `401` sin sesión |
| PATCH | `/api/v1/perfil/me` | `{ nombre?, telefono? }` | `200` perfil actualizado | `400` formato inválido (valor previo se conserva) |
| PUT | `/api/v1/perfil/me/ubicacion` | `{ zonaAproximada, direccionExacta? }` | `200` ubicación actualizada | `400` formato inválido |
| PATCH | `/api/v1/perfil/me/visibilidad` | `{ preferenciaVisibilidad }` | `200` | `400` valor fuera de las reglas de privacidad base |
| GET | `/api/v1/perfil/{usuarioId}/publico` | — | `200` *(solo `zonaAproximada`, nunca `direccionExacta`)* | `404` usuario no existe |
| POST | `/api/v1/perfil/me/eliminacion` | — | `202 { estado: PENDIENTE, expiraEn }` | `409` tiene un servicio en ejecución |
| POST | `/api/v1/perfil/me/eliminacion/confirmar` | — | `200 { estado: CONFIRMADA }` | `410` solicitud expirada (> 24 h) |

## Testing Strategy

- **Contract tests**: uno por endpoint de la tabla anterior.
- **Integration tests**: uno por Acceptance Scenario del SPEC, con Testcontainers.
- **Unit tests**: regla de separación zona aproximada/dirección exacta, expiración automática de `SolicitudEliminacion` a las 24 h.
- Cobertura obligatoria de Edge Cases: eliminación con servicio en ejecución, expiración de solicitud > 24 h, edición de zona sin alterar dirección comprometida con un servicio activo, actualizaciones concurrentes de perfil.

## Project Structure

```text
backend/src/main/java/com/aliado/
└── perfil/
    ├── controller/ PerfilController
    ├── service/    PerfilService, EliminacionCuentaService
    ├── repository/ PerfilRepository, UbicacionRepository, SolicitudEliminacionRepository
    └── model/      PerfilUsuario, Ubicacion, SolicitudEliminacion
```

---

## Phase 1: Setup

- [ ] T001 Crear el paquete `perfil/` con sus subcarpetas en capas
- [ ] T002 Migración Flyway: tablas `perfiles`, `ubicaciones`, `solicitudes_eliminacion` (con FK hacia `usuarios` de SPEC-01)

---

## Phase 2: User Story 1 - Administración de datos personales [UC008, UC011] (Priority: P1)

**Goal**: un usuario consulta y edita sus propios datos básicos.

**Independent Test**: editar un dato válido y verificar persistencia; editar uno inválido y verificar que no se altera el valor previo.
### Tests

- [ ] T003 [P] [US1] Contract tests `GET /perfil/me`, `PATCH /perfil/me` — `tests/contract/test_perfil_datos.java`
- [ ] T004 [P] [US1] Integration test: consulta propia, edición válida, edición con formato inválido — `tests/integration/test_perfil_datos.java`

### Implementation

- [ ] T005 [P] [US1] Modelo `PerfilUsuario` — `perfil/model`
- [ ] T006 [US1] `PerfilService.consultar()` / `actualizar()` con validación que no sobrescribe en caso de error (FR-002) — `perfil/service`
- [ ] T007 [US1] Endpoints `GET/PATCH /api/v1/perfil/me` — `perfil/controller`

**Checkpoint**: cualquier usuario autenticado mantiene sus datos básicos actualizados de forma independiente.

---

## Phase 3: User Story 2 - Privacidad y visibilidad de ubicación [UC009, UC010, UC013] (Priority: P1)

**Goal**: la zona aproximada y la dirección exacta quedan siempre separadas según reglas de privacidad.

**Independent Test**: un tercero sin autorización solo ve zona aproximada, nunca dirección exacta, bajo cualquier configuración de visibilidad.

### Tests

- [ ] T008 [P] [US2] Contract tests `PUT /perfil/me/ubicacion`, `PATCH /perfil/me/visibilidad`, `GET /perfil/{id}/publico` — `tests/contract/test_perfil_privacidad.java`
- [ ] T009 [P] [US2] Integration test: consulta de un tercero nunca recibe `direccionExacta` (FR-005), edición de zona no altera dirección comprometida con un servicio activo — `tests/integration/test_privacidad_ubicacion.java`

### Implementation

- [ ] T010 [P] [US2] Modelo `Ubicacion` (cifrado de `direccionExacta` en reposo, RNF-004) — `perfil/model`
- [ ] T011 [US2] `PerfilService`: lógica de exposición condicionada (zona por defecto, dirección exacta solo bajo regla explícita) — `perfil/service`
- [ ] T012 [US2] Endpoints `PUT /ubicacion`, `PATCH /visibilidad`, `GET /{id}/publico` — `perfil/controller`

**Checkpoint**: ninguna ruta del sistema puede exponer `direccionExacta` fuera de la regla explícita, verificable con un solo punto de control en `PerfilService`.

---

## Phase 4: User Story 3 - Eliminación de cuenta [UC012] (Priority: P2)

**Goal**: un usuario puede solicitar la eliminación de su cuenta de forma segura y reversible hasta su confirmación.

**Independent Test**: solicitar eliminación, verificar estado `PENDIENTE`, y que no se ejecuta sin confirmación ni tras expirar.

### Tests

- [ ] T013 [P] [US3] Contract tests `POST /perfil/me/eliminacion`, `/eliminacion/confirmar` — `tests/contract/test_eliminacion.java`
- [ ] T014 [P] [US3] Integration test: solicitud con servicio en ejecución (bloqueada), expiración automática a las 24 h, confirmación exitosa — `tests/integration/test_eliminacion_cuenta.java`

### Implementation

- [ ] T015 [P] [US3] Modelo `SolicitudEliminacion` — `perfil/model`
- [ ] T016 [US3] `EliminacionCuentaService`: validación de servicios en ejecución, expiración a 24 h — `perfil/service`
- [ ] T017 [US3] Endpoints `POST /eliminacion`, `/eliminacion/confirmar` — `perfil/controller`
- [ ] T018 [US3] Job programado (scheduler) que marca como `EXPIRADA` toda solicitud pendiente > 24 h

> **Dependencia cruzada pendiente**: T016 necesita consultar si el usuario tiene un "servicio en ejecución", dato que vivirá en el módulo `propuestas` (SPEC-07/08, UC-04), que todavía no tiene su propio plan. Esta tarea no puede completarse de forma aislada; debe revisarse al escribir el plan de SPEC-07/08.

**Checkpoint**: ninguna cuenta se elimina sin confirmación explícita ni mientras tenga un servicio en ejecución.

---

## Dependencies & Execution Order

- **Depende externamente de**: `plan-spec-01-autenticacion.md` — Phase 2 (Foundational) y Phase 4 (User Story 2, `auth` completo) deben estar terminadas antes de iniciar cualquier fase de este plan.
- **Setup (Phase 1)** → depende solo de lo anterior.
- **User Story 1 (Phase 2)** → depende de Phase 1.
- **User Story 2 (Phase 3)** → depende de Phase 1; puede paralelizarse con la Phase 2.
- **User Story 3 (Phase 4)** → depende de Phase 3 (reutiliza `PerfilService`) y tiene una dependencia cruzada pendiente hacia SPEC-07/08 (ver nota en T016).

## Notes

- Este plan no repite la Fase Foundational: queda centralizada una sola vez en `plan-spec-01-autenticacion.md`, tal como recomienda el `sdd-guide.MD`.
- La dependencia cruzada de T016 hacia SPEC-07/08 debe resolverse explícitamente cuando se redacte ese plan, para no implementarla dos veces ni de forma inconsistente.
