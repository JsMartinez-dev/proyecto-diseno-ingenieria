# Implementation Plan: SPEC-07

**Date**: 2026-10-02
**Spec**: [spec-07-creacion-gestion-propuestas](../../FASE-4-Prototipar/specs/spec-07-creacion-gestion-propuestas.md)
**Depends on**: `plan-spec-01-autenticacion.md` (rol Prestador autenticado, interceptor de autorización), `plan-spec-04-gestion-solicitudes-servicio.md` (`Solicitud` — una propuesta se vincula a una solicitud abierta), `plan-spec-06-compatibilidad-oportunidades.md` (`ConsultarDetalleOportunidadUseCase` — una propuesta solo puede crearse sobre una solicitud compatible con el perfil del Prestador)

## Summary

SPEC-07 cubre la creación, edición y retiro de propuestas que un Prestador hace sobre una solicitud publicada, y la notificación automática al Cliente cuando recibe una nueva propuesta. Es el primer plan que convierte una oportunidad (SPEC-06) en un compromiso potencial, y su entidad `Propuesta` es la que SPEC-08 usará para registrar la contratación.

## Technical Context

**Language/Version**: Java 21 (LTS) - reutilizado de SPEC-01
**Primary Dependencies**: Spring Boot 3.3.x (Web, Data JPA, Validation), Flyway - reutilizados de SPEC-01
**Build tool**: Maven
**Storage**: PostgreSQL 16 - nuevas tablas de este módulo
**Testing**: JUnit 5 + Mockito, Spring Boot Test + Testcontainers (PostgreSQL), MockMvc/WebTestClient - reutilizados de SPEC-01
**Target Platform**: VPS Hostinger (Docker Compose) - reutilizado de SPEC-01
**Project Type**: Web + Mobile (backend único) - reutilizado de SPEC-01
**Performance Goals**: sin metas específicas nuevas de este SPEC
**Constraints**: RNF-006 (integridad transaccional - creación de propuesta + notificación en una sola operación consistente), RNF-007 (notificación casi en tiempo real)
**Scale/Scope**: ~50–100 Prestadores, ~200–500 Clientes (piloto) - reutilizado de SPEC-01

## Data Model

| Entidad | Campos clave |
|---|---|
| `Propuesta` | `id`, `solicitudId` (FK `Solicitud` de SPEC-04), `prestadorId` (FK Usuario), `disponibilidad`, `mensaje` (nullable), `estado` (ACTIVA, RETIRADA, ACEPTADA, CERRADA), `fechaCreacion`, `fechaActualizacion` |
| `Notificacion` *(módulo notificaciones, reutilizada)* | tipo PROPUESTA_RECIBIDA, destinatarioId del Cliente, aggregateId de propuesta, eventVersion y entrega |

Relaciones: `Solicitud` (SPEC-04) 1—N `Propuesta`, `Usuario` (Prestador) 1—N `Propuesta`, `Propuesta` genera un evento PROPUESTA_RECIBIDA en notificaciones, con unicidad por evento/destinatario.


## API Contracts

| Método | Endpoint | Request body | Respuesta éxito | Errores |
|---|---|---|---|---|
| POST | `/api/v1/propuestas` | `{ solicitudId, disponibilidad, mensaje? }` | `201 { id, estado: "ACTIVA" }` | `400` falta disponibilidad; `404` solicitud inexistente; `409` solicitud no abierta o no compatible |
| PUT | `/api/v1/propuestas/{id}` | `{ disponibilidad?, mensaje? }` | `200 { id, estado }` | `403/404` no pertenece o no existe; `409` propuesta ya no activa |
| POST | `/api/v1/propuestas/{id}/retirar` | — | `200 { estado: "RETIRADA" }` | `403/404` no pertenece o no existe; `409` propuesta ya no activa |

Todos los endpoints restringidos a rol PRESTADOR mediante el filtro de autorización por rol de SPEC-01 (T018). No se expone un endpoint de listado de "mis propuestas": el SPEC no lo exige (el Prestador llega al `id` de su propuesta desde la respuesta de creación o desde el tablero de SPEC-06); se deja anotado por si una fase posterior lo requiere.

## Testing Strategy

- **Arquitectura**: comprobar `Service implements UseCase`, constructores de entrada con interfaces, ausencia de Spring/JPA/HTTP en dominio/aplicación, mappers separados y transacciones verificadas con PostgreSQL cuando aplique.

- **Contract tests**: uno por endpoint de la tabla anterior.
- **Integration tests**: uno por Acceptance Scenario del SPEC (9 escenarios entre las 3 historias), con Testcontainers, incluyendo el edge case de pérdida de conexión durante edición/retiro (no duplica ni deja estado ambiguo).
- **Unit tests**: validación de disponibilidad obligatoria, validación de solicitud abierta y compatible al crear (reutilizando `ConsultarDetalleOportunidadUseCase` de SPEC-06), transición de estado válida para editar/retirar.

## Project Structure

```text
backend/src/main/java/com/aliado/
└── propuestas/
    ├── domain/
    │   ├── model/
    │   │   Propuesta
    │   └── repository/
    │       PropuestaRepository
    ├── application/
    │   ├── usecase/
    │   │   CrearPropuestaUseCase, EditarPropuestaUseCase, RetirarPropuestaUseCase
    │   ├── service/
    │   │   CrearPropuestaService, EditarPropuestaService, RetirarPropuestaService
    │   ├── dto/
    │   │   Command/Query/Result de las operaciones del módulo (sin HTTP/JPA)
    │   └── port/
    │       ConsultaCompatibilidadPort, ConsultaSolicitudPort, RegistroNotificacionPort
    ├── infrastructure/
    │   ├── persistence/
    │   │   ├── entity/
    │   │   │   PropuestaEntity
    │   │   ├── mapper/
    │   │   │   PropuestaMapper
    │   │   ├── jpa/
    │   │   │   PropuestaJpaRepository
    │   │   └── adapter/
    │   │       PropuestaPersistenceAdapter
    │   └── adapter/
    │       Adaptadores de puertos requeridos; reutilizar contratos existentes
    └── presentation/
        ├── controller/
        │   PropuestaController
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
| `propuestas` | `CrearPropuestaUseCase` | `CrearPropuestaService` |
| `propuestas` | `EditarPropuestaUseCase` | `EditarPropuestaService` |
| `propuestas` | `RetirarPropuestaUseCase` | `RetirarPropuestaService` |

Puertos de salida: ConsultaCompatibilidadPort, ConsultaSolicitudPort y RegistroNotificacionPort. Las interfaces de entrada no crean endpoints nuevos; mantener API Contracts y las condiciones Could/Future. Las tareas existentes conservan IDs, historias, dependencias y orden: los nombres de servicio agrupado de origen se descomponen en estas operaciones, sin añadir tareas funcionales.

Persistencia de referencia: `propuestas`, `notificaciones`. El [manual entregado](../../tasks/fuentes/manual-base-de-datos-aliado.md) detalla el modelo MVP; no implica que los scripts V1–V6 ya estén disponibles o ejecutados.

**Structure Decision**: CrearPropuestaUseCase coordina creación y validación mediante contratos públicos de compatibilidad/solicitudes. EditarPropuestaUseCase y RetirarPropuestaUseCase conservan propiedad y estado. Cada Service implementa su interfaz. RegistroNotificacionPort delega al módulo notificaciones dentro de la transacción de creación; no crear entidad/tabla puntual de notificación.

---

## Phase 1: Setup

- [ ] T001 Crear el paquete `propuestas/` con interfaces UseCase, implementaciones Service y puertos/adaptadores de Arquitectura Limpia (según Project Structure)
- [ ] T002 Migración Flyway: tablas `propuestas`, `notificaciones_propuesta_recibida`

---

## Phase 2: Foundational

No se requieren tareas fundacionales nuevas: autenticación/roles (SPEC-01), `Solicitud` (SPEC-04) y `ConsultarDetalleOportunidadUseCase` (SPEC-06) ya existen y se consumen directamente.

**Checkpoint**: sin bloqueo adicional — las historias de usuario de este plan dependen funcionalmente de que SPEC-04 y SPEC-06 estén completos.

---

## Phase 3: User Story 1 - Crear una propuesta para una solicitud [UC039, UC040, UC041, UC044] (Priority: P1)

**Goal**: un Prestador crea una propuesta sobre una solicitud abierta y compatible, indicando disponibilidad obligatoria y mensaje opcional, y el Cliente es notificado automáticamente.

**Independent Test**: crear una propuesta con disponibilidad sin mensaje y verificar creación + notificación; repetir con mensaje; intentar sin disponibilidad y verificar rechazo.

### Tests

- [ ] T003 [P] [US1] Contract test `POST /propuestas` (201, 400, 404, 409) — `tests/contract/test_propuestas_crear.java`
- [ ] T004 [P] [US1] Integration test: creación completa con/sin mensaje, sin disponibilidad (rechazo), solicitud no abierta (rechazo), notificación generada al Cliente, actor no autorizado — `tests/integration/test_crear_propuesta.java`

### Implementation

- [ ] T005 [P] [US1] Modelo Propuesta en propuestas/domain/model y payload PROPUESTA_RECIBIDA para notificaciones; no crear una entidad puntual de aviso.
- [ ] T006 [US1] PropuestaRepository en propuestas/domain/repository y conexión de RegistroNotificacionPort con el módulo notificaciones; no crear NotificacionPropuestaRecibidaRepository ni otra tabla de avisos.
- [ ] T007 [US1] `CrearPropuestaUseCase.ejecutar()`: valida disponibilidad obligatoria (FR-040), valida que la solicitud esté abierta y compatible reutilizando `ConsultarDetalleOportunidadUseCase.ejecutar()` de SPEC-06 (FR-039), asocia mensaje opcional (FR-041), crea `Propuesta` en estado ACTIVA y la `Notificacion` PROPUESTA_RECIBIDA asociada mediante el contrato público de notificaciones en una sola transacción (FR-044, RNF-006) (depends on T005, T006, dependencia externa: `ConsultarDetalleOportunidadUseCase` de SPEC-06)
- [ ] T008 [US1] Endpoint `POST /api/v1/propuestas` restringido a rol PRESTADOR — `propuestas/presentation/controller`

**Checkpoint**: un Prestador puede crear una propuesta completa de forma independiente, y el Cliente queda notificado.

---

## Phase 4: User Story 2 - Editar una propuesta activa [UC042] (Priority: P1)

**Goal**: el Prestador puede editar disponibilidad o mensaje de una propuesta propia mientras esté activa.

**Independent Test**: editar un dato de una propuesta activa propia y verificar el cambio; intentar editar una ya retirada/aceptada/cerrada y verificar el rechazo.

### Tests

- [ ] T009 [P] [US2] Contract test `PUT /propuestas/{id}` (200, 403, 404, 409) — `tests/contract/test_propuestas_editar.java`
- [ ] T010 [P] [US2] Integration test: edición exitosa, edición de propuesta no activa (rechazo), propuesta ajena (rechazo), actor no autorizado, pérdida de conexión durante edición (edge case) — `tests/integration/test_editar_propuesta.java`

### Implementation

- [ ] T011 [US2] `EditarPropuestaUseCase.ejecutar()`: valida propiedad y estado ACTIVA, rechaza en caso contrario (FR-042) (depends on T006)
- [ ] T012 [US2] Endpoint `PUT /api/v1/propuestas/{id}` — `propuestas/presentation/controller`

**Checkpoint**: el Prestador puede mantener actualizada una propuesta activa de forma independiente.

---

## Phase 5: User Story 3 - Retirar una propuesta [UC043] (Priority: P1)

**Goal**: el Prestador puede retirar una propuesta propia activa.

**Independent Test**: retirar una propuesta activa propia y verificar que deja de estar disponible para el Cliente; intentar retirarla de nuevo y verificar el rechazo.

### Tests

- [ ] T013 [P] [US3] Contract test `POST /propuestas/{id}/retirar` (200, 403, 404, 409) — `tests/contract/test_propuestas_retirar.java`
- [ ] T014 [P] [US3] Integration test: retiro exitoso, retiro de propuesta ya inactiva (rechazo), propuesta ajena (rechazo), actor no autorizado — `tests/integration/test_retirar_propuesta.java`

### Implementation

- [ ] T015 [US3] `RetirarPropuestaUseCase.ejecutar()`: valida propiedad y estado ACTIVA, transiciona a RETIRADA, rechaza en caso contrario (FR-043); asegura que ninguna notificación de "propuesta nueva" se genere sobre una propuesta ya retirada (edge case del SPEC) (depends on T006)
- [ ] T016 [US3] Endpoint `POST /api/v1/propuestas/{id}/retirar` — `propuestas/presentation/controller`

**Checkpoint**: el Prestador puede retirar una propuesta que ya no puede cumplir, de forma independiente.

---

## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F07-FE-01** Formulario desde oportunidad con disponibilidad obligatoria, mensaje opcional y estados de envío.
- [ ] **F07-FE-02** Conservar id retornado para editar/retirar; guardar contexto mínimo de navegación sin inventar endpoint de mis propuestas.
- [ ] **F07-FE-03** Acciones editar/retirar solo mientras ACTIVA; confirmar retiro y refrescar ante 409.
- [ ] **F07-FE-04** Cliente recibe propuesta real en el detalle de solicitud mediante F08 y notificaciones.

Aplicar [estados y contrato de cliente](../../tasks/01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación de la feature

- [ ] **F07-QA-01** Rechazar solicitud cerrada/no compatible y disponibilidad vacía sin crear filas.
- [ ] **F07-QA-02** Mutación concurrente y reintento no duplican propuesta ni aviso; política de duplicidad requiere D-09.
- [ ] **F07-QA-03** No añadir precio/moneda al contrato solo porque exista en la demo: el modelo entregado no los incluye.
- [ ] **F07-QA-04** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Dependencies & Execution Order

- **Setup (Phase 1)** → depende de SPEC-01, SPEC-04 y SPEC-06 ya completos.
- **Foundational (Phase 2)** → no aplica como fase propia; funcionalmente este plan depende de SPEC-04 y SPEC-06.
- **User Story 1 (Phase 3)** → depende de Setup. Es prerrequisito de User Story 2 y 3 (requieren una propuesta ya creada).
- **User Story 2 (Phase 4)** → depende de User Story 1.
- **User Story 3 (Phase 5)** → depende de User Story 1; puede avanzar en paralelo a User Story 2.
- **Dependencia hacia adelante**: `plan-spec-08-contratacion-ciclo-servicio.md` (aún no escrito) dependerá de `Propuesta` (estado ACEPTADA, CERRADA) y de `PropuestaRepository` de este plan.

## Notes

- Se aplica el modelo unificado de notificaciones del plan general y del manual entregado: reutilizar notificaciones para SPEC-06/07/09. Las responsabilidades de generar el evento se conservan en su productor, la persistencia/entrega en el módulo propietario.
- Los estados ACEPTADA y CERRADA de `Propuesta` están reservados en el enum pero ninguna tarea de este plan los asigna: esa transición pertenece a SPEC-08 (aceptación de propuesta), que debe tratar `Propuesta` como entidad ya existente y no redefinirla.
