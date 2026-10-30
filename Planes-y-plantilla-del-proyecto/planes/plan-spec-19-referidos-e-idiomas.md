# Implementation Plan: SPEC-19

**Date**: 2026-10-02  
**Spec**: [spec-19-referidos-e-idiomas](../../FASE-4-Prototipar/specs/spec-19-referidos-e-idiomas.md)
**Depends on**: `plan-spec-01-autenticacion.md`

## Summary

SPEC-19 agrupa dos capacidades `Could` independientes: programa de referidos e idiomas adicionales. Ambas permanecen deshabilitadas por defecto y no bloquean el MVP.

Referidos registra atribución sin permitir auto-referido ni atribución duplicada. Idiomas mantiene español como fallback obligatorio y separa la preferencia del usuario de los recursos de traducción del frontend/backend.

## Technical Context

**Storage**: PostgreSQL 16 — `referidos`, `idiomas_soportados`, `preferencias_idioma` si las features se habilitan  
**Feature flags**: `referidos.enabled=false`, `i18n.additional-languages.enabled=false`  
**Constraints**: antifraude básico; fallback español

## Data Model

| Entidad | Campos |
|---|---|
| `Referido` | `id`, `referenteId`, `referidoId?`, `codigo/mecanismo`, `estadoAtribucion`, `fechaCreacion`, `fechaAtribucion` |
| `IdiomaSoportado` | `codigo`, `nombre`, `habilitado` |
| `PreferenciaIdioma` | `usuarioId`, `idiomaCodigo`, `fechaActualizacion` |

## API Contracts

| Método | Endpoint | Uso |
|---|---|---|
| POST | `/api/v1/referidos` | generar mecanismo de referido |
| POST | `/api/v1/referidos/atribuir` | consumido por registro/activación, idempotente |
| GET/PUT | `/api/v1/preferencias/idioma` | consultar/cambiar idioma |
| GET | `/api/v1/idiomas` | catálogo habilitado |

## Testing Strategy

- **Arquitectura**: comprobar `Service implements UseCase`, constructores de entrada con interfaces, ausencia de Spring/JPA/HTTP en dominio/aplicación, mappers separados y transacciones verificadas con PostgreSQL cuando aplique.

6 Acceptance Scenarios; auto-referido, duplicado y fallback por texto ausente. Feature off debe ocultar ambas capacidades.

## Project Structure

```text
backend/src/main/java/com/aliado/
├── referidos/
│   ├── domain/
│   │   ├── model/
│   │   │   Referido
│   │   └── repository/
│   │       ReferidoRepository
│   ├── application/
│   │   ├── usecase/
│   │   │   GenerarReferidoUseCase, AtribuirReferidoUseCase
│   │   ├── service/
│   │   │   GenerarReferidoService, AtribuirReferidoService
│   │   ├── dto/
│   │   │   Command/Query/Result de las operaciones del módulo (sin HTTP/JPA)
│   │   └── port/
│   │       Contratos de atribución e idiomas
│   └── infrastructure/
│       ├── persistence/
│       │   ├── entity/
│       │   │   ReferidoEntity
│       │   ├── mapper/
│       │   │   ReferidoMapper
│       │   ├── jpa/
│       │   │   ReferidoJpaRepository
│       │   └── adapter/
│       │       ReferidoPersistenceAdapter
│       └── adapter/
│           Adaptadores de puertos requeridos; reutilizar contratos existentes
└── internacionalizacion/
    ├── domain/
    │   ├── model/
    │   │   IdiomaSoportado, PreferenciaIdioma
    │   └── repository/
    │       IdiomaSoportadoRepository, PreferenciaIdiomaRepository
    ├── application/
    │   ├── usecase/
    │   │   ConsultarIdiomasUseCase, ConsultarPreferenciaIdiomaUseCase, ActualizarPreferenciaIdiomaUseCase
    │   ├── service/
    │   │   ConsultarIdiomasService, ConsultarPreferenciaIdiomaService, ActualizarPreferenciaIdiomaService
    │   ├── dto/
    │   │   Command/Query/Result de las operaciones del módulo (sin HTTP/JPA)
    │   └── port/
    │       Contratos de atribución e idiomas
    └── infrastructure/
        ├── persistence/
        │   ├── entity/
        │   │   IdiomaSoportadoEntity, PreferenciaIdiomaEntity
        │   ├── mapper/
        │   │   IdiomaSoportadoMapper, PreferenciaIdiomaMapper
        │   ├── jpa/
        │   │   IdiomaSoportadoJpaRepository, PreferenciaIdiomaJpaRepository
        │   └── adapter/
        │       IdiomaSoportadoPersistenceAdapter, PreferenciaIdiomaPersistenceAdapter
        └── adapter/
            Adaptadores de puertos requeridos; reutilizar contratos existentes
```

**Contrato de arquitectura**: cada operación tiene una interfaz `application/usecase/*UseCase` y una implementación `application/service/*Service implements *UseCase`. Controllers, filtros, gateways y workers inyectan las interfaces por constructor; no servicios concretos ni repositorios JPA. Los servicios coordinan dominio y puertos sin importar Spring, JPA o HTTP. Dominio contiene modelos, reglas, excepciones de negocio y repositorios propios; infraestructura implementa los puertos y configura transacciones. Los DTO HTTP y sus mappers pertenecen a presentación; Command/Query/Result de aplicación son independientes del transporte.

Los contratos entre módulos son interfaces públicas de aplicación; no se accede a Service concreto, repositorio interno o entidad JPA de otro módulo. Cuando se requiera persistencia se separan `domain/repository`, `infrastructure/persistence/entity`, `mapper`, `jpa` y `adapter`. La configuración de Spring conecta puertos y adaptadores, y conserva la transacción completa del caso de uso. Solo crear clases/carpetas con responsabilidad real. `common` contiene infraestructura/contratos transversales acotados; el contexto de Spring Security no entra a aplicación. `SesionAutenticada` es contrato puro en `auth/application/port`; generación aleatoria segura del token y huella SHA-256 son responsabilidades separadas.

### Interfaces de entrada e implementaciones

| Módulo | UseCase (interfaz) | Service (implementación) |
|---|---|---|
| `referidos` | `GenerarReferidoUseCase` | `GenerarReferidoService` |
| `referidos` | `AtribuirReferidoUseCase` | `AtribuirReferidoService` |
| `internacionalizacion` | `ConsultarIdiomasUseCase` | `ConsultarIdiomasService` |
| `internacionalizacion` | `ConsultarPreferenciaIdiomaUseCase` | `ConsultarPreferenciaIdiomaService` |
| `internacionalizacion` | `ActualizarPreferenciaIdiomaUseCase` | `ActualizarPreferenciaIdiomaService` |

Puertos de salida: reglas/puertos de atribución e idiomas independientes del controlador de registro. Las interfaces de entrada no crean endpoints nuevos; mantener API Contracts y las condiciones Could/Future. Las tareas existentes conservan IDs, historias, dependencias y orden: los nombres de servicio agrupado de origen se descomponen en estas operaciones, sin añadir tareas funcionales.

Persistencia de referencia: `referidos`, `idiomas_soportados`, `preferencias_idioma`. Cualquier tabla opcional se diseña/aplica solo con aprobación de la feature; no es parte de las 42 tablas MVP. El [manual entregado](../../tasks/fuentes/manual-base-de-datos-aliado.md) detalla el modelo MVP; no implica que los scripts V1–V6 ya estén disponibles o ejecutados.


---

## Phase 1: Feature flags / Setup

- [ ] T001 Flags OFF.
- [ ] T002 Migraciones de referidos/preferencias solo preparadas; no activación funcional automática.
- [ ] T003 Español configurado como idioma base/fallback.

## Phase 2: User Story 1 - Programa de referidos [UC089] (Priority: P3)

- [ ] T004 Tests feature off.
- [ ] T005 Tests referido válido, auto-referido y duplicado.
- [ ] T006 Modelo/repositorio `Referido`.
- [ ] T007 `GenerarReferidoService implements GenerarReferidoUseCase` y `AtribuirReferidoService implements AtribuirReferidoUseCase` con atribución idempotente.
- [ ] T008 Integración opcional con registro de SPEC-01 sin hacerla bloqueante.
- [ ] T009 Endpoints.

## Phase 3: User Story 2 - Idiomas adicionales [UC092] (Priority: P3)

- [ ] T010 Tests feature off, idioma habilitado y fallback.
- [ ] T011 Catálogo `IdiomaSoportado`.
- [ ] T012 Preferencia por Usuario.
- [ ] T013 Endpoints.
- [ ] T014 Integrar archivos/catálogo i18n en React Native y panel web.
- [ ] T015 Si se retira un idioma soportado, fallback automático a español.

## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F19-FE-01** Compartir identificador/enlace y estado de atribución solo bajo reglas acordadas.
- [ ] **F19-FE-02** Selector de idiomas y diccionario de mensajes propios por feature, respaldo español uniforme.
- [ ] **F19-FE-03** No ofrecer beneficio no definido; no interrumpir registro por referido inválido.

Aplicar [estados y contrato de cliente](../../tasks/01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación de la feature

- [ ] **F19-QA-01** Idempotencia de atribución, auto-referido y duplicados; integrar F01 por puerto opcional.
- [ ] **F19-QA-02** Claves faltantes y error de carga usan español; no mostrar mezcla confusa.
- [ ] **F19-QA-03** Dos flags OFF mantienen registro y textos del MVP intactos.
- [ ] **F19-QA-04** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Notes

- `[NEEDS CLARIFICATION]`: beneficio, campañas, elegibilidad y controles antifraude avanzados de referidos.
- `[NEEDS CLARIFICATION]`: primer idioma adicional y alcance exacto de traducción.
- Una persona invitada puede no tener todavía cuenta; `referidoId` es nullable hasta atribución válida.
