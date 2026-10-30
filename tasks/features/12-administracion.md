# F12 — Administración, moderación, riesgo y auditoría

**Alcance:** MVP. **Estado:** planificado, sin implementación.
**Dependencias:** 01 04 05 10 11. **Decisiones relacionadas:** D-02 D-11 D-12 (ver [registro](../03-decisiones-y-dependencias.md)).

## Resultado esperado

Panel administrativo para catálogos, reportes, revisión, resolución, bloqueos, moderación, búsqueda y riesgo.

## Fuentes y trazabilidad

- [SPEC original](../fuentes/specs/spec-12-administracion-moderacion-riesgos.md): historias, escenarios, requisitos y criterios de éxito.
- [Plan de origen](../fuentes/planes/plan-spec-12-administracion-moderacion-riesgos.md): fases, tareas y dependencias detalladas.
- [Manual de datos](../fuentes/manual-base-de-datos-aliado.md), [modelo PDF](../fuentes/modelo-logico-ALIADO.pdf) y [reglas transversales](../01-arquitectura-y-stack.md).

Los IDs `F12-Txxx` conservan el identificador Txxx de origen, ahora con prefijo para evitar colisiones entre SPEC. No implican que el trabajo ya exista. Las tareas adicionales DB/BE/FE/QA desglosan integración y clientes, sin reemplazar requisitos. Las correcciones explícitas de 03 prevalecen sobre notas antiguas del plan fuente; no implementar tablas puntuales de notificaciones ni JWT por copiar una referencia.

## Historias cubiertas

- User Story 1 - Administrar categorías de servicios [UC068] (Priority: P1)
- User Story 2 - Administrar zonas [UC069] (Priority: P1)
- User Story 3 - Gestionar reportes: cola, revisión y resolución [UC070, UC071, UC072] (Priority: P1)
- User Story 4 - Bloquear preventivamente una cuenta [UC073] (Priority: P1)
- User Story 5 - Moderar perfil o contenido [UC074] (Priority: P1)
- User Story 6 - Buscar usuarios y perfiles [UC075] (Priority: P2)
- User Story 7 - Gestionar servicios de alto riesgo [UC076] (Priority: P1)

## Base de datos

- [ ] **F12-DB-01** Implementar o verificar V5: `bloqueos_preventivos`, `acciones_moderacion`, `marcas_alto_riesgo`, `auditoria_administrativa`. Aplicar columnas, PK/FK, nulabilidad y CHECK del manual; las tablas compartidas se crean una sola vez.
- [ ] **F12-DB-02** Agregar/verificar restricciones e índices de esta feature según 02-base-de-datos.md; probar integridad con PostgreSQL 16 y Flyway, incluyendo inserciones inválidas y concurrencia.
- [ ] **F12-DB-03** Implementar modelos de dominio independientes, puertos, entidades JPA, repositorios Spring Data, mappers y adaptadores; no serializar entidades JPA en API.

## Backend — integración y arquitectura

- [ ] **F12-BE-01** Concretar los contratos de F12 en OpenAPI: DTO request/response, validación, rol, propiedad, paginación, errores e idempotencia, conservando endpoints fuente salvo decisión explícita.
- [ ] **F12-BE-02** Definir las interfaces `application/usecase/*UseCase` y sus implementaciones `application/service/*Service implements *UseCase` según la tabla de esta feature. Inyectar solo interfaces por constructor en controladores/filtros/worker. Service usa dominio y puertos; ninguna dependencia hacia Spring/JPA/HTTP/adaptadores concretos. Llamadas entre módulos mediante interfaces públicas, nunca clases Service ni repositorios JPA ajenos.
- [ ] **F12-BE-03** Integrar los casos de uso de las tareas de origen con transacciones, autorización por recurso y tratamiento de fallos. Donde aplique, notificación persistida junto al negocio y entrega externa posterior al commit.
- [ ] **F12-BE-04** Diseñar contrato administrativo de verificación de F10 y su justificación/auditoría (D-11) antes de implementar revisión; la tabla actual no documenta todos esos campos.

### Interfaces de entrada e implementaciones

Esta tabla concreta la separación del ejemplo del usuario: cada nombre base origina una interfaz `<Nombre>UseCase` en `application/usecase/` y una clase `<Nombre>Service implements <Nombre>UseCase` en `application/service/`, dentro del módulo indicado. Son nombres previstos de contratos, no endpoints nuevos ni prueba de implementación. Conservar responsabilidades y dependencias de las tareas de origen; sus nombres de servicio agrupado se descomponen conforme a esta tabla.

| Módulo | Interfaz de entrada | Implementación |
|---|---|---|
| `administracion` | `CrearCategoriaUseCase` | `CrearCategoriaService` |
| `administracion` | `EditarCategoriaUseCase` | `EditarCategoriaService` |
| `administracion` | `DesactivarCategoriaUseCase` | `DesactivarCategoriaService` |
| `administracion` | `CrearZonaUseCase` | `CrearZonaService` |
| `administracion` | `EditarZonaUseCase` | `EditarZonaService` |
| `administracion` | `DesactivarZonaUseCase` | `DesactivarZonaService` |
| `administracion` | `ConsultarColaReportesUseCase` | `ConsultarColaReportesService` |
| `administracion` | `RevisarReporteUseCase` | `RevisarReporteService` |
| `administracion` | `ResolverReporteUseCase` | `ResolverReporteService` |
| `administracion` | `BloquearCuentaUseCase` | `BloquearCuentaService` |
| `administracion` | `LevantarBloqueoUseCase` | `LevantarBloqueoService` |
| `administracion` | `ModerarContenidoUseCase` | `ModerarContenidoService` |
| `administracion` | `BuscarCuentasPerfilesUseCase` | `BuscarCuentasPerfilesService` |
| `administracion` | `MarcarServicioAltoRiesgoUseCase` | `MarcarServicioAltoRiesgoService` |
| `administracion` | `RevisarVerificacionUseCase` | `RevisarVerificacionService` |
| `auditoria` | `RegistrarAuditoriaUseCase` | `RegistrarAuditoriaService` |
| `auditoria` | `ConsultarAuditoriaUseCase` | `ConsultarAuditoriaService` |

Puertos de salida previstos: contratos públicos de catálogo, reportes, identidad, confianza y auditoría; sin repositorios JPA ajenos. Los repositorios siguen siendo contratos en `domain/repository/`; los puertos externos/consultas requeridos por aplicación van en `application/port/`, con adaptadores de infraestructura. No crear un puerto adicional cuando ya exista un contrato público equivalente.

Controllers reciben UseCase por constructor y convierten Request/Response mediante mapper de presentación. Commands/Queries/Results de aplicación no contienen objetos HTTP o JPA. Excepciones de negocio en `domain/exception/`; wiring/transacciones en infraestructura/configuración. Ver [árbol completo y reglas](../04-estructura-y-casos-de-uso.md).

`RevisarVerificacionUseCase` permanece sujeto a D-11; no convierte un endpoint pendiente en contrato ya aprobado.

### Tareas existentes del plan fuente

Conservar el orden por fases y las dependencias `Txxx` del documento de origen; una referencia `SPEC-n/Txxx` se interpreta como `Fn-Txxx`. Las rutas de origen son relativas a `backend/`. Si una tarea habla de crear una tabla ya incluida en V1–V6, se verifica/reutiliza esa tabla en lugar de crearla de nuevo. Si hace referencia a entidades de notificación puntuales, adaptar al módulo y tabla unificados.

- [ ] **F12-T001** Crear `administracion/` y `auditoria/`.
- [ ] **F12-T002** Migración Flyway para bloqueos, acciones de moderación, marcas de riesgo y auditoría.
- [ ] **F12-T003** Extender `Usuario.rol`/autorización con `ADMINISTRADOR` sin habilitar registro público para ese rol.
- [ ] **F12-T004** Añadir `version`/locking optimista a `Reporte` para resolución concurrente.
- [ ] **F12-T005** `AuditoriaService.registrar()` append-only para toda mutación administrativa.
- [ ] **F12-T006** Filtro/annotation de autorización `ADMINISTRADOR`.
- [ ] **F12-T007** `ReporteAdminService` con transición PENDIENTE→EN_REVISION→RESUELTO/DESCARTADO.
- [ ] **F12-T008** Garantizar que abrir detalle marca revisión antes de permitir resolución.
- [ ] **F12-T009** [P] Contract/integration tests de alta, edición y desactivación.
- [ ] **F12-T010** Implementar `AdministracionCatalogoService` para categorías.
- [ ] **F12-T011** Impedir publicar borrador que conserva categoría desactivada.
- [ ] **F12-T012** Auditar cada cambio.
- [ ] **F12-T013** [P] Tests de alta, edición y desactivación con zona aún asociada a Prestador.
- [ ] **F12-T014** Implementar administración de `Zona`.
- [ ] **F12-T015** Mantener referencia histórica sin ofrecer zona desactivada en nuevas selecciones.
- [ ] **F12-T016** Auditar cada cambio.
- [ ] **F12-T017** [P] Contract tests cola/detalle/resolución.
- [ ] **F12-T018** [P] Integration tests de los cuatro escenarios, incluida concurrencia de dos Administradores.
- [ ] **F12-T019** Cola unificada para tipos RESENA/USUARIO/SERVICIO.
- [ ] **F12-T020** Detalle con evidencias de SPEC-11.
- [ ] **F12-T021** Resolución obligando justificación y revisión previa.
- [ ] **F12-T022** Auditoría de revisión y resolución.
- [ ] **F12-T023** Tests de bloqueo/levantamiento y acceso bloqueado.
- [ ] **F12-T024** Modelo/servicio `BloqueoPreventivo`.
- [ ] **F12-T025** Integrar bloqueo activo con filtro de autorización de SPEC-01.
- [ ] **F12-T026** Mantener cuenta visible en búsquedas administrativas.
- [ ] **F12-T027** Auditar bloqueo y levantamiento.
- [ ] **F12-T028** Tests de ocultamiento/corrección sin bloqueo de cuenta.
- [ ] **F12-T029** Implementar `AccionModeracion`.
- [ ] **F12-T030** Aplicar moderación a exposición pública del contenido objetivo.
- [ ] **F12-T031** Auditar acción.
- [ ] **F12-T032** Contract/integration tests por nombre, email e identificador.
- [ ] **F12-T033** `BusquedaAdminService` con DTO mínimo administrativo.
- [ ] **F12-T034** Endpoint paginado.
- [ ] **F12-T035** Tests de marca y seguimiento.
- [ ] **F12-T036** Modelo/servicio `MarcaAltoRiesgo`.
- [ ] **F12-T037** Endpoint de marca.
- [ ] **F12-T038** Auditoría de la clasificación.

### Contratos API de origen

| Método | Endpoint | Uso |
|---|---|---|
| POST/PUT/DELETE lógico | `/api/v1/admin/categorias` | crear, editar, desactivar categoría |
| POST/PUT/DELETE lógico | `/api/v1/admin/zonas` | crear, editar, desactivar zona |
| GET | `/api/v1/admin/reportes?estado=PENDIENTE` | cola |
| GET | `/api/v1/admin/reportes/{id}` | detalle + evidencia y marca revisión |
| POST | `/api/v1/admin/reportes/{id}/resolver` | `{ resultado, justificacion }` |
| POST | `/api/v1/admin/usuarios/{id}/bloqueos` | `{ motivo }` |
| POST | `/api/v1/admin/usuarios/{id}/bloqueos/{bloqueoId}/levantar` | — |
| POST | `/api/v1/admin/moderacion` | `{ objetivoTipo, objetivoId, accion, motivo }` |
| GET | `/api/v1/admin/busqueda?q=` | cuentas/perfiles |
| POST | `/api/v1/admin/servicios/{id}/alto-riesgo` | `{ criterio }` |
| GET | `/api/v1/admin/auditoria` | consulta autorizada de trazabilidad |

Todos requieren rol `ADMINISTRADOR`.


## Frontend — app móvil y/o panel

Destino principal: panel-admin (React); app-movil refleja efectos de bloqueos y moderación.

- [ ] **F12-FE-01** Panel React con navegación exclusiva Administrador y login real; los guardas de UI complementan la autorización backend.
- [ ] **F12-FE-02** CRUD lógico de categorías/zonas; búsqueda de cuentas/perfiles y estados vacíos.
- [ ] **F12-FE-03** Cola de reportes con detalle/evidencia; habilitar resolver/descartar solo tras revisión y motivo obligatorio.
- [ ] **F12-FE-04** Bloqueo/desbloqueo con confirmación y motivo; moderación de contenido separada de bloqueo.
- [ ] **F12-FE-05** Detalle de servicio con marca de riesgo según catálogo acordado, auditoría filtrable y solo lectura.
- [ ] **F12-FE-06** Revisión documental aprobar/rechazar con justificación: formalizar endpoints y persistencia faltantes en D-11.

Aplicar [estados y contrato de cliente](../01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación

- [ ] **F12-QA-01** Dos administradores resuelven a la vez: una resolución válida y conflicto consistente.
- [ ] **F12-QA-02** Cada mutación y revisión definida registra auditoría; trigger y permisos impiden UPDATE/DELETE sobre auditoría.
- [ ] **F12-QA-03** Cuenta bloqueada pierde capacidades ordinarias y exposición pública; moderar contenido no bloquea cuenta.
- [ ] **F12-QA-04** Desactivar catálogo no borra referencias de solicitudes/perfiles históricos.
- [ ] **F12-QA-05** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Requisitos y criterios de éxito de origen

Los identificadores FR/SC son locales al SPEC: deben referenciarse como SPEC-12/FR-xxx y SPEC-12/SC-xxx.

- **FR-068**: El sistema DEBE permitir que un Administrador cree, edite y desactive categorías de servicio del catálogo. [UC068]
- **FR-069**: El sistema DEBE permitir que un Administrador cree, edite y desactive zonas geográficas del catálogo. [UC069]
- **FR-070**: El sistema DEBE permitir que un Administrador consulte la cola de reportes pendientes, sin importar su origen (usuario, servicio o reseña). [UC070]
- **FR-071**: El sistema DEBE permitir que un Administrador revise el detalle completo de un reporte, incluyendo su evidencia asociada, antes de poder resolverlo. [UC071]
- **FR-072**: El sistema DEBE permitir que un Administrador cambie el estado de un reporte a resuelto o descartado, con una justificación registrada, únicamente después de haberlo revisado en detalle. [UC072]
- **FR-073**: El sistema DEBE permitir que un Administrador bloquee preventivamente una cuenta, dejando trazabilidad de quién lo hizo, cuándo y por qué. [UC073]
- **FR-074**: El sistema DEBE permitir que un Administrador modere contenido puntual de un perfil sin bloquear la cuenta completa. [UC074]
- **FR-075**: El sistema DEBE permitir que un Administrador busque cuentas o perfiles por distintos criterios (nombre, correo, identificador). [UC075]
- **FR-076**: El sistema DEBE permitir que un Administrador marque un servicio como de alto riesgo según los criterios definidos por el producto. [UC076]
- **SC-001**: El 100% de los reportes creados en `SPEC-10` y `SPEC-11` es visible en la cola de este SPEC.
- **SC-002**: Ningún reporte cambia de estado a resuelto/descartado sin haber pasado primero por su revisión de detalle.
- **SC-003**: El 100% de los bloqueos preventivos queda con administrador, fecha y motivo registrados.
- **SC-004**: Ninguna acción de moderación de contenido (UC074) provoca por sí sola un bloqueo de cuenta (UC073); son acciones independientes.
