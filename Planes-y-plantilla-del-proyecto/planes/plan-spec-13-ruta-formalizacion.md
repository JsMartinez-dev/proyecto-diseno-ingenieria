# Implementation Plan: SPEC-13

**Date**: 2026-10-02  
**Spec**: [spec-13-ruta-formalizacion](FASE-4-Prototipar/specs/spec-13-ruta-formalizacion)  
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

- 7 Acceptance Scenarios.
- Tests de contrato garantizan que el disclaimer esté presente en progreso.
- Tests de integración para enlace no disponible y 100% de progreso sin certificación.
- Test de feature flag: vinculación Future apagada no modifica UC077–UC079.

## Project Structure

```text
backend/src/main/java/com/aliado/
└── formalizacion/
    ├── presentation/controller/       FormalizacionController
    ├── application/service/           RutaFormalizacionService, ProgresoFormalizacionService,
    │               VinculacionInstitucionalService
    ├── domain/repository/             RutaRepository, PasoRepository, EnlaceRepository,
    │               ProgresoRepository, VinculacionRepository
    └── domain/model/                  RutaFormalizacion, PasoFormalizacion, EnlaceInstitucional,
                    ProgresoFormalizacion, VinculacionInstitucional
```

**Arquitectura por capas**: este SPEC conserva la organización modular y aplica Arquitectura Limpia según las secciones 7.1–7.5 de [plan-general-ALIADO](plan-general-ALIADO.md#7-estructura-lógica-del-repositorio). Las rutas del árbol son relativas a cada módulo: `domain/` contiene modelos, reglas y puertos; `application/` coordina los casos de uso; `presentation/` expone HTTP; `infrastructure/` implementa los detalles técnicos. El dominio no importa Spring, JPA ni DTO HTTP; la aplicación depende de contratos de dominio/aplicación, nunca de adaptadores concretos. Los DTO de aplicación van en `application/dto/` y los contratos HTTP en `presentation/dto/`, con conversión en presentación cuando corresponda.

Cuando haya persistencia, los `*Repository` del árbol son puertos en `domain/repository/`, sin heredar de Spring Data. Las tareas existentes de persistencia incluyen sus implementaciones en `infrastructure/persistence/`: `entity/` para entidades JPA, `jpa/` para repositorios Spring Data, `adapter/` para implementar los puertos y `mapper/` para convertir dominio y persistencia. Las integraciones externas se definen mediante puertos de aplicación y adaptadores en `infrastructure/adapter/`; los contratos compartidos existentes de `common/` permanecen libres de detalles técnicos. Las dependencias entre módulos utilizan contratos de dominio o servicios públicos de aplicación, sin acceder a entidades JPA ni adaptadores ajenos. Los filtros de seguridad y la configuración de Spring pertenecen a infraestructura técnica; los controladores y la traducción de errores HTTP pertenecen a presentación. Se crean solo las carpetas necesarias para las tareas ya definidas; se conservan sus identificadores, orden y dependencias.

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
- [ ] T008 `RutaFormalizacionService`.
- [ ] T009 Endpoint `GET /formalizacion/ruta`.

## Phase 4: User Story 2 - Abrir enlaces oficiales [UC078] (Priority: P2)

- [ ] T010 Tests de enlace disponible/no disponible.
- [ ] T011 `EnlaceInstitucional` + servicio de consulta.
- [ ] T012 Endpoint de metadata/redirección segura.

## Phase 5: User Story 3 - Progreso orientativo [UC079] (Priority: P1)

- [ ] T013 Tests para avance parcial y máximo.
- [ ] T014 `ProgresoFormalizacionService`.
- [ ] T015 Endpoints de consulta/actualización.
- [ ] T016 Verificar disclaimer incluso al 100%.

## Phase 6: User Story 4 - Vinculación institucional futura [UC080] (Priority: P3)

- [ ] T017 Test: feature deshabilitada por defecto.
- [ ] T018 Adaptador/interfaz `FuenteInstitucionalFormalizacion`.
- [ ] T019 Implementación simulada únicamente para entorno de prueba.
- [ ] T020 Asegurar que ninguna respuesta externa cambia automáticamente el estatus legal del Prestador.

## Dependencies & Execution Order

US1 y US3 constituyen el núcleo. US2 puede avanzar después del modelo de ruta. US4 queda aislada mediante feature flag y no bloquea el MVP.

## Notes

- `[NEEDS CLARIFICATION]`: fórmula/representación exacta del progreso; el SPEC solo exige que sea orientativo.
- `[NEEDS CLARIFICATION]`: fuente y responsable de mantener el contenido oficial de la ruta.
- No se implementa verificación legal automática.
