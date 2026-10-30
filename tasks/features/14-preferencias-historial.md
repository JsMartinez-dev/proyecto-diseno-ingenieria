# F14 — Preferencias, historial, exportación, indicadores y actividad

**Alcance:** MVP. **Estado:** planificado, sin implementación.
**Dependencias:** 01 08 09 10. **Decisiones relacionadas:** D-08 D-15 (ver [registro](../03-decisiones-y-dependencias.md)).

## Resultado esperado

Preferencias configurables, historial propio/exportación, métricas propias y actividad cronológica.

## Fuentes y trazabilidad

- [SPEC original](../fuentes/specs/spec-14-preferencias-historial-indicadores.md): historias, escenarios, requisitos y criterios de éxito.
- [Plan de origen](../fuentes/planes/plan-spec-14-preferencias-historial-indicadores.md): fases, tareas y dependencias detalladas.
- [Manual de datos](../fuentes/manual-base-de-datos-aliado.md), [modelo PDF](../fuentes/modelo-logico-ALIADO.pdf) y [reglas transversales](../01-arquitectura-y-stack.md).

Los IDs `F14-Txxx` conservan el identificador Txxx de origen, ahora con prefijo para evitar colisiones entre SPEC. No implican que el trabajo ya exista. Las tareas adicionales DB/BE/FE/QA desglosan integración y clientes, sin reemplazar requisitos. Las correcciones explícitas de 03 prevalecen sobre notas antiguas del plan fuente; no implementar tablas puntuales de notificaciones ni JWT por copiar una referencia.

## Historias cubiertas

- User Story 1 - Configurar preferencias de notificación [UC081] (Priority: P1)
- User Story 2 - Consultar historial de trabajos [UC082] (Priority: P1)
- User Story 3 - Descargar historial [UC083 ] (Priority: P2)
- User Story 4 - Consultar indicadores básicos del prestador [UC084] (Priority: P1)
- User Story 5 - Consultar actividad reciente [UC085] (Priority: P2)

## Base de datos

- [ ] **F14-DB-01** Implementar o verificar V6: `preferencias_notificacion`, `descargas_historial`. Aplicar columnas, PK/FK, nulabilidad y CHECK del manual; las tablas compartidas se crean una sola vez.
- [ ] **F14-DB-02** Agregar/verificar restricciones e índices de esta feature según 02-base-de-datos.md; probar integridad con PostgreSQL 16 y Flyway, incluyendo inserciones inválidas y concurrencia.
- [ ] **F14-DB-03** Implementar modelos de dominio independientes, puertos, entidades JPA, repositorios Spring Data, mappers y adaptadores; no serializar entidades JPA en API.

## Backend — integración y arquitectura

- [ ] **F14-BE-01** Concretar los contratos de F14 en OpenAPI: DTO request/response, validación, rol, propiedad, paginación, errores e idempotencia, conservando endpoints fuente salvo decisión explícita.
- [ ] **F14-BE-02** Definir las interfaces `application/usecase/*UseCase` y sus implementaciones `application/service/*Service implements *UseCase` según la tabla de esta feature. Inyectar solo interfaces por constructor en controladores/filtros/worker. Service usa dominio y puertos; ninguna dependencia hacia Spring/JPA/HTTP/adaptadores concretos. Llamadas entre módulos mediante interfaces públicas, nunca clases Service ni repositorios JPA ajenos.
- [ ] **F14-BE-03** Integrar los casos de uso de las tareas de origen con transacciones, autorización por recurso y tratamiento de fallos. Donde aplique, notificación persistida junto al negocio y entrega externa posterior al commit.

### Interfaces de entrada e implementaciones

Esta tabla concreta la separación del ejemplo del usuario: cada nombre base origina una interfaz `<Nombre>UseCase` en `application/usecase/` y una clase `<Nombre>Service implements <Nombre>UseCase` en `application/service/`, dentro del módulo indicado. Son nombres previstos de contratos, no endpoints nuevos ni prueba de implementación. Conservar responsabilidades y dependencias de las tareas de origen; sus nombres de servicio agrupado se descomponen conforme a esta tabla.

| Módulo | Interfaz de entrada | Implementación |
|---|---|---|
| `preferencias` | `ConsultarPreferenciasNotificacionUseCase` | `ConsultarPreferenciasNotificacionService` |
| `preferencias` | `ActualizarPreferenciasNotificacionUseCase` | `ActualizarPreferenciasNotificacionService` |
| `historial` | `ConsultarHistorialTrabajosUseCase` | `ConsultarHistorialTrabajosService` |
| `historial` | `ExportarHistorialTrabajosUseCase` | `ExportarHistorialTrabajosService` |
| `indicadores` | `ConsultarIndicadoresPrestadorUseCase` | `ConsultarIndicadoresPrestadorService` |
| `actividad` | `ConsultarActividadRecienteUseCase` | `ConsultarActividadRecienteService` |

Puertos de salida previstos: consultas públicas de servicios/confianza/eventos y ArchivoStorageService para exportación; ConsultaPreferenciasPort se consume desde notificaciones. Los repositorios siguen siendo contratos en `domain/repository/`; los puertos externos/consultas requeridos por aplicación van en `application/port/`, con adaptadores de infraestructura. No crear un puerto adicional cuando ya exista un contrato público equivalente.

Controllers reciben UseCase por constructor y convierten Request/Response mediante mapper de presentación. Commands/Queries/Results de aplicación no contienen objetos HTTP o JPA. Excepciones de negocio en `domain/exception/`; wiring/transacciones en infraestructura/configuración. Ver [árbol completo y reglas](../04-estructura-y-casos-de-uso.md).

### Tareas existentes del plan fuente

Conservar el orden por fases y las dependencias `Txxx` del documento de origen; una referencia `SPEC-n/Txxx` se interpreta como `Fn-Txxx`. Las rutas de origen son relativas a `backend/`. Si una tarea habla de crear una tabla ya incluida en V1–V6, se verifica/reutiliza esa tabla en lugar de crearla de nuevo. Si hace referencia a entidades de notificación puntuales, adaptar al módulo y tabla unificados.

- [ ] **F14-T001** Crear módulos de lectura/configuración.
- [ ] **F14-T002** Migración `preferencias_notificacion`; `descargas_historial` solo si se requiere persistir metadata.
- [ ] **F14-T003** Añadir catálogo de tipos/canales configurables y obligatorios.
- [ ] **F14-T004** Integrar `NotificacionService` con `PreferenciaNotificacionService`.
- [ ] **F14-T005** Definir consulta autorizada común de servicios propios.
- [ ] **F14-T006** Definir estrategia de paginación y orden estable.
- [ ] **F14-T007** `[NEEDS CLARIFICATION]` fijar fórmulas/códigos de indicadores antes de implementación de US4.
- [ ] **F14-T008** Tests de preferencia configurable y obligatoria.
- [ ] **F14-T009** Implementar modelo/repositorio/servicio.
- [ ] **F14-T010** Endpoints.
- [ ] **F14-T011** Integrar evaluación de preferencia antes de entrega de notificación.
- [ ] **F14-T012** Tests con Cliente, Prestador y usuario sin historial.
- [ ] **F14-T013** `HistorialService` sobre `ServicioContratado`.
- [ ] **F14-T014** Endpoint paginado.
- [ ] **F14-T015** Tests de contenido equivalente y reintento.
- [ ] **F14-T016** `ExportacionHistorialService` genera desde la misma consulta de US2.
- [ ] **F14-T017** Endpoint de exportación.
- [ ] **F14-T018** Garantizar que el reintento no modifica historial.
- [ ] **F14-T019** Tests con dataset conocido.
- [ ] **F14-T020** Definir versión de fórmula.
- [ ] **F14-T021** `IndicadorService` sobre servicios/calificaciones propios.
- [ ] **F14-T022** Endpoint.
- [ ] **F14-T023** Incluir servicios cancelados o en moderación conforme al escenario explícito del SPEC; documentar fórmula.
- [ ] **F14-T024** Tests de visibilidad y orden.
- [ ] **F14-T025** `ActividadRecienteService` como read model de eventos existentes.
- [ ] **F14-T026** Endpoint paginado/limitado.

### Contratos API de origen

| Método | Endpoint | Uso |
|---|---|---|
| GET/PUT | `/api/v1/preferencias/notificaciones` | consultar/modificar preferencias |
| GET | `/api/v1/historial?pagina=&tamano=` | servicios propios |
| POST | `/api/v1/historial/exportaciones` | generar descarga |
| GET | `/api/v1/prestadores/mis-indicadores` | métricas propias |
| GET | `/api/v1/actividad-reciente` | eventos visibles propios |


## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F14-FE-01** Preferencias por tipo/canal mostrando cuáles son obligatorias y no editables.
- [ ] **F14-FE-02** Historial Cliente/Prestador con paginación/filtros; descarga usa los mismos filtros y datos autorizados.
- [ ] **F14-FE-03** Indicadores del Prestador con fórmula explicada y rango temporal; no mezclar actividad de terceros.
- [ ] **F14-FE-04** Actividad reciente ordenada y enlaces autorizados; mostrar fallo/vencimiento de descarga sin generar archivos públicos.

Aplicar [estados y contrato de cliente](../01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación

- [ ] **F14-QA-01** Exportación coincide con consulta bajo misma versión/snapshot/filtros; nunca añade campos privados.
- [ ] **F14-QA-02** Preferencias no desactivan avisos obligatorios; conectar worker F09 sin ciclo entre módulos.
- [ ] **F14-QA-03** Dataset con servicios cancelados/en moderación conserva inclusión indicada por UC084.
- [ ] **F14-QA-04** Historial/indicadores/actividad se derivan de fuentes existentes, sin tablas duplicadas.
- [ ] **F14-QA-05** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Requisitos y criterios de éxito de origen

Los identificadores FR/SC son locales al SPEC: deben referenciarse como SPEC-14/FR-xxx y SPEC-14/SC-xxx.

- **FR-081**: El sistema DEBE permitir que los Usuarios configuren sus preferencias de notificación para los tipos y canales marcados como configurables, sin permitir desactivar los obligatorios. [UC081]
- **FR-082**: El sistema DEBE permitir que los Usuarios consulten únicamente el historial de servicios en los que estén autorizados como participantes. [UC082]
- **FR-083**: El sistema DEBE permitir que los Usuarios descarguen su historial autorizado, garantizando que el contenido descargado coincida con el historial consultable. [UC083]
- **FR-084**: El sistema DEBE permitir que los Prestadores consulten indicadores básicos definidos por el producto, calculados exclusivamente sobre su propia actividad. [UC084]
- **FR-085**: El sistema DEBE permitir que los Usuarios consulten su actividad reciente autorizada, en orden cronológico. [UC085]
- **SC-001**: El 100% de las consultas y descargas de historial está limitado a servicios autorizados para el usuario solicitante.
- **SC-002**: Los indicadores básicos producen resultados reproducibles para el 100% de los conjuntos de datos de prueba definidos, una vez resuelta la política de inclusión/exclusión de la Historia 4.
- **SC-003**: Los eventos de notificación configurables respetan las preferencias activas del usuario en el 100% de los casos de prueba.
- **SC-004**: El contenido de toda descarga de historial coincide exactamente con el historial consultable en pantalla para la misma cuenta, en el 100% de los casos.
