# F02 — Perfil personal, privacidad y eliminación

**Alcance:** MVP. **Estado:** planificado, sin implementación.
**Dependencias:** 01. **Decisiones relacionadas:** D-05 D-14 (ver [registro](../03-decisiones-y-dependencias.md)).

## Resultado esperado

Datos personales propios, visibilidad, ubicación aproximada y solicitud/confirmación de eliminación.

## Fuentes y trazabilidad

- [SPEC original](../fuentes/specs/spec-02-gestion-perfil-privacidad.md): historias, escenarios, requisitos y criterios de éxito.
- [Plan de origen](../fuentes/planes/plan-spec-02-perfil.md): fases, tareas y dependencias detalladas.
- [Manual de datos](../fuentes/manual-base-de-datos-aliado.md), [modelo PDF](../fuentes/modelo-logico-ALIADO.pdf) y [reglas transversales](../01-arquitectura-y-stack.md).

Los IDs `F02-Txxx` conservan el identificador Txxx de origen, ahora con prefijo para evitar colisiones entre SPEC. No implican que el trabajo ya exista. Las tareas adicionales DB/BE/FE/QA desglosan integración y clientes, sin reemplazar requisitos. Las correcciones explícitas de 03 prevalecen sobre notas antiguas del plan fuente; no implementar tablas puntuales de notificaciones ni JWT por copiar una referencia.

## Historias cubiertas

- User Story 1 - Administración de datos personales [UC008, UC011] (Priority: P1)
- User Story 2 - Privacidad y visibilidad de ubicación [UC009, UC010, UC013] (Priority: P1)
- User Story 3 - Eliminación de cuenta [UC012] (Priority: P2)

## Base de datos

- [ ] **F02-DB-01** Implementar o verificar V1: `perfiles`, `ubicaciones`, `solicitudes_eliminacion`. Aplicar columnas, PK/FK, nulabilidad y CHECK del manual; las tablas compartidas se crean una sola vez.
- [ ] **F02-DB-02** Agregar/verificar restricciones e índices de esta feature según 02-base-de-datos.md; probar integridad con PostgreSQL 16 y Flyway, incluyendo inserciones inválidas y concurrencia.
- [ ] **F02-DB-03** Implementar modelos de dominio independientes, puertos, entidades JPA, repositorios Spring Data, mappers y adaptadores; no serializar entidades JPA en API.

## Backend — integración y arquitectura

- [ ] **F02-BE-01** Concretar los contratos de F02 en OpenAPI: DTO request/response, validación, rol, propiedad, paginación, errores e idempotencia, conservando endpoints fuente salvo decisión explícita.
- [ ] **F02-BE-02** Definir las interfaces `application/usecase/*UseCase` y sus implementaciones `application/service/*Service implements *UseCase` según la tabla de esta feature. Inyectar solo interfaces por constructor en controladores/filtros/worker. Service usa dominio y puertos; ninguna dependencia hacia Spring/JPA/HTTP/adaptadores concretos. Llamadas entre módulos mediante interfaces públicas, nunca clases Service ni repositorios JPA ajenos.
- [ ] **F02-BE-03** Integrar los casos de uso de las tareas de origen con transacciones, autorización por recurso y tratamiento de fallos. Donde aplique, notificación persistida junto al negocio y entrega externa posterior al commit.

### Interfaces de entrada e implementaciones

Esta tabla concreta la separación del ejemplo del usuario: cada nombre base origina una interfaz `<Nombre>UseCase` en `application/usecase/` y una clase `<Nombre>Service implements <Nombre>UseCase` en `application/service/`, dentro del módulo indicado. Son nombres previstos de contratos, no endpoints nuevos ni prueba de implementación. Conservar responsabilidades y dependencias de las tareas de origen; sus nombres de servicio agrupado se descomponen conforme a esta tabla.

| Módulo | Interfaz de entrada | Implementación |
|---|---|---|
| `perfil` | `ConsultarPerfilUseCase` | `ConsultarPerfilService` |
| `perfil` | `ActualizarPerfilUseCase` | `ActualizarPerfilService` |
| `perfil` | `ConfigurarUbicacionUseCase` | `ConfigurarUbicacionService` |
| `perfil` | `ConfigurarPrivacidadUseCase` | `ConfigurarPrivacidadService` |
| `perfil` | `SolicitarEliminacionCuentaUseCase` | `SolicitarEliminacionCuentaService` |
| `perfil` | `ConfirmarEliminacionCuentaUseCase` | `ConfirmarEliminacionCuentaService` |

Puertos de salida previstos: SesionAutenticada y ConsultaServiciosActivosPort; cifrado mediante puerto/adaptador sin dependencia del SDK. Los repositorios siguen siendo contratos en `domain/repository/`; los puertos externos/consultas requeridos por aplicación van en `application/port/`, con adaptadores de infraestructura. No crear un puerto adicional cuando ya exista un contrato público equivalente.

Controllers reciben UseCase por constructor y convierten Request/Response mediante mapper de presentación. Commands/Queries/Results de aplicación no contienen objetos HTTP o JPA. Excepciones de negocio en `domain/exception/`; wiring/transacciones en infraestructura/configuración. Ver [árbol completo y reglas](../04-estructura-y-casos-de-uso.md).

### Tareas existentes del plan fuente

Conservar el orden por fases y las dependencias `Txxx` del documento de origen; una referencia `SPEC-n/Txxx` se interpreta como `Fn-Txxx`. Las rutas de origen son relativas a `backend/`. Si una tarea habla de crear una tabla ya incluida en V1–V6, se verifica/reutiliza esa tabla en lugar de crearla de nuevo. Si hace referencia a entidades de notificación puntuales, adaptar al módulo y tabla unificados.

- [ ] **F02-T001** Crear el paquete `perfil/` con sus subcarpetas en capas de Arquitectura Limpia (según Project Structure)
- [ ] **F02-T002** Migración Flyway: tablas `perfiles`, `ubicaciones`, `solicitudes_eliminacion` (con FK hacia `usuarios` de SPEC-01)
- [ ] **F02-T003** [P] [US1] Contract tests `GET /perfil/me`, `PATCH /perfil/me` — `tests/contract/test_perfil_datos.java`
- [ ] **F02-T004** [P] [US1] Integration test: consulta propia, edición válida, edición con formato inválido — `tests/integration/test_perfil_datos.java`
- [ ] **F02-T005** [P] [US1] Modelo `PerfilUsuario` — `perfil/domain/model`
- [ ] **F02-T006** [US1] `PerfilService.consultar()` / `actualizar()` con validación que no sobrescribe en caso de error (FR-002) — `perfil/application/service`
- [ ] **F02-T007** [US1] Endpoints `GET/PATCH /api/v1/perfil/me` — `perfil/presentation/controller`
- [ ] **F02-T008** [P] [US2] Contract tests `PUT /perfil/me/ubicacion`, `PATCH /perfil/me/visibilidad`, `GET /perfil/{id}/publico` — `tests/contract/test_perfil_privacidad.java`
- [ ] **F02-T009** [P] [US2] Integration test: consulta de un tercero nunca recibe `direccionExacta` (FR-005), edición de zona no altera dirección comprometida con un servicio activo — `tests/integration/test_privacidad_ubicacion.java`
- [ ] **F02-T010** [P] [US2] Modelo `Ubicacion` (cifrado de `direccionExacta` en reposo, RNF-004) — `perfil/domain/model`
- [ ] **F02-T011** [US2] `PerfilService`: lógica de exposición condicionada (zona por defecto, dirección exacta solo bajo regla explícita) — `perfil/application/service`
- [ ] **F02-T012** [US2] Endpoints `PUT /ubicacion`, `PATCH /visibilidad`, `GET /{id}/publico` — `perfil/presentation/controller`
- [ ] **F02-T013** [P] [US3] Contract tests `POST /perfil/me/eliminacion`, `/eliminacion/confirmar` — `tests/contract/test_eliminacion.java`
- [ ] **F02-T014** [P] [US3] Integration test: solicitud con servicio en ejecución (bloqueada), expiración automática a las 24 h, confirmación exitosa — `tests/integration/test_eliminacion_cuenta.java`
- [ ] **F02-T015** [P] [US3] Modelo `SolicitudEliminacion` — `perfil/domain/model`
- [ ] **F02-T016** [US3] `EliminacionCuentaService`: validación de servicios en ejecución, expiración a 24 h — `perfil/application/service`
- [ ] **F02-T017** [US3] Endpoints `POST /eliminacion`, `/eliminacion/confirmar` — `perfil/presentation/controller`
- [ ] **F02-T018** [US3] Job programado (scheduler) que marca como `EXPIRADA` toda solicitud pendiente > 24 h

### Contratos API de origen

| Método | Endpoint | Request body | Respuesta éxito | Errores |
|---|---|---|---|---|
| GET | `/api/v1/perfil/me` | — | `200` perfil propio completo (incluye dirección exacta propia) | `401` sin sesión |
| PATCH | `/api/v1/perfil/me` | `{ nombre?, telefono? }` | `200` perfil actualizado | `400` formato inválido (valor previo se conserva) |
| PUT | `/api/v1/perfil/me/ubicacion` | `{ zonaAproximada, direccionExacta? }` | `200` ubicación actualizada | `400` formato inválido |
| PATCH | `/api/v1/perfil/me/visibilidad` | `{ preferenciaVisibilidad }` | `200` | `400` valor fuera de las reglas de privacidad base |
| GET | `/api/v1/perfil/{usuarioId}/publico` | — | `200` *(solo `zonaAproximada`, nunca `direccionExacta`)* | `404` usuario no existe |
| POST | `/api/v1/perfil/me/eliminacion` | — | `202 { estado: PENDIENTE, expiraEn }` | `409` tiene un servicio en ejecución |
| POST | `/api/v1/perfil/me/eliminacion/confirmar` | — | `200 { estado: CONFIRMADA }` | `410` solicitud expirada (> 24 h) |


## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F02-FE-01** Pantalla de datos propios y edición con validación, conservación del valor previo ante error y conflictos de versión.
- [ ] **F02-FE-02** Configurar privacidad y separar zona aproximada de dirección exacta en formularios y vistas públicas.
- [ ] **F02-FE-03** Solicitud y confirmación de eliminación con expiración, resultado y estado pendientes visibles.
- [ ] **F02-FE-04** Integrar bloqueo de eliminación por servicios activos con el puerto de SPEC-08 cuando esté disponible; no simular aprobación.

Aplicar [estados y contrato de cliente](../01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación

- [ ] **F02-QA-01** Comprobar cifrado de dirección y ausencia de teléfono/email/dirección en DTO públicos.
- [ ] **F02-QA-02** Probar eliminación sin confirmación, confirmación expirada y servicio activo; E2E diferido hasta F08.
- [ ] **F02-QA-03** Evitar borrado físico en cascada que destruya historial/auditoría; probar política de anonimización acordada.
- [ ] **F02-QA-04** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Requisitos y criterios de éxito de origen

Los identificadores FR/SC son locales al SPEC: deben referenciarse como SPEC-02/FR-xxx y SPEC-02/SC-xxx.

- **FR-001**: El sistema DEBE permitir consultar los datos almacenados del usuario autenticado, limitados a su propia cuenta. *(UC011)*
- **FR-002**: El sistema DEBE validar y persistir los cambios en datos básicos editables, rechazando valores con formato inválido sin alterar el valor previo. *(UC008)*
- **FR-003**: El sistema DEBE permitir configurar y actualizar la zona aproximada del usuario. *(UC009)*
- **FR-004**: El sistema DEBE aplicar las preferencias de visibilidad configuradas por el usuario sin superar las reglas de privacidad base definidas por el producto. *(UC010)*
- **FR-005**: El sistema DEBE separar de forma estricta la zona aproximada de la dirección exacta, exponiendo esta última únicamente cuando la regla de negocio correspondiente lo autorice explícitamente. *(UC013)*
- **FR-006**: El sistema DEBE registrar toda solicitud de eliminación de cuenta con usuario, fecha y estado. *(UC012)*
- **FR-007**: El sistema NO DEBE ejecutar la eliminación de una cuenta sin la confirmación explícita requerida. *(UC012)*
- **SC-001**: La dirección exacta no se muestra en el 100% de los casos donde solo corresponde exponer la zona aproximada.
- **SC-002**: Un dato con formato inválido nunca modifica el valor previamente guardado, en el 100% de los intentos de edición.
- **SC-003**: Toda solicitud de eliminación queda registrada y ninguna se ejecuta sin la confirmación requerida.
- **SC-004**: El 100% de las consultas de datos almacenados devuelve exclusivamente información de la cuenta del solicitante.
