# F05 — Perfil profesional, portafolio, disponibilidad y agenda

**Alcance:** MVP. **Estado:** planificado, sin implementación.
**Dependencias:** 01 04. **Decisiones relacionadas:** D-02 D-03 D-07 (ver [registro](../03-decisiones-y-dependencias.md)).

## Resultado esperado

Crear/editar perfil con categorías/zonas, experiencia opcional, portafolio, disponibilidad, agenda y vista previa.

## Fuentes y trazabilidad

- [SPEC original](../fuentes/specs/spec-05-perfil-profesional.md): historias, escenarios, requisitos y criterios de éxito.
- [Plan de origen](../fuentes/planes/plan-spec-05-perfil-profesional.md): fases, tareas y dependencias detalladas.
- [Manual de datos](../fuentes/manual-base-de-datos-aliado.md), [modelo PDF](../fuentes/modelo-logico-ALIADO.pdf) y [reglas transversales](../01-arquitectura-y-stack.md).

Los IDs `F05-Txxx` conservan el identificador Txxx de origen, ahora con prefijo para evitar colisiones entre SPEC. No implican que el trabajo ya exista. Las tareas adicionales DB/BE/FE/QA desglosan integración y clientes, sin reemplazar requisitos. Las correcciones explícitas de 03 prevalecen sobre notas antiguas del plan fuente; no implementar tablas puntuales de notificaciones ni JWT por copiar una referencia.

## Historias cubiertas

- User Story 1 - Crear el perfil profesional [UC024, UC026, UC027, UC028] (Priority: P1)
- User Story 2 - Editar los datos generales del perfil [UC025] (Priority: P1)
- User Story 3 - Gestionar el portafolio de servicios [UC029, UC030] (Priority: P1)
- User Story 4 - Configurar disponibilidad y gestionar la agenda [UC031, UC032] (Priority: P1)
- User Story 5 - Consultar la vista previa del perfil [UC033] (Priority: P1)

## Base de datos

- [ ] **F05-DB-01** Implementar o verificar V2: `perfiles_profesionales`, `perfil_categoria`, `perfil_zona_atencion`, `experiencias_profesionales`, `servicios_portafolio`, `disponibilidades`, `compromisos_agenda`. Aplicar columnas, PK/FK, nulabilidad y CHECK del manual; las tablas compartidas se crean una sola vez.
- [ ] **F05-DB-02** Agregar/verificar restricciones e índices de esta feature según 02-base-de-datos.md; probar integridad con PostgreSQL 16 y Flyway, incluyendo inserciones inválidas y concurrencia.
- [ ] **F05-DB-03** Implementar modelos de dominio independientes, puertos, entidades JPA, repositorios Spring Data, mappers y adaptadores; no serializar entidades JPA en API.

## Backend — integración y arquitectura

- [ ] **F05-BE-01** Concretar los contratos de F05 en OpenAPI: DTO request/response, validación, rol, propiedad, paginación, errores e idempotencia, conservando endpoints fuente salvo decisión explícita.
- [ ] **F05-BE-02** Definir las interfaces `application/usecase/*UseCase` y sus implementaciones `application/service/*Service implements *UseCase` según la tabla de esta feature. Inyectar solo interfaces por constructor en controladores/filtros/worker. Service usa dominio y puertos; ninguna dependencia hacia Spring/JPA/HTTP/adaptadores concretos. Llamadas entre módulos mediante interfaces públicas, nunca clases Service ni repositorios JPA ajenos.
- [ ] **F05-BE-03** Integrar los casos de uso de las tareas de origen con transacciones, autorización por recurso y tratamiento de fallos. Donde aplique, notificación persistida junto al negocio y entrega externa posterior al commit.

### Interfaces de entrada e implementaciones

Esta tabla concreta la separación del ejemplo del usuario: cada nombre base origina una interfaz `<Nombre>UseCase` en `application/usecase/` y una clase `<Nombre>Service implements <Nombre>UseCase` en `application/service/`, dentro del módulo indicado. Son nombres previstos de contratos, no endpoints nuevos ni prueba de implementación. Conservar responsabilidades y dependencias de las tareas de origen; sus nombres de servicio agrupado se descomponen conforme a esta tabla.

| Módulo | Interfaz de entrada | Implementación |
|---|---|---|
| `perfiles` | `CrearPerfilProfesionalUseCase` | `CrearPerfilProfesionalService` |
| `perfiles` | `EditarPerfilProfesionalUseCase` | `EditarPerfilProfesionalService` |
| `perfiles` | `ActualizarCategoriasProfesionalesUseCase` | `ActualizarCategoriasProfesionalesService` |
| `perfiles` | `ActualizarZonasAtencionUseCase` | `ActualizarZonasAtencionService` |
| `perfiles` | `RegistrarExperienciaProfesionalUseCase` | `RegistrarExperienciaProfesionalService` |
| `perfiles` | `AgregarServicioPortafolioUseCase` | `AgregarServicioPortafolioService` |
| `perfiles` | `EliminarServicioPortafolioUseCase` | `EliminarServicioPortafolioService` |
| `perfiles` | `ConfigurarDisponibilidadUseCase` | `ConfigurarDisponibilidadService` |
| `perfiles` | `GestionarCompromisoAgendaUseCase` | `GestionarCompromisoAgendaService` |
| `perfiles` | `ConsultarVistaPreviaPerfilUseCase` | `ConsultarVistaPreviaPerfilService` |

Puertos de salida previstos: ArchivoStorageService, consultas de catálogo y puerto de consulta de compromisos cuando se requiera. Los repositorios siguen siendo contratos en `domain/repository/`; los puertos externos/consultas requeridos por aplicación van en `application/port/`, con adaptadores de infraestructura. No crear un puerto adicional cuando ya exista un contrato público equivalente.

Controllers reciben UseCase por constructor y convierten Request/Response mediante mapper de presentación. Commands/Queries/Results de aplicación no contienen objetos HTTP o JPA. Excepciones de negocio en `domain/exception/`; wiring/transacciones en infraestructura/configuración. Ver [árbol completo y reglas](../04-estructura-y-casos-de-uso.md).

### Tareas existentes del plan fuente

Conservar el orden por fases y las dependencias `Txxx` del documento de origen; una referencia `SPEC-n/Txxx` se interpreta como `Fn-Txxx`. Las rutas de origen son relativas a `backend/`. Si una tarea habla de crear una tabla ya incluida en V1–V6, se verifica/reutiliza esa tabla en lugar de crearla de nuevo. Si hace referencia a entidades de notificación puntuales, adaptar al módulo y tabla unificados.

- [ ] **F05-T001** Crear el paquete `perfiles/` con sus subcarpetas en capas de Arquitectura Limpia (según Project Structure)
- [ ] **F05-T002** Migración Flyway: tablas `perfiles_profesionales`, `perfil_categoria`, `perfil_zona_atencion`, `experiencia_profesional`, `servicio_portafolio`, `disponibilidad`, `compromiso_agenda`
- [ ] **F05-T003** [P] [US1] Contract test `POST /perfiles` (201, 400) — `tests/contract/test_perfiles_crear.java`
- [ ] **F05-T004** [P] [US1] Integration test: creación completa, sin categorías, sin zonas, con/sin experiencia, actualizar categorías/experiencia después de creado sin duplicar perfil, actor no autorizado — `tests/integration/test_crear_perfil.java`
- [ ] **F05-T005** [P] [US1] Modelos `PerfilProfesional`, `ExperienciaProfesional` y tablas puente `PerfilCategoria`/`PerfilZonaAtencion` — `perfiles/domain/model`
- [ ] **F05-T006** [US1] `PerfilProfesionalRepository`, `ExperienciaProfesionalRepository` — `perfiles/domain/repository`
- [ ] **F05-T007** [US1] `PerfilService.crear()`: valida al menos una categoría y una zona (FR-024), asocia categorías existentes del catálogo (FR-026, reutiliza `CategoriaServicioRepository` de SPEC-04), asocia zonas (FR-027, reutiliza `ZonaRepository` de SPEC-04), registra experiencia opcional (FR-028) (depends on T005, T006)
- [ ] **F05-T008** [US1] `PerfilService.actualizarCategorias()`, `agregarExperiencia()`: operan sobre perfil existente sin crear uno nuevo (depends on T007)
- [ ] **F05-T009** [US1] Endpoints `POST /api/v1/perfiles`, `PUT /api/v1/perfiles/mio/categorias`, `POST /api/v1/perfiles/mio/experiencia`, restringidos a rol PRESTADOR — `perfiles/presentation/controller`
- [ ] **F05-T010** [P] [US2] Contract test `PUT /perfiles/mio` (200, 403, 404) — `tests/contract/test_perfiles_editar.java`
- [ ] **F05-T011** [P] [US2] Integration test: edición exitosa, perfil inexistente, actor no autorizado — `tests/integration/test_editar_perfil.java`
- [ ] **F05-T012** [US2] `PerfilService.editarDatosGenerales()`: valida existencia y propiedad del perfil, rechaza si no existe o no pertenece al Prestador (FR-025) (depends on T007)
- [ ] **F05-T013** [US2] Endpoint `PUT /api/v1/perfiles/mio` — `perfiles/presentation/controller`
- [ ] **F05-T014** [P] [US3] Contract test `POST /perfiles/mio/portafolio`, `DELETE /perfiles/mio/portafolio/{id}` (201, 204, 403, 404) — `tests/contract/test_portafolio.java`
- [ ] **F05-T015** [P] [US3] Integration test: agregar servicio, eliminar servicio propio, eliminar servicio ajeno (rechazo), actor no autorizado — `tests/integration/test_gestionar_portafolio.java`
- [ ] **F05-T016** [P] [US3] Modelo `ServicioPortafolio` — `perfiles/domain/model` (depends on T005)
- [ ] **F05-T017** [US3] `ServicioPortafolioRepository` — `perfiles/domain/repository`
- [ ] **F05-T018** [US3] `PerfilService.agregarServicioPortafolio()`: sube evidencia vía `ArchivoStorageService` de SPEC-04, asocia al perfil propio (FR-029) (depends on T017, dependencia externa: `ArchivoStorageService` de SPEC-04 T006)
- [ ] **F05-T019** [US3] `PerfilService.eliminarServicioPortafolio()`: valida propiedad, elimina sin afectar otros servicios (FR-030) (depends on T017)
- [ ] **F05-T020** [US3] Endpoints `POST /api/v1/perfiles/mio/portafolio`, `DELETE /api/v1/perfiles/mio/portafolio/{id}` — `perfiles/presentation/controller`
- [ ] **F05-T021** [P] [US4] Contract test `PUT /perfiles/mio/disponibilidad`, `POST/PUT/GET /perfiles/mio/agenda` (200, 201, 403, 404, 409) — `tests/contract/test_disponibilidad_agenda.java`
- [ ] **F05-T022** [P] [US4] Integration test: configurar disponibilidad, agregar/modificar/consultar compromiso sin afectar otros, conflicto disponibilidad-agenda (edge case), actor no autorizado — `tests/integration/test_disponibilidad_agenda.java`
- [ ] **F05-T023** [P] [US4] Modelos `Disponibilidad`, `CompromisoAgenda` — `perfiles/domain/model` (depends on T005)
- [ ] **F05-T024** [US4] `DisponibilidadRepository`, `CompromisoAgendaRepository` — `perfiles/domain/repository`
- [ ] **F05-T025** [US4] `DisponibilidadService.configurar()`: guarda disponibilidad del perfil (FR-031) (depends on T024)
- [ ] **F05-T026** [US4] `DisponibilidadService.gestionarCompromiso()`: agrega/modifica/consulta compromisos propios sin afectar los de otros prestadores (FR-032), rechaza si entra en conflicto con disponibilidad ya registrada (edge case del SPEC) (depends on T024, T025)
- [ ] **F05-T027** [US4] Endpoints `PUT /api/v1/perfiles/mio/disponibilidad`, `POST|PUT|GET /api/v1/perfiles/mio/agenda` — `perfiles/presentation/controller`
- [ ] **F05-T028** [P] [US5] Contract test `GET /perfiles/mio/vista-previa` (200, 403, 404) — `tests/contract/test_vista_previa.java`
- [ ] **F05-T029** [P] [US5] Integration test: vista previa disponible y coincide con subconjunto público, actor no autorizado o perfil ajeno — `tests/integration/test_vista_previa.java`
- [ ] **F05-T030** [US5] `PerfilService.construirVistaPublica()`: define el subconjunto de datos expuestos públicamente a partir del perfil completo (FR-033); esta misma construcción debe ser la que use SPEC-03 (UC015) para no divergir (depends on T007, T018, T025) 
- [ ] **F05-T031** [US5] Endpoint `GET /api/v1/perfiles/mio/vista-previa` — `perfiles/presentation/controller`

### Contratos API de origen

| Método | Endpoint | Request body | Respuesta éxito | Errores |
|---|---|---|---|---|
| POST | `/api/v1/perfiles` | `{ datosGenerales, categoriaIds[], zonaIds[], experiencia[]? }` | `201 { id }` | `400` falta categoría o zona |
| PUT | `/api/v1/perfiles/mio` | datos generales editables | `200 { id }` | `404` perfil no existe; `403` no autorizado |
| PUT | `/api/v1/perfiles/mio/categorias` | `{ categoriaIds[] }` | `200` | `403/404` |
| POST | `/api/v1/perfiles/mio/experiencia` | `{ descripcion, ... }` | `201` | `403/404` |
| POST | `/api/v1/perfiles/mio/portafolio` | `{ descripcion, evidencia[] }` | `201 { id }` | `403/404` |
| DELETE | `/api/v1/perfiles/mio/portafolio/{id}` | — | `204` | `403/404` servicio ajeno o inexistente |
| PUT | `/api/v1/perfiles/mio/disponibilidad` | `{ bloques[] }` | `200` | `403/404` |
| POST \| PUT \| GET | `/api/v1/perfiles/mio/agenda` | `{ fechaHoraInicio, fechaHoraFin }` | `200/201` | `403/404`; `409` conflicto con disponibilidad |
| GET | `/api/v1/perfiles/mio/vista-previa` | — | `200 { ...perfil público }` | `403/404` |

Todos los endpoints restringidos a rol PRESTADOR mediante el filtro de autorización por rol de SPEC-01 (T018).


## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F05-FE-01** Editor de perfil profesional y selectores de categorías/zonas sin valores definitivos codificados en cliente.
- [ ] **F05-FE-02** Alta/baja de trabajos del portafolio y evidencia privada autorizada, con previsualización y confirmación.
- [ ] **F05-FE-03** Disponibilidad semanal y compromisos de agenda con fecha/hora local, validación de solapes y aviso de conflicto.
- [ ] **F05-FE-04** Vista previa consume la misma proyección pública de descubrimiento, sin permitir al Prestador la búsqueda exclusiva de Cliente.

Aplicar [estados y contrato de cliente](../01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación

- [ ] **F05-QA-01** No crear perfil sin categoría o zona; aislar cada mutación por prestador autenticado.
- [ ] **F05-QA-02** Probar solapes, cambios de zona horaria y compromisos activos; precisión temporal según D-03.
- [ ] **F05-QA-03** Comparar automáticamente campos de vista previa con DTO público.
- [ ] **F05-QA-04** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Requisitos y criterios de éxito de origen

Los identificadores FR/SC son locales al SPEC: deben referenciarse como SPEC-05/FR-xxx y SPEC-05/SC-xxx.

- **FR-024**: El sistema DEBE permitir que un Prestador cree su perfil profesional únicamente cuando incluya al menos una categoría de servicio y al menos una zona de atención, y DEBE rechazar la creación si falta alguno de estos datos obligatorios. _(UC024, incluye a UC026 y UC027)_
- **FR-026**: El sistema DEBE permitir que un Prestador escoja o actualice sus categorías de servicio, tanto durante la creación del perfil como de forma independiente después de creado. _(UC026)_
- **FR-027**: El sistema DEBE permitir que un Prestador configure sus zonas de atención como parte obligatoria de la creación del perfil. _(UC027, incluido en UC024)_
- **FR-028**: El sistema DEBE permitir, de forma opcional, registrar experiencia profesional en el perfil, tanto durante su creación como de forma independiente después de creado, sin que su ausencia impida crear el perfil. _(UC028, extiende a UC024)_
- **FR-025**: El sistema DEBE permitir que un Prestador edite los datos generales de un perfil ya creado, y DEBE rechazar la edición si el perfil no existe o no le pertenece. _(UC025)_
- **FR-029**: El sistema DEBE permitir que un Prestador agregue un servicio, con su descripción y evidencia, al portafolio de su propio perfil. _(UC029)_
- **FR-030**: El sistema DEBE permitir que un Prestador elimine un servicio de su propio portafolio sin afectar los demás servicios registrados. _(UC030)_
- **FR-031**: El sistema DEBE permitir que un Prestador configure su disponibilidad horaria, dejándola disponible para el cálculo de compatibilidad de oportunidades. _(UC031)_
- **FR-032**: El sistema DEBE permitir que un Prestador gestione los compromisos de su propia agenda sin afectar los de otros prestadores. _(UC032)_
- **FR-033**: El sistema DEBE permitir que un Prestador consulte la vista previa de su propio perfil, mostrando exactamente la misma información pública que vería un Cliente. _(UC033)_
- **SC-001**: El 100% de los perfiles creados incluye al menos una categoría de servicio y una zona de atención; ninguno se crea sin estos datos.
- **SC-002**: El 100% de las ediciones de categorías, zonas, experiencia, portafolio, disponibilidad o agenda solo afecta al perfil del Prestador autenticado que la solicita.
- **SC-003**: La vista previa del perfil coincide, en el 100% de los casos de prueba, con la información pública que un Cliente ve al consultar ese mismo perfil.
- **SC-004**: Ante datos obligatorios faltantes, registro inexistente o rol incorrecto, ninguna operación de esta especificación modifica datos y la interfaz informa la causa.
