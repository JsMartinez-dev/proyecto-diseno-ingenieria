# F13 — Ruta y progreso orientativo de formalización

**Alcance:** MVP. **Estado:** planificado, sin implementación.
**Dependencias:** 01 05. **Decisiones relacionadas:** D-13 (ver [registro](../03-decisiones-y-dependencias.md)).

## Resultado esperado

Ruta, pasos, enlaces oficiales y progreso orientativo; vinculación institucional Future apagada.

## Fuentes y trazabilidad

- [SPEC original](../fuentes/specs/spec-13-ruta-formalizacion.md): historias, escenarios, requisitos y criterios de éxito.
- [Plan de origen](../fuentes/planes/plan-spec-13-ruta-formalizacion.md): fases, tareas y dependencias detalladas.
- [Manual de datos](../fuentes/manual-base-de-datos-aliado.md), [modelo PDF](../fuentes/modelo-logico-ALIADO.pdf) y [reglas transversales](../01-arquitectura-y-stack.md).

Los IDs `F13-Txxx` conservan el identificador Txxx de origen, ahora con prefijo para evitar colisiones entre SPEC. No implican que el trabajo ya exista. Las tareas adicionales DB/BE/FE/QA desglosan integración y clientes, sin reemplazar requisitos. Las correcciones explícitas de 03 prevalecen sobre notas antiguas del plan fuente; no implementar tablas puntuales de notificaciones ni JWT por copiar una referencia.

## Historias cubiertas

- User Story 1 - Consultar ruta de formalización [UC077] (Priority: P1)
- User Story 2 - Abrir enlaces oficiales de formalización [UC078] (Priority: P2)
- User Story 3 - Mostrar progreso sin declarar estatus legal [UC079] (Priority: P1)
- User Story 4 - Vincular ruta institucional futura  [UC080] (Priority: P3)

## Base de datos

- [ ] **F13-DB-01** Implementar o verificar V6: `rutas_formalizacion`, `pasos_formalizacion`, `enlaces_institucionales`, `progreso_formalizacion`. Aplicar columnas, PK/FK, nulabilidad y CHECK del manual; las tablas compartidas se crean una sola vez.
- [ ] **F13-DB-02** Agregar/verificar restricciones e índices de esta feature según 02-base-de-datos.md; probar integridad con PostgreSQL 16 y Flyway, incluyendo inserciones inválidas y concurrencia.
- [ ] **F13-DB-03** Implementar modelos de dominio independientes, puertos, entidades JPA, repositorios Spring Data, mappers y adaptadores; no serializar entidades JPA en API.

## Backend — integración y arquitectura

- [ ] **F13-BE-01** Concretar los contratos de F13 en OpenAPI: DTO request/response, validación, rol, propiedad, paginación, errores e idempotencia, conservando endpoints fuente salvo decisión explícita.
- [ ] **F13-BE-02** Definir las interfaces `application/usecase/*UseCase` y sus implementaciones `application/service/*Service implements *UseCase` según la tabla de esta feature. Inyectar solo interfaces por constructor en controladores/filtros/worker. Service usa dominio y puertos; ninguna dependencia hacia Spring/JPA/HTTP/adaptadores concretos. Llamadas entre módulos mediante interfaces públicas, nunca clases Service ni repositorios JPA ajenos.
- [ ] **F13-BE-03** Integrar los casos de uso de las tareas de origen con transacciones, autorización por recurso y tratamiento de fallos. Donde aplique, notificación persistida junto al negocio y entrega externa posterior al commit.
- [ ] **F13-BE-04** Mantener vinculación institucional UC080 aislada y apagada; el MVP no crea adaptador institucional real ni certifica trámites.

### Interfaces de entrada e implementaciones

Esta tabla concreta la separación del ejemplo del usuario: cada nombre base origina una interfaz `<Nombre>UseCase` en `application/usecase/` y una clase `<Nombre>Service implements <Nombre>UseCase` en `application/service/`, dentro del módulo indicado. Son nombres previstos de contratos, no endpoints nuevos ni prueba de implementación. Conservar responsabilidades y dependencias de las tareas de origen; sus nombres de servicio agrupado se descomponen conforme a esta tabla.

| Módulo | Interfaz de entrada | Implementación |
|---|---|---|
| `formalizacion` | `ConsultarRutaFormalizacionUseCase` | `ConsultarRutaFormalizacionService` |
| `formalizacion` | `ConsultarEnlaceInstitucionalUseCase` | `ConsultarEnlaceInstitucionalService` |
| `formalizacion` | `ConsultarProgresoFormalizacionUseCase` | `ConsultarProgresoFormalizacionService` |
| `formalizacion` | `ActualizarProgresoFormalizacionUseCase` | `ActualizarProgresoFormalizacionService` |
| `formalizacion` | `ConsultarVinculacionInstitucionalUseCase` | `ConsultarVinculacionInstitucionalService` |

Puertos de salida previstos: repositorios de dominio para ruta/progreso; puerto institucional únicamente si se aprueba UC080. Los repositorios siguen siendo contratos en `domain/repository/`; los puertos externos/consultas requeridos por aplicación van en `application/port/`, con adaptadores de infraestructura. No crear un puerto adicional cuando ya exista un contrato público equivalente.

Controllers reciben UseCase por constructor y convierten Request/Response mediante mapper de presentación. Commands/Queries/Results de aplicación no contienen objetos HTTP o JPA. Excepciones de negocio en `domain/exception/`; wiring/transacciones en infraestructura/configuración. Ver [árbol completo y reglas](../04-estructura-y-casos-de-uso.md).

`ConsultarVinculacionInstitucionalUseCase` corresponde a UC080 y permanece Future OFF.

### Tareas existentes del plan fuente

Conservar el orden por fases y las dependencias `Txxx` del documento de origen; una referencia `SPEC-n/Txxx` se interpreta como `Fn-Txxx`. Las rutas de origen son relativas a `backend/`. Si una tarea habla de crear una tabla ya incluida en V1–V6, se verifica/reutiliza esa tabla en lugar de crearla de nuevo. Si hace referencia a entidades de notificación puntuales, adaptar al módulo y tabla unificados.

- [ ] **F13-T001** Crear módulo `formalizacion/`.
- [ ] **F13-T002** Migraciones de ruta, pasos, enlaces, progreso y configuración de vinculación futura.
- [ ] **F13-T003** Seed inicial de la ruta solo con contenido aprobado por el proyecto.
- [ ] **F13-T004** Centralizar texto/flag `progresoOrientativoNoCertificante`.
- [ ] **F13-T005** Feature flag `formalizacion.integracion-institucional.enabled=false`.
- [ ] **F13-T006** Validación de URLs externas configuradas sin asumir que su contenido fue completado.
- [ ] **F13-T007** Contract/integration tests.
- [ ] **F13-T008** `RutaFormalizacionService`.
- [ ] **F13-T009** Endpoint `GET /formalizacion/ruta`.
- [ ] **F13-T010** Tests de enlace disponible/no disponible.
- [ ] **F13-T011** `EnlaceInstitucional` + servicio de consulta.
- [ ] **F13-T012** Endpoint de metadata/redirección segura.
- [ ] **F13-T013** Tests para avance parcial y máximo.
- [ ] **F13-T014** `ProgresoFormalizacionService`.
- [ ] **F13-T015** Endpoints de consulta/actualización.
- [ ] **F13-T016** Verificar disclaimer incluso al 100%.
- [ ] **F13-T017** Test: feature deshabilitada por defecto.
- [ ] **F13-T018** Adaptador/interfaz `FuenteInstitucionalFormalizacion`.
- [ ] **F13-T019** Implementación simulada únicamente para entorno de prueba.
- [ ] **F13-T020** Asegurar que ninguna respuesta externa cambia automáticamente el estatus legal del Prestador.

### Contratos API de origen

| Método | Endpoint | Respuesta |
|---|---|---|
| GET | `/api/v1/formalizacion/ruta` | ruta, pasos, recursos, disclaimer |
| GET | `/api/v1/formalizacion/enlaces/{id}` | metadata del enlace/destino externo |
| GET | `/api/v1/formalizacion/progreso` | progreso orientativo + disclaimer |
| PUT | `/api/v1/formalizacion/progreso` | actualiza avance orientativo permitido |
| GET | `/api/v1/formalizacion/vinculacion` | solo si feature Future habilitada |


## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F13-FE-01** Ruta del Prestador con pasos, recursos y aviso visible de carácter orientativo.
- [ ] **F13-FE-02** Abrir enlaces institucionales como destinos externos, informar URL no disponible sin alterar progreso.
- [ ] **F13-FE-03** Consultar/actualizar avance autorizado conforme fórmula y fuente acordadas.
- [ ] **F13-FE-04** Mostrar el mismo aviso al llegar a 100%; no afirmar certificación ni habilitar vínculo Future.

Aplicar [estados y contrato de cliente](../01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación

- [ ] **F13-QA-01** Usuario solo actualiza su progreso; validar rango y unicidad prestador/ruta.
- [ ] **F13-QA-02** Mismo contenido/configuración alimenta todos los clientes; no inferir trámites completados por abrir enlaces.
- [ ] **F13-QA-03** Flag institucional OFF no afecta consulta de ruta/progreso.
- [ ] **F13-QA-04** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Requisitos y criterios de éxito de origen

Los identificadores FR/SC son locales al SPEC: deben referenciarse como SPEC-13/FR-xxx y SPEC-13/SC-xxx.

- **FR-077**: El sistema DEBE proporcionar a los Prestadores una ruta orientativa de formalización, identificada explícitamente como informativa. [UC077]
- **FR-078**: El sistema DEBE permitir abrir enlaces oficiales de formalización configurados, identificándolos claramente como destinos externos. [UC078]
- **FR-079**: El sistema DEBE presentar el progreso de formalización como orientativo y NO DEBE declarar, certificar ni inferir automáticamente un estatus legal a partir de dicho progreso, sin importar su nivel de avance. [UC079]
- **FR-080**: El sistema PUEDE admitir en el futuro una vinculación con rutas institucionales externas, la cual DEBE permanecer deshabilitada sin afectar el funcionamiento de UC077–UC079 mientras no sea aprobada explícitamente. [UC080]
- **SC-001**: El 100% de las vistas de progreso de formalización muestra explícitamente que el avance es orientativo y no una declaración de estatus legal.
- **SC-002**: El 100% de los enlaces identificados como oficiales dirige al destino institucional configurado y se distingue como externo.
- **SC-003**: La desactivación de la capacidad de vinculación institucional futura (UC080) no impide completar ningún flujo de UC077–UC079.
