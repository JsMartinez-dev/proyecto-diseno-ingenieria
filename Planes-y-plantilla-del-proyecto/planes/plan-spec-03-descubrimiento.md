# Implementation Plan: SPEC-03 — Descubrimiento de prestadores

**Date**: 2026-09-18
**Spec**: [spec-03-descubrimiento-prestadores](FASE-4-Prototipar/specs/spec-03-descubrimiento-prestadores)
**Depends on**: `plan-spec-01-autenticacion.md` (rol Cliente autenticado, interceptor de autorización por rol)

## Summary

SPEC-03 permite que un Cliente busque Prestadores por categoría/zona y consulte su perfil público, desde la búsqueda o por acceso directo, sin exponer nunca datos privados ni ubicación exacta. A diferencia de SPEC-01 y SPEC-02, **este SPEC no introduce entidades propias**: es un módulo de **solo lectura** que consulta datos que pertenecen a otros SPEC.

## Technical Context

**Language/Version**: Java 21 (LTS)
**Primary Dependencies**: Spring Boot 3.3.x — Spring Web, Spring Data JPA, Spring Security, Spring Validation, Flyway, BCrypt
**Build tool**: Maven
**Storage**: sin tablas propias, consultas de solo lectura sobre tablas de otros módulos.
**Constraints**: hereda RNF-004 (nunca exponer dirección exacta) a través de la misma regla ya centralizada en el  SPEC-02.
**Performance Goals**: búsqueda por categoría/zona en p95 < 300 ms bajo la carga del piloto (RNF-003)

## Data Model

Este SPEC no define entidades persistentes propias. Usa como **vistas de lectura** (DTO, no tablas):

| DTO                   | Campos                                                                                 | Origen real de los datos                                                                                                 |
| --------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `PrestadorPublicoDTO` | `id`, `categorias[]`, `zonaCobertura`, `reputacionAgregada`, `disponibilidadDeclarada` | `PerfilProfesional`/`CategoriaOfrecida`/`ZonaCobertura` (SPEC-05/06, aún sin plan), `Reputacion` (SPEC-10, aún sin plan) |
| `CriterioBusqueda`    | `categoria`, `zona` (parámetros de consulta, no persistidos)                           | `Categoria`/`Zona` del catálogo administrable (SPEC-12, aún sin plan)                                                    |


## API Contracts

| Método | Endpoint | Request | Respuesta éxito | Errores |
|---|---|---|---|---|
| GET | `/api/v1/descubrimiento/prestadores?categoria=&zona=` | query params | `200 [PrestadorPublicoDTO, ...]` *(lista vacía si no hay coincidencias, nunca error)*; si la categoría/zona no existe en el catálogo, `200` con `sugerencias: [...]` en vez de rechazar la solicitud | `403` si el actor no tiene rol Cliente |
| GET | `/api/v1/descubrimiento/prestadores/{id}/perfil` | — | `200 PrestadorPublicoDTO` *(idéntico sin importar si se llegó por búsqueda o por acceso directo — un único mapeo)* | `404` detalle no disponible (perfil incompleto, oculto o inexistente — mismo mensaje genérico para los tres casos); `403` si el actor no tiene rol Cliente |

## Testing Strategy

- **Contract tests**: ambos endpoints, incluyendo el caso de lista vacía (200, no error) y el 404 genérico de perfil no disponible.
- **Integration tests**: uno por Acceptance Scenario del SPEC (búsqueda con/sin resultados, perfil desde búsqueda, perfil directo, perfil no disponible, actor no autorizado). Mientras SPEC-05/06/10/12 no existan, estos tests corren contra fixtures/mocks de esas entidades, dejando explícito en el propio test que es un doble de prueba, no el dato real.


## Project Structure

```text
backend/src/main/java/com/aliado/
└── descubrimiento/
    ├── controller/ DescubrimientoController
    ├── service/    DescubrimientoService
    └── dto/        PrestadorPublicoDTO, CriterioBusqueda
```

No hay carpeta `model/` ni `repository/` propias: `DescubrimientoService` consulta, por inyección de dependencias dentro del mismo monolito, los repositorios de `prestador` (SPEC-05/06), `confianza` (SPEC-10) y el catálogo de `common`/administración (SPEC-12) cuando existan.

---

## Phase 1: Setup

- [ ] T001 Crear el paquete `descubrimiento/` con sus subcarpetas (`controller`, `service`, `dto`)
- [ ] T002 Definir fixtures/mocks de `PerfilProfesional`, `Reputacion` y catálogo de `Categoria`/`Zona` para poder probar este módulo antes de que existan SPEC-05/06, SPEC-10 y SPEC-12

---

## Phase 2: User Story 1 - Buscar y explorar prestadores [UC014, UC015] (Priority: P1)

**Goal**: un Cliente busca Prestadores por categoría/zona y consulta su perfil público, por cualquiera de los dos caminos, sin exponer datos privados.

**Independent Test**: buscar por categoría y zona, abrir un perfil desde los resultados y el mismo perfil por acceso directo, y verificar que ambos caminos devuelven exactamente lo mismo.

### Tests

- [ ] T003 [P] [US1] Contract tests `GET /descubrimiento/prestadores` (con y sin resultados), `GET /descubrimiento/prestadores/{id}/perfil` (200, 404) — `tests/contract/test_descubrimiento.java`
- [ ] T004 [P] [US1] Integration test: búsqueda con resultados, búsqueda sin resultados, perfil desde búsqueda, perfil directo, perfil no disponible, actor no autorizado — `tests/integration/test_descubrimiento.java` (sobre fixtures mientras SPEC-05/06/10/12 no existan)

### Implementation

- [ ] T005 [P] [US1] DTO `PrestadorPublicoDTO` y `CriterioBusqueda` — `descubrimiento/dto`
- [ ] T006 [US1] `DescubrimientoService.buscar(categoria, zona)` — consulta cross-módulo (depends on T002; depends en producción de los repositorios reales de SPEC-05/06, SPEC-10, SPEC-12)
- [ ] T007 [US1] `DescubrimientoService.consultarPerfilPublico(id)` — mapeo único reutilizado tanto desde búsqueda como desde acceso directo, garantizando SC-002
- [ ] T008 [US1] Reutilizar el interceptor de autorización por rol de SPEC-01 (T018) para restringir ambos endpoints a Cliente
- [ ] T009 [US1] Endpoints `GET /prestadores`, `GET /prestadores/{id}/perfil` — `descubrimiento/controller`


**Checkpoint**: un Cliente puede descubrir Prestadores y consultar su perfil público de forma consistente, aunque los datos reales subyacentes todavía vengan de fixtures hasta que SPEC-05/06, SPEC-10 y SPEC-12 se implementen.

---

## Dependencies & Execution Order

- **Depende externamente de**: `plan-spec-01-autenticacion.md` (rol Cliente, interceptor de autorización).
- **Dependencia de datos pendiente (no bloqueante para empezar, sí para terminar)**: SPEC-05/06 (perfil profesional del Prestador), SPEC-10 (reputación), SPEC-12 (catálogo de categorías/zonas). Se puede avanzar Phase 1-2 con fixtures, pero las integration tests de T004 no pueden considerarse definitivamente verdes hasta integrar los repositorios reales.
- **Setup (Phase 1)** → depende solo de `plan-spec-01-autenticacion.md`.
- **User Story 1 (Phase 2)** → depende de Phase 1.

## Notes

- Este plan documenta una dependencia de datos que contradice el orden superficial de los diagramas (UC-02 antes que UC-03/UC-05); se deja explícita para que, al planear SPEC-05/06/10/12, el equipo recuerde volver aquí y reemplazar los fixtures por los repositorios reales.

