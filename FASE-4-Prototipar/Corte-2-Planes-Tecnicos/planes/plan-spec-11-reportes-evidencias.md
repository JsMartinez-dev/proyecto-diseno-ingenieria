# Implementation Plan: SPEC-11

**Date**: 2026-10-02  
**Spec**: [spec-11-reportes-evidencias](FASE-4-Prototipar/specs/spec-11-reportes-evidencias)  
**Depends on**: `plan-spec-01-autenticacion.md` (Usuario autenticado), `plan-spec-04-gestion-solicitudes-servicio.md` (`ArchivoStorageService`), `plan-spec-08-contratacion-ciclo-servicio.md` (`ServicioContratado`), `plan-spec-10-calificaciones-resenas-verificacion.md` (núcleo `reportes/` y reporte de reseña)

## Summary

SPEC-11 amplía el módulo común `reportes/` introducido por SPEC-10 para permitir reportes de Usuario y de Servicio, además de evidencias opcionales. El objetivo es que los tres orígenes —reseña, usuario y servicio— compartan un único ciclo de estado y una única cola de moderación consumida por SPEC-12.

La evidencia nunca existe de forma huérfana: depende de un reporte preexistente y se almacena mediante `ArchivoStorageService`.

## Technical Context

**Language/Version**: Java 21 LTS  
**Primary Dependencies**: Spring Boot 3.3.x, Spring Data JPA, Validation, Flyway; `ArchivoStorageService`  
**Build tool**: Maven  
**Storage**: PostgreSQL 16 — ampliación de `reportes`, nueva tabla `evidencias_reporte`  
**Testing**: JUnit 5 + Mockito; Spring Boot Test + Testcontainers; MockMvc/WebTestClient  
**Target Platform**: VPS Hostinger (Docker Compose)  
**Project Type**: Web + Mobile  
**Constraints**: RNF-004 (evidencias privadas), RNF-005 (preparación para moderación/auditoría), RNF-010  
**Scale/Scope**: reportes generados por Clientes y Prestadores; revisión posterior por SPEC-12

## Data Model

| Entidad | Campos clave |
|---|---|
| `Reporte` *(ampliada)* | `id`, `tipo` (RESENA/USUARIO/SERVICIO), `reportanteId`, `objetivoId`, `motivo`, `estado`, `fechaCreacion` |
| `EvidenciaReporte` | `id`, `reporteId`, `archivoKey`, `tipoContenido`, `fechaCarga` |

Reglas:
- un reporte debe tener exactamente un objetivo del tipo declarado;
- motivo obligatorio;
- evidencia solo puede agregarse a un reporte abierto y por actor autorizado;
- mismo reportante + mismo objetivo + mismo motivo + reporte abierto se consolida en el reporte existente;
- archivos rechazados no alteran el reporte.

## API Contracts

| Método | Endpoint | Request | Respuesta | Errores |
|---|---|---|---|---|
| POST | `/api/v1/usuarios/{id}/reportes` | `{ motivo }` | `201 { reporteId }` | `400` motivo vacío; `404` objetivo no existe; `409` equivalente abierto |
| POST | `/api/v1/servicios/{id}/reportes` | `{ motivo }` | `201 { reporteId }` | `403/404` actor no participante; `409` equivalente abierto |
| POST | `/api/v1/reportes/{id}/evidencias` | multipart archivo | `201 { evidenciaId }` | `403/404`; `409` reporte cerrado; `413/415` archivo inválido |
| GET | `/api/v1/reportes/mios/{id}` | — | `200 { reporte, evidencias[] }` | `403/404` |

## Testing Strategy

- **Contract tests**: endpoints y formato de errores.
- **Integration tests**: 6 Acceptance Scenarios, incluyendo consolidación, archivo inválido y carrera reporte-resuelto vs. nueva evidencia.
- **Unit tests**: política de consolidación, autorización de evidencia y validación de estado.
- **Storage tests**: rollback lógico si el archivo no se acepta; ninguna evidencia huérfana.

## Project Structure

```text
backend/src/main/java/com/aliado/
├── reportes/
│   ├── controller/ ReporteController
│   ├── service/    ReporteService, EvidenciaReporteService
│   ├── repository/ ReporteRepository, EvidenciaReporteRepository
│   └── model/      Reporte, EvidenciaReporte
├── servicios/      # SPEC-08
├── confianza/      # SPEC-10
└── common/storage/ # SPEC-04
```

**Structure Decision**: se amplía el módulo ya creado en SPEC-10 en lugar de crear `reporte_usuario`, `reporte_servicio` y `reporte_resena` como sistemas independientes. La discriminación por tipo queda centralizada y SPEC-12 consume el mismo repositorio/servicio.

---

## Phase 1: Setup

- [ ] T001 Extender enum/tipo de `Reporte` con USUARIO y SERVICIO.
- [ ] T002 Migración Flyway: `evidencias_reporte` e índices de búsqueda por estado/tipo/objetivo.
- [ ] T003 Añadir mecanismo de unicidad/consolidación para reporte equivalente abierto.

---

## Phase 2: Foundational

- [ ] T004 `ReporteService` expone operaciones genéricas de creación y consulta.
- [ ] T005 `EvidenciaReporteService` integra `ArchivoStorageService`, validación MIME/tamaño y autorización.
- [ ] T006 Definir estado `PENDIENTE` como estado inicial consumible por SPEC-12.

---

## Phase 3: User Story 1 - Reportar usuario [UC065] (Priority: P1)

- [ ] T007 [P] [US1] Contract test `POST /usuarios/{id}/reportes`.
- [ ] T008 [P] [US1] Integration test: éxito, motivo ausente, objetivo inexistente, reporte equivalente.
- [ ] T009 [US1] Implementar `ReporteService.reportarUsuario()`.
- [ ] T010 [US1] Endpoint correspondiente.

---

## Phase 4: User Story 2 - Reportar servicio [UC066] (Priority: P1)

- [ ] T011 [P] [US2] Contract test `POST /servicios/{id}/reportes`.
- [ ] T012 [P] [US2] Integration test: participante válido y actor ajeno.
- [ ] T013 [US2] Implementar `ReporteService.reportarServicio()`.
- [ ] T014 [US2] Endpoint correspondiente.

---

## Phase 5: User Story 3 - Adjuntar evidencia [UC067] (Priority: P2)

- [ ] T015 [P] [US3] Contract test de upload.
- [ ] T016 [P] [US3] Integration test: evidencia válida, sin reporte previo, tipo/tamaño inválido, reporte resuelto concurrentemente.
- [ ] T017 [US3] Modelo/repositorio `EvidenciaReporte`.
- [ ] T018 [US3] Implementar carga con storage privado.
- [ ] T019 [US3] Endpoint de evidencia.
- [ ] T020 [US3] Consulta de reporte propio con evidencias.

**Checkpoint**: reportes de los tres tipos quedan listos para la cola administrativa de SPEC-12.

---

## Dependencies & Execution Order

- Requiere el núcleo `reportes/` de SPEC-10.
- US1 y US2 pueden implementarse en paralelo después de Foundational.
- US3 depende del reporte genérico, no de un tipo específico.
- SPEC-12 depende de la finalización de este plan para moderar reportes con evidencia.

## Notes

- `[NEEDS CLARIFICATION]`: formatos permitidos y límite máximo por archivo; el SPEC exige definirlos antes de implementación.
- El estado final y resolución pertenecen a SPEC-12.
- La consolidación no borra evidencia previa; agrega evidencias al reporte abierto equivalente.
