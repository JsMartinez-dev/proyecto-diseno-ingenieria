# F06 — Compatibilidad y oportunidades

**Alcance:** MVP. **Estado:** planificado, sin implementación.
**Dependencias:** 01 04 05 09.base. **Decisiones relacionadas:** D-03 D-08 (ver [registro](../03-decisiones-y-dependencias.md)).

## Resultado esperado

Tablero compatible por categoría/zona/disponibilidad, filtros, detalle y notificación de nueva oportunidad.

## Fuentes y trazabilidad

- [SPEC original](../fuentes/specs/spec-06-compatibilidad-oportunidades.md): historias, escenarios, requisitos y criterios de éxito.
- [Plan de origen](../fuentes/planes/plan-spec-06-compatibilidad-oportunidades.md): fases, tareas y dependencias detalladas.
- [Manual de datos](../fuentes/manual-base-de-datos-aliado.md), [modelo PDF](../fuentes/modelo-logico-ALIADO.pdf) y [reglas transversales](../01-arquitectura-y-stack.md).

Los IDs `F06-Txxx` conservan el identificador Txxx de origen, ahora con prefijo para evitar colisiones entre SPEC. No implican que el trabajo ya exista. Las tareas adicionales DB/BE/FE/QA desglosan integración y clientes, sin reemplazar requisitos. Las correcciones explícitas de 03 prevalecen sobre notas antiguas del plan fuente; no implementar tablas puntuales de notificaciones ni JWT por copiar una referencia.

## Historias cubiertas

- User Story 1 - Ver y filtrar el tablero de oportunidades compatibles [UC034, UC035, UC036, UC038] (Priority: P1)
- User Story 2 - Consultar el detalle de una oportunidad [UC037] (Priority: P1)

## Base de datos

- [ ] **F06-DB-01** Implementar o verificar V3 compartida: `notificaciones`. Aplicar columnas, PK/FK, nulabilidad y CHECK del manual; las tablas compartidas se crean una sola vez.
- [ ] **F06-DB-02** Agregar/verificar restricciones e índices de esta feature según 02-base-de-datos.md; probar integridad con PostgreSQL 16 y Flyway, incluyendo inserciones inválidas y concurrencia.
- [ ] **F06-DB-03** Implementar modelos de dominio independientes, puertos, entidades JPA, repositorios Spring Data, mappers y adaptadores; no serializar entidades JPA en API.

## Backend — integración y arquitectura

- [ ] **F06-BE-01** Concretar los contratos de F06 en OpenAPI: DTO request/response, validación, rol, propiedad, paginación, errores e idempotencia, conservando endpoints fuente salvo decisión explícita.
- [ ] **F06-BE-02** Definir las interfaces `application/usecase/*UseCase` y sus implementaciones `application/service/*Service implements *UseCase` según la tabla de esta feature. Inyectar solo interfaces por constructor en controladores/filtros/worker. Service usa dominio y puertos; ninguna dependencia hacia Spring/JPA/HTTP/adaptadores concretos. Llamadas entre módulos mediante interfaces públicas, nunca clases Service ni repositorios JPA ajenos.
- [ ] **F06-BE-03** Integrar los casos de uso de las tareas de origen con transacciones, autorización por recurso y tratamiento de fallos. Donde aplique, notificación persistida junto al negocio y entrega externa posterior al commit.

### Interfaces de entrada e implementaciones

Esta tabla concreta la separación del ejemplo del usuario: cada nombre base origina una interfaz `<Nombre>UseCase` en `application/usecase/` y una clase `<Nombre>Service implements <Nombre>UseCase` en `application/service/`, dentro del módulo indicado. Son nombres previstos de contratos, no endpoints nuevos ni prueba de implementación. Conservar responsabilidades y dependencias de las tareas de origen; sus nombres de servicio agrupado se descomponen conforme a esta tabla.

| Módulo | Interfaz de entrada | Implementación |
|---|---|---|
| `oportunidades` | `ConsultarTableroOportunidadesUseCase` | `ConsultarTableroOportunidadesService` |
| `oportunidades` | `ConsultarDetalleOportunidadUseCase` | `ConsultarDetalleOportunidadService` |
| `oportunidades` | `CalcularCompatibilidadUseCase` | `CalcularCompatibilidadService` |
| `oportunidades` | `DetectarNuevaOportunidadUseCase` | `DetectarNuevaOportunidadService` |

Puertos de salida previstos: ConsultaSolicitudesAbiertasPort, ConsultaCoberturaDisponibilidadPort y RegistroNotificacionPort. Los repositorios siguen siendo contratos en `domain/repository/`; los puertos externos/consultas requeridos por aplicación van en `application/port/`, con adaptadores de infraestructura. No crear un puerto adicional cuando ya exista un contrato público equivalente.

Controllers reciben UseCase por constructor y convierten Request/Response mediante mapper de presentación. Commands/Queries/Results de aplicación no contienen objetos HTTP o JPA. Excepciones de negocio en `domain/exception/`; wiring/transacciones en infraestructura/configuración. Ver [árbol completo y reglas](../04-estructura-y-casos-de-uso.md).

### Tareas existentes del plan fuente

Conservar el orden por fases y las dependencias `Txxx` del documento de origen; una referencia `SPEC-n/Txxx` se interpreta como `Fn-Txxx`. Las rutas de origen son relativas a `backend/`. Si una tarea habla de crear una tabla ya incluida en V1–V6, se verifica/reutiliza esa tabla en lugar de crearla de nuevo. Si hace referencia a entidades de notificación puntuales, adaptar al módulo y tabla unificados.

- [ ] **F06-T001** Crear el paquete `oportunidades/` con sus subcarpetas en capas de Arquitectura Limpia (según Project Structure)
- [ ] **F06-T002** Migración Flyway: tabla `notificaciones_oportunidad`
- [ ] **F06-T003** [P] [US1] Contract test `GET /oportunidades`, `GET /notificaciones/oportunidades` (200, 401) — `tests/contract/test_oportunidades_tablero.java`
- [ ] **F06-T004** [P] [US1] Integration test: tablero con oportunidades compatibles, tablero vacío, filtro que acota resultados, filtro sin coincidencias, solicitud sin datos suficientes marcada no evaluable, notificación generada al publicar solicitud compatible, notificación pendiente sin sesión activa, actor no autorizado — `tests/integration/test_tablero_oportunidades.java`
- [ ] **F06-T005** [P] [US1] Modelo `NotificacionOportunidad` — `oportunidades/domain/model`
- [ ] **F06-T006** [US1] `NotificacionOportunidadRepository` — `oportunidades/domain/repository`
- [ ] **F06-T007** [US1] `CompatibilidadService.calcularTablero(prestadorId)`: consulta `Solicitud` (SPEC-04) y `PerfilProfesional`/`Disponibilidad` (SPEC-05) vía sus repositorios; compara categoría, zona y disponibilidad (FR-034); marca como no evaluable toda solicitud sin datos suficientes, excluyéndola del resultado (FR-034); devuelve lista vacía sin error cuando no hay coincidencias (FR-035) (depends on T005, dependencias externas: `SolicitudRepository` de SPEC-04, `PerfilProfesionalRepository`/`DisponibilidadRepository` de SPEC-05)
- [ ] **F06-T008** [US1] `CompatibilidadService.filtrarTablero(prestadorId, criterios)`: aplica filtros adicionales (categoría, urgencia) sobre el resultado de T007 sin alterar el cálculo base (FR-036); devuelve vacío sin error si ningún resultado cumple (depends on T007)
- [ ] **F06-T009** [US1] `NotificacionOportunidadService.notificarNuevaOportunidad()`: se invoca cuando una nueva `Solicitud` publicada resulta compatible con un perfil (FR-038); registra la notificación con estado PENDIENTE si el Prestador no tiene sesión activa, y ENTREGADA en caso contrario (depends on T006, T007)
- [ ] **F06-T010** [US1] Endpoints `GET /api/v1/oportunidades` (con query params de filtro), `GET /api/v1/notificaciones/oportunidades` — `oportunidades/presentation/controller`
- [ ] **F06-T011** [P] [US2] Contract test `GET /oportunidades/{solicitudId}` (200, 404) — `tests/contract/test_oportunidad_detalle.java`
- [ ] **F06-T012** [P] [US2] Integration test: detalle disponible sin datos privados ni dirección exacta, oportunidad no compatible o inexistente (rechazo unificado), actor no autorizado — `tests/integration/test_detalle_oportunidad.java`
- [ ] **F06-T013** [US2] `CompatibilidadService.obtenerDetalle(prestadorId, solicitudId)`: reutiliza la verificación de compatibilidad de T007 para esa solicitud puntual; si no es compatible o no existe, rechaza sin distinguir la causa (FR-037); construye la respuesta a partir de `Solicitud` (SPEC-04) excluyendo explícitamente dirección exacta y datos privados del Cliente (depends on T007)
- [ ] **F06-T014** [US2] Endpoint `GET /api/v1/oportunidades/{solicitudId}` — `oportunidades/presentation/controller`

### Contratos API de origen

| Método | Endpoint | Request body / Query params | Respuesta éxito | Errores |
|---|---|---|---|---|
| GET | `/api/v1/oportunidades` | query params de filtro opcionales (categoría, urgencia) | `200 [ { solicitudId, categoria, zonaAproximada, urgencia, ... } ]` *(puede ser vacío)* | `401` sin rol Prestador |
| GET | `/api/v1/oportunidades/{solicitudId}` | — | `200 { ...detalle completo, sin datos privados del Cliente ni dirección exacta }` | `404` no compatible o inexistente (sin distinguir causa) |
| GET | `/api/v1/notificaciones/oportunidades` | — | `200 [ { solicitudId, fechaGeneracion, estado } ]` | `401` sin rol Prestador |

Todos los endpoints restringidos a rol PRESTADOR mediante el filtro de autorización por rol de SPEC-01 (T018). No se expone un endpoint de "push" en tiempo real en esta tabla porque el mecanismo de entrega (polling vs. WebSocket vs. push) no está definido — ver Notes.


## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F06-FE-01** Tablero con filtros y estados vacío, cargando, sin datos suficientes y error de conexión.
- [ ] **F06-FE-02** Detalle que solo permite proponer sobre solicitud abierta y compatible; refrescar después de cambios relevantes.
- [ ] **F06-FE-03** Abrir oportunidad desde notificación y volver a validar en servidor en lugar de confiar en el push.
- [ ] **F06-FE-04** No revelar identidad/contacto del Cliente antes de autorización del servicio.

Aplicar [estados y contrato de cliente](../01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación

- [ ] **F06-QA-01** Matriz de coincidencia de categoría, zona y disponibilidad; datos insuficientes excluidos como no evaluables.
- [ ] **F06-QA-02** Cambio de agenda/solicitud invalida coincidencias sin tabla oportunidades duplicada.
- [ ] **F06-QA-03** Nuevas coincidencias persisten una sola notificación por evento aunque el Prestador no tenga sesión activa.
- [ ] **F06-QA-04** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Requisitos y criterios de éxito de origen

Los identificadores FR/SC son locales al SPEC: deben referenciarse como SPEC-06/FR-xxx y SPEC-06/SC-xxx.

- **FR-035**: El sistema DEBE permitir que un Prestador consulte un tablero que muestre únicamente las solicitudes abiertas compatibles con su perfil (categoría, zona y disponibilidad), incluyendo el caso de tablero vacío. _(UC035, incluye a UC034)_
- **FR-034**: El sistema DEBE calcular la compatibilidad de cada solicitud contra cada perfil usando categoría, zona y disponibilidad, y DEBE marcar como no evaluable toda solicitud que no tenga datos suficientes para ese cálculo. _(UC034, incluido en UC035)_
- **FR-036**: El sistema DEBE permitir que un Prestador filtre su tablero de oportunidades por criterios adicionales, sin alterar el cálculo de compatibilidad subyacente. _(UC036, extiende a UC035)_
- **FR-037**: El sistema DEBE permitir que un Prestador consulte el detalle completo de una oportunidad compatible de su tablero, sin exponer datos privados del Cliente que la publicó, y DEBE rechazar la consulta si la oportunidad no es compatible con su perfil o no existe. _(UC037)_
- **FR-038**: El sistema DEBE notificar a un Prestador cuando el cálculo de compatibilidad detecte una nueva oportunidad para su perfil, sin requerir que el Prestador esté consultando el tablero en ese momento. _(UC038, extiende a UC034)_
- **SC-001**: El 100% de las oportunidades mostradas en un tablero corresponde a solicitudes cuya categoría, zona y disponibilidad coinciden con el perfil del Prestador que consulta.
- **SC-002**: El 100% de las solicitudes sin datos suficientes para evaluar compatibilidad se marca como no evaluable y no aparece como compatible en ningún tablero.
- **SC-003**: El 100% de las consultas de detalle de oportunidad no expone datos privados del Cliente que publicó la solicitud.
- **SC-004**: El 100% de las nuevas solicitudes compatibles genera una notificación hacia el Prestador correspondiente.
- **SC-005**: Ante datos faltantes, oportunidad inexistente o rol incorrecto, ninguna operación de esta especificación modifica datos y la interfaz informa la causa.
