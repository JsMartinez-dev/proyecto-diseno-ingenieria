# F10 — Calificaciones, reseñas, reputación y verificación

**Alcance:** MVP. **Estado:** planificado, sin implementación.
**Dependencias:** 01 04 05 08. **Decisiones relacionadas:** D-07 D-11 (ver [registro](../03-decisiones-y-dependencias.md)).

## Resultado esperado

Calificar/reseñar, reputación derivada, verificación documental y núcleo único de reportes.

## Fuentes y trazabilidad

- [SPEC original](../fuentes/specs/spec-10-calificaciones-resenas-verificacion.md): historias, escenarios, requisitos y criterios de éxito.
- [Plan de origen](../fuentes/planes/plan-spec-10-calificaciones-resenas-verificacion.md): fases, tareas y dependencias detalladas.
- [Manual de datos](../fuentes/manual-base-de-datos-aliado.md), [modelo PDF](../fuentes/modelo-logico-ALIADO.pdf) y [reglas transversales](../01-arquitectura-y-stack.md).

Los IDs `F10-Txxx` conservan el identificador Txxx de origen, ahora con prefijo para evitar colisiones entre SPEC. No implican que el trabajo ya exista. Las tareas adicionales DB/BE/FE/QA desglosan integración y clientes, sin reemplazar requisitos. Las correcciones explícitas de 03 prevalecen sobre notas antiguas del plan fuente; no implementar tablas puntuales de notificaciones ni JWT por copiar una referencia.

## Historias cubiertas

- User Story 1 - Calificar servicio finalizado [UC059, UC061 ] (Priority: P1)
- User Story 2 - Agregar reseña textual [UC060] (Priority: P2)
- User Story 3 - Mostrar nivel de verificación [UC062] (Priority: P1)
- User Story 4 - Solicitar verificación documental ampliada [UC063] (Priority: P1)
- User Story 5 - Reportar reseña problemática [UC064] (Priority: P2)

## Base de datos

- [ ] **F10-DB-01** Implementar o verificar V4: `calificaciones`, `resenas`, `reputaciones_prestador`, `solicitudes_verificacion`, `documentos_verificacion`, `reportes`. Aplicar columnas, PK/FK, nulabilidad y CHECK del manual; las tablas compartidas se crean una sola vez.
- [ ] **F10-DB-02** Agregar/verificar restricciones e índices de esta feature según 02-base-de-datos.md; probar integridad con PostgreSQL 16 y Flyway, incluyendo inserciones inválidas y concurrencia.
- [ ] **F10-DB-03** Implementar modelos de dominio independientes, puertos, entidades JPA, repositorios Spring Data, mappers y adaptadores; no serializar entidades JPA en API.

## Backend — integración y arquitectura

- [ ] **F10-BE-01** Concretar los contratos de F10 en OpenAPI: DTO request/response, validación, rol, propiedad, paginación, errores e idempotencia, conservando endpoints fuente salvo decisión explícita.
- [ ] **F10-BE-02** Definir las interfaces `application/usecase/*UseCase` y sus implementaciones `application/service/*Service implements *UseCase` según la tabla de esta feature. Inyectar solo interfaces por constructor en controladores/filtros/worker. Service usa dominio y puertos; ninguna dependencia hacia Spring/JPA/HTTP/adaptadores concretos. Llamadas entre módulos mediante interfaces públicas, nunca clases Service ni repositorios JPA ajenos.
- [ ] **F10-BE-03** Integrar los casos de uso de las tareas de origen con transacciones, autorización por recurso y tratamiento de fallos. Donde aplique, notificación persistida junto al negocio y entrega externa posterior al commit.

### Interfaces de entrada e implementaciones

Esta tabla concreta la separación del ejemplo del usuario: cada nombre base origina una interfaz `<Nombre>UseCase` en `application/usecase/` y una clase `<Nombre>Service implements <Nombre>UseCase` en `application/service/`, dentro del módulo indicado. Son nombres previstos de contratos, no endpoints nuevos ni prueba de implementación. Conservar responsabilidades y dependencias de las tareas de origen; sus nombres de servicio agrupado se descomponen conforme a esta tabla.

| Módulo | Interfaz de entrada | Implementación |
|---|---|---|
| `confianza` | `CalificarServicioUseCase` | `CalificarServicioService` |
| `confianza` | `AgregarResenaUseCase` | `AgregarResenaService` |
| `confianza` | `ConsultarConfianzaPrestadorUseCase` | `ConsultarConfianzaPrestadorService` |
| `confianza` | `SolicitarVerificacionUseCase` | `SolicitarVerificacionService` |
| `confianza` | `ConsultarVerificacionPropiaUseCase` | `ConsultarVerificacionPropiaService` |
| `reportes` | `ReportarResenaUseCase` | `ReportarResenaService` |

Puertos de salida previstos: ArchivoStorageService, ConsultaServicioFinalizadoPort y contratos públicos de reputación/reportes. Los repositorios siguen siendo contratos en `domain/repository/`; los puertos externos/consultas requeridos por aplicación van en `application/port/`, con adaptadores de infraestructura. No crear un puerto adicional cuando ya exista un contrato público equivalente.

Controllers reciben UseCase por constructor y convierten Request/Response mediante mapper de presentación. Commands/Queries/Results de aplicación no contienen objetos HTTP o JPA. Excepciones de negocio en `domain/exception/`; wiring/transacciones en infraestructura/configuración. Ver [árbol completo y reglas](../04-estructura-y-casos-de-uso.md).

### Tareas existentes del plan fuente

Conservar el orden por fases y las dependencias `Txxx` del documento de origen; una referencia `SPEC-n/Txxx` se interpreta como `Fn-Txxx`. Las rutas de origen son relativas a `backend/`. Si una tarea habla de crear una tabla ya incluida en V1–V6, se verifica/reutiliza esa tabla en lugar de crearla de nuevo. Si hace referencia a entidades de notificación puntuales, adaptar al módulo y tabla unificados.

- [ ] **F10-T001** Crear paquetes `confianza/` y núcleo `reportes/`.
- [ ] **F10-T002** Migración Flyway: `calificaciones`, `resenas`, `reputaciones_prestador`, `solicitudes_verificacion`, `documentos_verificacion`, `reportes`.
- [ ] **F10-T003** Añadir constraints: `calificaciones.servicio_id UNIQUE` y unicidad parcial/equivalente para una verificación PENDIENTE por Prestador.
- [ ] **F10-T004** Crear `ReputacionService.recalcular(prestadorId)` a partir de calificaciones persistidas.
- [ ] **F10-T005** Integrar `ArchivoStorageService` para documentos de verificación con objetos privados y referencias persistidas, nunca archivos públicos.
- [ ] **F10-T006** Crear `ReporteService.crearReporteResena()` como primer uso del módulo compartido.
- [ ] **F10-T007** Extender el DTO público del Prestador de SPEC-05/03 con `reputacionAgregada` y `nivelVerificacion`, sin exponer documentos.
- [ ] **F10-T008** [P] [US1] Contract test `POST /servicios/{id}/calificacion`.
- [ ] **F10-T009** [P] [US1] Integration test: éxito, servicio no finalizado, cancelado, duplicado, servicio ajeno.
- [ ] **F10-T010** [P] [US1] Unit test de cálculo reproducible de reputación.
- [ ] **F10-T011** [P] [US1] Modelos `Calificacion`, `ReputacionPrestador`.
- [ ] **F10-T012** [US1] `CalificacionService.calificar()` valida actor, estado `FINALIZADO` y unicidad.
- [ ] **F10-T013** [US1] Ejecutar persistencia de `Calificacion` + `ReputacionService.recalcular()` en transacción consistente.
- [ ] **F10-T014** [US1] Endpoint de calificación.
- [ ] **F10-T015** [P] [US2] Contract test `POST /calificaciones/{id}/resena`.
- [ ] **F10-T016** [P] [US2] Integration test con/sin calificación previa y acceso ajeno.
- [ ] **F10-T017** [P] [US2] Modelo `Resena`.
- [ ] **F10-T018** [US2] `CalificacionService.agregarResena()` con relación 1:0..1.
- [ ] **F10-T019** [US2] Endpoint de reseña.
- [ ] **F10-T020** [P] [US3] Contract test `GET /prestadores/{id}/confianza`.
- [ ] **F10-T021** [US3] Implementar `ConfianzaController`.
- [ ] **F10-T022** [US3] Integrar confianza en el perfil público canónico de SPEC-05/03, con texto que no implique certificación legal.
- [ ] **F10-T023** [P] [US4] Contract tests de creación/consulta de solicitud.
- [ ] **F10-T024** [P] [US4] Integration test: solicitud válida, duplicada pendiente y nivel máximo.
- [ ] **F10-T025** [US4] Modelos `SolicitudVerificacion`, `DocumentoVerificacion`.
- [ ] **F10-T026** [US4] `VerificacionService.solicitar()` y carga segura de documentos.
- [ ] **F10-T027** [US4] Endpoints de verificación.
- [ ] **F10-T028** [P] [US5] Contract test `POST /resenas/{id}/reportes`.
- [ ] **F10-T029** [P] [US5] Integration test: reporte válido, reseña no disponible, reporte equivalente abierto.
- [ ] **F10-T030** [US5] Integrar `ReporteService.crearReporteResena()`.
- [ ] **F10-T031** [US5] Endpoint de reporte.

### Contratos API de origen

| Método | Endpoint | Request | Respuesta éxito | Errores |
|---|---|---|---|---|
| POST | `/api/v1/servicios/{servicioId}/calificacion` | `{ valor }` | `201 { id, reputacionActualizada }` | `403/404`; `409` no finalizado o ya calificado |
| POST | `/api/v1/calificaciones/{id}/resena` | `{ texto }` | `201 { id }` | `403/404`; `409` reseña ya existente |
| GET | `/api/v1/prestadores/{prestadorId}/confianza` | — | `200 { reputacion, cantidadCalificaciones, nivelVerificacion }` | `404` perfil no disponible |
| POST | `/api/v1/verificaciones` | multipart/documentos | `202 { id, estado: "PENDIENTE" }` | `409` solicitud pendiente o nivel máximo; `400` documento inválido |
| GET | `/api/v1/verificaciones/mia` | — | `200 { ... }` | `404` sin solicitud |
| POST | `/api/v1/resenas/{id}/reportes` | `{ motivo }` | `201 { reporteId }` | `404` reseña no disponible; `409` reporte equivalente abierto |

Todos los endpoints de escritura validan identidad y pertenencia; la consulta de confianza expone solo información pública aprobada.


## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F10-FE-01** Calificar una vez al finalizar servicio y agregar reseña a la calificación propia.
- [ ] **F10-FE-02** Mostrar reputación y nivel de verificación con explicación; sin presentar garantía o certificación legal.
- [ ] **F10-FE-03** Prestador carga documentos privados y consulta estado; impedir otra solicitud pendiente.
- [ ] **F10-FE-04** Reportar reseña con motivo y comprobante; administración recibe resultado en cola F12.
- [ ] **F10-FE-05** Integrar confianza en búsqueda/vista previa F03/F05 cuando el contrato quede disponible.

Aplicar [estados y contrato de cliente](../01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación

- [ ] **F10-QA-01** Un servicio sin finalizar o calificado rechaza otra calificación; carrera concurrente protegida por UNIQUE.
- [ ] **F10-QA-02** Recalcular/reconstruir reputación desde calificaciones, preservarla si moderación oculta una reseña.
- [ ] **F10-QA-03** Documentos accesibles solo por solicitante y administración autorizada; una verificación pendiente por prestador.
- [ ] **F10-QA-04** Reportes de reseña se almacenan en reportes, nunca en una tabla paralela.
- [ ] **F10-QA-05** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Requisitos y criterios de éxito de origen

Los identificadores FR/SC son locales al SPEC: deben referenciarse como SPEC-10/FR-xxx y SPEC-10/SC-xxx.

- **FR-059**: El sistema DEBE permitir que un Cliente califique un servicio propio únicamente cuando esté en estado "finalizado", y como máximo una vez por servicio. [UC059]
- **FR-060**: El sistema DEBE permitir agregar una reseña textual únicamente sobre una calificación ya existente del mismo Cliente. [UC060]
- **FR-061**: El sistema DEBE recalcular automáticamente la reputación agregada del Prestador cada vez que se registra una nueva calificación válida. [UC061]
- **FR-062**: El sistema DEBE mostrar el nivel de verificación vigente de un Prestador a cualquier Usuario que consulte su perfil. [UC062]
- **FR-063**: El sistema DEBE permitir que un Prestador solicite verificación documental ampliada, sin admitir una segunda solicitud mientras haya una pendiente. [UC063]
- **FR-064**: El sistema DEBE permitir que un Usuario reporte una reseña existente, registrando el reporte para su revisión posterior. [UC064]
- **SC-001**: El 100% de los servicios no finalizados o ya calificados rechaza intentos adicionales de calificación.
- **SC-002**: El 100% de las calificaciones nuevas produce un recálculo verificable de la reputación agregada del Prestador correspondiente.
- **SC-003**: Ningún nivel de verificación se presenta junto a lenguaje que sugiera una certificación legal.
- **SC-004**: El 100% de los reportes de reseña queda disponible en la cola de moderación (SPEC-12) inmediatamente después de registrarse.
