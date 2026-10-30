# F08 — Contratación, ciclo del servicio y comunicación

**Alcance:** MVP. **Estado:** planificado, sin implementación.
**Dependencias:** 01 04 07 09.base. **Decisiones relacionadas:** D-03 D-10 (ver [registro](../03-decisiones-y-dependencias.md)).

## Resultado esperado

Comparar/aceptar propuestas, ejecutar/finalizar/cancelar, historial y canal autorizado entre las partes.

## Fuentes y trazabilidad

- [SPEC original](../fuentes/specs/spec-08-contratacion-ciclo-servicio.md): historias, escenarios, requisitos y criterios de éxito.
- [Plan de origen](../fuentes/planes/plan-spec-08-contratacion-ciclo-servicio.md): fases, tareas y dependencias detalladas.
- [Manual de datos](../fuentes/manual-base-de-datos-aliado.md), [modelo PDF](../fuentes/modelo-logico-ALIADO.pdf) y [reglas transversales](../01-arquitectura-y-stack.md).

Los IDs `F08-Txxx` conservan el identificador Txxx de origen, ahora con prefijo para evitar colisiones entre SPEC. No implican que el trabajo ya exista. Las tareas adicionales DB/BE/FE/QA desglosan integración y clientes, sin reemplazar requisitos. Las correcciones explícitas de 03 prevalecen sobre notas antiguas del plan fuente; no implementar tablas puntuales de notificaciones ni JWT por copiar una referencia.

## Historias cubiertas

- User Story 1 - Consultar y aceptar propuestas recibidas [UC045, UC046, UC047, UC048, UC049] (Priority: P1)
- User Story 2 - Consultar el detalle del servicio contratado [UC050] (Priority: P1)
- User Story 3 - Gestionar el ciclo de vida del servicio contratado [UC051, UC052, UC053, UC054] (Priority: P1)
- User Story 4 - Consultar el historial de estados del servicio [UC055] (Priority: P1)
- User Story 5 - Usar el canal de comunicación autorizado [UC056] (Priority: P1)

## Base de datos

- [ ] **F08-DB-01** Implementar o verificar V3: `servicios_contratados`, `historial_estado_servicio`, `mensajes_servicio`. Aplicar columnas, PK/FK, nulabilidad y CHECK del manual; las tablas compartidas se crean una sola vez.
- [ ] **F08-DB-02** Agregar/verificar restricciones e índices de esta feature según 02-base-de-datos.md; probar integridad con PostgreSQL 16 y Flyway, incluyendo inserciones inválidas y concurrencia.
- [ ] **F08-DB-03** Implementar modelos de dominio independientes, puertos, entidades JPA, repositorios Spring Data, mappers y adaptadores; no serializar entidades JPA en API.

## Backend — integración y arquitectura

- [ ] **F08-BE-01** Concretar los contratos de F08 en OpenAPI: DTO request/response, validación, rol, propiedad, paginación, errores e idempotencia, conservando endpoints fuente salvo decisión explícita.
- [ ] **F08-BE-02** Definir las interfaces `application/usecase/*UseCase` y sus implementaciones `application/service/*Service implements *UseCase` según la tabla de esta feature. Inyectar solo interfaces por constructor en controladores/filtros/worker. Service usa dominio y puertos; ninguna dependencia hacia Spring/JPA/HTTP/adaptadores concretos. Llamadas entre módulos mediante interfaces públicas, nunca clases Service ni repositorios JPA ajenos.
- [ ] **F08-BE-03** Integrar los casos de uso de las tareas de origen con transacciones, autorización por recurso y tratamiento de fallos. Donde aplique, notificación persistida junto al negocio y entrega externa posterior al commit.

### Interfaces de entrada e implementaciones

Esta tabla concreta la separación del ejemplo del usuario: cada nombre base origina una interfaz `<Nombre>UseCase` en `application/usecase/` y una clase `<Nombre>Service implements <Nombre>UseCase` en `application/service/`, dentro del módulo indicado. Son nombres previstos de contratos, no endpoints nuevos ni prueba de implementación. Conservar responsabilidades y dependencias de las tareas de origen; sus nombres de servicio agrupado se descomponen conforme a esta tabla.

| Módulo | Interfaz de entrada | Implementación |
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

Puertos de salida previstos: ConsultaGestionPropuestasPort, ConsultaGestionSolicitudPort y RegistroNotificacionPort; adaptadores/composición preservan una transacción de aceptación. Los repositorios siguen siendo contratos en `domain/repository/`; los puertos externos/consultas requeridos por aplicación van en `application/port/`, con adaptadores de infraestructura. No crear un puerto adicional cuando ya exista un contrato público equivalente.

Controllers reciben UseCase por constructor y convierten Request/Response mediante mapper de presentación. Commands/Queries/Results de aplicación no contienen objetos HTTP o JPA. Excepciones de negocio en `domain/exception/`; wiring/transacciones en infraestructura/configuración. Ver [árbol completo y reglas](../04-estructura-y-casos-de-uso.md).

### Tareas existentes del plan fuente

Conservar el orden por fases y las dependencias `Txxx` del documento de origen; una referencia `SPEC-n/Txxx` se interpreta como `Fn-Txxx`. Las rutas de origen son relativas a `backend/`. Si una tarea habla de crear una tabla ya incluida en V1–V6, se verifica/reutiliza esa tabla en lugar de crearla de nuevo. Si hace referencia a entidades de notificación puntuales, adaptar al módulo y tabla unificados.

- [ ] **F08-T001** Crear el paquete `servicios/` con sus subcarpetas en capas de Arquitectura Limpia (según Project Structure)
- [ ] **F08-T002** Migración Flyway: tablas `servicios_contratados` (con columna `version` para bloqueo optimista), `historial_estado_servicio`, `mensajes_servicio`
- [ ] **F08-T003** [P] [US1] Contract test `GET /solicitudes/{id}/propuestas`, `POST /propuestas/{id}/aceptar` (200, 403, 404, 409) — `tests/contract/test_aceptacion_propuesta.java`
- [ ] **F08-T004** [P] [US1] Integration test: consulta de propuestas activas, aceptación exitosa (servicio + cierre de demás + comunicación habilitada en una sola operación), segunda aceptación sobre la misma solicitud (rechazo), actor no autorizado o solicitud ajena — `tests/integration/test_aceptar_propuesta.java`
- [ ] **F08-T005** [P] [US1] Modelo `ServicioContratado` — `servicios/domain/model`
- [ ] **F08-T006** [US1] `ServicioContratadoRepository` — `servicios/domain/repository`
- [ ] **F08-T007** [US1] `ServicioService.listarPropuestasRecibidas(solicitudId)`: reutiliza `PropuestaRepository` de SPEC-07 filtrando por solicitud propia y estado ACTIVA (FR-045) (depends on dependencia externa: `PropuestaRepository` de SPEC-07)
- [ ] **F08-T008** [US1] `ServicioService.aceptarPropuesta(propuestaId)`: valida que la solicitud no tenga ya un servicio contratado (FR-046), transaccionalmente crea `ServicioContratado` en estado CONTRATADO (FR-048), marca la propuesta aceptada como ACEPTADA y cierra el resto de propuestas activas de la misma solicitud como CERRADA (FR-047, reutiliza `PropuestaRepository` de SPEC-07), habilita `comunicacionHabilitada = true` (FR-049), registra la entrada inicial en `HistorialEstadoServicio` (depends on T005, T006, dependencia externa: `PropuestaRepository` de SPEC-07)
- [ ] **F08-T009** [US1] Endpoints `GET /api/v1/solicitudes/{id}/propuestas`, `POST /api/v1/propuestas/{id}/aceptar` — `servicios/presentation/controller`
- [ ] **F08-T010** [P] [US2] Contract test `GET /servicios/{id}` (200, 403, 404) — `tests/contract/test_servicio_detalle.java`
- [ ] **F08-T011** [P] [US2] Integration test: consulta por Cliente y por Prestador del mismo servicio (misma información), consulta por actor ajeno (rechazo) — `tests/integration/test_detalle_servicio.java`
- [ ] **F08-T012** [US2] `ServicioService.obtenerDetalle(servicioId, actorId)`: valida que el actor sea el Cliente o el Prestador del servicio, construye la respuesta con solicitud de origen, propuesta aceptada y estado actual (FR-050) (depends on T006)
- [ ] **F08-T013** [US2] Endpoint `GET /api/v1/servicios/{id}` — `servicios/presentation/controller`
- [ ] **F08-T014** [P] [US3] Contract test `POST /servicios/{id}/en-ejecucion`, `/terminado`, `/confirmar-finalizacion`, `/cancelar` (200, 403, 404, 409) — `tests/contract/test_ciclo_vida_servicio.java`
- [ ] **F08-T015** [P] [US3] Integration test: marcar en ejecución, marcar terminado, confirmar finalización, cancelar antes de finalizar, cancelar ya finalizado (rechazo), transiciones simultáneas (una válida, una rechazada, historial consistente), actor no autorizado o rol incorrecto para la transición — `tests/integration/test_ciclo_vida_servicio.java`
- [ ] **F08-T016** [P] [US3] Modelo `HistorialEstadoServicio` — `servicios/domain/model` (depends on T005)
- [ ] **F08-T017** [US3] `HistorialEstadoServicioRepository` — `servicios/domain/repository`
- [ ] **F08-T018** [US3] `ServicioService.marcarEnEjecucion()`: valida que el actor sea el Prestador del servicio y que el estado actual lo permita, detecta conflicto de concurrencia mediante el puerto de persistencia (el adaptador JPA usa `@Version`) (FR-051) (depends on T006, T017)
- [ ] **F08-T019** [US3] `ServicioService.marcarTerminado()`: mismas validaciones que T018, deja el servicio pendiente de confirmación del Cliente (FR-052) 
- [ ] **F08-T020** [US3] `ServicioService.confirmarFinalizacion()`: valida que el actor sea el Cliente del servicio y que esté en estado TERMINADO, cierra definitivamente como FINALIZADO (FR-053) (depends on T018)
- [ ] **F08-T021** [US3] `ServicioService.cancelar()`: valida que el actor sea Cliente o Prestador del servicio y que no esté ya FINALIZADO, transiciona a CANCELADO y rechaza en caso contrario (FR-054) (depends on T018)
- [ ] **F08-T022** [US3] Cada transición registra su entrada en `HistorialEstadoServicio` con el actor que la ejecutó, dentro de la misma transacción de la transición (depends on T017, T018-T021)
- [ ] **F08-T023** [US3] Endpoints `POST /api/v1/servicios/{id}/en-ejecucion`, `/terminado`, `/confirmar-finalizacion`, `/cancelar` — `servicios/presentation/controller`
- [ ] **F08-T024** [P] [US4] Contract test `GET /servicios/{id}/historial` (200, 403, 404) — `tests/contract/test_historial_servicio.java`
- [ ] **F08-T025** [P] [US4] Integration test: historial disponible en orden, actor ajeno (rechazo) — `tests/integration/test_historial_servicio.java`
- [ ] **F08-T026** [US4] `ServicioService.obtenerHistorial(servicioId, actorId)`: valida que el actor sea Cliente o Prestador del servicio, devuelve las transiciones ordenadas cronológicamente (FR-055) (depends on T017)
- [ ] **F08-T027** [US4] Endpoint `GET /api/v1/servicios/{id}/historial` — `servicios/presentation/controller`
- [ ] **F08-T028** [P] [US5] Contract test `POST /servicios/{id}/mensajes`, `GET /servicios/{id}/mensajes` (201, 200, 403, 404, 409) — `tests/contract/test_mensajes_servicio.java`
- [ ] **F08-T029** [P] [US5] Integration test: envío tras habilitación, intento antes de habilitación (rechazo), actor ajeno al servicio (rechazo), ningún dato de contacto personal expuesto en la respuesta — `tests/integration/test_mensajes_servicio.java`
- [ ] **F08-T030** [P] [US5] Modelo `MensajeServicio` — `servicios/domain/model` (depends on T005)
- [ ] **F08-T031** [US5] `MensajeServicioRepository` — `servicios/domain/repository`
- [ ] **F08-T032** [US5] `MensajeServicioService.enviar()`: valida que el actor sea Cliente o Prestador del servicio y que `comunicacionHabilitada = true`, rechaza en caso contrario (FR-056) (depends on T006, T031)
- [ ] **F08-T033** [US5] `MensajeServicioService.listar()`: misma validación de propiedad y habilitación (depends on T032)
- [ ] **F08-T034** [US5] Endpoints `POST /api/v1/servicios/{id}/mensajes`, `GET /api/v1/servicios/{id}/mensajes` — `servicios/presentation/controller`

### Contratos API de origen

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


## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F08-FE-01** Cliente lista propuestas activas propias, compara disponibilidad/mensaje y confirma aceptación.
- [ ] **F08-FE-02** Detalle compartido con acciones según rol y estado, confirmación de finalización para Cliente y cancelación válida.
- [ ] **F08-FE-03** Historial ordenado de estados; manejar 409 refrescando servicio antes de ofrecer nueva acción.
- [ ] **F08-FE-04** Canal de mensajes REST autorizado tras contratación, con errores y reintento; realtime permanece en F15.
- [ ] **F08-FE-05** No mostrar contacto personal: mantener comunicación mediada de SPEC-08, aunque la demo tenga un recorrido distinto.

Aplicar [estados y contrato de cliente](../01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación

- [ ] **F08-QA-01** Aceptar dos propuestas simultáneamente: solo un servicio, una aceptada, cierre del resto e historial/notificación atómicos.
- [ ] **F08-QA-02** CONTRATADO → EN_EJECUCION → TERMINADO → FINALIZADO; cancelación solo antes de finalizado conforme SPEC-08.
- [ ] **F08-QA-03** Aislar mensajes de terceros y probar canal antes de habilitación; política tras cierre se decide en D-10.
- [ ] **F08-QA-04** Completar integración de eliminación de cuenta F02 con servicios activos.
- [ ] **F08-QA-05** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Requisitos y criterios de éxito de origen

Los identificadores FR/SC son locales al SPEC: deben referenciarse como SPEC-08/FR-xxx y SPEC-08/SC-xxx.

- **FR-045**: El sistema DEBE permitir que un Cliente consulte todas las propuestas activas recibidas para una solicitud propia. _(UC045)_
- **FR-046**: El sistema DEBE permitir que un Cliente acepte una propuesta activa de su solicitud, y DEBE rechazar una segunda aceptación si la solicitud ya tiene un servicio contratado. _(UC046, incluye a UC047, UC048 y UC049)_
- **FR-047**: El sistema DEBE cerrar automáticamente, como parte de la aceptación, todas las demás propuestas activas de la misma solicitud. _(UC047, incluido en UC046)_
- **FR-048**: El sistema DEBE registrar, como parte de la aceptación, un servicio contratado vinculado a la solicitud, la propuesta aceptada, el Cliente y el Prestador. _(UC048, incluido en UC046)_
- **FR-049**: El sistema DEBE habilitar, como parte de la aceptación, los datos de comunicación necesarios entre el Cliente y el Prestador de ese servicio. _(UC049, incluido en UC046)_
- **FR-050**: El sistema DEBE permitir que el Cliente o el Prestador de un servicio contratado consulten su detalle completo, y DEBE denegar el acceso a cualquier otro actor. _(UC050)_
- **FR-051**: El sistema DEBE permitir que el Prestador de un servicio contratado lo marque como en ejecución. _(UC051)_
- **FR-052**: El sistema DEBE permitir que el Prestador de un servicio en ejecución lo marque como terminado. _(UC052)_
- **FR-053**: El sistema DEBE permitir que el Cliente de un servicio marcado como terminado confirme su finalización, cerrándolo de forma definitiva. _(UC053)_
- **FR-054**: El sistema DEBE permitir que el Cliente o el Prestador de un servicio contratado lo cancelen mientras no haya sido confirmado como finalizado, y DEBE rechazar la cancelación si ya fue finalizado. _(UC054)_
- **FR-055**: El sistema DEBE permitir que el Cliente o el Prestador de un servicio consulten su historial completo de transiciones de estado, en orden. _(UC055)_
- **FR-056**: El sistema DEBE permitir el uso del canal de comunicación autorizado únicamente después de que los datos de comunicación del servicio hayan sido habilitados, sin exponer datos de contacto personales de ninguna de las partes. _(UC056, extiende a UC049)_
- **SC-001**: El 100% de las aceptaciones de propuesta produce, en una sola operación, el cierre de las demás propuestas, el registro del servicio y la habilitación de comunicación.
- **SC-002**: El 100% de los intentos de aceptar una segunda propuesta para una solicitud ya contratada es rechazado.
- **SC-003**: El 100% de las transiciones de estado del servicio queda registrada en un historial ordenado, incluso ante intentos simultáneos.
- **SC-004**: El 100% de los intentos de cancelar un servicio ya finalizado es rechazado sin cambiar su estado.
- **SC-005**: El 100% de los usos del canal de comunicación autorizado ocurre solo después de que los datos de comunicación fueron habilitados, y ninguno expone datos de contacto personales.
