# Implementation Plan: SPEC-02 

**Date**: 2026-09-18
**Spec**: [spec-02-gestion-perfil-privacidad](../../FASE-4-Prototipar/specs/spec-02-gestion-perfil-privacidad.md)
**Depends on**: `plan-spec-01-autenticacion.md` (Phase 2 Foundational + Phase 4 User Story 2 deben estar completas  este plan requiere `Usuario` autenticado)

## Summary

SPEC-02 cubre la administración de datos personales, la separación entre zona aproximada y dirección exacta, y la eliminación de cuenta. No define infraestructura nueva: reutiliza por completo la Fase Foundational ya establecida en `plan-spec-01-autenticacion.md` (seguridad, manejo de errores, configuración de entorno). Por eso este plan **no tiene una Fase 2 propia**.

## Technical Context

**Language/Version**: Java 21 (LTS)
**Primary Dependencies**: Spring Boot 3.3.x — Spring Web, Spring Data JPA, Spring Security, Spring Validation, Flyway, BCrypt
**Build tool**: Maven
**Storage**: tablas `perfiles`, `ubicaciones`, `solicitudes_eliminacion`
**Constraints**: RNF-004 (cifrado en reposo de `direccionExacta` y datos de contacto), RNF-010 (Ley 1581)
**Performance Goals**: consulta de perfil propio en p95 < 300 ms (heredado de RNF-003)

## Data Model

| Entidad | Campos clave |
|---|---|
| `PerfilUsuario` | `usuarioId` (FK 1:1 con `Usuario` de SPEC-01), `nombre`, `telefono`, `preferenciaVisibilidad` |
| `Ubicacion` | `usuarioId` (FK 1:1), `zonaAproximada`, `direccionExacta` (cifrada, nullable) |
| `SolicitudEliminacion` | `id`, `usuarioId` (FK), `fechaSolicitud`, `estado` (PENDIENTE/CONFIRMADA/EXPIRADA/RECHAZADA), `fechaConfirmacion`, `fechaExpiracion` |

Relaciones: `Usuario` (SPEC-01) 1—1 `PerfilUsuario`, 1—1 `Ubicacion`, 1—N `SolicitudEliminacion` (solo una activa a la vez).

## API Contracts

| Método | Endpoint | Request body | Respuesta éxito | Errores |
|---|---|---|---|---|
| GET | `/api/v1/perfil/me` | — | `200` perfil propio completo (incluye dirección exacta propia) | `401` sin sesión |
| PATCH | `/api/v1/perfil/me` | `{ nombre?, telefono? }` | `200` perfil actualizado | `400` formato inválido (valor previo se conserva) |
| PUT | `/api/v1/perfil/me/ubicacion` | `{ zonaAproximada, direccionExacta? }` | `200` ubicación actualizada | `400` formato inválido |
| PATCH | `/api/v1/perfil/me/visibilidad` | `{ preferenciaVisibilidad }` | `200` | `400` valor fuera de las reglas de privacidad base |
| GET | `/api/v1/perfil/{usuarioId}/publico` | — | `200` *(solo `zonaAproximada`, nunca `direccionExacta`)* | `404` usuario no existe |
| POST | `/api/v1/perfil/me/eliminacion` | — | `202 { estado: PENDIENTE, expiraEn }` | `409` tiene un servicio en ejecución |
| POST | `/api/v1/perfil/me/eliminacion/confirmar` | — | `200 { estado: CONFIRMADA }` | `410` solicitud expirada (> 24 h) |

## Testing Strategy

- **Arquitectura**: comprobar `Service implements UseCase`, constructores de entrada con interfaces, ausencia de Spring/JPA/HTTP en dominio/aplicación, mappers separados y transacciones verificadas con PostgreSQL cuando aplique.

- **Contract tests**: uno por endpoint de la tabla anterior.
- **Integration tests**: uno por Acceptance Scenario del SPEC, con Testcontainers.
- **Unit tests**: regla de separación zona aproximada/dirección exacta, expiración automática de `SolicitudEliminacion` a las 24 h.
- Cobertura obligatoria de Edge Cases: eliminación con servicio en ejecución, expiración de solicitud > 24 h, edición de zona sin alterar dirección comprometida con un servicio activo, actualizaciones concurrentes de perfil.

## Project Structure

```text
backend/src/main/java/com/aliado/
└── perfil/
    ├── domain/
    │   ├── model/
    │   │   PerfilUsuario, Ubicacion, SolicitudEliminacion
    │   └── repository/
    │       PerfilRepository, UbicacionRepository, SolicitudEliminacionRepository
    ├── application/
    │   ├── usecase/
    │   │   ConsultarPerfilUseCase, ActualizarPerfilUseCase, ConfigurarUbicacionUseCase, ConfigurarPrivacidadUseCase,
    │   │   SolicitarEliminacionCuentaUseCase, ConfirmarEliminacionCuentaUseCase
    │   ├── service/
    │   │   ConsultarPerfilService, ActualizarPerfilService, ConfigurarUbicacionService, ConfigurarPrivacidadService,
    │   │   SolicitarEliminacionCuentaService, ConfirmarEliminacionCuentaService
    │   ├── dto/
    │   │   Command/Query/Result de las operaciones del módulo (sin HTTP/JPA)
    │   └── port/
    │       ConsultaServiciosActivosPort, CifradoDatosPort
    ├── infrastructure/
    │   ├── persistence/
    │   │   ├── entity/
    │   │   │   PerfilUsuarioEntity, UbicacionEntity, SolicitudEliminacionEntity
    │   │   ├── mapper/
    │   │   │   PerfilUsuarioMapper, UbicacionMapper, SolicitudEliminacionMapper
    │   │   ├── jpa/
    │   │   │   PerfilJpaRepository, UbicacionJpaRepository, SolicitudEliminacionJpaRepository
    │   │   └── adapter/
    │   │       PerfilPersistenceAdapter, UbicacionPersistenceAdapter, SolicitudEliminacionPersistenceAdapter
    │   └── adapter/
    │       Adaptadores de puertos requeridos; reutilizar contratos existentes
    └── presentation/
        ├── controller/
        │   PerfilController
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
| `perfil` | `ConsultarPerfilUseCase` | `ConsultarPerfilService` |
| `perfil` | `ActualizarPerfilUseCase` | `ActualizarPerfilService` |
| `perfil` | `ConfigurarUbicacionUseCase` | `ConfigurarUbicacionService` |
| `perfil` | `ConfigurarPrivacidadUseCase` | `ConfigurarPrivacidadService` |
| `perfil` | `SolicitarEliminacionCuentaUseCase` | `SolicitarEliminacionCuentaService` |
| `perfil` | `ConfirmarEliminacionCuentaUseCase` | `ConfirmarEliminacionCuentaService` |

Puertos de salida: SesionAutenticada y ConsultaServiciosActivosPort; cifrado mediante puerto/adaptador sin dependencia del SDK. Las interfaces de entrada no crean endpoints nuevos; mantener API Contracts y las condiciones Could/Future. Las tareas existentes conservan IDs, historias, dependencias y orden: los nombres de servicio agrupado de origen se descomponen en estas operaciones, sin añadir tareas funcionales.

Persistencia de referencia: `perfiles`, `ubicaciones`, `solicitudes_eliminacion`. El [manual entregado](../../tasks/fuentes/manual-base-de-datos-aliado.md) detalla el modelo MVP; no implica que los scripts V1–V6 ya estén disponibles o ejecutados.


---

## Phase 1: Setup

- [ ] T001 Crear el paquete `perfil/` con interfaces UseCase, implementaciones Service y puertos/adaptadores de Arquitectura Limpia (según Project Structure)
- [ ] T002 Migración Flyway: tablas `perfiles`, `ubicaciones`, `solicitudes_eliminacion` (con FK hacia `usuarios` de SPEC-01)

---

## Phase 2: User Story 1 - Administración de datos personales [UC008, UC011] (Priority: P1)

**Goal**: un usuario consulta y edita sus propios datos básicos.

**Independent Test**: editar un dato válido y verificar persistencia; editar uno inválido y verificar que no se altera el valor previo.
### Tests

- [ ] T003 [P] [US1] Contract tests `GET /perfil/me`, `PATCH /perfil/me` — `tests/contract/test_perfil_datos.java`
- [ ] T004 [P] [US1] Integration test: consulta propia, edición válida, edición con formato inválido — `tests/integration/test_perfil_datos.java`

### Implementation

- [ ] T005 [P] [US1] Modelo `PerfilUsuario` — `perfil/domain/model`
- [ ] T006 [US1] ConsultarPerfilUseCase y ActualizarPerfilUseCase con sus Service; validación que no sobrescribe datos previos ante error (FR-002) — perfil/application.
- [ ] T007 [US1] Endpoints `GET/PATCH /api/v1/perfil/me` — `perfil/presentation/controller`

**Checkpoint**: cualquier usuario autenticado mantiene sus datos básicos actualizados de forma independiente.

---

## Phase 3: User Story 2 - Privacidad y visibilidad de ubicación [UC009, UC010, UC013] (Priority: P1)

**Goal**: la zona aproximada y la dirección exacta quedan siempre separadas según reglas de privacidad.

**Independent Test**: un tercero sin autorización solo ve zona aproximada, nunca dirección exacta, bajo cualquier configuración de visibilidad.

### Tests

- [ ] T008 [P] [US2] Contract tests `PUT /perfil/me/ubicacion`, `PATCH /perfil/me/visibilidad`, `GET /perfil/{id}/publico` — `tests/contract/test_perfil_privacidad.java`
- [ ] T009 [P] [US2] Integration test: consulta de un tercero nunca recibe `direccionExacta` (FR-005), edición de zona no altera dirección comprometida con un servicio activo — `tests/integration/test_privacidad_ubicacion.java`

### Implementation

- [ ] T010 [P] [US2] Modelo `Ubicacion` (cifrado de `direccionExacta` en reposo, RNF-004) — `perfil/domain/model`
- [ ] T011 [US2] ConfigurarUbicacionUseCase y ConfigurarPrivacidadUseCase con sus Service: exposición condicionada de zona/dirección exacta según regla explícita — perfil/application.
- [ ] T012 [US2] Endpoints `PUT /ubicacion`, `PATCH /visibilidad`, `GET /{id}/publico` — `perfil/presentation/controller`

**Checkpoint**: ninguna ruta del sistema puede exponer `direccionExacta` fuera de la regla explícita, verificable con una política de dominio aplicada por los UseCase de perfil/privacidad.

---

## Phase 4: User Story 3 - Eliminación de cuenta [UC012] (Priority: P2)

**Goal**: un usuario puede solicitar la eliminación de su cuenta de forma segura y reversible hasta su confirmación.

**Independent Test**: solicitar eliminación, verificar estado `PENDIENTE`, y que no se ejecuta sin confirmación ni tras expirar.

### Tests

- [ ] T013 [P] [US3] Contract tests `POST /perfil/me/eliminacion`, `/eliminacion/confirmar` — `tests/contract/test_eliminacion.java`
- [ ] T014 [P] [US3] Integration test: solicitud con servicio en ejecución (bloqueada), expiración automática a las 24 h, confirmación exitosa — `tests/integration/test_eliminacion_cuenta.java`

### Implementation

- [ ] T015 [P] [US3] Modelo `SolicitudEliminacion` — `perfil/domain/model`
- [ ] T016 [US3] SolicitarEliminacionCuentaUseCase y ConfirmarEliminacionCuentaUseCase: usar ConsultaServiciosActivosPort y expiración a 24 h; Service separados, sin acceder al repositorio JPA de servicios.
- [ ] T017 [US3] Endpoints `POST /eliminacion`, `/eliminacion/confirmar` — `perfil/presentation/controller`
- [ ] T018 [US3] Job programado (scheduler) que marca como `EXPIRADA` toda solicitud pendiente > 24 h

> **Dependencia cruzada pendiente**: T016 necesita consultar si el usuario tiene un "servicio en ejecución", dato que vivirá en el módulo `propuestas` (SPEC-07/08, UC-04), que todavía no tiene su propio plan. Esta tarea no puede completarse de forma aislada; debe revisarse al escribir el plan de SPEC-07/08.

**Checkpoint**: ninguna cuenta se elimina sin confirmación explícita ni mientras tenga un servicio en ejecución.

---

## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F02-FE-01** Pantalla de datos propios y edición con validación, conservación del valor previo ante error y conflictos de versión.
- [ ] **F02-FE-02** Configurar privacidad y separar zona aproximada de dirección exacta en formularios y vistas públicas.
- [ ] **F02-FE-03** Solicitud y confirmación de eliminación con expiración, resultado y estado pendientes visibles.
- [ ] **F02-FE-04** Integrar bloqueo de eliminación por servicios activos con el puerto de SPEC-08 cuando esté disponible; no simular aprobación.

Aplicar [estados y contrato de cliente](../../tasks/01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación de la feature

- [ ] **F02-QA-01** Comprobar cifrado de dirección y ausencia de teléfono/email/dirección en DTO públicos.
- [ ] **F02-QA-02** Probar eliminación sin confirmación, confirmación expirada y servicio activo; E2E diferido hasta F08.
- [ ] **F02-QA-03** Evitar borrado físico en cascada que destruya historial/auditoría; probar política de anonimización acordada.
- [ ] **F02-QA-04** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Dependencies & Execution Order

- **Depende externamente de**: `plan-spec-01-autenticacion.md` — Phase 2 (Foundational) y Phase 4 (User Story 2, `auth` completo) deben estar terminadas antes de iniciar cualquier fase de este plan.
- **Setup (Phase 1)** → depende solo de lo anterior.
- **User Story 1 (Phase 2)** → depende de Phase 1.
- **User Story 2 (Phase 3)** → depende de Phase 1; puede paralelizarse con la Phase 2.
- **User Story 3 (Phase 4)** → depende de Phase 3 (reutiliza contratos de perfil/privacidad) y tiene una dependencia cruzada pendiente hacia SPEC-07/08 (ver nota en T016).

## Notes

- Este plan no repite la Fase Foundational: queda centralizada una sola vez en `plan-spec-01-autenticacion.md`, tal como recomienda el `sdd-guide.MD`.
- La dependencia cruzada de T016 hacia SPEC-07/08 debe resolverse explícitamente cuando se redacte ese plan, para no implementarla dos veces ni de forma inconsistente.
