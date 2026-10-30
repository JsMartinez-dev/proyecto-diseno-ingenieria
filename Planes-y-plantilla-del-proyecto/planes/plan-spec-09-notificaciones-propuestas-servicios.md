# Implementation Plan: SPEC-09

**Date**: 2026-10-02
**Spec**: [spec-09-notificaciones-propuestas-servicios](../../FASE-4-Prototipar/specs/spec-09-notificaciones-propuestas-servicios.md)
**Depends on**: `plan-spec-01-autenticacion.md` (roles Cliente/Prestador), `plan-spec-08-contratacion-ciclo-servicio.md` (eventos de aceptación de propuesta y de cada transición de estado del servicio, que este plan debe enganchar sin modificarlos)

## Summary

SPEC-09 cubre avisos por aceptación y transiciones reales del servicio. Reutiliza el módulo/tabla notificaciones que también persiste eventos de SPEC-06/07; no existe un patrón paralelo de tablas puntuales. RegistrarNotificacionUseCase registra dentro de la transacción de negocio; EntregarNotificacionesPendientesUseCase coordina entrega externa posterior al commit.

## Technical Context

**Language/Version**: Java 21 (LTS) — reutilizado de SPEC-01
**Primary Dependencies**: Spring Boot 3.3.x (Web, Data JPA, Validation), Flyway — reutilizados de SPEC-01
**Build tool**: Maven
**Storage**: PostgreSQL 16 — tabla notificaciones compartida por SPEC-06/07/09
**Testing**: JUnit 5 + Mockito, Spring Boot Test + Testcontainers (PostgreSQL), MockMvc/WebTestClient — reutilizados de SPEC-01
**Target Platform**: VPS Hostinger (Docker Compose) — reutilizado de SPEC-01
**Project Type**: Web + Mobile (backend único) — reutilizado de SPEC-01
**Performance Goals**: sin metas específicas nuevas de este SPEC
**Constraints**: RNF-007 (notificaciones en tiempo casi real), RNF-006 (no duplicar avisos ante fallas y reintentos del canal de entrega)
**Scale/Scope**: ~50–100 Prestadores, ~200–500 Clientes (piloto) — reutilizado de SPEC-01

## Data Model

| Entidad | Campos clave |
|---|---|
| `Notificacion` | id, destinatarioId, tipo, aggregateId, eventVersion, detalle, canal, estadoEntrega, intentos, fechaGeneracion, fechaEntrega; SPEC-09 usa ACEPTACION_PROPUESTA/CAMBIO_ESTADO_SERVICIO |

Restricción de unicidad del evento: `(tipo, aggregateId, destinatarioId, eventVersion)` conforme al plan general; la política de multicanal debe concretarse antes de imponer unicidad por canal. Reintentar entrega actualiza el evento persistido, no crea otra notificación (SC-003). `servicioId` de la respuesta HTTP se proyecta de aggregateId cuando el evento corresponde a un servicio.




## API Contracts

| Método | Endpoint | Request body | Respuesta éxito | Errores |
|---|---|---|---|---|
| GET | `/api/v1/notificaciones` | — | `200 [ { tipo, servicioId, detalle, estadoEntrega, fechaGeneracion }, ... ]` *(propias del actor autenticado)* | `401` sin sesión |

No se expone ningún endpoint de creación: por diseño (FR del SPEC exige que una notificación nunca se genere sin un evento real asociado), `Notificacion` se registra mediante RegistrarNotificacionUseCase por productores autorizados de SPEC-06/07/08, nunca a través de la API pública. Esto es lo que garantiza SC-004 a nivel de contrato, no solo de validación de negocio.

## Testing Strategy

- **Arquitectura**: comprobar `Service implements UseCase`, constructores de entrada con interfaces, ausencia de Spring/JPA/HTTP en dominio/aplicación, mappers separados y transacciones verificadas con PostgreSQL cuando aplique.

- **Contract tests**: el único endpoint de la tabla anterior, más una verificación explícita de que no existe ruta de creación pública.
- **Integration tests**: uno por Acceptance Scenario del SPEC (7 escenarios entre las 2 historias), con Testcontainers, incluyendo falla simulada del canal de entrega (el evento permanece consultable y no se duplica al reintentar) y el intento de generar una notificación sin evento real (debe ser imposible, no solo rechazado).
- **Unit tests**: `RegistrarNotificacionUseCase.ejecutar()` no crea una segunda fila para el mismo evento (unicidad), `CanalEntregaNotificacion` reintenta sin duplicar, disparo exclusivo desde los puntos de extensión de los UseCase de servicio de SPEC-08 (SPEC-08).

## Project Structure

```text
backend/src/main/java/com/aliado/
└── notificaciones/
    ├── domain/
    │   ├── model/
    │   │   Notificacion
    │   └── repository/
    │       NotificacionRepository
    ├── application/
    │   ├── usecase/
    │   │   RegistrarNotificacionUseCase, ConsultarNotificacionesPropiasUseCase,
    │   │   EntregarNotificacionesPendientesUseCase
    │   ├── service/
    │   │   RegistrarNotificacionService, ConsultarNotificacionesPropiasService,
    │   │   EntregarNotificacionesPendientesService
    │   ├── dto/
    │   │   Command/Query/Result de las operaciones del módulo (sin HTTP/JPA)
    │   └── port/
    │       CanalEntregaNotificacion, ConsultaPreferenciasPort
    ├── infrastructure/
    │   ├── persistence/
    │   │   ├── entity/
    │   │   │   NotificacionEntity
    │   │   ├── mapper/
    │   │   │   NotificacionMapper
    │   │   ├── jpa/
    │   │   │   NotificacionJpaRepository
    │   │   └── adapter/
    │   │       NotificacionPersistenceAdapter
    │   ├── adapter/
    │   │   Adaptadores de puertos requeridos; reutilizar contratos existentes
    │   └── worker/
    │       Worker de entrega (depende de EntregarNotificacionesPendientesUseCase)
    └── presentation/
        ├── controller/
        │   NotificacionController
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
| `notificaciones` | `RegistrarNotificacionUseCase` | `RegistrarNotificacionService` |
| `notificaciones` | `ConsultarNotificacionesPropiasUseCase` | `ConsultarNotificacionesPropiasService` |
| `notificaciones` | `EntregarNotificacionesPendientesUseCase` | `EntregarNotificacionesPendientesService` |

Puertos de salida: CanalEntregaNotificacion, ConsultaPreferenciasPort y puertos de entrega; worker invoca interfaz de entrada. Las interfaces de entrada no crean endpoints nuevos; mantener API Contracts y las condiciones Could/Future. Las tareas existentes conservan IDs, historias, dependencias y orden: los nombres de servicio agrupado de origen se descomponen en estas operaciones, sin añadir tareas funcionales.

Persistencia de referencia: `notificaciones`. El [manual entregado](../../tasks/fuentes/manual-base-de-datos-aliado.md) detalla el modelo MVP; no implica que los scripts V1–V6 ya estén disponibles o ejecutados.

**Structure Decision**: el módulo propietario expone RegistrarNotificacionUseCase, ConsultarNotificacionesPropiasUseCase y EntregarNotificacionesPendientesUseCase. Sus Service implementan las interfaces; productores y worker dependen de contratos. CanalEntregaNotificacion es puerto de salida. Persistencia atómica con el negocio y entrega externa asíncrona con reintentos/idempotencia; ningún consumidor inyecta una implementación de notificaciones.

---

## Phase 1: Setup

- [ ] T001 Crear el paquete `notificaciones/` con interfaces UseCase, implementaciones Service y puertos/adaptadores de Arquitectura Limpia (según Project Structure)
- [ ] T002 Migración/verificación de tabla compartida notificaciones según manual, con clave de evento (tipo, aggregate_id, destinatario_id, event_version); no crear tablas paralelas ni reescribir migraciones aplicadas.

---

## Phase 2: Foundational

- [ ] T003 Definir interfaz `CanalEntregaNotificacion` (contrato de entrega, con una implementación mínima que registra el intento sin proveedor externo real) — puerto en `notificaciones/application/port` e implementación en `notificaciones/infrastructure/adapter`
- [ ] T004 RegistrarNotificacionUseCase y RegistrarNotificacionService: persistencia idempotente junto al negocio; EntregarNotificacionesPendientesUseCase y su Service: consumir CanalEntregaNotificacion después del commit, con reintentos (depends on T003).

**Checkpoint**: el mecanismo genérico de notificación está listo para que SPEC-08 lo invoque desde sus puntos de extensión.

---

## Phase 3: User Story 1 - Notificar la aceptación de una propuesta [UC057] (Priority: P1)

**Goal**: el Prestador es notificado automáticamente cuando su propuesta es aceptada.

**Independent Test**: aceptar una propuesta (SPEC-08) y verificar que el Prestador recibe la notificación; simular una falla en el canal y verificar que el evento sigue consultable sin duplicar el aviso al recuperarse.

### Tests

- [ ] T005 [P] [US1] Contract test `GET /notificaciones` filtrando tipo ACEPTACION_PROPUESTA (200) — `tests/contract/test_notificacion_aceptacion.java`
- [ ] T006 [P] [US1] Integration test: notificación disparada por aceptación real, falla de canal seguida de recuperación sin duplicado, intento de generar notificación de aceptación sin una aceptación real (debe ser imposible porque no existe endpoint de creación) — `tests/integration/test_notificar_aceptacion.java`

### Implementation

- [ ] T007 [P] [US1] Modelo `Notificacion` — `notificaciones/domain/model`
- [ ] T008 [US1] `NotificacionRepository` — `notificaciones/domain/repository`
- [ ] T009 [US1] Enganchar `RegistrarNotificacionUseCase.ejecutar()` dentro de `AceptarPropuestaUseCase.ejecutar()` (T008 de SPEC-08), notificando al Prestador cuya propuesta fue aceptada (FR-057) (depends on T004, T008, dependencia externa: `AceptarPropuestaUseCase.ejecutar()` de SPEC-08 — modificación mínima de ese método para invocar el punto de extensión, sin alterar su lógica transaccional ya probada)
- [ ] T010 [US1] Endpoint `GET /api/v1/notificaciones` (propias del actor autenticado) — `notificaciones/presentation/controller`

**Checkpoint**: el Prestador recibe notificación automática de aceptación, sin que ningún actor deba solicitarla.

---

## Phase 4: User Story 2 - Notificar cambios de estado del servicio [UC058] (Priority: P1)

**Goal**: la contraparte del servicio es notificada automáticamente ante cada transición de estado.

**Independent Test**: marcar en ejecución y verificar que el Cliente es notificado; repetir para terminado, confirmación de finalización y cancelación, verificando que se notifica a la contraparte de quien ejecutó la acción.

### Tests

- [ ] T011 [P] [US2] Contract test `GET /notificaciones` filtrando tipo CAMBIO_ESTADO_SERVICIO (200) — `tests/contract/test_notificacion_cambio_estado.java`
- [ ] T012 [P] [US2] Integration test: notificación por transición del Prestador (en ejecución, terminado) hacia el Cliente, notificación por transición del Cliente (confirmar finalización) hacia el Prestador, notificación por cancelación (de cualquiera de las dos partes) hacia la contraparte, falla de canal seguida de recuperación sin duplicado — `tests/integration/test_notificar_cambio_estado.java`

### Implementation

- [ ] T013 [US2] RegistrarNotificacionUseCase se invoca mediante puerto dentro de las transiciones MarcarServicioEnEjecucionUseCase, MarcarServicioTerminadoUseCase, ConfirmarFinalizacionServicioUseCase y CancelarServicioUseCase de SPEC-08 (T018-T021); avisar a contraparte según FR-058, sin envío externo dentro de la transacción (depends on T004, T008).

**Checkpoint**: ambas partes del servicio quedan siempre informadas de los cambios de estado que no ejecutaron ellas mismas.

---

## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F09-FE-01** Bandeja propia y navegación al recurso correspondiente; permitir consultar eventos aunque push haya fallado.
- [ ] **F09-FE-02** Registrar/renovar y retirar token de dispositivo por sesión mediante contrato a definir en D-08.
- [ ] **F09-FE-03** Estados de permisos push denegados y canal no disponible sin impedir usar la app.
- [ ] **F09-FE-04** No añadir marcación leído/no leído persistida hasta definir contrato y migración: el modelo no tiene ese campo.

Aplicar [estados y contrato de cliente](../../tasks/01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación de la feature

- [ ] **F09-QA-01** F09.base ofrece puerto/persistencia/fake para F06–F08 antes de integrar los productores; no depende de sus controladores.
- [ ] **F09-QA-02** Simular caída proveedor: negocio confirma, notificación queda pendiente y worker reintenta sin generar otro evento lógico.
- [ ] **F09-QA-03** Probar clave de unicidad tipo/aggregate_id/destinatario/event_version, preferencias F14 y múltiples workers.
- [ ] **F09-QA-04** Sin endpoint público para fabricar notificaciones; notificación solo por evento real.
- [ ] **F09-QA-05** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Dependencies & Execution Order

- **Setup (Phase 1)** → depende de SPEC-01 y SPEC-08 ya completos.
- **Foundational (Phase 2)** → bloquea Phases 3-4 de este plan.
- **User Story 1 (Phase 3)** → depende de Foundational. Requiere modificar `AceptarPropuestaUseCase.ejecutar()` de SPEC-08 para invocar el punto de extensión.
- **User Story 2 (Phase 4)** → depende de Foundational; puede avanzar en paralelo a User Story 1. Requiere modificar los cuatro métodos de transición de los UseCase de servicio de SPEC-08 de SPEC-08.

## Notes

- Se utiliza una sola tabla notificaciones para SPEC-06/07/09, conforme al plan general/manual; cada productor registra mediante una interfaz pública. No se requiere una migración futura desde tablas puntuales que este plan no crea.
- Este plan modifica mínimamente cuatro métodos ya implementados en `plan-spec-08-contratacion-ciclo-servicio.md` (T008, T018, T019, T020, T021) para invocar `RegistrarNotificacionUseCase.ejecutar()`. Esa modificación debe hacerse como un punto de extensión (ej. una línea de llamada al final del método, dentro de la misma transacción), no como una reescritura de la lógica ya probada de SPEC-08.
- Pendiente de aclaración real: mecanismo concreto de `CanalEntregaNotificacion` (push, SMS, correo) y si el actor "Proveedor de notificaciones" es un servicio externo a integrar — ninguna fuente entregada lo define.
