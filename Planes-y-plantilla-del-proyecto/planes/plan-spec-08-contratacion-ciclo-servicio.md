# Implementation Plan: SPEC-08

**Date**: 2026-10-02
**Spec**: [spec-08-contratacion-ciclo-servicio](../../FASE-4-Prototipar/specs/spec-08-contratacion-ciclo-servicio.md)
**Depends on**: `plan-spec-01-autenticacion.md` (roles Cliente/Prestador), `plan-spec-02-perfil.md` (dependencia cruzada pendiente: T016 necesita saber si un usuario tiene un servicio en ejecución — este plan la resuelve, ver Notes), `plan-spec-04-gestion-solicitudes-servicio.md` (`Solicitud`), `plan-spec-07-creacion-gestion-propuestas.md` (`Propuesta`, estados ACEPTADA/CERRADA)

## Summary

SPEC-08 cubre la aceptación de propuestas (con cierre automático de las demás y registro del servicio contratado), el ciclo de vida del servicio (en ejecución, terminado, finalización confirmada, cancelado), su historial de estados, y el canal de comunicación autorizado entre Cliente y Prestador una vez contratado. Es el plan que materializa el compromiso real entre las partes y resuelve la dependencia cruzada que `plan-spec-02-perfil.md` dejó pendiente.

## Technical Context

**Language/Version**: Java 21 (LTS) — reutilizado de SPEC-01
**Primary Dependencies**: Spring Boot 3.3.x (Web, Data JPA, Validation), Flyway — reutilizados de SPEC-01
**Build tool**: Maven
**Storage**: PostgreSQL 16 — nuevas tablas de este módulo
**Testing**: JUnit 5 + Mockito, Spring Boot Test + Testcontainers (PostgreSQL), MockMvc/WebTestClient — reutilizados de SPEC-01
**Target Platform**: VPS Hostinger (Docker Compose) — reutilizado de SPEC-01
**Project Type**: Web + Mobile (backend único) — reutilizado de SPEC-01
**Performance Goals**: sin metas específicas nuevas de este SPEC
**Constraints**: RNF-004 (el canal de comunicación no debe exponer datos de contacto personales), RNF-006 (integridad transaccional en aceptación y en transiciones de estado concurrentes), RNF-007 (notificaciones casi en tiempo real — delegado a SPEC-09)
**Scale/Scope**: ~50–100 Prestadores, ~200–500 Clientes (piloto) — reutilizado de SPEC-01

## Data Model

| Entidad | Campos clave |
|---|---|
| `ServicioContratado` | `id`, `solicitudId` (FK `Solicitud` única, SPEC-04), `propuestaId` (FK `Propuesta` única, SPEC-07), `clienteId` (FK Usuario), `prestadorId` (FK Usuario), `estado` (CONTRATADO, EN_EJECUCION, TERMINADO, FINALIZADO, CANCELADO), `comunicacionHabilitada` (boolean), `fechaContratacion`, `version` (control de concurrencia optimista) |
| `HistorialEstadoServicio` | `id`, `servicioId` (FK), `estadoAnterior`, `estadoNuevo`, `actorId` (FK Usuario que ejecutó la transición), `fecha` |
| `MensajeServicio` | `id`, `servicioId` (FK), `remitenteId` (FK Usuario), `contenido`, `fechaEnvio` |

Relaciones: `Solicitud` (SPEC-04) 1—1 `ServicioContratado`, `Propuesta` (SPEC-07) 1—1 `ServicioContratado`, `ServicioContratado` 1—N `HistorialEstadoServicio`, `ServicioContratado` 1—N `MensajeServicio`.



## API Contracts

| Método | Endpoint | Request body | Respuesta éxito | Errores |
|---|---|---|---|---|
| GET | `/api/v1/solicitudes/{solicitudId}/propuestas` | — | `200 [ Propuesta activa, ... ]` | `403/404` no es el Cliente dueño |
| POST | `/api/v1/propuestas/{id}/aceptar` | — | `200 { servicioId, estado: "CONTRATADO" }` | `403/404` no autorizado o propuesta inexistente; `409` la solicitud ya tiene servicio contratado |
| GET | `/api/v1/servicios/{id}` | — | `200 { ...detalle: solicitud, propuesta, estado actual }` | `403/404` actor ajeno al servicio |
| POST | `/api/v1/servicios/{id}/en-ejecucion` | — | `200 { estado: "EN_EJECUCION" }` | `403/404` no es el Prestador del servicio; `409` transición inválida |
| POST | `/api/v1/servicios/{id}/terminado` | — | `200 { estado: "TERMINADO" }` | `403/404`; `409` transición inválida |
| POST | `/api/v1/servicios/{id}/confirmar-finalizacion` | — | `200 { estado: "FINALIZADO" }` | `403/404` no es el Cliente del servicio; `409` transición inválida |
| POST | `/api/v1/servicios/{id}/cancelar` | — | `200 { estado: "CANCELADO" }` | `403/404`; `409` ya finalizado |
| GET | `/api/v1/servicios/{id}/historial` | — | `200 [ { estadoAnterior, estadoNuevo, actorId, fecha }, ... ]` | `403/404` actor ajeno al servicio |
| POST | `/api/v1/servicios/{id}/mensajes` | `{ contenido }` | `201 { id, fechaEnvio }` | `403/404` actor ajeno; `409` comunicación no habilitada |
| GET | `/api/v1/servicios/{id}/mensajes` | — | `200 [ { remitenteId, contenido, fechaEnvio }, ... ]` | `403/404` actor ajeno; `409` comunicación no habilitada |

Todos los endpoints validan que el actor autenticado sea el Cliente o el Prestador del servicio (o el rol que la operación exige específicamente), reutilizando el interceptor de autorización por rol de SPEC-01 (T018) como primera capa, más una verificación de propiedad adicional en el servicio.

## Testing Strategy

- **Arquitectura**: comprobar `Service implements UseCase`, constructores de entrada con interfaces, ausencia de Spring/JPA/HTTP en dominio/aplicación, mappers separados y transacciones verificadas con PostgreSQL cuando aplique.

- **Contract tests**: uno por endpoint de la tabla anterior.
- **Integration tests**: uno por Acceptance Scenario del SPEC (20 escenarios entre las 5 historias), con Testcontainers, incluyendo el escenario de transiciones simultáneas (concurrencia) y el de uso del canal antes de la habilitación.
- **Unit tests**: cierre automático de propuestas al aceptar una (FR-047), rechazo de segunda aceptación (FR-046), máquina de estados del servicio y sus transiciones válidas/inválidas, resolución de concurrencia optimista en transiciones simultáneas (edge case), bloqueo del canal de mensajería antes de `comunicacionHabilitada`.

## Project Structure

```text
backend/src/main/java/com/aliado/
└── servicios/
    ├── domain/
    │   ├── model/
    │   │   ServicioContratado, HistorialEstadoServicio, MensajeServicio
    │   └── repository/
    │       ServicioContratadoRepository, HistorialEstadoServicioRepository, MensajeServicioRepository
    ├── application/
    │   ├── usecase/
    │   │   ListarPropuestasRecibidasUseCase, AceptarPropuestaUseCase, ConsultarServicioUseCase,
    │   │   MarcarServicioEnEjecucionUseCase, MarcarServicioTerminadoUseCase, ConfirmarFinalizacionServicioUseCase,
    │   │   CancelarServicioUseCase, ConsultarHistorialServicioUseCase, EnviarMensajeServicioUseCase,
    │   │   ConsultarMensajesServicioUseCase
    │   ├── service/
    │   │   ListarPropuestasRecibidasService, AceptarPropuestaService, ConsultarServicioService,
    │   │   MarcarServicioEnEjecucionService, MarcarServicioTerminadoService, ConfirmarFinalizacionServicioService,
    │   │   CancelarServicioService, ConsultarHistorialServicioService, EnviarMensajeServicioService,
    │   │   ConsultarMensajesServicioService
    │   ├── dto/
    │   │   Command/Query/Result de las operaciones del módulo (sin HTTP/JPA)
    │   └── port/
    │       ConsultaGestionPropuestasPort, ConsultaGestionSolicitudPort, RegistroNotificacionPort
    ├── infrastructure/
    │   ├── persistence/
    │   │   ├── entity/
    │   │   │   ServicioContratadoEntity, HistorialEstadoServicioEntity, MensajeServicioEntity
    │   │   ├── mapper/
    │   │   │   ServicioContratadoMapper, HistorialEstadoServicioMapper, MensajeServicioMapper
    │   │   ├── jpa/
    │   │   │   ServicioContratadoJpaRepository, HistorialEstadoServicioJpaRepository, MensajeServicioJpaRepository
    │   │   └── adapter/
    │   │       ServicioContratadoPersistenceAdapter, HistorialEstadoServicioPersistenceAdapter,
    │   │       MensajeServicioPersistenceAdapter
    │   └── adapter/
    │       Adaptadores de puertos requeridos; reutilizar contratos existentes
    └── presentation/
        ├── controller/
        │   ServicioController, MensajeServicioController
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
| `servicios` | `ListarPropuestasRecibidasUseCase` | `ListarPropuestasRecibidasService` |
| `servicios` | `AceptarPropuestaUseCase` | `AceptarPropuestaService` |
| `servicios` | `ConsultarServicioUseCase` | `ConsultarServicioService` |
| `servicios` | `MarcarServicioEnEjecucionUseCase` | `MarcarServicioEnEjecucionService` |
| `servicios` | `MarcarServicioTerminadoUseCase` | `MarcarServicioTerminadoService` |
| `servicios` | `ConfirmarFinalizacionServicioUseCase` | `ConfirmarFinalizacionServicioService` |
| `servicios` | `CancelarServicioUseCase` | `CancelarServicioService` |
| `servicios` | `ConsultarHistorialServicioUseCase` | `ConsultarHistorialServicioService` |
| `servicios` | `EnviarMensajeServicioUseCase` | `EnviarMensajeServicioService` |
| `servicios` | `ConsultarMensajesServicioUseCase` | `ConsultarMensajesServicioService` |

Puertos de salida: ConsultaGestionPropuestasPort, ConsultaGestionSolicitudPort y RegistroNotificacionPort; adaptadores/composición preservan una transacción de aceptación. Las interfaces de entrada no crean endpoints nuevos; mantener API Contracts y las condiciones Could/Future. Las tareas existentes conservan IDs, historias, dependencias y orden: los nombres de servicio agrupado de origen se descomponen en estas operaciones, sin añadir tareas funcionales.

Persistencia de referencia: `servicios_contratados`, `historial_estado_servicio`, `mensajes_servicio`. El [manual entregado](../../tasks/fuentes/manual-base-de-datos-aliado.md) detalla el modelo MVP; no implica que los scripts V1–V6 ya estén disponibles o ejecutados.

**Structure Decision**: AceptarPropuestaUseCase coordina contratos públicos de propuestas/solicitudes y notificaciones, con una sola transacción para servicio, aceptación/cierre de propuestas, historial y aviso. Los demás UseCase gestionan consultas, transiciones y mensajes; cada Service implementa su interfaz. @Version pertenece a la entidad JPA; los conflictos se traducen a 409 en la frontera HTTP. No acceder a repositorios internos de otros módulos.

---

## Phase 1: Setup

- [ ] T001 Crear el paquete `servicios/` con interfaces UseCase, implementaciones Service y puertos/adaptadores de Arquitectura Limpia (según Project Structure)
- [ ] T002 Migración Flyway: tablas `servicios_contratados` (con columna `version` para bloqueo optimista), `historial_estado_servicio`, `mensajes_servicio`

---

## Phase 2: Foundational

No se requieren tareas fundacionales nuevas: autenticación/roles (SPEC-01), `Solicitud` (SPEC-04) y `Propuesta` (SPEC-07) ya existen y se consumen directamente.

**Checkpoint**: sin bloqueo adicional — funcionalmente este plan depende de que SPEC-04 y SPEC-07 estén completos.

---

## Phase 3: User Story 1 - Consultar y aceptar propuestas recibidas [UC045, UC046, UC047, UC048, UC049] (Priority: P1)

**Goal**: el Cliente consulta las propuestas activas de su solicitud y acepta una, lo que registra el servicio, cierra las demás propuestas y habilita la comunicación, en una sola operación consistente.

**Independent Test**: con varias propuestas activas, aceptar una y verificar servicio registrado + demás propuestas cerradas + comunicación habilitada; intentar aceptar una segunda y verificar el rechazo.

### Tests

- [ ] T003 [P] [US1] Contract test `GET /solicitudes/{id}/propuestas`, `POST /propuestas/{id}/aceptar` (200, 403, 404, 409) — `tests/contract/test_aceptacion_propuesta.java`
- [ ] T004 [P] [US1] Integration test: consulta de propuestas activas, aceptación exitosa (servicio + cierre de demás + comunicación habilitada en una sola operación), segunda aceptación sobre la misma solicitud (rechazo), actor no autorizado o solicitud ajena — `tests/integration/test_aceptar_propuesta.java`

### Implementation

- [ ] T005 [P] [US1] Modelo `ServicioContratado` — `servicios/domain/model`
- [ ] T006 [US1] `ServicioContratadoRepository` — `servicios/domain/repository`
- [ ] T007 [US1] `ListarPropuestasRecibidasUseCase.ejecutar(solicitudId)`: reutiliza el contrato público de propuestas de SPEC-07 filtrando por solicitud propia y estado ACTIVA (FR-045) (depends on dependencia externa: contrato público de propuestas de SPEC-07)
- [ ] T008 [US1] `AceptarPropuestaUseCase.ejecutar(propuestaId)`: valida que la solicitud no tenga ya un servicio contratado (FR-046), transaccionalmente crea `ServicioContratado` en estado CONTRATADO (FR-048), marca la propuesta aceptada como ACEPTADA y cierra el resto de propuestas activas de la misma solicitud como CERRADA (FR-047, reutiliza el contrato público de propuestas de SPEC-07), habilita `comunicacionHabilitada = true` (FR-049), registra la entrada inicial en `HistorialEstadoServicio` (depends on T005, T006, dependencia externa: contrato público de propuestas de SPEC-07)
- [ ] T009 [US1] Endpoints `GET /api/v1/solicitudes/{id}/propuestas`, `POST /api/v1/propuestas/{id}/aceptar` — `servicios/presentation/controller`

**Checkpoint**: el Cliente puede aceptar una propuesta de forma independiente, y el resultado queda consistente en una sola operación.

---

## Phase 4: User Story 2 - Consultar el detalle del servicio contratado [UC050] (Priority: P1)

**Goal**: el Cliente o el Prestador de un servicio consultan su detalle completo.

**Independent Test**: ambas partes consultan el detalle y ven la misma información; un tercero es rechazado.

### Tests

- [ ] T010 [P] [US2] Contract test `GET /servicios/{id}` (200, 403, 404) — `tests/contract/test_servicio_detalle.java`
- [ ] T011 [P] [US2] Integration test: consulta por Cliente y por Prestador del mismo servicio (misma información), consulta por actor ajeno (rechazo) — `tests/integration/test_detalle_servicio.java`

### Implementation

- [ ] T012 [US2] `ConsultarServicioUseCase.ejecutar(servicioId, actorId)`: valida que el actor sea el Cliente o el Prestador del servicio, construye la respuesta con solicitud de origen, propuesta aceptada y estado actual (FR-050) (depends on T006)
- [ ] T013 [US2] Endpoint `GET /api/v1/servicios/{id}` — `servicios/presentation/controller`

**Checkpoint**: ambas partes tienen una referencia única y confiable del servicio, de forma independiente.

---

## Phase 5: User Story 3 - Gestionar el ciclo de vida del servicio contratado [UC051, UC052, UC053, UC054] (Priority: P1)

**Goal**: el Prestador marca el servicio en ejecución y terminado; el Cliente confirma la finalización o cancela; cualquiera puede cancelar antes de finalizar.

**Independent Test**: marcar en ejecución, luego terminado, luego confirmar finalización, verificando el estado en cada paso; en un servicio distinto, cancelar antes de finalizar.

### Tests

- [ ] T014 [P] [US3] Contract test `POST /servicios/{id}/en-ejecucion`, `/terminado`, `/confirmar-finalizacion`, `/cancelar` (200, 403, 404, 409) — `tests/contract/test_ciclo_vida_servicio.java`
- [ ] T015 [P] [US3] Integration test: marcar en ejecución, marcar terminado, confirmar finalización, cancelar antes de finalizar, cancelar ya finalizado (rechazo), transiciones simultáneas (una válida, una rechazada, historial consistente), actor no autorizado o rol incorrecto para la transición — `tests/integration/test_ciclo_vida_servicio.java`

### Implementation

- [ ] T016 [P] [US3] Modelo `HistorialEstadoServicio` — `servicios/domain/model` (depends on T005)
- [ ] T017 [US3] `HistorialEstadoServicioRepository` — `servicios/domain/repository`
- [ ] T018 [US3] `MarcarServicioEnEjecucionUseCase.ejecutar()`: valida que el actor sea el Prestador del servicio y que el estado actual lo permita, detecta conflicto de concurrencia mediante el puerto de persistencia (el adaptador JPA usa `@Version`) (FR-051) (depends on T006, T017)
- [ ] T019 [US3] `MarcarServicioTerminadoUseCase.ejecutar()`: mismas validaciones que T018, deja el servicio pendiente de confirmación del Cliente (FR-052)
- [ ] T020 [US3] `ConfirmarFinalizacionServicioUseCase.ejecutar()`: valida que el actor sea el Cliente del servicio y que esté en estado TERMINADO, cierra definitivamente como FINALIZADO (FR-053) (depends on T018)
- [ ] T021 [US3] `CancelarServicioUseCase.ejecutar()`: valida que el actor sea Cliente o Prestador del servicio y que no esté ya FINALIZADO, transiciona a CANCELADO y rechaza en caso contrario (FR-054) (depends on T018)
- [ ] T022 [US3] Cada transición registra su entrada en `HistorialEstadoServicio` con el actor que la ejecutó, dentro de la misma transacción de la transición (depends on T017, T018-T021)
- [ ] T023 [US3] Endpoints `POST /api/v1/servicios/{id}/en-ejecucion`, `/terminado`, `/confirmar-finalizacion`, `/cancelar` — `servicios/presentation/controller`

**Checkpoint**: el estado del servicio refleja siempre la realidad, incluso ante transiciones simultáneas.

---

## Phase 6: User Story 4 - Consultar el historial de estados del servicio [UC055] (Priority: P1)

**Goal**: el Cliente o el Prestador de un servicio consultan su historial completo de transiciones.

**Independent Test**: con un servicio que pasó por varias transiciones, consultar su historial y verificar el orden; un actor ajeno es rechazado.

### Tests

- [ ] T024 [P] [US4] Contract test `GET /servicios/{id}/historial` (200, 403, 404) — `tests/contract/test_historial_servicio.java`
- [ ] T025 [P] [US4] Integration test: historial disponible en orden, actor ajeno (rechazo) — `tests/integration/test_historial_servicio.java`

### Implementation

- [ ] T026 [US4] `ConsultarHistorialServicioUseCase.ejecutar(servicioId, actorId)`: valida que el actor sea Cliente o Prestador del servicio, devuelve las transiciones ordenadas cronológicamente (FR-055) (depends on T017)
- [ ] T027 [US4] Endpoint `GET /api/v1/servicios/{id}/historial` — `servicios/presentation/controller`

**Checkpoint**: ambas partes tienen trazabilidad completa del servicio, de forma independiente.

---

## Phase 7: User Story 5 - Usar el canal de comunicación autorizado [UC056] (Priority: P1)

**Goal**: el Cliente o el Prestador de un servicio contratado se comunican por un canal autorizado una vez habilitado, sin exponer datos de contacto personales.

**Independent Test**: con un servicio recién contratado (comunicación habilitada), enviar un mensaje y verificar que llega a la otra parte; intentar usarlo antes de la habilitación y verificar el rechazo.

### Tests

- [ ] T028 [P] [US5] Contract test `POST /servicios/{id}/mensajes`, `GET /servicios/{id}/mensajes` (201, 200, 403, 404, 409) — `tests/contract/test_mensajes_servicio.java`
- [ ] T029 [P] [US5] Integration test: envío tras habilitación, intento antes de habilitación (rechazo), actor ajeno al servicio (rechazo), ningún dato de contacto personal expuesto en la respuesta — `tests/integration/test_mensajes_servicio.java`

### Implementation

- [ ] T030 [P] [US5] Modelo `MensajeServicio` — `servicios/domain/model` (depends on T005)
- [ ] T031 [US5] `MensajeServicioRepository` — `servicios/domain/repository`
- [ ] T032 [US5] `EnviarMensajeServicioUseCase.ejecutar()`: valida que el actor sea Cliente o Prestador del servicio y que `comunicacionHabilitada = true`, rechaza en caso contrario (FR-056) (depends on T006, T031)
- [ ] T033 [US5] `ConsultarMensajesServicioUseCase.ejecutar()`: misma validación de propiedad y habilitación (depends on T032)
- [ ] T034 [US5] Endpoints `POST /api/v1/servicios/{id}/mensajes`, `GET /api/v1/servicios/{id}/mensajes` — `servicios/presentation/controller`

**Checkpoint**: ambas partes pueden coordinar el servicio sin depender de canales informales.

---

## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F08-FE-01** Cliente lista propuestas activas propias, compara disponibilidad/mensaje y confirma aceptación.
- [ ] **F08-FE-02** Detalle compartido con acciones según rol y estado, confirmación de finalización para Cliente y cancelación válida.
- [ ] **F08-FE-03** Historial ordenado de estados; manejar 409 refrescando servicio antes de ofrecer nueva acción.
- [ ] **F08-FE-04** Canal de mensajes REST autorizado tras contratación, con errores y reintento; realtime permanece en F15.
- [ ] **F08-FE-05** No mostrar contacto personal: mantener comunicación mediada de SPEC-08, aunque la demo tenga un recorrido distinto.

Aplicar [estados y contrato de cliente](../../tasks/01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación de la feature

- [ ] **F08-QA-01** Aceptar dos propuestas simultáneamente: solo un servicio, una aceptada, cierre del resto e historial/notificación atómicos.
- [ ] **F08-QA-02** CONTRATADO → EN_EJECUCION → TERMINADO → FINALIZADO; cancelación solo antes de finalizado conforme SPEC-08.
- [ ] **F08-QA-03** Aislar mensajes de terceros y probar canal antes de habilitación; política tras cierre se decide en D-10.
- [ ] **F08-QA-04** Completar integración de eliminación de cuenta F02 con servicios activos.
- [ ] **F08-QA-05** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Dependencies & Execution Order

- **Setup (Phase 1)** → depende de SPEC-01, SPEC-04 y SPEC-07 ya completos.
- **Foundational (Phase 2)** → no aplica como fase propia; funcionalmente depende de SPEC-04 y SPEC-07.
- **User Story 1 (Phase 3)** → depende de Setup. Es prerrequisito de todas las demás historias de este plan (requieren un `ServicioContratado` ya creado).
- **User Story 2 (Phase 4)** → depende de User Story 1.
- **User Story 3 (Phase 5)** → depende de User Story 1.
- **User Story 4 (Phase 6)** → depende de User Story 3 (necesita transiciones registradas para tener historial que mostrar).
- **User Story 5 (Phase 7)** → depende de User Story 1 (requiere `comunicacionHabilitada`).
- **Dependencia hacia adelante**: `plan-spec-09-notificaciones-propuestas-servicios.md` dependerá de los eventos de aceptación (T008) y de cada transición de estado (T018-T021) de este plan para disparar sus notificaciones (FR-057, FR-058); esos métodos deben exponer un punto de extensión (ej. evento de dominio o llamada directa) que SPEC-09 pueda enganchar sin modificar la lógica transaccional ya probada aquí.

## Notes

- **Resuelve la dependencia cruzada pendiente de `plan-spec-02-perfil.md` (T016)**: `ConfirmarEliminacionCuentaUseCase` puede ahora consultar el contrato público de servicios activos de este plan para verificar si un usuario tiene un servicio en estado distinto de FINALIZADO o CANCELADO antes de permitir la eliminación de cuenta. Esta integración no es una tarea de este plan (pertenece al plan de SPEC-02), pero debe anotarse ahí como dependencia ahora resuelta.
- Pendiente de aclaración real del propio SPEC (no inventable): si `TERMINADO` exige pasar antes por `EN_EJECUCION` o si puede alcanzarse directamente — ver nota en Data Model y en T019.
- El bloqueo optimista (`@Version`) es la técnica elegida para resolver el edge case de transiciones simultáneas; es una decisión de implementación para cumplir SC-003, no un requisito nuevo no solicitado.
- Este plan reutiliza el registro unificado de notificaciones por interfaces públicas: FR-057 y FR-058 (notificar aceptación y cambios de estado) pertenecen explícitamente a SPEC-09, que debe enganchar sus notificaciones a los eventos de T008 y T018-T021 de este plan.
