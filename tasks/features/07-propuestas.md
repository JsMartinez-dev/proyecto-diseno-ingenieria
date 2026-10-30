# F07 — Creación, edición y retiro de propuestas

**Alcance:** MVP. **Estado:** planificado, sin implementación.
**Dependencias:** 01 04 05 06 09.base. **Decisiones relacionadas:** D-03 D-08 D-09 (ver [registro](../03-decisiones-y-dependencias.md)).

## Resultado esperado

Propuesta para solicitud abierta compatible, disponibilidad obligatoria, mensaje opcional y aviso al Cliente.

## Fuentes y trazabilidad

- [SPEC original](../fuentes/specs/spec-07-creacion-gestion-propuestas.md): historias, escenarios, requisitos y criterios de éxito.
- [Plan de origen](../fuentes/planes/plan-spec-07-creacion-gestion-propuestas.md): fases, tareas y dependencias detalladas.
- [Manual de datos](../fuentes/manual-base-de-datos-aliado.md), [modelo PDF](../fuentes/modelo-logico-ALIADO.pdf) y [reglas transversales](../01-arquitectura-y-stack.md).

Los IDs `F07-Txxx` conservan el identificador Txxx de origen, ahora con prefijo para evitar colisiones entre SPEC. No implican que el trabajo ya exista. Las tareas adicionales DB/BE/FE/QA desglosan integración y clientes, sin reemplazar requisitos. Las correcciones explícitas de 03 prevalecen sobre notas antiguas del plan fuente; no implementar tablas puntuales de notificaciones ni JWT por copiar una referencia.

## Historias cubiertas

- User Story 1 - Crear una propuesta para una solicitud [UC039, UC040, UC041, UC044] (Priority: P1)
- User Story 2 - Editar una propuesta activa [UC042] (Priority: P1)
- User Story 3 - Retirar una propuesta [UC043] (Priority: P1)

## Base de datos

- [ ] **F07-DB-01** Implementar o verificar V3 compartida: `propuestas`, `notificaciones`. Aplicar columnas, PK/FK, nulabilidad y CHECK del manual; las tablas compartidas se crean una sola vez.
- [ ] **F07-DB-02** Agregar/verificar restricciones e índices de esta feature según 02-base-de-datos.md; probar integridad con PostgreSQL 16 y Flyway, incluyendo inserciones inválidas y concurrencia.
- [ ] **F07-DB-03** Implementar modelos de dominio independientes, puertos, entidades JPA, repositorios Spring Data, mappers y adaptadores; no serializar entidades JPA en API.

## Backend — integración y arquitectura

- [ ] **F07-BE-01** Concretar los contratos de F07 en OpenAPI: DTO request/response, validación, rol, propiedad, paginación, errores e idempotencia, conservando endpoints fuente salvo decisión explícita.
- [ ] **F07-BE-02** Definir las interfaces `application/usecase/*UseCase` y sus implementaciones `application/service/*Service implements *UseCase` según la tabla de esta feature. Inyectar solo interfaces por constructor en controladores/filtros/worker. Service usa dominio y puertos; ninguna dependencia hacia Spring/JPA/HTTP/adaptadores concretos. Llamadas entre módulos mediante interfaces públicas, nunca clases Service ni repositorios JPA ajenos.
- [ ] **F07-BE-03** Integrar los casos de uso de las tareas de origen con transacciones, autorización por recurso y tratamiento de fallos. Donde aplique, notificación persistida junto al negocio y entrega externa posterior al commit.

### Interfaces de entrada e implementaciones

Esta tabla concreta la separación del ejemplo del usuario: cada nombre base origina una interfaz `<Nombre>UseCase` en `application/usecase/` y una clase `<Nombre>Service implements <Nombre>UseCase` en `application/service/`, dentro del módulo indicado. Son nombres previstos de contratos, no endpoints nuevos ni prueba de implementación. Conservar responsabilidades y dependencias de las tareas de origen; sus nombres de servicio agrupado se descomponen conforme a esta tabla.

| Módulo | Interfaz de entrada | Implementación |
|---|---|---|
| `propuestas` | `CrearPropuestaUseCase` | `CrearPropuestaService` |
| `propuestas` | `EditarPropuestaUseCase` | `EditarPropuestaService` |
| `propuestas` | `RetirarPropuestaUseCase` | `RetirarPropuestaService` |

Puertos de salida previstos: ConsultaCompatibilidadPort, ConsultaSolicitudPort y RegistroNotificacionPort. Los repositorios siguen siendo contratos en `domain/repository/`; los puertos externos/consultas requeridos por aplicación van en `application/port/`, con adaptadores de infraestructura. No crear un puerto adicional cuando ya exista un contrato público equivalente.

Controllers reciben UseCase por constructor y convierten Request/Response mediante mapper de presentación. Commands/Queries/Results de aplicación no contienen objetos HTTP o JPA. Excepciones de negocio en `domain/exception/`; wiring/transacciones en infraestructura/configuración. Ver [árbol completo y reglas](../04-estructura-y-casos-de-uso.md).

### Tareas existentes del plan fuente

Conservar el orden por fases y las dependencias `Txxx` del documento de origen; una referencia `SPEC-n/Txxx` se interpreta como `Fn-Txxx`. Las rutas de origen son relativas a `backend/`. Si una tarea habla de crear una tabla ya incluida en V1–V6, se verifica/reutiliza esa tabla en lugar de crearla de nuevo. Si hace referencia a entidades de notificación puntuales, adaptar al módulo y tabla unificados.

- [ ] **F07-T001** Crear el paquete `propuestas/` con sus subcarpetas en capas de Arquitectura Limpia (según Project Structure)
- [ ] **F07-T002** Migración Flyway: tablas `propuestas`, `notificaciones_propuesta_recibida`
- [ ] **F07-T003** [P] [US1] Contract test `POST /propuestas` (201, 400, 404, 409) — `tests/contract/test_propuestas_crear.java`
- [ ] **F07-T004** [P] [US1] Integration test: creación completa con/sin mensaje, sin disponibilidad (rechazo), solicitud no abierta (rechazo), notificación generada al Cliente, actor no autorizado — `tests/integration/test_crear_propuesta.java`
- [ ] **F07-T005** [P] [US1] Modelos `Propuesta`, `NotificacionPropuestaRecibida` — `propuestas/domain/model`
- [ ] **F07-T006** [US1] `PropuestaRepository`, `NotificacionPropuestaRecibidaRepository` — `propuestas/domain/repository`
- [ ] **F07-T007** [US1] `PropuestaService.crear()`: valida disponibilidad obligatoria (FR-040), valida que la solicitud esté abierta y compatible reutilizando `CompatibilidadService.obtenerDetalle()` de SPEC-06 (FR-039), asocia mensaje opcional (FR-041), crea `Propuesta` en estado ACTIVA y la `NotificacionPropuestaRecibida` asociada en una sola transacción (FR-044, RNF-006) (depends on T005, T006, dependencia externa: `CompatibilidadService` de SPEC-06)
- [ ] **F07-T008** [US1] Endpoint `POST /api/v1/propuestas` restringido a rol PRESTADOR — `propuestas/presentation/controller`
- [ ] **F07-T009** [P] [US2] Contract test `PUT /propuestas/{id}` (200, 403, 404, 409) — `tests/contract/test_propuestas_editar.java`
- [ ] **F07-T010** [P] [US2] Integration test: edición exitosa, edición de propuesta no activa (rechazo), propuesta ajena (rechazo), actor no autorizado, pérdida de conexión durante edición (edge case) — `tests/integration/test_editar_propuesta.java`
- [ ] **F07-T011** [US2] `PropuestaService.editar()`: valida propiedad y estado ACTIVA, rechaza en caso contrario (FR-042) (depends on T006)
- [ ] **F07-T012** [US2] Endpoint `PUT /api/v1/propuestas/{id}` — `propuestas/presentation/controller`
- [ ] **F07-T013** [P] [US3] Contract test `POST /propuestas/{id}/retirar` (200, 403, 404, 409) — `tests/contract/test_propuestas_retirar.java`
- [ ] **F07-T014** [P] [US3] Integration test: retiro exitoso, retiro de propuesta ya inactiva (rechazo), propuesta ajena (rechazo), actor no autorizado — `tests/integration/test_retirar_propuesta.java`
- [ ] **F07-T015** [US3] `PropuestaService.retirar()`: valida propiedad y estado ACTIVA, transiciona a RETIRADA, rechaza en caso contrario (FR-043); asegura que ninguna notificación de "propuesta nueva" se genere sobre una propuesta ya retirada (edge case del SPEC) (depends on T006)
- [ ] **F07-T016** [US3] Endpoint `POST /api/v1/propuestas/{id}/retirar` — `propuestas/presentation/controller`

### Contratos API de origen

| Método | Endpoint | Request body | Respuesta éxito | Errores |
|---|---|---|---|---|
| POST | `/api/v1/propuestas` | `{ solicitudId, disponibilidad, mensaje? }` | `201 { id, estado: "ACTIVA" }` | `400` falta disponibilidad; `404` solicitud inexistente; `409` solicitud no abierta o no compatible |
| PUT | `/api/v1/propuestas/{id}` | `{ disponibilidad?, mensaje? }` | `200 { id, estado }` | `403/404` no pertenece o no existe; `409` propuesta ya no activa |
| POST | `/api/v1/propuestas/{id}/retirar` | — | `200 { estado: "RETIRADA" }` | `403/404` no pertenece o no existe; `409` propuesta ya no activa |

Todos los endpoints restringidos a rol PRESTADOR mediante el filtro de autorización por rol de SPEC-01 (T018). No se expone un endpoint de listado de "mis propuestas": el SPEC no lo exige (el Prestador llega al `id` de su propuesta desde la respuesta de creación o desde el tablero de SPEC-06); se deja anotado por si una fase posterior lo requiere.


## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F07-FE-01** Formulario desde oportunidad con disponibilidad obligatoria, mensaje opcional y estados de envío.
- [ ] **F07-FE-02** Conservar id retornado para editar/retirar; guardar contexto mínimo de navegación sin inventar endpoint de mis propuestas.
- [ ] **F07-FE-03** Acciones editar/retirar solo mientras ACTIVA; confirmar retiro y refrescar ante 409.
- [ ] **F07-FE-04** Cliente recibe propuesta real en el detalle de solicitud mediante F08 y notificaciones.

Aplicar [estados y contrato de cliente](../01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación

- [ ] **F07-QA-01** Rechazar solicitud cerrada/no compatible y disponibilidad vacía sin crear filas.
- [ ] **F07-QA-02** Mutación concurrente y reintento no duplican propuesta ni aviso; política de duplicidad requiere D-09.
- [ ] **F07-QA-03** No añadir precio/moneda al contrato solo porque exista en la demo: el modelo entregado no los incluye.
- [ ] **F07-QA-04** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Requisitos y criterios de éxito de origen

Los identificadores FR/SC son locales al SPEC: deben referenciarse como SPEC-07/FR-xxx y SPEC-07/SC-xxx.

- **FR-039**: El sistema DEBE permitir que un Prestador cree una propuesta vinculada a una solicitud abierta y compatible con su perfil, únicamente si incluye su disponibilidad, y DEBE rechazar la creación si la solicitud ya no está abierta. _(UC039, incluye a UC040)_
- **FR-040**: El sistema DEBE exigir la disponibilidad del Prestador como dato obligatorio de toda propuesta creada. _(UC040, incluido en UC039)_
- **FR-041**: El sistema DEBE permitir, de forma opcional, agregar un mensaje a la propuesta al momento de crearla, sin que su ausencia impida crearla. _(UC041, extiende a UC039)_
- **FR-044**: El sistema DEBE notificar automáticamente al Cliente propietario de la solicitud cuando se cree una nueva propuesta para ella, sin que ningún actor deba solicitar esa notificación por separado. _(UC044, extiende a UC039)_
- **FR-042**: El sistema DEBE permitir que un Prestador edite una propuesta propia mientras esté activa, y DEBE rechazar la edición si la propuesta ya no está activa o no le pertenece. _(UC042)_
- **FR-043**: El sistema DEBE permitir que un Prestador retire una propuesta propia mientras esté activa, y DEBE rechazar el retiro si la propuesta ya no está activa o no le pertenece. _(UC043)_
- **SC-001**: El 100% de las propuestas creadas incluye disponibilidad del Prestador; ninguna se crea sin este dato.
- **SC-002**: El 100% de las propuestas creadas para una solicitud que ya no está abierta es rechazada.
- **SC-003**: El 100% de las propuestas nuevas genera una notificación hacia el Cliente correspondiente.
- **SC-004**: El 100% de los intentos de editar o retirar una propuesta ajena o ya inactiva es rechazado sin modificar ningún registro.
