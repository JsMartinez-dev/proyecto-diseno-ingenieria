# F11 — Reportes de cuentas/servicios y evidencias

**Alcance:** MVP. **Estado:** planificado, sin implementación.
**Dependencias:** 01 04 08 10. **Decisiones relacionadas:** D-07 D-12 (ver [registro](../03-decisiones-y-dependencias.md)).

## Resultado esperado

Ampliar núcleo reportes para cuenta/servicio/reseña, consulta propia y adjuntos posteriores.

## Fuentes y trazabilidad

- [SPEC original](../fuentes/specs/spec-11-reportes-evidencias.md): historias, escenarios, requisitos y criterios de éxito.
- [Plan de origen](../fuentes/planes/plan-spec-11-reportes-evidencias.md): fases, tareas y dependencias detalladas.
- [Manual de datos](../fuentes/manual-base-de-datos-aliado.md), [modelo PDF](../fuentes/modelo-logico-ALIADO.pdf) y [reglas transversales](../01-arquitectura-y-stack.md).

Los IDs `F11-Txxx` conservan el identificador Txxx de origen, ahora con prefijo para evitar colisiones entre SPEC. No implican que el trabajo ya exista. Las tareas adicionales DB/BE/FE/QA desglosan integración y clientes, sin reemplazar requisitos. Las correcciones explícitas de 03 prevalecen sobre notas antiguas del plan fuente; no implementar tablas puntuales de notificaciones ni JWT por copiar una referencia.

## Historias cubiertas

- User Story 1 - Reportar usuario [UC065] (Priority: P1)
- User Story 2 - Reportar servicio [UC066] (Priority: P1)
- User Story 3 - Adjuntar evidencia a un reporte [UC067] (Priority: P2)

## Base de datos

- [ ] **F11-DB-01** Implementar o verificar V4 compartida: `reportes`, `evidencias_reporte`. Aplicar columnas, PK/FK, nulabilidad y CHECK del manual; las tablas compartidas se crean una sola vez.
- [ ] **F11-DB-02** Agregar/verificar restricciones e índices de esta feature según 02-base-de-datos.md; probar integridad con PostgreSQL 16 y Flyway, incluyendo inserciones inválidas y concurrencia.
- [ ] **F11-DB-03** Implementar modelos de dominio independientes, puertos, entidades JPA, repositorios Spring Data, mappers y adaptadores; no serializar entidades JPA en API.

## Backend — integración y arquitectura

- [ ] **F11-BE-01** Concretar los contratos de F11 en OpenAPI: DTO request/response, validación, rol, propiedad, paginación, errores e idempotencia, conservando endpoints fuente salvo decisión explícita.
- [ ] **F11-BE-02** Definir las interfaces `application/usecase/*UseCase` y sus implementaciones `application/service/*Service implements *UseCase` según la tabla de esta feature. Inyectar solo interfaces por constructor en controladores/filtros/worker. Service usa dominio y puertos; ninguna dependencia hacia Spring/JPA/HTTP/adaptadores concretos. Llamadas entre módulos mediante interfaces públicas, nunca clases Service ni repositorios JPA ajenos.
- [ ] **F11-BE-03** Integrar los casos de uso de las tareas de origen con transacciones, autorización por recurso y tratamiento de fallos. Donde aplique, notificación persistida junto al negocio y entrega externa posterior al commit.

### Interfaces de entrada e implementaciones

Esta tabla concreta la separación del ejemplo del usuario: cada nombre base origina una interfaz `<Nombre>UseCase` en `application/usecase/` y una clase `<Nombre>Service implements <Nombre>UseCase` en `application/service/`, dentro del módulo indicado. Son nombres previstos de contratos, no endpoints nuevos ni prueba de implementación. Conservar responsabilidades y dependencias de las tareas de origen; sus nombres de servicio agrupado se descomponen conforme a esta tabla.

| Módulo | Interfaz de entrada | Implementación |
|---|---|---|
| `reportes` | `ReportarUsuarioUseCase` | `ReportarUsuarioService` |
| `reportes` | `ReportarServicioUseCase` | `ReportarServicioService` |
| `reportes` | `AdjuntarEvidenciaReporteUseCase` | `AdjuntarEvidenciaReporteService` |
| `reportes` | `ConsultarReportePropioUseCase` | `ConsultarReportePropioService` |

Puertos de salida previstos: ArchivoStorageService y consultas autorizadas de cuenta/servicio/reseña. Los repositorios siguen siendo contratos en `domain/repository/`; los puertos externos/consultas requeridos por aplicación van en `application/port/`, con adaptadores de infraestructura. No crear un puerto adicional cuando ya exista un contrato público equivalente.

Controllers reciben UseCase por constructor y convierten Request/Response mediante mapper de presentación. Commands/Queries/Results de aplicación no contienen objetos HTTP o JPA. Excepciones de negocio en `domain/exception/`; wiring/transacciones en infraestructura/configuración. Ver [árbol completo y reglas](../04-estructura-y-casos-de-uso.md).

### Tareas existentes del plan fuente

Conservar el orden por fases y las dependencias `Txxx` del documento de origen; una referencia `SPEC-n/Txxx` se interpreta como `Fn-Txxx`. Las rutas de origen son relativas a `backend/`. Si una tarea habla de crear una tabla ya incluida en V1–V6, se verifica/reutiliza esa tabla en lugar de crearla de nuevo. Si hace referencia a entidades de notificación puntuales, adaptar al módulo y tabla unificados.

- [ ] **F11-T001** Extender enum/tipo de `Reporte` con USUARIO y SERVICIO.
- [ ] **F11-T002** Migración Flyway: `evidencias_reporte` e índices de búsqueda por estado/tipo/objetivo.
- [ ] **F11-T003** Añadir mecanismo de unicidad/consolidación para reporte equivalente abierto.
- [ ] **F11-T004** `ReporteService` expone operaciones genéricas de creación y consulta.
- [ ] **F11-T005** `EvidenciaReporteService` integra `ArchivoStorageService`, validación MIME/tamaño y autorización.
- [ ] **F11-T006** Definir estado `PENDIENTE` como estado inicial consumible por SPEC-12.
- [ ] **F11-T007** [P] [US1] Contract test `POST /usuarios/{id}/reportes`.
- [ ] **F11-T008** [P] [US1] Integration test: éxito, motivo ausente, objetivo inexistente, reporte equivalente.
- [ ] **F11-T009** [US1] Implementar `ReporteService.reportarUsuario()`.
- [ ] **F11-T010** [US1] Endpoint correspondiente.
- [ ] **F11-T011** [P] [US2] Contract test `POST /servicios/{id}/reportes`.
- [ ] **F11-T012** [P] [US2] Integration test: participante válido y actor ajeno.
- [ ] **F11-T013** [US2] Implementar `ReporteService.reportarServicio()`.
- [ ] **F11-T014** [US2] Endpoint correspondiente.
- [ ] **F11-T015** [P] [US3] Contract test de upload.
- [ ] **F11-T016** [P] [US3] Integration test: evidencia válida, sin reporte previo, tipo/tamaño inválido, reporte resuelto concurrentemente.
- [ ] **F11-T017** [US3] Modelo/repositorio `EvidenciaReporte`.
- [ ] **F11-T018** [US3] Implementar carga con storage privado.
- [ ] **F11-T019** [US3] Endpoint de evidencia.
- [ ] **F11-T020** [US3] Consulta de reporte propio con evidencias.

### Contratos API de origen

| Método | Endpoint | Request | Respuesta | Errores |
|---|---|---|---|---|
| POST | `/api/v1/usuarios/{id}/reportes` | `{ motivo }` | `201 { reporteId }` | `400` motivo vacío; `404` objetivo no existe; `409` equivalente abierto |
| POST | `/api/v1/servicios/{id}/reportes` | `{ motivo }` | `201 { reporteId }` | `403/404` actor no participante; `409` equivalente abierto |
| POST | `/api/v1/reportes/{id}/evidencias` | multipart archivo | `201 { evidenciaId }` | `403/404`; `409` reporte cerrado; `413/415` archivo inválido |
| GET | `/api/v1/reportes/mios/{id}` | — | `200 { reporte, evidencias[] }` | `403/404` |


## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F11-FE-01** Formularios contextuales para reportar cuenta o servicio con motivo obligatorio.
- [ ] **F11-FE-02** Carga de evidencia solo después de recibir reporteId; permitir reintentar carga sin recrear reporte.
- [ ] **F11-FE-03** Detalle propio y estado; distinguir carga fallida de reporte creado para no perder trazabilidad.
- [ ] **F11-FE-04** Mantener contenido y evidencia anteriores al consolidar reporte equivalente abierto.

Aplicar [estados y contrato de cliente](../01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación

- [ ] **F11-QA-01** CHECK de un objetivo compatible con tipo, FK de evidencia y política de consolidación concurrente.
- [ ] **F11-QA-02** Usuario ajeno no accede a reporte/evidencia ni reporta un servicio no autorizado por contrato.
- [ ] **F11-QA-03** Fallo storage o metadatos no deja evidencia publicada huérfana; URL firmada expira.
- [ ] **F11-QA-04** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Requisitos y criterios de éxito de origen

Los identificadores FR/SC son locales al SPEC: deben referenciarse como SPEC-11/FR-xxx y SPEC-11/SC-xxx.

- **FR-065**: El sistema DEBE permitir que un Usuario reporte a otra cuenta indicando un motivo obligatorio, dejando el reporte disponible para moderación. [UC065]
- **FR-066**: El sistema DEBE permitir que un Usuario reporte un servicio específico indicando un motivo obligatorio, dejando el reporte disponible para moderación. [UC066]
- **FR-067**: El sistema DEBE permitir adjuntar evidencia únicamente a un reporte ya existente, sin importar si el reporte es de usuario, de servicio o de reseña (SPEC-10, UC064). [UC067]
- **SC-001**: El 100% de los reportes de usuario y de servicio queda disponible en la cola de moderación (SPEC-12) inmediatamente después de registrarse.
- **SC-002**: Ningún reporte se crea sin un motivo indicado.
- **SC-003**: El 100% de las evidencias adjuntadas queda asociada a un reporte válido y preexistente; ninguna evidencia queda huérfana.
