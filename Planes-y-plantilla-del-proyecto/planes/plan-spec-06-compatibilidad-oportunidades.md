# Implementation Plan: SPEC-06

**Date**: 2026-10-02
**Spec**: [spec-06-compatibilidad-oportunidades](../../FASE-4-Prototipar/specs/spec-06-compatibilidad-oportunidades.md)

## Summary

SPEC-06 cubre el cálculo de compatibilidad entre solicitudes (SPEC-04) y perfiles de Prestador (SPEC-05), el tablero de oportunidades con filtros, la consulta de detalle de una oportunidad, y las notificaciones de nuevas oportunidades compatibles. No introduce entidades de negocio propias más allá de la representación de "oportunidad" y "notificación"; su lógica central es un servicio de cálculo que lee de `Solicitud` (SPEC-04) y `PerfilProfesional`/`Disponibilidad` (SPEC-05).

## Technical Context

**Language/Version**: Java 21 (LTS) — reutilizado de SPEC-01
**Primary Dependencies**: Spring Boot 3.3.x (Web, Data JPA, Validation), Flyway — reutilizados de SPEC-01. No se agregan dependencias de framework nuevas.
**Build tool**: Maven
**Storage**: PostgreSQL 16 — una tabla nueva para notificaciones; el cálculo de compatibilidad se realiza sobre `Solicitud`, `PerfilProfesional` y `Disponibilidad` ya existentes (SPEC-04/SPEC-05), sin tabla propia de "compatibilidad" (ver Data Model)
**Testing**: JUnit 5 + Mockito, Spring Boot Test + Testcontainers (PostgreSQL), MockMvc/WebTestClient — reutilizados de SPEC-01
**Target Platform**: VPS Hostinger (Docker Compose) — reutilizado de SPEC-01
**Project Type**: Web + Mobile (backend único) — reutilizado de SPEC-01
**Performance Goals**: RNF-003 (el tablero debe cargar en un tiempo que permita revisión ágil) — sin cifra numérica definida en los documentos entregados 
**Constraints**: RNF-003 (rendimiento del tablero), RNF-004 (no exponer datos privados del Cliente ni dirección exacta), RNF-007 (notificaciones en tiempo casi real), RNF-008 (escalabilidad del cálculo de compatibilidad)
**Scale/Scope**: ~50–100 Prestadores, ~200–500 Clientes (piloto) — reutilizado de SPEC-01

## Data Model

Este SPEC no agrega entidades persistentes de "oportunidad" ni de "criterio de compatibilidad": según sus propias Key Entities, una oportunidad es "una solicitud publicada por un Cliente vista desde la perspectiva de un Prestador compatible" — es decir, una proyección calculada de `Solicitud` (SPEC-04), no una tabla nueva.

| Entidad | Campos clave |
|---|---|
| `Solicitud` *(SPEC-04, reutilizada)* | usada como fuente de categoría, zona, urgencia, estado |
| `PerfilProfesional` *(SPEC-05, reutilizada)* | usada junto a `PerfilCategoria`/`PerfilZonaAtencion` como criterio de categoría/zona |
| `Disponibilidad` *(SPEC-05, reutilizada)* | usada como criterio de disponibilidad |
| `Notificacion` *(módulo notificaciones, reutilizada)* | tipo NUEVA_OPORTUNIDAD, destinatarioId, aggregateId de solicitud, eventVersion y estado de entrega; una fuente de persistencia compartida |



## API Contracts

| Método | Endpoint | Request body / Query params | Respuesta éxito | Errores |
|---|---|---|---|---|
| GET | `/api/v1/oportunidades` | query params de filtro opcionales (categoría, urgencia) | `200 [ { solicitudId, categoria, zonaAproximada, urgencia, ... } ]` *(puede ser vacío)* | `401` sin rol Prestador |
| GET | `/api/v1/oportunidades/{solicitudId}` | — | `200 { ...detalle completo, sin datos privados del Cliente ni dirección exacta }` | `404` no compatible o inexistente (sin distinguir causa) |
| GET | `/api/v1/notificaciones/oportunidades` | — | `200 [ { solicitudId, fechaGeneracion, estado } ]` | `401` sin rol Prestador |

Todos los endpoints restringidos a rol PRESTADOR mediante el filtro de autorización por rol de SPEC-01 (T018). No se expone un endpoint de "push" en tiempo real en esta tabla porque el mecanismo de entrega (polling vs. WebSocket vs. push) no está definido — ver Notes.

## Testing Strategy

- **Arquitectura**: comprobar `Service implements UseCase`, constructores de entrada con interfaces, ausencia de Spring/JPA/HTTP en dominio/aplicación, mappers separados y transacciones verificadas con PostgreSQL cuando aplique.

- **Contract tests**: uno por endpoint de la tabla anterior.
- **Integration tests**: uno por Acceptance Scenario del SPEC (10 escenarios entre las 2 historias), con Testcontainers, incluyendo tablero vacío, filtro sin coincidencias, solicitud no evaluable, y notificación pendiente mientras el Prestador no tiene sesión activa (edge case).
- **Unit tests**: reglas de dominio y Service que implementan CalcularCompatibilidadUseCase (coincidencia de categoría, zona y disponibilidad; marcado de no evaluable ante datos insuficientes), lógica de filtrado adicional sin alterar el cálculo base.

## Project Structure

```text
backend/src/main/java/com/aliado/
└── oportunidades/
    ├── application/
    │   ├── usecase/
    │   │   ConsultarTableroOportunidadesUseCase, ConsultarDetalleOportunidadUseCase, CalcularCompatibilidadUseCase,
    │   │   DetectarNuevaOportunidadUseCase
    │   ├── service/
    │   │   ConsultarTableroOportunidadesService, ConsultarDetalleOportunidadService, CalcularCompatibilidadService,
    │   │   DetectarNuevaOportunidadService
    │   ├── dto/
    │   │   Command/Query/Result de las operaciones del módulo (sin HTTP/JPA)
    │   └── port/
    │       ConsultaSolicitudesAbiertasPort, ConsultaCoberturaDisponibilidadPort, RegistroNotificacionPort
    ├── infrastructure/
    │   └── adapter/
    │       Adaptadores de puertos requeridos; reutilizar contratos existentes
    └── presentation/
        ├── controller/
        │   OportunidadController
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
| `oportunidades` | `ConsultarTableroOportunidadesUseCase` | `ConsultarTableroOportunidadesService` |
| `oportunidades` | `ConsultarDetalleOportunidadUseCase` | `ConsultarDetalleOportunidadService` |
| `oportunidades` | `CalcularCompatibilidadUseCase` | `CalcularCompatibilidadService` |
| `oportunidades` | `DetectarNuevaOportunidadUseCase` | `DetectarNuevaOportunidadService` |

Puertos de salida: ConsultaSolicitudesAbiertasPort, ConsultaCoberturaDisponibilidadPort y RegistroNotificacionPort. Las interfaces de entrada no crean endpoints nuevos; mantener API Contracts y las condiciones Could/Future. Las tareas existentes conservan IDs, historias, dependencias y orden: los nombres de servicio agrupado de origen se descomponen en estas operaciones, sin añadir tareas funcionales.

Persistencia de referencia: `notificaciones`. El [manual entregado](../../tasks/fuentes/manual-base-de-datos-aliado.md) detalla el modelo MVP; no implica que los scripts V1–V6 ya estén disponibles o ejecutados.

**Structure Decision**: oportunidades es una proyección calculada, sin tabla propia. ConsultarTableroOportunidadesUseCase y ConsultarDetalleOportunidadUseCase coordinan contratos públicos de solicitudes/perfiles; el cálculo puro se delega al dominio. DetectarNuevaOportunidadUseCase registra el evento mediante RegistroNotificacionPort; notificaciones lo persiste y entrega. La sesión activa no acredita entrega del proveedor.

---

## Phase 1: Setup

- [ ] T001 Crear el paquete `oportunidades/` con interfaces UseCase, implementaciones Service y puertos/adaptadores de Arquitectura Limpia (según Project Structure)
- [ ] T002 Migración Flyway: tabla `notificaciones_oportunidad`

---

## Phase 2: Foundational

No se requieren tareas fundacionales nuevas: autenticación/roles (SPEC-01), `Solicitud` (SPEC-04) y `PerfilProfesional`/`Disponibilidad` (SPEC-05) ya existen y se consumen directamente.

**Checkpoint**: sin bloqueo adicional más allá de que SPEC-04 y SPEC-05 estén completos (ambos son prerrequisito funcional, no solo de infraestructura, porque este SPEC calcula sobre sus datos).

---

## Phase 3: User Story 1 - Ver y filtrar el tablero de oportunidades compatibles [UC034, UC035, UC036, UC038] (Priority: P1)

**Goal**: un Prestador puede ver su tablero de oportunidades compatibles, filtrarlo, y ser notificado cuando aparece una nueva oportunidad.

**Independent Test**: con perfil configurado y solicitudes publicadas en distintas categorías/zonas, consultar el tablero y verificar que solo aparecen las compatibles; aplicar un filtro y verificar que se acota; publicar una nueva solicitud compatible y verificar que se genera la notificación.

### Tests

- [ ] T003 [P] [US1] Contract test `GET /oportunidades`, `GET /notificaciones/oportunidades` (200, 401) — `tests/contract/test_oportunidades_tablero.java`
- [ ] T004 [P] [US1] Integration test: tablero con oportunidades compatibles, tablero vacío, filtro que acota resultados, filtro sin coincidencias, solicitud sin datos suficientes marcada no evaluable, notificación generada al publicar solicitud compatible, notificación pendiente sin sesión activa, actor no autorizado — `tests/integration/test_tablero_oportunidades.java`

### Implementation

- [ ] T005 [P] [US1] Reutilizar el modelo Notificacion del módulo notificaciones para NUEVA_OPORTUNIDAD; definir el payload del evento en aplicación sin entidad puntual de oportunidades.
- [ ] T006 [US1] Conectar RegistroNotificacionPort con RegistrarNotificacionUseCase del módulo notificaciones; reutilizar su puerto de persistencia, sin NotificacionOportunidadRepository ni tabla puntual.
- [ ] T007 [US1] `ConsultarTableroOportunidadesUseCase.ejecutar(prestadorId)`: consulta `Solicitud` (SPEC-04) y `PerfilProfesional`/`Disponibilidad` (SPEC-05) mediante contratos públicos de consulta; compara categoría, zona y disponibilidad (FR-034); marca como no evaluable toda solicitud sin datos suficientes, excluyéndola del resultado (FR-034); devuelve lista vacía sin error cuando no hay coincidencias (FR-035) (depends on T005, dependencias externas: consultas públicas de solicitudes y perfiles/disponibilidad de SPEC-04/05)
- [ ] T008 [US1] `ConsultarTableroOportunidadesUseCase.ejecutar(prestadorId, criterios)`: aplica filtros adicionales (categoría, urgencia) sobre el resultado de T007 sin alterar el cálculo base (FR-036); devuelve vacío sin error si ningún resultado cumple (depends on T007)
- [ ] T009 [US1] DetectarNuevaOportunidadUseCase y su Service: detectar Solicitud publicada compatible (FR-038), registrar Notificacion NUEVA_OPORTUNIDAD con estado PENDIENTE y clave de evento; entrega diferida por F09, no por presencia de sesión (depends on T006, T007).
- [ ] T010 [US1] Endpoints `GET /api/v1/oportunidades` (con query params de filtro), `GET /api/v1/notificaciones/oportunidades` — `oportunidades/presentation/controller`

**Checkpoint**: el Prestador puede ver, filtrar y recibir notificaciones de su tablero de oportunidades de forma independiente.

---

## Phase 4: User Story 2 - Consultar el detalle de una oportunidad [UC037] (Priority: P1)

**Goal**: el Prestador puede consultar el detalle completo de una oportunidad de su tablero.

**Independent Test**: con una oportunidad compatible visible, consultar su detalle y verificar que muestra la información completa sin exponer datos privados del Cliente.

### Tests

- [ ] T011 [P] [US2] Contract test `GET /oportunidades/{solicitudId}` (200, 404) — `tests/contract/test_oportunidad_detalle.java`
- [ ] T012 [P] [US2] Integration test: detalle disponible sin datos privados ni dirección exacta, oportunidad no compatible o inexistente (rechazo unificado), actor no autorizado — `tests/integration/test_detalle_oportunidad.java`

### Implementation

- [ ] T013 [US2] `ConsultarDetalleOportunidadUseCase.ejecutar(prestadorId, solicitudId)`: reutiliza la verificación de compatibilidad de T007 para esa solicitud puntual; si no es compatible o no existe, rechaza sin distinguir la causa (FR-037); construye la respuesta a partir de `Solicitud` (SPEC-04) excluyendo explícitamente dirección exacta y datos privados del Cliente (depends on T007)
- [ ] T014 [US2] Endpoint `GET /api/v1/oportunidades/{solicitudId}` — `oportunidades/presentation/controller`

**Checkpoint**: el Prestador puede consultar el detalle de una oportunidad específica de forma independiente.

---

## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F06-FE-01** Tablero con filtros y estados vacío, cargando, sin datos suficientes y error de conexión.
- [ ] **F06-FE-02** Detalle que solo permite proponer sobre solicitud abierta y compatible; refrescar después de cambios relevantes.
- [ ] **F06-FE-03** Abrir oportunidad desde notificación y volver a validar en servidor en lugar de confiar en el push.
- [ ] **F06-FE-04** No revelar identidad/contacto del Cliente antes de autorización del servicio.

Aplicar [estados y contrato de cliente](../../tasks/01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación de la feature

- [ ] **F06-QA-01** Matriz de coincidencia de categoría, zona y disponibilidad; datos insuficientes excluidos como no evaluables.
- [ ] **F06-QA-02** Cambio de agenda/solicitud invalida coincidencias sin tabla oportunidades duplicada.
- [ ] **F06-QA-03** Nuevas coincidencias persisten una sola notificación por evento aunque el Prestador no tenga sesión activa.
- [ ] **F06-QA-04** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Dependencies & Execution Order

- **Setup (Phase 1)** → depende de SPEC-01 (auth/roles), SPEC-04 (`Solicitud`) y SPEC-05 (`PerfilProfesional`, `Disponibilidad`) ya completos.
- **Foundational (Phase 2)** → no aplica como fase de infraestructura propia; funcionalmente, todo este plan depende de que SPEC-04 y SPEC-05 estén implementados.
- **User Story 1 (Phase 3)** → depende de Setup.
- **User Story 2 (Phase 4)** → depende de User Story 1 (reutiliza `ConsultarTableroOportunidadesUseCase.ejecutar`/su lógica de verificación).

## Notes

- Este plan no crea una tabla de "oportunidades": calcula sobre `Solicitud` (SPEC-04) y `PerfilProfesional`/`Disponibilidad` (SPEC-05) en tiempo de consulta, para evitar un estado duplicado que pueda desincronizarse.
- Pendientes de aclaración: umbral de rendimiento concreto para RNF-003 (el tablero "debe cargar en un tiempo que permita revisión ágil" no da una cifra); si "no evaluable" es un cálculo en tiempo de consulta o un flag persistente en `Solicitud`; el disparador y mecanismo de entrega en tiempo casi real de las notificaciones (RNF-007): WebSocket, push nativo (FCM, ya contemplado como alternativa de infraestructura en la Plantilla del Proyecto para la Alternativa B, pero no confirmado como decisión final) o polling.
- Si el disparador de notificaciones termina requiriendo un mecanismo de eventos (ej. tras guardar una `Solicitud` en SPEC-04), ese enganche debe hacerse sin modificar `SolicitudService` de SPEC-04 más allá de lo estrictamente necesario para no romper su independencia ya probada.
