# Implementation Plan: SPEC-11

**Date**: 2026-10-02  
**Spec**: [spec-11-reportes-evidencias](../../FASE-4-Prototipar/specs/spec-11-reportes-evidencias.md)
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

- **Arquitectura**: comprobar `Service implements UseCase`, constructores de entrada con interfaces, ausencia de Spring/JPA/HTTP en dominio/aplicación, mappers separados y transacciones verificadas con PostgreSQL cuando aplique.

- **Contract tests**: endpoints y formato de errores.
- **Integration tests**: 6 Acceptance Scenarios, incluyendo consolidación, archivo inválido y carrera reporte-resuelto vs. nueva evidencia.
- **Unit tests**: política de consolidación, autorización de evidencia y validación de estado.
- **Storage tests**: rollback lógico si el archivo no se acepta; ninguna evidencia huérfana.

## Project Structure

```text
backend/src/main/java/com/aliado/
└── reportes/
    ├── domain/
    │   ├── model/
    │   │   Reporte, EvidenciaReporte
    │   └── repository/
    │       ReporteRepository, EvidenciaReporteRepository
    ├── application/
    │   ├── usecase/
    │   │   ReportarUsuarioUseCase, ReportarServicioUseCase, AdjuntarEvidenciaReporteUseCase,
    │   │   ConsultarReportePropioUseCase
    │   ├── service/
    │   │   ReportarUsuarioService, ReportarServicioService, AdjuntarEvidenciaReporteService,
    │   │   ConsultarReportePropioService
    │   ├── dto/
    │   │   Command/Query/Result de las operaciones del módulo (sin HTTP/JPA)
    │   └── port/
    │       ArchivoStorageService (reutilizado)
    ├── infrastructure/
    │   ├── persistence/
    │   │   ├── entity/
    │   │   │   ReporteEntity, EvidenciaReporteEntity
    │   │   ├── mapper/
    │   │   │   ReporteMapper, EvidenciaReporteMapper
    │   │   ├── jpa/
    │   │   │   ReporteJpaRepository, EvidenciaReporteJpaRepository
    │   │   └── adapter/
    │   │       ReportePersistenceAdapter, EvidenciaReportePersistenceAdapter
    │   └── adapter/
    │       Adaptadores de puertos requeridos; reutilizar contratos existentes
    └── presentation/
        ├── controller/
        │   ReporteController
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
| `reportes` | `ReportarUsuarioUseCase` | `ReportarUsuarioService` |
| `reportes` | `ReportarServicioUseCase` | `ReportarServicioService` |
| `reportes` | `AdjuntarEvidenciaReporteUseCase` | `AdjuntarEvidenciaReporteService` |
| `reportes` | `ConsultarReportePropioUseCase` | `ConsultarReportePropioService` |

Puertos de salida: ArchivoStorageService y consultas autorizadas de cuenta/servicio/reseña. Las interfaces de entrada no crean endpoints nuevos; mantener API Contracts y las condiciones Could/Future. Las tareas existentes conservan IDs, historias, dependencias y orden: los nombres de servicio agrupado de origen se descomponen en estas operaciones, sin añadir tareas funcionales.

Persistencia de referencia: `reportes`, `evidencias_reporte`. El [manual entregado](../../tasks/fuentes/manual-base-de-datos-aliado.md) detalla el modelo MVP; no implica que los scripts V1–V6 ya estén disponibles o ejecutados.

**Structure Decision**: se amplía el módulo ya creado en SPEC-10 en lugar de crear `reporte_usuario`, `reporte_servicio` y `reporte_resena` como sistemas independientes. La discriminación por tipo queda centralizada y SPEC-12 consume el mismo repositorio/servicio.

---

## Phase 1: Setup

- [ ] T001 Extender enum/tipo de `Reporte` con USUARIO y SERVICIO.
- [ ] T002 Migración Flyway: `evidencias_reporte` e índices de búsqueda por estado/tipo/objetivo.
- [ ] T003 Añadir mecanismo de unicidad/consolidación para reporte equivalente abierto.

---

## Phase 2: Foundational

- [ ] T004 Interfaces ReportarResenaUseCase, ReportarUsuarioUseCase, ReportarServicioUseCase y ConsultarReportePropioUseCase con sus Service; núcleo compartido único de reportes.
- [ ] T005 AdjuntarEvidenciaReporteUseCase y su Service usan ArchivoStorageService, validación MIME/tamaño y autorización; detalles del SDK solo en adaptador.
- [ ] T006 Definir estado `PENDIENTE` como estado inicial consumible por SPEC-12.

---

## Phase 3: User Story 1 - Reportar usuario [UC065] (Priority: P1)

- [ ] T007 [P] [US1] Contract test `POST /usuarios/{id}/reportes`.
- [ ] T008 [P] [US1] Integration test: éxito, motivo ausente, objetivo inexistente, reporte equivalente.
- [ ] T009 [US1] Implementar `ReportarUsuarioUseCase.ejecutar()`.
- [ ] T010 [US1] Endpoint correspondiente.

---

## Phase 4: User Story 2 - Reportar servicio [UC066] (Priority: P1)

- [ ] T011 [P] [US2] Contract test `POST /servicios/{id}/reportes`.
- [ ] T012 [P] [US2] Integration test: participante válido y actor ajeno.
- [ ] T013 [US2] Implementar `ReportarServicioUseCase.ejecutar()`.
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

## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F11-FE-01** Formularios contextuales para reportar cuenta o servicio con motivo obligatorio.
- [ ] **F11-FE-02** Carga de evidencia solo después de recibir reporteId; permitir reintentar carga sin recrear reporte.
- [ ] **F11-FE-03** Detalle propio y estado; distinguir carga fallida de reporte creado para no perder trazabilidad.
- [ ] **F11-FE-04** Mantener contenido y evidencia anteriores al consolidar reporte equivalente abierto.

Aplicar [estados y contrato de cliente](../../tasks/01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación de la feature

- [ ] **F11-QA-01** CHECK de un objetivo compatible con tipo, FK de evidencia y política de consolidación concurrente.
- [ ] **F11-QA-02** Usuario ajeno no accede a reporte/evidencia ni reporta un servicio no autorizado por contrato.
- [ ] **F11-QA-03** Fallo storage o metadatos no deja evidencia publicada huérfana; URL firmada expira.
- [ ] **F11-QA-04** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Dependencies & Execution Order

- Requiere el núcleo `reportes/` de SPEC-10.
- US1 y US2 pueden implementarse en paralelo después de Foundational.
- US3 depende del reporte genérico, no de un tipo específico.
- SPEC-12 depende de la finalización de este plan para moderar reportes con evidencia.

## Notes

- `[NEEDS CLARIFICATION]`: formatos permitidos y límite máximo por archivo; el SPEC exige definirlos antes de implementación.
- El estado final y resolución pertenecen a SPEC-12.
- La consolidación no borra evidencia previa; agrega evidencias al reporte abierto equivalente.
