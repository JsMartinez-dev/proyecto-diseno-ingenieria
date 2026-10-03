# Implementation Plan: SPEC-14

**Date**: 2026-10-02  
**Spec**: [spec-14-preferencias-historial-indicadores](FASE-4-Prototipar/specs/spec-14-preferencias-historial-indicadores)  
**Depends on**: `plan-spec-01-autenticacion.md`, `plan-spec-08-contratacion-ciclo-servicio.md`, `plan-spec-09-notificaciones-propuestas-servicios.md`, `plan-spec-10-calificaciones-resenas-verificacion.md`, `plan-spec-04-gestion-solicitudes-servicio.md` (`ArchivoStorageService` si se persisten exportaciones)

## Summary

SPEC-14 agrega preferencias de notificación, historial autorizado de servicios, descarga del historial, indicadores básicos del Prestador y actividad reciente. El historial, los indicadores y la actividad son principalmente **modelos de lectura** construidos sobre entidades ya existentes; no deben duplicar la fuente de verdad.

Solo `PreferenciaNotificacion` y, opcionalmente, metadata de `DescargaHistorial` requieren persistencia propia. Los indicadores se calculan desde servicios/calificaciones según fórmulas aprobadas.

## Technical Context

**Language/Version**: Java 21 LTS  
**Primary Dependencies**: Spring Boot 3.3.x; Data JPA; Flyway; módulo `notificaciones`  
**Storage**: PostgreSQL 16; exportaciones opcionales mediante `ArchivoStorageService`  
**Testing**: JUnit/Mockito/Testcontainers/MockMvc  
**Constraints**: RNF-001, RNF-003, RNF-004, RNF-007  
**Performance Goals**: historial paginado; actividad reciente ordenada de forma determinista  
**Scale/Scope**: todos los usuarios para historial/preferencias; indicadores solo Prestador

## Data Model

| Entidad / read model | Campos |
|---|---|
| `PreferenciaNotificacion` | `usuarioId`, `tipoAviso`, `canal`, `habilitada`, `configurable` |
| `HistorialTrabajoDTO` | derivado de `ServicioContratado`; no tabla |
| `DescargaHistorial` | `id`, `usuarioId`, `fechaGeneracion`, `archivoKey?`, `estado?` |
| `IndicadorBasicoDTO` | `codigo`, `valor`, `formulaVersion`, `periodo`; calculado |
| `ActividadRecienteDTO` | `tipoEvento`, `referenciaId`, `fecha`, `secuencia`; derivado |

## API Contracts

| Método | Endpoint | Uso |
|---|---|---|
| GET/PUT | `/api/v1/preferencias/notificaciones` | consultar/modificar preferencias |
| GET | `/api/v1/historial?pagina=&tamano=` | servicios propios |
| POST | `/api/v1/historial/exportaciones` | generar descarga |
| GET | `/api/v1/prestadores/mis-indicadores` | métricas propias |
| GET | `/api/v1/actividad-reciente` | eventos visibles propios |

## Testing Strategy

- 9 Acceptance Scenarios.
- Tests de privacidad: historial/exportación jamás incluyen servicios ajenos.
- Preferencias: tipo obligatorio no puede deshabilitarse.
- Indicadores: resultados reproducibles.
- Actividad: desempate estable `(fecha, secuencia/id)`.

## Project Structure

```text
backend/src/main/java/com/aliado/
├── preferencias/
│   ├── controller/ PreferenciaNotificacionController
│   ├── service/    PreferenciaNotificacionService
│   └── repository/ PreferenciaNotificacionRepository
├── historial/
│   ├── controller/ HistorialController
│   ├── service/    HistorialService, ExportacionHistorialService
│   └── model/      DescargaHistorial
├── indicadores/
│   ├── controller/ IndicadorController
│   └── service/    IndicadorService
└── actividad/
    ├── controller/ ActividadController
    └── service/    ActividadRecienteService
```

---

## Phase 1: Setup

- [ ] T001 Crear módulos de lectura/configuración.
- [ ] T002 Migración `preferencias_notificacion`; `descargas_historial` solo si se requiere persistir metadata.
- [ ] T003 Añadir catálogo de tipos/canales configurables y obligatorios.

## Phase 2: Foundational

- [ ] T004 Integrar `NotificacionService` con `PreferenciaNotificacionService`.
- [ ] T005 Definir consulta autorizada común de servicios propios.
- [ ] T006 Definir estrategia de paginación y orden estable.
- [ ] T007 `[NEEDS CLARIFICATION]` fijar fórmulas/códigos de indicadores antes de implementación de US4.

## Phase 3: User Story 1 - Preferencias de notificación [UC081] (Priority: P1)

- [ ] T008 Tests de preferencia configurable y obligatoria.
- [ ] T009 Implementar modelo/repositorio/servicio.
- [ ] T010 Endpoints.
- [ ] T011 Integrar evaluación de preferencia antes de entrega de notificación.

## Phase 4: User Story 2 - Historial de trabajos [UC082] (Priority: P1)

- [ ] T012 Tests con Cliente, Prestador y usuario sin historial.
- [ ] T013 `HistorialService` sobre `ServicioContratado`.
- [ ] T014 Endpoint paginado.

## Phase 5: User Story 3 - Descargar historial [UC083] (Priority: P2)

- [ ] T015 Tests de contenido equivalente y reintento.
- [ ] T016 `ExportacionHistorialService` genera desde la misma consulta de US2.
- [ ] T017 Endpoint de exportación.
- [ ] T018 Garantizar que el reintento no modifica historial.

## Phase 6: User Story 4 - Indicadores básicos [UC084] (Priority: P1)

- [ ] T019 Tests con dataset conocido.
- [ ] T020 Definir versión de fórmula.
- [ ] T021 `IndicadorService` sobre servicios/calificaciones propios.
- [ ] T022 Endpoint.
- [ ] T023 Incluir servicios cancelados o en moderación conforme al escenario explícito del SPEC; documentar fórmula.

## Phase 7: User Story 5 - Actividad reciente [UC085] (Priority: P2)

- [ ] T024 Tests de visibilidad y orden.
- [ ] T025 `ActividadRecienteService` como read model de eventos existentes.
- [ ] T026 Endpoint paginado/limitado.

## Dependencies & Execution Order

US1 depende de SPEC-09; US2 de SPEC-08; US4 de SPEC-08/10. US3 depende de US2. US5 puede implementarse al final como agregación de eventos.

## Notes

- El historial no es una tabla duplicada.
- Los indicadores no deben persistirse salvo que mediciones demuestren necesidad; si se cachean/materializan, deben incluir versión de fórmula.
- El SPEC indica explícitamente que servicios cancelados o en moderación **se incluyen** en el escenario UC084; la fórmula debe conservar esa decisión salvo cambio formal del SPEC.
