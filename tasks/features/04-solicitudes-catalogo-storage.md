# F04 — Solicitudes, catálogos y archivos

**Alcance:** MVP. **Estado:** planificado, sin implementación.
**Dependencias:** 01 00. **Decisiones relacionadas:** D-02 D-03 D-06 D-07 (ver [registro](../03-decisiones-y-dependencias.md)).

## Resultado esperado

Crear/publicar/borrador, editar/cancelar y consultar solicitudes propias; catálogo y storage compartidos.

## Fuentes y trazabilidad

- [SPEC original](../fuentes/specs/spec-04-gestion-solicitudes-servicio.md): historias, escenarios, requisitos y criterios de éxito.
- [Plan de origen](../fuentes/planes/plan-spec-04-gestion-solicitudes-servicio.md): fases, tareas y dependencias detalladas.
- [Manual de datos](../fuentes/manual-base-de-datos-aliado.md), [modelo PDF](../fuentes/modelo-logico-ALIADO.pdf) y [reglas transversales](../01-arquitectura-y-stack.md).

Los IDs `F04-Txxx` conservan el identificador Txxx de origen, ahora con prefijo para evitar colisiones entre SPEC. No implican que el trabajo ya exista. Las tareas adicionales DB/BE/FE/QA desglosan integración y clientes, sin reemplazar requisitos. Las correcciones explícitas de 03 prevalecen sobre notas antiguas del plan fuente; no implementar tablas puntuales de notificaciones ni JWT por copiar una referencia.

## Historias cubiertas

- User Story 1 - Publicar una solicitud de servicio [UC016, UC017, UC018, UC019] (Priority: P1)
- User Story 2 - Gestionar una solicitud abierta [UC020, UC021] (Priority: P1)
- User Story 3 - Consultar mis solicitudes [UC022, UC023] (Priority: P1)

## Base de datos

- [ ] **F04-DB-01** Implementar o verificar V2: `categorias_servicio`, `zonas`, `solicitudes`, `fotos_solicitud`, `historial_estado_solicitud`. Aplicar columnas, PK/FK, nulabilidad y CHECK del manual; las tablas compartidas se crean una sola vez.
- [ ] **F04-DB-02** Agregar/verificar restricciones e índices de esta feature según 02-base-de-datos.md; probar integridad con PostgreSQL 16 y Flyway, incluyendo inserciones inválidas y concurrencia.
- [ ] **F04-DB-03** Implementar modelos de dominio independientes, puertos, entidades JPA, repositorios Spring Data, mappers y adaptadores; no serializar entidades JPA en API.

## Backend — integración y arquitectura

- [ ] **F04-BE-01** Concretar los contratos de F04 en OpenAPI: DTO request/response, validación, rol, propiedad, paginación, errores e idempotencia, conservando endpoints fuente salvo decisión explícita.
- [ ] **F04-BE-02** Definir las interfaces `application/usecase/*UseCase` y sus implementaciones `application/service/*Service implements *UseCase` según la tabla de esta feature. Inyectar solo interfaces por constructor en controladores/filtros/worker. Service usa dominio y puertos; ninguna dependencia hacia Spring/JPA/HTTP/adaptadores concretos. Llamadas entre módulos mediante interfaces públicas, nunca clases Service ni repositorios JPA ajenos.
- [ ] **F04-BE-03** Integrar los casos de uso de las tareas de origen con transacciones, autorización por recurso y tratamiento de fallos. Donde aplique, notificación persistida junto al negocio y entrega externa posterior al commit.

### Interfaces de entrada e implementaciones

Esta tabla concreta la separación del ejemplo del usuario: cada nombre base origina una interfaz `<Nombre>UseCase` en `application/usecase/` y una clase `<Nombre>Service implements <Nombre>UseCase` en `application/service/`, dentro del módulo indicado. Son nombres previstos de contratos, no endpoints nuevos ni prueba de implementación. Conservar responsabilidades y dependencias de las tareas de origen; sus nombres de servicio agrupado se descomponen conforme a esta tabla.

| Módulo | Interfaz de entrada | Implementación |
|---|---|---|
| `catalogo` | `ConsultarCategoriasUseCase` | `ConsultarCategoriasService` |
| `catalogo` | `ConsultarZonasUseCase` | `ConsultarZonasService` |
| `solicitudes` | `CrearSolicitudUseCase` | `CrearSolicitudService` |
| `solicitudes` | `EditarSolicitudUseCase` | `EditarSolicitudService` |
| `solicitudes` | `CancelarSolicitudUseCase` | `CancelarSolicitudService` |
| `solicitudes` | `ListarSolicitudesPropiasUseCase` | `ListarSolicitudesPropiasService` |
| `solicitudes` | `ConsultarSolicitudPropiaUseCase` | `ConsultarSolicitudPropiaService` |

Puertos de salida previstos: ArchivoStorageService y consultas de catálogo; notificaciones por interfaz del módulo propietario. Los repositorios siguen siendo contratos en `domain/repository/`; los puertos externos/consultas requeridos por aplicación van en `application/port/`, con adaptadores de infraestructura. No crear un puerto adicional cuando ya exista un contrato público equivalente.

Controllers reciben UseCase por constructor y convierten Request/Response mediante mapper de presentación. Commands/Queries/Results de aplicación no contienen objetos HTTP o JPA. Excepciones de negocio en `domain/exception/`; wiring/transacciones en infraestructura/configuración. Ver [árbol completo y reglas](../04-estructura-y-casos-de-uso.md).

### Tareas existentes del plan fuente

Conservar el orden por fases y las dependencias `Txxx` del documento de origen; una referencia `SPEC-n/Txxx` se interpreta como `Fn-Txxx`. Las rutas de origen son relativas a `backend/`. Si una tarea habla de crear una tabla ya incluida en V1–V6, se verifica/reutiliza esa tabla en lugar de crearla de nuevo. Si hace referencia a entidades de notificación puntuales, adaptar al módulo y tabla unificados.

- [ ] **F04-T001** Crear el paquete `catalogo/` (`domain/model`, `domain/repository` y adaptadores de persistencia) y el paquete `solicitudes/` con sus subcarpetas en capas de Arquitectura Limpia (según Project Structure)
- [ ] **F04-T002** Migración Flyway: tablas `categorias_servicio`, `zonas`, `solicitudes`, `fotos_solicitud`, `historial_estado_solicitud`
- [ ] **F04-T003** Modelos `CategoriaServicio` y `Zona` (catálogo compartido) - `catalogo/domain/model`
- [ ] **F04-T004** `CategoriaServicioRepository`, `ZonaRepository` - `catalogo/domain/repository`
- [ ] **F04-T005** Seed inicial de categorías y zonas vía migración Flyway.
- [ ] **F04-T006** Definir interfaz `ArchivoStorageService` (contrato para subir/asociar archivos, reutilizable por el portafolio de SPEC-05) - `common/storage` 
- [ ] **F04-T007** [P] [US1] Contract test `POST /solicitudes` (201, 400) — `tests/contract/test_solicitudes_crear.java`
- [ ] **F04-T008** [P] [US1] Integration test: publicación completa, falta zona/urgencia, con/sin fotos, guardar como borrador, pérdida de conexión (no duplica), actor no autorizado — `tests/integration/test_publicar_solicitud.java`
- [ ] **F04-T009** [P] [US1] Modelos `Solicitud`, `FotoSolicitud` — `solicitudes/domain/model` (depends on T003)
- [ ] **F04-T010** [US1] `SolicitudRepository`, `FotoSolicitudRepository` — `solicitudes/domain/repository`
- [ ] **F04-T011** [US1] `SolicitudService.crear()`: valida categoría, zona y urgencia obligatorios (FR-017), asocia fotos opcionales vía `ArchivoStorageService` (FR-016), decide estado BORRADOR/PUBLICADA (FR-019), idempotente ante reintento por pérdida de conexión (depends on T009, T010, T006)
- [ ] **F04-T012** [US1] Endpoint `POST /api/v1/solicitudes` restringido a rol CLIENTE (reutiliza filtro de SPEC-01 T018) — `solicitudes/presentation/controller`
- [ ] **F04-T013** [US1] Registrar entrada inicial en `HistorialEstadoSolicitud` al crear (depends on T011)
- [ ] **F04-T014** [P] [US2] Contract test `PUT /solicitudes/{id}`, `POST /solicitudes/{id}/cancelar` (200, 400, 403, 404, 409) - `tests/contract/test_solicitudes_gestionar.java`
- [ ] **F04-T015** [P] [US2] Integration test: editar abierta, editar ya cerrada (rechazo), cancelar abierta, cancelar ya cancelada (rechazo), solicitud ajena/no autorizado - `tests/integration/test_gestionar_solicitud.java`
- [ ] **F04-T016** [US2] `SolicitudService.editar()`: valida estado abierto (BORRADOR/PUBLICADA) y propiedad, rechaza en caso contrario (FR-020) (depends on T010)
- [ ] **F04-T017** [US2] `SolicitudService.cancelar()`: valida estado abierto y propiedad, transiciona a CANCELADA, registra en historial (FR-021) (depends on T010, T013)
- [ ] **F04-T018** [US2] Endpoints `PUT /api/v1/solicitudes/{id}`, `POST /api/v1/solicitudes/{id}/cancelar` - `solicitudes/presentation/controller`
- [ ] **F04-T019** [US2] Bloqueo de edición/cancelación sobre solicitudes en estado CONTRATADA 
- [ ] **F04-T020** [P] [US3] Contract test `GET /solicitudes/mias`, `GET /solicitudes/mias/{id}` (200, 404) - `tests/contract/test_solicitudes_consultar.java`
- [ ] **F04-T021** [P] [US3] Integration test: listar propias (no ajenas), lista vacía, detalle propio, detalle inexistente/ajeno sin revelar la causa, no autorizado- `tests/integration/test_consultar_solicitudes.java`
- [ ] **F04-T022** [US3] `SolicitudService.listarPorCliente()`, `obtenerDetalle()`: filtra por propietario; el detalle unifica la respuesta para solicitud inexistente o ajena (FR-022, FR-023) (depends on T010)
- [ ] **F04-T023** [US3] Endpoints `GET /api/v1/solicitudes/mias`, `GET /api/v1/solicitudes/mias/{id}` - `solicitudes/presentation/controller`

### Contratos API de origen

| Método | Endpoint                            | Request body                                                             | Respuesta éxito                                   | Errores                                                                               |
| ------ | ----------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------- | ------------------------------------------------------------------------------------- |
| POST   | `/api/v1/solicitudes`               | `{ categoriaId, descripcion, zonaId, urgencia, fotos[], estadoDeseado }` | `201 { id, estado }`                              | `400` falta zona/urgencia/categoría                                                   |
| PUT    | `/api/v1/solicitudes/{id}`          | campos editables de la solicitud                                         | `200 { id, estado }`                              | `400` datos inválidos; `403/404` no pertenece o no existe; `409` ya no admite cambios |
| POST   | `/api/v1/solicitudes/{id}/cancelar` | *(sin body)*                                                             | `200 { estado: "CANCELADA" }`                     | `403/404` no pertenece o no existe; `409` ya no estaba abierta                        |
| GET    | `/api/v1/solicitudes/mias`          | —                                                                        | `200 [ { id, estado, ... } ]` *(puede ser vacío)* | `401` sin rol Cliente                                                                 |
| GET    | `/api/v1/solicitudes/mias/{id}`     | —                                                                        | `200 { ...detalle }`                              | `404` inexistente o ajena (sin distinguir causa)                                      |

Todos los endpoints restringidos a rol CLIENTE mediante el filtro de autorización por rol de SPEC-01 (T018).


## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F04-FE-01** Formulario de categoría, descripción, zona y urgencia; fotos opcionales con progreso, límites y errores reales.
- [ ] **F04-FE-02** Guardar borrador, retomar, publicar y confirmar cancelación; conservar datos locales transitorios ante pérdida de conexión.
- [ ] **F04-FE-03** Lista y detalle de solicitudes propias con estado e historial visible cuando esté previsto por el contrato.
- [ ] **F04-FE-04** Reutilizar Idempotency-Key al reintentar el mismo envío y renovarla para una nueva intención; no declarar éxito antes del servidor.

Aplicar [estados y contrato de cliente](../01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación

- [ ] **F04-QA-01** Publicar sin fotos y rechazar publicación sin zona/urgencia; borrador nunca visible en oportunidades.
- [ ] **F04-QA-02** Reintentar tras timeout y recargar: una solicitud, un historial y fotos asociadas.
- [ ] **F04-QA-03** Validar firma MIME, propiedad de archivos y compensación si storage falla después de cargar.
- [ ] **F04-QA-04** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Requisitos y criterios de éxito de origen

Los identificadores FR/SC son locales al SPEC: deben referenciarse como SPEC-04/FR-xxx y SPEC-04/SC-xxx.

- **FR-017**: El sistema DEBE exigir zona aproximada y nivel de urgencia como datos obligatorios en toda publicación de solicitud, incluidos siempre dentro del flujo de publicación. _(UC017, incluido en UC018)_
- **FR-018**: El sistema DEBE permitir que un Cliente publique una solicitud completa (categoría, descripción, zona aproximada, urgencia y fotos opcionales), dejándola visible para prestadores de esa categoría y zona sin revelar la dirección exacta, y DEBE rechazar la publicación si falta algún dato obligatorio. _(UC018)_
- **FR-016**: El sistema DEBE permitir, de forma opcional, adjuntar una o más fotos a la solicitud antes o durante su publicación, sin que su ausencia impida publicar. _(UC016, extiende a UC018)_
- **FR-019**: El sistema DEBE permitir, como alternativa a publicar, conservar la solicitud como borrador no visible para prestadores, retomable posteriormente. _(UC019, extiende a UC018)_
- **FR-020**: El sistema DEBE permitir que un Cliente edite los datos de una solicitud propia mientras esté en estado abierto (publicada o borrador), y DEBE rechazar la edición si la solicitud ya no admite cambios o no le pertenece. _(UC020)_
- **FR-021**: El sistema DEBE permitir que un Cliente cancele una solicitud propia mientras esté abierta, dejándola fuera de la visibilidad de los prestadores, y DEBE rechazar la cancelación si la solicitud ya no está abierta o no le pertenece. _(UC021)_
- **FR-022**: El sistema DEBE permitir que un Cliente consulte la lista completa de sus propias solicitudes, con su estado actual, sin mostrar solicitudes de otros clientes. _(UC022)_
- **FR-023**: El sistema DEBE permitir que un Cliente consulte el detalle y el estado de una solicitud propia, y DEBE rechazar la consulta si la solicitud no existe o pertenece a otro Cliente, sin revelar cuál de las dos causas aplica. _(UC023)_
- **SC-001**: El 100% de las solicitudes publicadas incluye zona aproximada y urgencia; ninguna se publica sin estos datos.
- **SC-002**: El 100% de las solicitudes guardadas como borrador permanece no visible para prestadores hasta que el Cliente decide publicarlas.
- **SC-003**: El 100% de los intentos de editar o cancelar una solicitud ajena, inexistente o que ya no está abierta es rechazado sin modificar ningún registro.
- **SC-004**: El 100% de las consultas de lista o detalle de solicitudes devuelve únicamente información del Cliente autenticado que la solicita.
- **SC-005**: Ante una pérdida de conexión durante publicación o edición, el 100% de los casos de prueba conserva un único registro consistente, sin duplicados.
