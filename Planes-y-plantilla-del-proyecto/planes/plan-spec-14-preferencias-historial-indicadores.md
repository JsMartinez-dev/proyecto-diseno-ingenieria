# Implementation Plan: SPEC-14

**Date**: 2026-10-02  
**Spec**: [spec-14-preferencias-historial-indicadores](../../FASE-4-Prototipar/specs/spec-14-preferencias-historial-indicadores.md)
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

- **Arquitectura**: comprobar `Service implements UseCase`, constructores de entrada con interfaces, ausencia de Spring/JPA/HTTP en dominio/aplicación, mappers separados y transacciones verificadas con PostgreSQL cuando aplique.

- 9 Acceptance Scenarios.
- Tests de privacidad: historial/exportación jamás incluyen servicios ajenos.
- Preferencias: tipo obligatorio no puede deshabilitarse.
- Indicadores: resultados reproducibles.
- Actividad: desempate estable `(fecha, secuencia/id)`.

## Project Structure

```text
backend/src/main/java/com/aliado/
├── preferencias/
│   ├── domain/
│   │   ├── model/
│   │   │   PreferenciaNotificacion
│   │   └── repository/
│   │       PreferenciaNotificacionRepository
│   ├── application/
│   │   ├── usecase/
│   │   │   ConsultarPreferenciasNotificacionUseCase, ActualizarPreferenciasNotificacionUseCase
│   │   ├── service/
│   │   │   ConsultarPreferenciasNotificacionService, ActualizarPreferenciasNotificacionService
│   │   ├── dto/
│   │   │   Command/Query/Result de las operaciones del módulo (sin HTTP/JPA)
│   │   └── port/
│   │       Consultas públicas de servicios, confianza y eventos; storage para exportación
│   ├── infrastructure/
│   │   ├── persistence/
│   │   │   ├── entity/
│   │   │   │   PreferenciaNotificacionEntity
│   │   │   ├── mapper/
│   │   │   │   PreferenciaNotificacionMapper
│   │   │   ├── jpa/
│   │   │   │   PreferenciaNotificacionJpaRepository
│   │   │   └── adapter/
│   │   │       PreferenciaNotificacionPersistenceAdapter
│   │   └── adapter/
│   │       Adaptadores de puertos requeridos; reutilizar contratos existentes
│   └── presentation/
│       ├── controller/
│       │   PreferenciaNotificacionController
│       ├── dto/
│       │   Request/Response HTTP según API Contracts
│       └── mapper/
│           Conversión HTTP ↔ Command/Query/Result
├── historial/
│   ├── domain/
│   │   └── model/
│   │       DescargaHistorial
│   ├── application/
│   │   ├── usecase/
│   │   │   ConsultarHistorialTrabajosUseCase, ExportarHistorialTrabajosUseCase
│   │   ├── service/
│   │   │   ConsultarHistorialTrabajosService, ExportarHistorialTrabajosService
│   │   ├── dto/
│   │   │   Command/Query/Result de las operaciones del módulo (sin HTTP/JPA)
│   │   └── port/
│   │       Consultas públicas de servicios, confianza y eventos; storage para exportación
│   ├── infrastructure/
│   │   └── adapter/
│   │       Adaptadores de puertos requeridos; reutilizar contratos existentes
│   └── presentation/
│       ├── controller/
│       │   HistorialController
│       ├── dto/
│       │   Request/Response HTTP según API Contracts
│       └── mapper/
│           Conversión HTTP ↔ Command/Query/Result
├── indicadores/
│   ├── application/
│   │   ├── usecase/
│   │   │   ConsultarIndicadoresPrestadorUseCase
│   │   ├── service/
│   │   │   ConsultarIndicadoresPrestadorService
│   │   ├── dto/
│   │   │   Command/Query/Result de las operaciones del módulo (sin HTTP/JPA)
│   │   └── port/
│   │       Consultas públicas de servicios, confianza y eventos; storage para exportación
│   ├── infrastructure/
│   │   └── adapter/
│   │       Adaptadores de puertos requeridos; reutilizar contratos existentes
│   └── presentation/
│       ├── controller/
│       │   IndicadorController
│       ├── dto/
│       │   Request/Response HTTP según API Contracts
│       └── mapper/
│           Conversión HTTP ↔ Command/Query/Result
└── actividad/
    ├── application/
    │   ├── usecase/
    │   │   ConsultarActividadRecienteUseCase
    │   ├── service/
    │   │   ConsultarActividadRecienteService
    │   ├── dto/
    │   │   Command/Query/Result de las operaciones del módulo (sin HTTP/JPA)
    │   └── port/
    │       Consultas públicas de servicios, confianza y eventos; storage para exportación
    ├── infrastructure/
    │   └── adapter/
    │       Adaptadores de puertos requeridos; reutilizar contratos existentes
    └── presentation/
        ├── controller/
        │   ActividadController
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
| `preferencias` | `ConsultarPreferenciasNotificacionUseCase` | `ConsultarPreferenciasNotificacionService` |
| `preferencias` | `ActualizarPreferenciasNotificacionUseCase` | `ActualizarPreferenciasNotificacionService` |
| `historial` | `ConsultarHistorialTrabajosUseCase` | `ConsultarHistorialTrabajosService` |
| `historial` | `ExportarHistorialTrabajosUseCase` | `ExportarHistorialTrabajosService` |
| `indicadores` | `ConsultarIndicadoresPrestadorUseCase` | `ConsultarIndicadoresPrestadorService` |
| `actividad` | `ConsultarActividadRecienteUseCase` | `ConsultarActividadRecienteService` |

Puertos de salida: consultas públicas de servicios/confianza/eventos y ArchivoStorageService para exportación; ConsultaPreferenciasPort se consume desde notificaciones. Las interfaces de entrada no crean endpoints nuevos; mantener API Contracts y las condiciones Could/Future. Las tareas existentes conservan IDs, historias, dependencias y orden: los nombres de servicio agrupado de origen se descomponen en estas operaciones, sin añadir tareas funcionales.

Persistencia de referencia: `preferencias_notificacion`, `descargas_historial`. El [manual entregado](../../tasks/fuentes/manual-base-de-datos-aliado.md) detalla el modelo MVP; no implica que los scripts V1–V6 ya estén disponibles o ejecutados.


---

## Phase 1: Setup

- [ ] T001 Crear módulos de lectura/configuración.
- [ ] T002 Migración `preferencias_notificacion`; `descargas_historial` solo si se requiere persistir metadata.
- [ ] T003 Añadir catálogo de tipos/canales configurables y obligatorios.

## Phase 2: Foundational

- [ ] T004 Integrar el contrato de preferencias con notificaciones mediante ConsultaPreferenciasPort y adaptador; ningún módulo depende de Service concreto ajeno.
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
- [ ] T013 ConsultarHistorialTrabajosUseCase y su Service consultan contratos públicos de servicios autorizados.
- [ ] T014 Endpoint paginado.

## Phase 5: User Story 3 - Descargar historial [UC083] (Priority: P2)

- [ ] T015 Tests de contenido equivalente y reintento.
- [ ] T016 ExportarHistorialTrabajosUseCase y su Service generan desde la misma consulta autorizada de US2.
- [ ] T017 Endpoint de exportación.
- [ ] T018 Garantizar que el reintento no modifica historial.

## Phase 6: User Story 4 - Indicadores básicos [UC084] (Priority: P1)

- [ ] T019 Tests con dataset conocido.
- [ ] T020 Definir versión de fórmula.
- [ ] T021 ConsultarIndicadoresPrestadorUseCase y su Service consultan servicios/calificaciones propios mediante contratos públicos.
- [ ] T022 Endpoint.
- [ ] T023 Incluir servicios cancelados o en moderación conforme al escenario explícito del SPEC; documentar fórmula.

## Phase 7: User Story 5 - Actividad reciente [UC085] (Priority: P2)

- [ ] T024 Tests de visibilidad y orden.
- [ ] T025 ConsultarActividadRecienteUseCase y su Service construyen una proyección de eventos autorizados existentes.
- [ ] T026 Endpoint paginado/limitado.

## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F14-FE-01** Preferencias por tipo/canal mostrando cuáles son obligatorias y no editables.
- [ ] **F14-FE-02** Historial Cliente/Prestador con paginación/filtros; descarga usa los mismos filtros y datos autorizados.
- [ ] **F14-FE-03** Indicadores del Prestador con fórmula explicada y rango temporal; no mezclar actividad de terceros.
- [ ] **F14-FE-04** Actividad reciente ordenada y enlaces autorizados; mostrar fallo/vencimiento de descarga sin generar archivos públicos.

Aplicar [estados y contrato de cliente](../../tasks/01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación de la feature

- [ ] **F14-QA-01** Exportación coincide con consulta bajo misma versión/snapshot/filtros; nunca añade campos privados.
- [ ] **F14-QA-02** Preferencias no desactivan avisos obligatorios; conectar worker F09 sin ciclo entre módulos.
- [ ] **F14-QA-03** Dataset con servicios cancelados/en moderación conserva inclusión indicada por UC084.
- [ ] **F14-QA-04** Historial/indicadores/actividad se derivan de fuentes existentes, sin tablas duplicadas.
- [ ] **F14-QA-05** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Dependencies & Execution Order

US1 depende de SPEC-09; US2 de SPEC-08; US4 de SPEC-08/10. US3 depende de US2. US5 puede implementarse al final como agregación de eventos.

## Notes

- El historial no es una tabla duplicada.
- Los indicadores no deben persistirse salvo que mediciones demuestren necesidad; si se cachean/materializan, deben incluir versión de fórmula.
- El SPEC indica explícitamente que servicios cancelados o en moderación **se incluyen** en el escenario UC084; la fórmula debe conservar esa decisión salvo cambio formal del SPEC.
