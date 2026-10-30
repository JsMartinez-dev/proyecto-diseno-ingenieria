# Implementation Plan: SPEC-12

**Date**: 2026-10-02  
**Spec**: [spec-12-administracion-moderacion-riesgos](../../FASE-4-Prototipar/specs/spec-12-administracion-moderacion-riesgos.md)
**Depends on**: `plan-spec-01-autenticacion.md`, `plan-spec-04-gestion-solicitudes-servicio.md` (`CategoriaServicio`, `Zona`), `plan-spec-05-perfil-profesional.md`, `plan-spec-08-contratacion-ciclo-servicio.md`, `plan-spec-10-calificaciones-resenas-verificacion.md`, `plan-spec-11-reportes-evidencias.md`

## Summary

SPEC-12 implementa el dominio administrativo de ALIADO: mantenimiento de categorías y zonas, cola/revisión/resolución de reportes, bloqueo preventivo, moderación de contenido, búsqueda administrativa y marca de servicios de alto riesgo.

Este es el módulo que materializa RNF-005: toda acción administrativa sensible debe producir auditoría inmutable. También formaliza el rol `ADMINISTRADOR`, ya contemplado por la solución final del proyecto pero no expuesto al registro público de SPEC-01.

## Technical Context

**Language/Version**: Java 21 LTS  
**Primary Dependencies**: Spring Boot 3.3.x — Web, Data JPA, Security, Validation, Flyway  
**Build tool**: Maven  
**Storage**: PostgreSQL 16 — `bloqueos_preventivos`, `acciones_moderacion`, `marcas_alto_riesgo`, `auditoria_administrativa`; reutiliza catálogo y reportes existentes  
**Testing**: JUnit 5 + Mockito; Spring Boot Test + Testcontainers; MockMvc/WebTestClient  
**Target Platform**: VPS Hostinger (Docker Compose), panel administrativo React  
**Project Type**: Web + Mobile; endpoints de este módulo orientados principalmente a `panel-admin`  
**Constraints**: RNF-004, RNF-005 (auditoría inmutable), RNF-006 (resolución concurrente), RNF-010  
**Scale/Scope**: piloto de ciudad; pocos Administradores pero operaciones de alto impacto

## Data Model

| Entidad | Campos clave |
|---|---|
| `CategoriaServicio` | reutilizada de SPEC-04; `nombre`, `estado` |
| `Zona` | reutilizada de SPEC-04; `nombre`, `coberturaGeografica`, `estado` |
| `Reporte` | reutilizado; `estado` PENDIENTE/EN_REVISION/RESUELTO/DESCARTADO, `justificacionResolucion`, `revisadoPor`, `version` |
| `BloqueoPreventivo` | `id`, `usuarioId`, `administradorId`, `motivo`, `fechaInicio`, `fechaFin`, `activo` |
| `AccionModeracion` | `id`, `administradorId`, `tipo`, `objetivoTipo`, `objetivoId`, `motivo`, `fecha` |
| `MarcaAltoRiesgo` | `id`, `servicioId`, `criterio`, `administradorId`, `fecha`, `activa` |
| `AuditoriaAdministrativa` | `id`, `administradorId`, `accion`, `objetivoTipo`, `objetivoId`, `detalle`, `fecha`, `traceId` |

## API Contracts

| Método | Endpoint | Uso |
|---|---|---|
| POST/PUT/DELETE lógico | `/api/v1/admin/categorias` | crear, editar, desactivar categoría |
| POST/PUT/DELETE lógico | `/api/v1/admin/zonas` | crear, editar, desactivar zona |
| GET | `/api/v1/admin/reportes?estado=PENDIENTE` | cola |
| GET | `/api/v1/admin/reportes/{id}` | detalle + evidencia y marca revisión |
| POST | `/api/v1/admin/reportes/{id}/resolver` | `{ resultado, justificacion }` |
| POST | `/api/v1/admin/usuarios/{id}/bloqueos` | `{ motivo }` |
| POST | `/api/v1/admin/usuarios/{id}/bloqueos/{bloqueoId}/levantar` | — |
| POST | `/api/v1/admin/moderacion` | `{ objetivoTipo, objetivoId, accion, motivo }` |
| GET | `/api/v1/admin/busqueda?q=` | cuentas/perfiles |
| POST | `/api/v1/admin/servicios/{id}/alto-riesgo` | `{ criterio }` |
| GET | `/api/v1/admin/auditoria` | consulta autorizada de trazabilidad |

Todos requieren rol `ADMINISTRADOR`.

## Testing Strategy

- **Arquitectura**: comprobar `Service implements UseCase`, constructores de entrada con interfaces, ausencia de Spring/JPA/HTTP en dominio/aplicación, mappers separados y transacciones verificadas con PostgreSQL cuando aplique.

- **Contract tests** para cada familia de endpoints.
- **Integration tests**: 12 Acceptance Scenarios, incluyendo categoría/zona en uso, resolución concurrente y cuenta bloqueada todavía localizable por Administrador.
- **Unit tests**: máquina de estados del reporte, política de desactivación, bloqueo preventivo, moderación no equivalente a bloqueo.
- **Audit tests**: cada mutación administrativa crea exactamente una entrada inmutable.

## Project Structure

```text
backend/src/main/java/com/aliado/
├── administracion/
│   ├── domain/
│   │   ├── model/
│   │   │   BloqueoPreventivo, AccionModeracion, MarcaAltoRiesgo
│   │   └── repository/
│   │       BloqueoRepository, AccionModeracionRepository, MarcaAltoRiesgoRepository
│   ├── application/
│   │   ├── usecase/
│   │   │   CrearCategoriaUseCase, EditarCategoriaUseCase, DesactivarCategoriaUseCase, CrearZonaUseCase,
│   │   │   EditarZonaUseCase, DesactivarZonaUseCase, ConsultarColaReportesUseCase, RevisarReporteUseCase,
│   │   │   ResolverReporteUseCase, BloquearCuentaUseCase, LevantarBloqueoUseCase, ModerarContenidoUseCase,
│   │   │   BuscarCuentasPerfilesUseCase, MarcarServicioAltoRiesgoUseCase, RevisarVerificacionUseCase
│   │   ├── service/
│   │   │   CrearCategoriaService, EditarCategoriaService, DesactivarCategoriaService, CrearZonaService,
│   │   │   EditarZonaService, DesactivarZonaService, ConsultarColaReportesService, RevisarReporteService,
│   │   │   ResolverReporteService, BloquearCuentaService, LevantarBloqueoService, ModerarContenidoService,
│   │   │   BuscarCuentasPerfilesService, MarcarServicioAltoRiesgoService, RevisarVerificacionService
│   │   ├── dto/
│   │   │   Command/Query/Result de las operaciones del módulo (sin HTTP/JPA)
│   │   └── port/
│   │       Contratos públicos de catálogo, reportes, identidad, confianza y auditoría
│   ├── infrastructure/
│   │   ├── persistence/
│   │   │   ├── entity/
│   │   │   │   BloqueoPreventivoEntity, AccionModeracionEntity, MarcaAltoRiesgoEntity
│   │   │   ├── mapper/
│   │   │   │   BloqueoPreventivoMapper, AccionModeracionMapper, MarcaAltoRiesgoMapper
│   │   │   ├── jpa/
│   │   │   │   BloqueoJpaRepository, AccionModeracionJpaRepository, MarcaAltoRiesgoJpaRepository
│   │   │   └── adapter/
│   │   │       BloqueoPersistenceAdapter, AccionModeracionPersistenceAdapter, MarcaAltoRiesgoPersistenceAdapter
│   │   └── adapter/
│   │       Adaptadores de puertos requeridos; reutilizar contratos existentes
│   └── presentation/
│       ├── controller/
│       │   CatalogoAdminController, ReporteAdminController, CuentaAdminController, ModeracionController,
│       │   RiesgoController
│       ├── dto/
│       │   Request/Response HTTP según API Contracts
│       └── mapper/
│           Conversión HTTP ↔ Command/Query/Result
└── auditoria/
    ├── domain/
    │   ├── model/
    │   │   AuditoriaAdministrativa
    │   └── repository/
    │       AuditoriaAdministrativaRepository
    ├── application/
    │   ├── usecase/
    │   │   RegistrarAuditoriaUseCase, ConsultarAuditoriaUseCase
    │   ├── service/
    │   │   RegistrarAuditoriaService, ConsultarAuditoriaService
    │   ├── dto/
    │   │   Command/Query/Result de las operaciones del módulo (sin HTTP/JPA)
    │   └── port/
    │       Contratos públicos de catálogo, reportes, identidad, confianza y auditoría
    └── infrastructure/
        ├── persistence/
        │   ├── entity/
        │   │   AuditoriaAdministrativaEntity
        │   ├── mapper/
        │   │   AuditoriaAdministrativaMapper
        │   ├── jpa/
        │   │   AuditoriaAdministrativaJpaRepository
        │   └── adapter/
        │       AuditoriaAdministrativaPersistenceAdapter
        └── adapter/
            Adaptadores de puertos requeridos; reutilizar contratos existentes
```

**Contrato de arquitectura**: cada operación tiene una interfaz `application/usecase/*UseCase` y una implementación `application/service/*Service implements *UseCase`. Controllers, filtros, gateways y workers inyectan las interfaces por constructor; no servicios concretos ni repositorios JPA. Los servicios coordinan dominio y puertos sin importar Spring, JPA o HTTP. Dominio contiene modelos, reglas, excepciones de negocio y repositorios propios; infraestructura implementa los puertos y configura transacciones. Los DTO HTTP y sus mappers pertenecen a presentación; Command/Query/Result de aplicación son independientes del transporte.

Los contratos entre módulos son interfaces públicas de aplicación; no se accede a Service concreto, repositorio interno o entidad JPA de otro módulo. Cuando se requiera persistencia se separan `domain/repository`, `infrastructure/persistence/entity`, `mapper`, `jpa` y `adapter`. La configuración de Spring conecta puertos y adaptadores, y conserva la transacción completa del caso de uso. Solo crear clases/carpetas con responsabilidad real. `common` contiene infraestructura/contratos transversales acotados; el contexto de Spring Security no entra a aplicación. `SesionAutenticada` es contrato puro en `auth/application/port`; generación aleatoria segura del token y huella SHA-256 son responsabilidades separadas.

### Interfaces de entrada e implementaciones

| Módulo | UseCase (interfaz) | Service (implementación) |
|---|---|---|
| `administracion` | `CrearCategoriaUseCase` | `CrearCategoriaService` |
| `administracion` | `EditarCategoriaUseCase` | `EditarCategoriaService` |
| `administracion` | `DesactivarCategoriaUseCase` | `DesactivarCategoriaService` |
| `administracion` | `CrearZonaUseCase` | `CrearZonaService` |
| `administracion` | `EditarZonaUseCase` | `EditarZonaService` |
| `administracion` | `DesactivarZonaUseCase` | `DesactivarZonaService` |
| `administracion` | `ConsultarColaReportesUseCase` | `ConsultarColaReportesService` |
| `administracion` | `RevisarReporteUseCase` | `RevisarReporteService` |
| `administracion` | `ResolverReporteUseCase` | `ResolverReporteService` |
| `administracion` | `BloquearCuentaUseCase` | `BloquearCuentaService` |
| `administracion` | `LevantarBloqueoUseCase` | `LevantarBloqueoService` |
| `administracion` | `ModerarContenidoUseCase` | `ModerarContenidoService` |
| `administracion` | `BuscarCuentasPerfilesUseCase` | `BuscarCuentasPerfilesService` |
| `administracion` | `MarcarServicioAltoRiesgoUseCase` | `MarcarServicioAltoRiesgoService` |
| `administracion` | `RevisarVerificacionUseCase` | `RevisarVerificacionService` |
| `auditoria` | `RegistrarAuditoriaUseCase` | `RegistrarAuditoriaService` |
| `auditoria` | `ConsultarAuditoriaUseCase` | `ConsultarAuditoriaService` |

Puertos de salida: contratos públicos de catálogo, reportes, identidad, confianza y auditoría; sin repositorios JPA ajenos. Las interfaces de entrada no crean endpoints nuevos; mantener API Contracts y las condiciones Could/Future. Las tareas existentes conservan IDs, historias, dependencias y orden: los nombres de servicio agrupado de origen se descomponen en estas operaciones, sin añadir tareas funcionales.

Persistencia de referencia: `bloqueos_preventivos`, `acciones_moderacion`, `marcas_alto_riesgo`, `auditoria_administrativa`. El [manual entregado](../../tasks/fuentes/manual-base-de-datos-aliado.md) detalla el modelo MVP; no implica que los scripts V1–V6 ya estén disponibles o ejecutados.

**Structure Decision**: administración opera sobre los módulos propietarios mediante servicios, no duplicando entidades. `auditoria/` es transversal y append-only. El rol Administrador se autentica con SPEC-01 pero no puede ser creado mediante el endpoint público de registro Cliente/Prestador.

---

## Phase 1: Setup

- [ ] T001 Crear `administracion/` y `auditoria/`.
- [ ] T002 Migración Flyway para bloqueos, acciones de moderación, marcas de riesgo y auditoría.
- [ ] T003 Extender `Usuario.rol`/autorización con `ADMINISTRADOR` sin habilitar registro público para ese rol.
- [ ] T004 Añadir `version`/locking optimista a `Reporte` para resolución concurrente.

---

## Phase 2: Foundational

- [ ] T005 `RegistrarAuditoriaUseCase.ejecutar()` append-only para toda mutación administrativa.
- [ ] T006 Filtro/annotation de autorización `ADMINISTRADOR`.
- [ ] T007 ConsultarColaReportesUseCase, RevisarReporteUseCase y ResolverReporteUseCase con sus Service coordinan el contrato público de reportes y transición PENDIENTE→EN_REVISION→RESUELTO/DESCARTADO.
- [ ] T008 Garantizar que abrir detalle marca revisión antes de permitir resolución.

---

## Phase 3: User Story 1 - Administrar categorías [UC068] (Priority: P1)

- [ ] T009 [P] Contract/integration tests de alta, edición y desactivación.
- [ ] T010 CrearCategoriaUseCase, EditarCategoriaUseCase y DesactivarCategoriaUseCase con sus Service, mediante el contrato público propietario del catálogo.
- [ ] T011 Impedir publicar borrador que conserva categoría desactivada.
- [ ] T012 Auditar cada cambio.

---

## Phase 4: User Story 2 - Administrar zonas [UC069] (Priority: P1)

- [ ] T013 [P] Tests de alta, edición y desactivación con zona aún asociada a Prestador.
- [ ] T014 Implementar administración de `Zona`.
- [ ] T015 Mantener referencia histórica sin ofrecer zona desactivada en nuevas selecciones.
- [ ] T016 Auditar cada cambio.

---

## Phase 5: User Story 3 - Gestionar reportes [UC070, UC071, UC072] (Priority: P1)

- [ ] T017 [P] Contract tests cola/detalle/resolución.
- [ ] T018 [P] Integration tests de los cuatro escenarios, incluida concurrencia de dos Administradores.
- [ ] T019 Cola unificada para tipos RESENA/USUARIO/SERVICIO.
- [ ] T020 Detalle con evidencias de SPEC-11.
- [ ] T021 Resolución obligando justificación y revisión previa.
- [ ] T022 Auditoría de revisión y resolución.

---

## Phase 6: User Story 4 - Bloqueo preventivo [UC073] (Priority: P1)

- [ ] T023 Tests de bloqueo/levantamiento y acceso bloqueado.
- [ ] T024 Modelo/servicio `BloqueoPreventivo`.
- [ ] T025 Integrar bloqueo activo con filtro de autorización de SPEC-01.
- [ ] T026 Mantener cuenta visible en búsquedas administrativas.
- [ ] T027 Auditar bloqueo y levantamiento.

---

## Phase 7: User Story 5 - Moderar contenido [UC074] (Priority: P1)

- [ ] T028 Tests de ocultamiento/corrección sin bloqueo de cuenta.
- [ ] T029 Implementar `AccionModeracion`.
- [ ] T030 Aplicar moderación a exposición pública del contenido objetivo.
- [ ] T031 Auditar acción.

---

## Phase 8: User Story 6 - Buscar usuarios y perfiles [UC075] (Priority: P2)

- [ ] T032 Contract/integration tests por nombre, email e identificador.
- [ ] T033 BuscarCuentasPerfilesUseCase y BuscarCuentasPerfilesService con DTO mínimo administrativo.
- [ ] T034 Endpoint paginado.

---

## Phase 9: User Story 7 - Gestionar servicios de alto riesgo [UC076] (Priority: P1)

- [ ] T035 Tests de marca y seguimiento.
- [ ] T036 Modelo/servicio `MarcaAltoRiesgo`.
- [ ] T037 Endpoint de marca.
- [ ] T038 Auditoría de la clasificación.

---

## Frontend — app móvil y/o panel

Destino principal: panel-admin (React); app-movil refleja efectos de bloqueos y moderación.

- [ ] **F12-FE-01** Panel React con navegación exclusiva Administrador y login real; los guardas de UI complementan la autorización backend.
- [ ] **F12-FE-02** CRUD lógico de categorías/zonas; búsqueda de cuentas/perfiles y estados vacíos.
- [ ] **F12-FE-03** Cola de reportes con detalle/evidencia; habilitar resolver/descartar solo tras revisión y motivo obligatorio.
- [ ] **F12-FE-04** Bloqueo/desbloqueo con confirmación y motivo; moderación de contenido separada de bloqueo.
- [ ] **F12-FE-05** Detalle de servicio con marca de riesgo según catálogo acordado, auditoría filtrable y solo lectura.
- [ ] **F12-FE-06** Revisión documental aprobar/rechazar con justificación: formalizar endpoints y persistencia faltantes en D-11.

Aplicar [estados y contrato de cliente](../../tasks/01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación de la feature

- [ ] **F12-QA-01** Dos administradores resuelven a la vez: una resolución válida y conflicto consistente.
- [ ] **F12-QA-02** Cada mutación y revisión definida registra auditoría; trigger y permisos impiden UPDATE/DELETE sobre auditoría.
- [ ] **F12-QA-03** Cuenta bloqueada pierde capacidades ordinarias y exposición pública; moderar contenido no bloquea cuenta.
- [ ] **F12-QA-04** Desactivar catálogo no borra referencias de solicitudes/perfiles históricos.
- [ ] **F12-QA-05** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Dependencies & Execution Order

- Phase 1/2 requieren SPEC-01, 10 y 11.
- US1 y US2 reutilizan SPEC-04 y pueden avanzar en paralelo.
- US3 requiere reportes completos de SPEC-10/11.
- US4/US5/US7 pueden avanzar en paralelo después de Foundational.
- US6 depende solo de identidad/perfiles y Foundational.

## Notes

- `[NEEDS CLARIFICATION]`: criterios concretos de "alto riesgo"; el SPEC indica que deben ser definidos por producto.
- La desactivación de catálogo es lógica, no borrado físico, para preservar referencias históricas.
- RNF-005 exige que la auditoría sea inmutable; no se expone endpoint de modificación/eliminación de auditoría.
