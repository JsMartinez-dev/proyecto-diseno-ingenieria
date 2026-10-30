# F09 — Notificaciones unificadas y entrega

**Alcance:** MVP. **Estado:** planificado, sin implementación.
**Dependencias:** 01; productores 06 07 08. **Decisiones relacionadas:** D-08 (ver [registro](../03-decisiones-y-dependencias.md)).

## Resultado esperado

Una fuente de notificaciones para oportunidad, propuesta, aceptación y transiciones; entrega posterior al commit.

## Fuentes y trazabilidad

- [SPEC original](../fuentes/specs/spec-09-notificaciones-propuestas-servicios.md): historias, escenarios, requisitos y criterios de éxito.
- [Plan de origen](../fuentes/planes/plan-spec-09-notificaciones-propuestas-servicios.md): fases, tareas y dependencias detalladas.
- [Manual de datos](../fuentes/manual-base-de-datos-aliado.md), [modelo PDF](../fuentes/modelo-logico-ALIADO.pdf) y [reglas transversales](../01-arquitectura-y-stack.md).

Los IDs `F09-Txxx` conservan el identificador Txxx de origen, ahora con prefijo para evitar colisiones entre SPEC. No implican que el trabajo ya exista. Las tareas adicionales DB/BE/FE/QA desglosan integración y clientes, sin reemplazar requisitos. Las correcciones explícitas de 03 prevalecen sobre notas antiguas del plan fuente; no implementar tablas puntuales de notificaciones ni JWT por copiar una referencia.

## Historias cubiertas

- User Story 1 - Notificar la aceptación de una propuesta [UC057] (Priority: P1)
- User Story 2 - Notificar cambios de estado del servicio [UC058] (Priority: P1)

## Base de datos

- [ ] **F09-DB-01** Implementar o verificar V3: `notificaciones`. Aplicar columnas, PK/FK, nulabilidad y CHECK del manual; las tablas compartidas se crean una sola vez.
- [ ] **F09-DB-02** Agregar/verificar restricciones e índices de esta feature según 02-base-de-datos.md; probar integridad con PostgreSQL 16 y Flyway, incluyendo inserciones inválidas y concurrencia.
- [ ] **F09-DB-03** Implementar modelos de dominio independientes, puertos, entidades JPA, repositorios Spring Data, mappers y adaptadores; no serializar entidades JPA en API.

## Backend — integración y arquitectura

- [ ] **F09-BE-01** Concretar los contratos de F09 en OpenAPI: DTO request/response, validación, rol, propiedad, paginación, errores e idempotencia, conservando endpoints fuente salvo decisión explícita.
- [ ] **F09-BE-02** Definir las interfaces `application/usecase/*UseCase` y sus implementaciones `application/service/*Service implements *UseCase` según la tabla de esta feature. Inyectar solo interfaces por constructor en controladores/filtros/worker. Service usa dominio y puertos; ninguna dependencia hacia Spring/JPA/HTTP/adaptadores concretos. Llamadas entre módulos mediante interfaces públicas, nunca clases Service ni repositorios JPA ajenos.
- [ ] **F09-BE-03** Integrar los casos de uso de las tareas de origen con transacciones, autorización por recurso y tratamiento de fallos. Donde aplique, notificación persistida junto al negocio y entrega externa posterior al commit.
- [ ] **F09-BE-04** Dividir entrega: F09.base (puerto + tabla + registro + fake) tras F01 y antes de F06/F07/F08; F09.integracion conecta productores y worker tras F08. El puerto de preferencias evita dependencia circular con F14.

### Interfaces de entrada e implementaciones

Esta tabla concreta la separación del ejemplo del usuario: cada nombre base origina una interfaz `<Nombre>UseCase` en `application/usecase/` y una clase `<Nombre>Service implements <Nombre>UseCase` en `application/service/`, dentro del módulo indicado. Son nombres previstos de contratos, no endpoints nuevos ni prueba de implementación. Conservar responsabilidades y dependencias de las tareas de origen; sus nombres de servicio agrupado se descomponen conforme a esta tabla.

| Módulo | Interfaz de entrada | Implementación |
|---|---|---|
| `notificaciones` | `RegistrarNotificacionUseCase` | `RegistrarNotificacionService` |
| `notificaciones` | `ConsultarNotificacionesPropiasUseCase` | `ConsultarNotificacionesPropiasService` |
| `notificaciones` | `EntregarNotificacionesPendientesUseCase` | `EntregarNotificacionesPendientesService` |

Puertos de salida previstos: CanalEntregaNotificacion, ConsultaPreferenciasPort y puertos de entrega; worker invoca interfaz de entrada. Los repositorios siguen siendo contratos en `domain/repository/`; los puertos externos/consultas requeridos por aplicación van en `application/port/`, con adaptadores de infraestructura. No crear un puerto adicional cuando ya exista un contrato público equivalente.

Controllers reciben UseCase por constructor y convierten Request/Response mediante mapper de presentación. Commands/Queries/Results de aplicación no contienen objetos HTTP o JPA. Excepciones de negocio en `domain/exception/`; wiring/transacciones en infraestructura/configuración. Ver [árbol completo y reglas](../04-estructura-y-casos-de-uso.md).

### Tareas existentes del plan fuente

Conservar el orden por fases y las dependencias `Txxx` del documento de origen; una referencia `SPEC-n/Txxx` se interpreta como `Fn-Txxx`. Las rutas de origen son relativas a `backend/`. Si una tarea habla de crear una tabla ya incluida en V1–V6, se verifica/reutiliza esa tabla en lugar de crearla de nuevo. Si hace referencia a entidades de notificación puntuales, adaptar al módulo y tabla unificados.

- [ ] **F09-T001** Crear el paquete `notificaciones/` con sus subcarpetas en capas de Arquitectura Limpia (según Project Structure)
- [ ] **F09-T002** Migración Flyway: tabla `notificaciones` con restricción de unicidad `(tipo, servicio_id, destinatario_id, detalle)`
- [ ] **F09-T003** Definir interfaz `CanalEntregaNotificacion` (contrato de entrega, con una implementación mínima que registra el intento sin proveedor externo real) — puerto en `notificaciones/application/port` e implementación en `notificaciones/infrastructure/adapter`
- [ ] **F09-T004** `NotificacionService.notificar(destinatarioId, tipo, servicioId, detalle)`: crea una `Notificacion` solo si no existe ya una fila con la misma clave de unicidad (idempotencia ante reintentos), delega la entrega a `CanalEntregaNotificacion` sin bloquear la transacción de origen (depends on T003)
- [ ] **F09-T005** [P] [US1] Contract test `GET /notificaciones` filtrando tipo ACEPTACION_PROPUESTA (200) — `tests/contract/test_notificacion_aceptacion.java`
- [ ] **F09-T006** [P] [US1] Integration test: notificación disparada por aceptación real, falla de canal seguida de recuperación sin duplicado, intento de generar notificación de aceptación sin una aceptación real (debe ser imposible porque no existe endpoint de creación) — `tests/integration/test_notificar_aceptacion.java`
- [ ] **F09-T007** [P] [US1] Modelo `Notificacion` — `notificaciones/domain/model`
- [ ] **F09-T008** [US1] `NotificacionRepository` — `notificaciones/domain/repository`
- [ ] **F09-T009** [US1] Enganchar `NotificacionService.notificar()` dentro de `ServicioService.aceptarPropuesta()` (T008 de SPEC-08), notificando al Prestador cuya propuesta fue aceptada (FR-057) (depends on T004, T008, dependencia externa: `ServicioService.aceptarPropuesta()` de SPEC-08 — modificación mínima de ese método para invocar el punto de extensión, sin alterar su lógica transaccional ya probada)
- [ ] **F09-T010** [US1] Endpoint `GET /api/v1/notificaciones` (propias del actor autenticado) — `notificaciones/presentation/controller`
- [ ] **F09-T011** [P] [US2] Contract test `GET /notificaciones` filtrando tipo CAMBIO_ESTADO_SERVICIO (200) — `tests/contract/test_notificacion_cambio_estado.java`
- [ ] **F09-T012** [P] [US2] Integration test: notificación por transición del Prestador (en ejecución, terminado) hacia el Cliente, notificación por transición del Cliente (confirmar finalización) hacia el Prestador, notificación por cancelación (de cualquiera de las dos partes) hacia la contraparte, falla de canal seguida de recuperación sin duplicado — `tests/integration/test_notificar_cambio_estado.java`
- [ ] **F09-T013** [US2] Enganchar `NotificacionService.notificar()` dentro de `ServicioService.marcarEnEjecucion()`, `marcarTerminado()`, `confirmarFinalizacion()` y `cancelar()` (T018-T021 de SPEC-08), notificando en cada caso a la contraparte de quien ejecutó la transición (FR-058) (depends on T004, T008, dependencia externa: esos cuatro métodos de `ServicioService` de SPEC-08)

### Contratos API de origen

| Método | Endpoint | Request body | Respuesta éxito | Errores |
|---|---|---|---|---|
| GET | `/api/v1/notificaciones` | — | `200 [ { tipo, servicioId, detalle, estadoEntrega, fechaGeneracion }, ... ]` *(propias del actor autenticado)* | `401` sin sesión |

No se expone ningún endpoint de creación: por diseño (FR del SPEC exige que una notificación nunca se genere sin un evento real asociado), `Notificacion` solo se crea internamente desde `ServicioService` de SPEC-08, nunca a través de la API pública. Esto es lo que garantiza SC-004 a nivel de contrato, no solo de validación de negocio.


## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F09-FE-01** Bandeja propia y navegación al recurso correspondiente; permitir consultar eventos aunque push haya fallado.
- [ ] **F09-FE-02** Registrar/renovar y retirar token de dispositivo por sesión mediante contrato a definir en D-08.
- [ ] **F09-FE-03** Estados de permisos push denegados y canal no disponible sin impedir usar la app.
- [ ] **F09-FE-04** No añadir marcación leído/no leído persistida hasta definir contrato y migración: el modelo no tiene ese campo.

Aplicar [estados y contrato de cliente](../01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación

- [ ] **F09-QA-01** F09.base ofrece puerto/persistencia/fake para F06–F08 antes de integrar los productores; no depende de sus controladores.
- [ ] **F09-QA-02** Simular caída proveedor: negocio confirma, notificación queda pendiente y worker reintenta sin generar otro evento lógico.
- [ ] **F09-QA-03** Probar clave de unicidad tipo/aggregate_id/destinatario/event_version, preferencias F14 y múltiples workers.
- [ ] **F09-QA-04** Sin endpoint público para fabricar notificaciones; notificación solo por evento real.
- [ ] **F09-QA-05** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Requisitos y criterios de éxito de origen

Los identificadores FR/SC son locales al SPEC: deben referenciarse como SPEC-09/FR-xxx y SPEC-09/SC-xxx.

- **FR-057**: El sistema DEBE notificar automáticamente al Prestador cuya propuesta fue aceptada, disparado exclusivamente por la aceptación de esa propuesta, sin que ningún actor lo ejecute como acción independiente. _(UC057, extiende a UC046)_
- **FR-058**: El sistema DEBE notificar automáticamente a la contraparte del servicio (Cliente o Prestador) cuando este cambie de estado por marcar en ejecución, marcar como terminado, confirmar finalización o cancelar, disparado exclusivamente por esas transiciones. _(UC058, extiende a UC051, UC052, UC053 y UC054)_
- **SC-001**: El 100% de las aceptaciones de propuesta genera una notificación hacia el Prestador correspondiente.
- **SC-002**: El 100% de las transiciones de estado del servicio (en ejecución, terminado, finalización confirmada, cancelado) genera una notificación hacia la contraparte de quien la ejecutó.
- **SC-003**: Ante una falla del canal de entrega, el 100% de los eventos de aceptación o cambio de estado permanece consultable en su origen sin generar avisos duplicados al recuperarse.
- **SC-004**: El 100% de los intentos de generar una notificación sin un evento real asociado es rechazado.
