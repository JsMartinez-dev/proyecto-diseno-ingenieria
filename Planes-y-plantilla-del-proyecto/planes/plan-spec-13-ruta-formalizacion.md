# Implementation Plan: SPEC-13

**Date**: 2026-10-02  
**Spec**: [spec-13-ruta-formalizacion](../../FASE-4-Prototipar/specs/spec-13-ruta-formalizacion.md)
**Depends on**: `plan-spec-01-autenticacion.md` (Prestador autenticado), `plan-spec-05-perfil-profesional.md` (Prestador/perfil)

## Summary

SPEC-13 crea una ruta de formalización estrictamente orientativa: pasos y recursos oficiales, progreso del Prestador y una capacidad futura de vinculación institucional. El módulo no certifica, infiere ni declara estatus legal.

La ruta y sus enlaces se modelan como contenido configurable. El progreso pertenece al Prestador; la insignia visual de SPEC-18 será una proyección de este progreso y no una fuente de datos independiente.

## Technical Context

**Language/Version**: Java 21 LTS  
**Primary Dependencies**: Spring Boot 3.3.x, Data JPA, Validation, Flyway  
**Build tool**: Maven  
**Storage**: PostgreSQL 16  
**Testing**: JUnit 5 + Mockito; Spring Boot Test + Testcontainers; MockMvc  
**Target Platform**: VPS Hostinger  
**Constraints**: lenguaje no certificante; enlaces externos deben identificarse; capacidad Future deshabilitada por defecto  
**Scale/Scope**: módulo informativo para Prestadores

## Data Model

| Entidad | Campos clave |
|---|---|
| `RutaFormalizacion` | `id`, `nombre`, `descripcion`, `activa` |
| `PasoFormalizacion` | `id`, `rutaId`, `titulo`, `descripcion`, `orden` |
| `EnlaceInstitucional` | `id`, `pasoId`, `nombre`, `url`, `estado` |
| `ProgresoFormalizacion` | `id`, `prestadorId`, `rutaId`, `valor/estadoOrientativo`, `fechaActualizacion` |
| `VinculacionInstitucional` *(Future)* | `id`, `rutaId`, `proveedor`, `habilitada`, `configuracion` |

`ProgresoFormalizacion` se mantiene deliberadamente neutral respecto a certificación.

## API Contracts

| Método | Endpoint | Respuesta |
|---|---|---|
| GET | `/api/v1/formalizacion/ruta` | ruta, pasos, recursos, disclaimer |
| GET | `/api/v1/formalizacion/enlaces/{id}` | metadata del enlace/destino externo |
| GET | `/api/v1/formalizacion/progreso` | progreso orientativo + disclaimer |
| PUT | `/api/v1/formalizacion/progreso` | actualiza avance orientativo permitido |
| GET | `/api/v1/formalizacion/vinculacion` | solo si feature Future habilitada |

## Testing Strategy

- **Arquitectura**: comprobar `Service implements UseCase`, constructores de entrada con interfaces, ausencia de Spring/JPA/HTTP en dominio/aplicación, mappers separados y transacciones verificadas con PostgreSQL cuando aplique.

- 7 Acceptance Scenarios.
- Tests de contrato garantizan que el disclaimer esté presente en progreso.
- Tests de integración para enlace no disponible y 100% de progreso sin certificación.
- Test de feature flag: vinculación Future apagada no modifica UC077–UC079.

## Project Structure

```text
backend/src/main/java/com/aliado/
└── formalizacion/
    ├── domain/
    │   ├── model/
    │   │   RutaFormalizacion, PasoFormalizacion, EnlaceInstitucional, ProgresoFormalizacion
    │   └── repository/
    │       RutaRepository, PasoRepository, EnlaceRepository, ProgresoRepository
    ├── application/
    │   ├── usecase/
    │   │   ConsultarRutaFormalizacionUseCase, ConsultarEnlaceInstitucionalUseCase,
    │   │   ConsultarProgresoFormalizacionUseCase, ActualizarProgresoFormalizacionUseCase,
    │   │   ConsultarVinculacionInstitucionalUseCase
    │   ├── service/
    │   │   ConsultarRutaFormalizacionService, ConsultarEnlaceInstitucionalService,
    │   │   ConsultarProgresoFormalizacionService, ActualizarProgresoFormalizacionService,
    │   │   ConsultarVinculacionInstitucionalService
    │   ├── dto/
    │   │   Command/Query/Result de las operaciones del módulo (sin HTTP/JPA)
    │   └── port/
    │       Puerto institucional solo si UC080 se aprueba
    ├── infrastructure/
    │   ├── persistence/
    │   │   ├── entity/
    │   │   │   RutaFormalizacionEntity, PasoFormalizacionEntity, EnlaceInstitucionalEntity, ProgresoFormalizacionEntity
    │   │   ├── mapper/
    │   │   │   RutaFormalizacionMapper, PasoFormalizacionMapper, EnlaceInstitucionalMapper, ProgresoFormalizacionMapper
    │   │   ├── jpa/
    │   │   │   RutaJpaRepository, PasoJpaRepository, EnlaceJpaRepository, ProgresoJpaRepository
    │   │   └── adapter/
    │   │       RutaPersistenceAdapter, PasoPersistenceAdapter, EnlacePersistenceAdapter, ProgresoPersistenceAdapter
    │   └── adapter/
    │       Adaptadores de puertos requeridos; reutilizar contratos existentes
    └── presentation/
        ├── controller/
        │   FormalizacionController
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
| `formalizacion` | `ConsultarRutaFormalizacionUseCase` | `ConsultarRutaFormalizacionService` |
| `formalizacion` | `ConsultarEnlaceInstitucionalUseCase` | `ConsultarEnlaceInstitucionalService` |
| `formalizacion` | `ConsultarProgresoFormalizacionUseCase` | `ConsultarProgresoFormalizacionService` |
| `formalizacion` | `ActualizarProgresoFormalizacionUseCase` | `ActualizarProgresoFormalizacionService` |
| `formalizacion` | `ConsultarVinculacionInstitucionalUseCase` | `ConsultarVinculacionInstitucionalService` |

Puertos de salida: repositorios de dominio para ruta/progreso; puerto institucional únicamente si se aprueba UC080. Las interfaces de entrada no crean endpoints nuevos; mantener API Contracts y las condiciones Could/Future. Las tareas existentes conservan IDs, historias, dependencias y orden: los nombres de servicio agrupado de origen se descomponen en estas operaciones, sin añadir tareas funcionales.

Persistencia de referencia: `rutas_formalizacion`, `pasos_formalizacion`, `enlaces_institucionales`, `progreso_formalizacion`. El [manual entregado](../../tasks/fuentes/manual-base-de-datos-aliado.md) detalla el modelo MVP; no implica que los scripts V1–V6 ya estén disponibles o ejecutados.


---

## Phase 1: Setup

- [ ] T001 Crear módulo `formalizacion/`.
- [ ] T002 Migraciones de ruta, pasos, enlaces, progreso y configuración de vinculación futura.
- [ ] T003 Seed inicial de la ruta solo con contenido aprobado por el proyecto.

## Phase 2: Foundational

- [ ] T004 Centralizar texto/flag `progresoOrientativoNoCertificante`.
- [ ] T005 Feature flag `formalizacion.integracion-institucional.enabled=false`.
- [ ] T006 Validación de URLs externas configuradas sin asumir que su contenido fue completado.

## Phase 3: User Story 1 - Consultar ruta [UC077] (Priority: P1)

- [ ] T007 Contract/integration tests.
- [ ] T008 ConsultarRutaFormalizacionUseCase y ConsultarRutaFormalizacionService.
- [ ] T009 Endpoint `GET /formalizacion/ruta`.

## Phase 4: User Story 2 - Abrir enlaces oficiales [UC078] (Priority: P2)

- [ ] T010 Tests de enlace disponible/no disponible.
- [ ] T011 `EnlaceInstitucional` + servicio de consulta.
- [ ] T012 Endpoint de metadata/redirección segura.

## Phase 5: User Story 3 - Progreso orientativo [UC079] (Priority: P1)

- [ ] T013 Tests para avance parcial y máximo.
- [ ] T014 ConsultarProgresoFormalizacionUseCase y ActualizarProgresoFormalizacionUseCase con sus Service; progreso siempre orientativo.
- [ ] T015 Endpoints de consulta/actualización.
- [ ] T016 Verificar disclaimer incluso al 100%.

## Phase 6: User Story 4 - Vinculación institucional futura [UC080] (Priority: P3)

- [ ] T017 Test: feature deshabilitada por defecto.
- [ ] T018 Adaptador/interfaz `FuenteInstitucionalFormalizacion`.
- [ ] T019 Implementación simulada únicamente para entorno de prueba.
- [ ] T020 Asegurar que ninguna respuesta externa cambia automáticamente el estatus legal del Prestador.

## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F13-FE-01** Ruta del Prestador con pasos, recursos y aviso visible de carácter orientativo.
- [ ] **F13-FE-02** Abrir enlaces institucionales como destinos externos, informar URL no disponible sin alterar progreso.
- [ ] **F13-FE-03** Consultar/actualizar avance autorizado conforme fórmula y fuente acordadas.
- [ ] **F13-FE-04** Mostrar el mismo aviso al llegar a 100%; no afirmar certificación ni habilitar vínculo Future.

Aplicar [estados y contrato de cliente](../../tasks/01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación de la feature

- [ ] **F13-QA-01** Usuario solo actualiza su progreso; validar rango y unicidad prestador/ruta.
- [ ] **F13-QA-02** Mismo contenido/configuración alimenta todos los clientes; no inferir trámites completados por abrir enlaces.
- [ ] **F13-QA-03** Flag institucional OFF no afecta consulta de ruta/progreso.
- [ ] **F13-QA-04** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Dependencies & Execution Order

US1 y US3 constituyen el núcleo. US2 puede avanzar después del modelo de ruta. US4 queda aislada mediante feature flag y no bloquea el MVP.

## Notes

- `[NEEDS CLARIFICATION]`: fórmula/representación exacta del progreso; el SPEC solo exige que sea orientativo.
- `[NEEDS CLARIFICATION]`: fuente y responsable de mantener el contenido oficial de la ruta.
- No se implementa verificación legal automática.
