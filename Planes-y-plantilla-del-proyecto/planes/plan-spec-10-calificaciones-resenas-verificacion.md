# Implementation Plan: SPEC-10

**Date**: 2026-10-02  
**Spec**: [spec-10-calificaciones-resenas-verificacion](../../FASE-4-Prototipar/specs/spec-10-calificaciones-resenas-verificacion.md)
**Depends on**: `plan-spec-01-autenticacion.md` (Cliente/Prestador autenticado), `plan-spec-04-gestion-solicitudes-servicio.md` (`ArchivoStorageService` para documentos), `plan-spec-05-perfil-profesional.md` (`PerfilProfesional` y vista pública), `plan-spec-08-contratacion-ciclo-servicio.md` (`ServicioContratado` finalizado)

## Summary

SPEC-10 introduce el núcleo de confianza posterior a la contratación: calificación única de servicios finalizados, reseña textual opcional, reputación agregada del Prestador, nivel de verificación y solicitud de verificación documental ampliada. También introduce el primer tipo de reporte de contenido (`RESEÑA`), que será reutilizado y generalizado por SPEC-11 y administrado por SPEC-12.

La reputación es un dato derivado de las calificaciones válidas; puede materializarse para lectura rápida, pero la fuente de verdad sigue siendo `Calificacion`. El nivel de verificación no representa certificación legal y debe exponerse con lenguaje neutral.

## Technical Context

**Language/Version**: Java 21 (LTS) — reutilizado de SPEC-01  
**Primary Dependencies**: Spring Boot 3.3.x (Web, Data JPA, Validation), Flyway — reutilizados; `ArchivoStorageService` de SPEC-04  
**Build tool**: Maven  
**Storage**: PostgreSQL 16 — tablas `calificaciones`, `resenas`, `reputaciones_prestador`, `solicitudes_verificacion`, `documentos_verificacion`, y núcleo inicial de `reportes`  
**Testing**: JUnit 5 + Mockito; Spring Boot Test + Testcontainers; MockMvc/WebTestClient  
**Target Platform**: VPS Hostinger (Docker Compose)  
**Project Type**: Web + Mobile (backend único)  
**Performance Goals**: lectura de reputación/nivel de verificación debe ser apta para perfil público; sin cifra adicional definida en el SPEC  
**Constraints**: RNF-004 (privacidad de documentos), RNF-006 (calificación + reputación consistentes), RNF-010 (datos personales); el nivel de verificación nunca debe presentarse como certificación legal  
**Scale/Scope**: una calificación máxima por servicio; ~50–100 Prestadores en piloto

## Data Model

| Entidad | Campos clave |
|---|---|
| `Calificacion` | `id`, `servicioId` (FK única), `clienteId` (FK Usuario), `prestadorId` (FK Usuario), `valor`, `fecha` |
| `Resena` | `id`, `calificacionId` (FK única), `texto`, `fechaCreacion`, `estadoVisibilidad` |
| `ReputacionPrestador` | `prestadorId` (FK única), `valorAgregado`, `cantidadCalificaciones`, `fechaCalculo` |
| `SolicitudVerificacion` | `id`, `prestadorId`, `estado` (PENDIENTE/APROBADA/RECHAZADA), `fechaSolicitud`, `fechaRevision` |
| `DocumentoVerificacion` | `id`, `solicitudVerificacionId`, `archivoKey`, `fechaCarga` |
| `Reporte` *(núcleo compartido)* | `id`, `tipo` (inicialmente RESENA), `reportanteId`, `objetivoId`, `motivo`, `estado`, `fechaCreacion` |

Relaciones: `ServicioContratado` 1—0..1 `Calificacion`; `Calificacion` 1—0..1 `Resena`; `Usuario` Prestador 1—1 `ReputacionPrestador`; Prestador 1—N `SolicitudVerificacion`; `SolicitudVerificacion` 1—N `DocumentoVerificacion`; `Resena` 1—N `Reporte`.

**Reglas estructurales**:
- `servicio_id` en `calificaciones` debe ser único.
- solo el Cliente asignado al servicio puede calificarlo.
- solo servicios `FINALIZADO` son calificables.
- debe existir como máximo una `SolicitudVerificacion` PENDIENTE por Prestador.
- la reputación materializada debe poder reconstruirse exclusivamente desde `Calificacion`.

## API Contracts

| Método | Endpoint | Request | Respuesta éxito | Errores |
|---|---|---|---|---|
| POST | `/api/v1/servicios/{servicioId}/calificacion` | `{ valor }` | `201 { id, reputacionActualizada }` | `403/404`; `409` no finalizado o ya calificado |
| POST | `/api/v1/calificaciones/{id}/resena` | `{ texto }` | `201 { id }` | `403/404`; `409` reseña ya existente |
| GET | `/api/v1/prestadores/{prestadorId}/confianza` | — | `200 { reputacion, cantidadCalificaciones, nivelVerificacion }` | `404` perfil no disponible |
| POST | `/api/v1/verificaciones` | multipart/documentos | `202 { id, estado: "PENDIENTE" }` | `409` solicitud pendiente o nivel máximo; `400` documento inválido |
| GET | `/api/v1/verificaciones/mia` | — | `200 { ... }` | `404` sin solicitud |
| POST | `/api/v1/resenas/{id}/reportes` | `{ motivo }` | `201 { reporteId }` | `404` reseña no disponible; `409` reporte equivalente abierto |

Todos los endpoints de escritura validan identidad y pertenencia; la consulta de confianza expone solo información pública aprobada.

## Testing Strategy

- **Arquitectura**: comprobar `Service implements UseCase`, constructores de entrada con interfaces, ausencia de Spring/JPA/HTTP en dominio/aplicación, mappers separados y transacciones verificadas con PostgreSQL cuando aplique.

- **Contract tests**: todos los endpoints anteriores, incluyendo duplicados y estados no elegibles.
- **Integration tests**: los 10 Acceptance Scenarios del SPEC con PostgreSQL real; calificación + recálculo de reputación dentro de una operación consistente.
- **Unit tests**: elegibilidad para calificar, cálculo de reputación, límite de una solicitud de verificación pendiente, tope de nivel, creación de reporte de reseña.
- **Security tests**: un Cliente no puede calificar servicios ajenos ni un Prestador alterar su propia reputación.

## Project Structure

```text
backend/src/main/java/com/aliado/
├── confianza/
│   ├── domain/
│   │   ├── model/
│   │   │   Calificacion, Resena, ReputacionPrestador, SolicitudVerificacion, DocumentoVerificacion
│   │   └── repository/
│   │       CalificacionRepository, ResenaRepository, ReputacionRepository, SolicitudVerificacionRepository,
│   │       DocumentoVerificacionRepository
│   ├── application/
│   │   ├── usecase/
│   │   │   CalificarServicioUseCase, AgregarResenaUseCase, ConsultarConfianzaPrestadorUseCase,
│   │   │   SolicitarVerificacionUseCase, ConsultarVerificacionPropiaUseCase
│   │   ├── service/
│   │   │   CalificarServicioService, AgregarResenaService, ConsultarConfianzaPrestadorService,
│   │   │   SolicitarVerificacionService, ConsultarVerificacionPropiaService
│   │   ├── dto/
│   │   │   Command/Query/Result de las operaciones del módulo (sin HTTP/JPA)
│   │   └── port/
│   │       ArchivoStorageService (reutilizado), ConsultaServicioFinalizadoPort
│   ├── infrastructure/
│   │   ├── persistence/
│   │   │   ├── entity/
│   │   │   │   CalificacionEntity, ResenaEntity, ReputacionPrestadorEntity, SolicitudVerificacionEntity,
│   │   │   │   DocumentoVerificacionEntity
│   │   │   ├── mapper/
│   │   │   │   CalificacionMapper, ResenaMapper, ReputacionPrestadorMapper, SolicitudVerificacionMapper,
│   │   │   │   DocumentoVerificacionMapper
│   │   │   ├── jpa/
│   │   │   │   CalificacionJpaRepository, ResenaJpaRepository, ReputacionJpaRepository,
│   │   │   │   SolicitudVerificacionJpaRepository, DocumentoVerificacionJpaRepository
│   │   │   └── adapter/
│   │   │       CalificacionPersistenceAdapter, ResenaPersistenceAdapter, ReputacionPersistenceAdapter,
│   │   │       SolicitudVerificacionPersistenceAdapter, DocumentoVerificacionPersistenceAdapter
│   │   └── adapter/
│   │       Adaptadores de puertos requeridos; reutilizar contratos existentes
│   └── presentation/
│       ├── controller/
│       │   CalificacionController, VerificacionController, ConfianzaController
│       ├── dto/
│       │   Request/Response HTTP según API Contracts
│       └── mapper/
│           Conversión HTTP ↔ Command/Query/Result
└── reportes/
    ├── domain/
    │   ├── model/
    │   │   Reporte
    │   └── repository/
    │       ReporteRepository
    ├── application/
    │   ├── usecase/
    │   │   ReportarResenaUseCase
    │   ├── service/
    │   │   ReportarResenaService
    │   ├── dto/
    │   │   Command/Query/Result de las operaciones del módulo (sin HTTP/JPA)
    │   └── port/
    │       ArchivoStorageService (reutilizado), ConsultaServicioFinalizadoPort
    └── infrastructure/
        ├── persistence/
        │   ├── entity/
        │   │   ReporteEntity
        │   ├── mapper/
        │   │   ReporteMapper
        │   ├── jpa/
        │   │   ReporteJpaRepository
        │   └── adapter/
        │       ReportePersistenceAdapter
        └── adapter/
            Adaptadores de puertos requeridos; reutilizar contratos existentes
```

**Contrato de arquitectura**: cada operación tiene una interfaz `application/usecase/*UseCase` y una implementación `application/service/*Service implements *UseCase`. Controllers, filtros, gateways y workers inyectan las interfaces por constructor; no servicios concretos ni repositorios JPA. Los servicios coordinan dominio y puertos sin importar Spring, JPA o HTTP. Dominio contiene modelos, reglas, excepciones de negocio y repositorios propios; infraestructura implementa los puertos y configura transacciones. Los DTO HTTP y sus mappers pertenecen a presentación; Command/Query/Result de aplicación son independientes del transporte.

Los contratos entre módulos son interfaces públicas de aplicación; no se accede a Service concreto, repositorio interno o entidad JPA de otro módulo. Cuando se requiera persistencia se separan `domain/repository`, `infrastructure/persistence/entity`, `mapper`, `jpa` y `adapter`. La configuración de Spring conecta puertos y adaptadores, y conserva la transacción completa del caso de uso. Solo crear clases/carpetas con responsabilidad real. `common` contiene infraestructura/contratos transversales acotados; el contexto de Spring Security no entra a aplicación. `SesionAutenticada` es contrato puro en `auth/application/port`; generación aleatoria segura del token y huella SHA-256 son responsabilidades separadas.

### Interfaces de entrada e implementaciones

| Módulo | UseCase (interfaz) | Service (implementación) |
|---|---|---|
| `confianza` | `CalificarServicioUseCase` | `CalificarServicioService` |
| `confianza` | `AgregarResenaUseCase` | `AgregarResenaService` |
| `confianza` | `ConsultarConfianzaPrestadorUseCase` | `ConsultarConfianzaPrestadorService` |
| `confianza` | `SolicitarVerificacionUseCase` | `SolicitarVerificacionService` |
| `confianza` | `ConsultarVerificacionPropiaUseCase` | `ConsultarVerificacionPropiaService` |
| `reportes` | `ReportarResenaUseCase` | `ReportarResenaService` |

Puertos de salida: ArchivoStorageService, ConsultaServicioFinalizadoPort y contratos públicos de reputación/reportes. Las interfaces de entrada no crean endpoints nuevos; mantener API Contracts y las condiciones Could/Future. Las tareas existentes conservan IDs, historias, dependencias y orden: los nombres de servicio agrupado de origen se descomponen en estas operaciones, sin añadir tareas funcionales.

Persistencia de referencia: `calificaciones`, `resenas`, `reputaciones_prestador`, `solicitudes_verificacion`, `documentos_verificacion`, `reportes`. El [manual entregado](../../tasks/fuentes/manual-base-de-datos-aliado.md) detalla el modelo MVP; no implica que los scripts V1–V6 ya estén disponibles o ejecutados.

**Structure Decision**: `confianza/` concentra calificaciones, reputación y verificación. El reporte de reseña se crea mediante un módulo `reportes/` mínimo y genérico para evitar que SPEC-10, SPEC-11 y SPEC-12 definan tres infraestructuras incompatibles. SPEC-11 ampliará sus tipos/objetivos y SPEC-12 administrará su ciclo de moderación.

---

## Phase 1: Setup

- [ ] T001 Crear paquetes `confianza/` y núcleo `reportes/`.
- [ ] T002 Migración Flyway: `calificaciones`, `resenas`, `reputaciones_prestador`, `solicitudes_verificacion`, `documentos_verificacion`, `reportes`.
- [ ] T003 Añadir constraints: `calificaciones.servicio_id UNIQUE` y unicidad parcial/equivalente para una verificación PENDIENTE por Prestador.

---

## Phase 2: Foundational

- [ ] T004 Crear la regla de dominio de recálculo de reputación del Prestador a partir de calificaciones persistidas.
- [ ] T005 Integrar `ArchivoStorageService` para documentos de verificación con objetos privados y referencias persistidas, nunca archivos públicos.
- [ ] T006 Crear `ReportarResenaUseCase.ejecutar()` como primer uso del módulo compartido.
- [ ] T007 Extender el DTO público del Prestador de SPEC-05/03 con `reputacionAgregada` y `nivelVerificacion`, sin exponer documentos.

**Checkpoint**: confianza base disponible; historias de calificación, verificación y reporte pueden avanzar.

---

## Phase 3: User Story 1 - Calificar servicio finalizado [UC059, UC061] (Priority: P1)

**Goal**: un Cliente califica una sola vez un servicio propio finalizado y la reputación se recalcula.

**Independent Test**: finalizar un servicio, calificarlo y comprobar persistencia + reputación; repetir sobre servicio no finalizado y duplicado.

### Tests

- [ ] T008 [P] [US1] Contract test `POST /servicios/{id}/calificacion`.
- [ ] T009 [P] [US1] Integration test: éxito, servicio no finalizado, cancelado, duplicado, servicio ajeno.
- [ ] T010 [P] [US1] Unit test de cálculo reproducible de reputación.

### Implementation

- [ ] T011 [P] [US1] Modelos `Calificacion`, `ReputacionPrestador`.
- [ ] T012 [US1] `CalificarServicioUseCase.ejecutar()` valida actor, estado `FINALIZADO` y unicidad.
- [ ] T013 [US1] Ejecutar persistencia de `Calificacion` + recálculo de reputación por regla de dominio en transacción consistente.
- [ ] T014 [US1] Endpoint de calificación.

**Checkpoint**: reputación deriva exclusivamente de calificaciones válidas.

---

## Phase 4: User Story 2 - Agregar reseña textual [UC060] (Priority: P2)

**Goal**: añadir texto opcional únicamente sobre una calificación existente del Cliente.

### Tests

- [ ] T015 [P] [US2] Contract test `POST /calificaciones/{id}/resena`.
- [ ] T016 [P] [US2] Integration test con/sin calificación previa y acceso ajeno.

### Implementation

- [ ] T017 [P] [US2] Modelo `Resena`.
- [ ] T018 [US2] `AgregarResenaUseCase.ejecutar()` con relación 1:0..1.
- [ ] T019 [US2] Endpoint de reseña.

---

## Phase 5: User Story 3 - Mostrar nivel de verificación [UC062] (Priority: P1)

- [ ] T020 [P] [US3] Contract test `GET /prestadores/{id}/confianza`.
- [ ] T021 [US3] Implementar `ConfianzaController`.
- [ ] T022 [US3] Integrar confianza en el perfil público canónico de SPEC-05/03, con texto que no implique certificación legal.

---

## Phase 6: User Story 4 - Solicitar verificación documental ampliada [UC063] (Priority: P1)

- [ ] T023 [P] [US4] Contract tests de creación/consulta de solicitud.
- [ ] T024 [P] [US4] Integration test: solicitud válida, duplicada pendiente y nivel máximo.
- [ ] T025 [US4] Modelos `SolicitudVerificacion`, `DocumentoVerificacion`.
- [ ] T026 [US4] `SolicitarVerificacionUseCase.ejecutar()` y carga segura de documentos.
- [ ] T027 [US4] Endpoints de verificación.

**Checkpoint**: la revisión administrativa queda pendiente de SPEC-12; este plan solo registra la solicitud y su estado.

---

## Phase 7: User Story 5 - Reportar reseña problemática [UC064] (Priority: P2)

- [ ] T028 [P] [US5] Contract test `POST /resenas/{id}/reportes`.
- [ ] T029 [P] [US5] Integration test: reporte válido, reseña no disponible, reporte equivalente abierto.
- [ ] T030 [US5] Integrar `ReportarResenaUseCase.ejecutar()`.
- [ ] T031 [US5] Endpoint de reporte.

---

## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F10-FE-01** Calificar una vez al finalizar servicio y agregar reseña a la calificación propia.
- [ ] **F10-FE-02** Mostrar reputación y nivel de verificación con explicación; sin presentar garantía o certificación legal.
- [ ] **F10-FE-03** Prestador carga documentos privados y consulta estado; impedir otra solicitud pendiente.
- [ ] **F10-FE-04** Reportar reseña con motivo y comprobante; administración recibe resultado en cola F12.
- [ ] **F10-FE-05** Integrar confianza en búsqueda/vista previa F03/F05 cuando el contrato quede disponible.

Aplicar [estados y contrato de cliente](../../tasks/01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación de la feature

- [ ] **F10-QA-01** Un servicio sin finalizar o calificado rechaza otra calificación; carrera concurrente protegida por UNIQUE.
- [ ] **F10-QA-02** Recalcular/reconstruir reputación desde calificaciones, preservarla si moderación oculta una reseña.
- [ ] **F10-QA-03** Documentos accesibles solo por solicitante y administración autorizada; una verificación pendiente por prestador.
- [ ] **F10-QA-04** Reportes de reseña se almacenan en reportes, nunca en una tabla paralela.
- [ ] **F10-QA-05** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Dependencies & Execution Order

- SPEC-01, SPEC-05 y SPEC-08 deben estar disponibles antes de Phase 3.
- `ArchivoStorageService` de SPEC-04 es requerido para Phase 6.
- Phase 2 bloquea las historias.
- US1 y US3 pueden ejecutarse en paralelo tras Foundational.
- US2 depende de US1.
- US4 es independiente de US1/US2 después de Foundational.
- US5 depende de US2 y será consumida por SPEC-12.

## Notes

- La aprobación/rechazo administrativo de verificación se implementa en SPEC-12; SPEC-10 no inventa un flujo de administrador no definido aquí.
- `[NEEDS CLARIFICATION]`: documentos exactos exigidos y formatos/tamaños máximos para verificación.
- El valor de reputación puede materializarse por rendimiento, pero `Calificacion` es la fuente de verdad.
- El nivel de verificación nunca debe presentarse como certificación legal.
