# F16 — Onboarding asistido

**Alcance:** Could OFF. **Estado:** planificado, sin implementación.
**Dependencias:** 01 02 05; aprobación Could. **Decisiones relacionadas:** D-16 (ver [registro](../03-decisiones-y-dependencias.md)).

## Resultado esperado

Solicitud de acompañamiento por gestor o canal externo sin bloquear registro autónomo.

## Fuentes y trazabilidad

- [SPEC original](../fuentes/specs/spec-16-onboarding-asistido.md): historias, escenarios, requisitos y criterios de éxito.
- [Plan de origen](../fuentes/planes/plan-spec-16-onboarding-asistido.md): fases, tareas y dependencias detalladas.
- [Manual de datos](../fuentes/manual-base-de-datos-aliado.md), [modelo PDF](../fuentes/modelo-logico-ALIADO.pdf) y [reglas transversales](../01-arquitectura-y-stack.md).

Los IDs `F16-Txxx` conservan el identificador Txxx de origen, ahora con prefijo para evitar colisiones entre SPEC. No implican que el trabajo ya exista. Las tareas adicionales DB/BE/FE/QA desglosan integración y clientes, sin reemplazar requisitos. Las correcciones explícitas de 03 prevalecen sobre notas antiguas del plan fuente; no implementar tablas puntuales de notificaciones ni JWT por copiar una referencia.

## Historias cubiertas

- User Story 1 - Onboarding asistido por WhatsApp o gestor `<<Could>>` [UC091] (Priority: P3)

## Base de datos

- [ ] **F16-DB-01** Implementar o verificar posterior a V6: `sesiones_acompanamiento`. Aplicar columnas, PK/FK, nulabilidad y CHECK del manual; las tablas compartidas se crean una sola vez.
- [ ] **F16-DB-02** Agregar/verificar restricciones e índices de esta feature según 02-base-de-datos.md; probar integridad con PostgreSQL 16 y Flyway, incluyendo inserciones inválidas y concurrencia.
- [ ] **F16-DB-03** Implementar modelos de dominio independientes, puertos, entidades JPA, repositorios Spring Data, mappers y adaptadores; no serializar entidades JPA en API.

## Backend — integración y arquitectura

- [ ] **F16-BE-01** Concretar los contratos de F16 en OpenAPI: DTO request/response, validación, rol, propiedad, paginación, errores e idempotencia, conservando endpoints fuente salvo decisión explícita.
- [ ] **F16-BE-02** Definir las interfaces `application/usecase/*UseCase` y sus implementaciones `application/service/*Service implements *UseCase` según la tabla de esta feature. Inyectar solo interfaces por constructor en controladores/filtros/worker. Service usa dominio y puertos; ninguna dependencia hacia Spring/JPA/HTTP/adaptadores concretos. Llamadas entre módulos mediante interfaces públicas, nunca clases Service ni repositorios JPA ajenos.
- [ ] **F16-BE-03** Integrar los casos de uso de las tareas de origen con transacciones, autorización por recurso y tratamiento de fallos. Donde aplique, notificación persistida junto al negocio y entrega externa posterior al commit.
- [ ] **F16-BE-04** No implementar ni activar proveedor productivo durante MVP: cerrar decisiones y flags de forma independiente antes de ejecutar esta feature opcional.

### Interfaces de entrada e implementaciones

Esta tabla concreta la separación del ejemplo del usuario: cada nombre base origina una interfaz `<Nombre>UseCase` en `application/usecase/` y una clase `<Nombre>Service implements <Nombre>UseCase` en `application/service/`, dentro del módulo indicado. Son nombres previstos de contratos, no endpoints nuevos ni prueba de implementación. Conservar responsabilidades y dependencias de las tareas de origen; sus nombres de servicio agrupado se descomponen conforme a esta tabla.

| Módulo | Interfaz de entrada | Implementación |
|---|---|---|
| `onboarding` | `SolicitarAcompanamientoUseCase` | `SolicitarAcompanamientoService` |
| `onboarding` | `ConsultarAcompanamientoUseCase` | `ConsultarAcompanamientoService` |

Puertos de salida previstos: CanalAcompanamiento y SesionAutenticada; adaptadores de gestor/WhatsApp cuando se aprueben. Los repositorios siguen siendo contratos en `domain/repository/`; los puertos externos/consultas requeridos por aplicación van en `application/port/`, con adaptadores de infraestructura. No crear un puerto adicional cuando ya exista un contrato público equivalente.

Controllers reciben UseCase por constructor y convierten Request/Response mediante mapper de presentación. Commands/Queries/Results de aplicación no contienen objetos HTTP o JPA. Excepciones de negocio en `domain/exception/`; wiring/transacciones en infraestructura/configuración. Ver [árbol completo y reglas](../04-estructura-y-casos-de-uso.md).

Mantener flag OFF y condición de aprobación de esta feature; la tabla no autoriza activación de proveedores.

### Tareas existentes del plan fuente

Conservar el orden por fases y las dependencias `Txxx` del documento de origen; una referencia `SPEC-n/Txxx` se interpreta como `Fn-Txxx`. Las rutas de origen son relativas a `backend/`. Si una tarea habla de crear una tabla ya incluida en V1–V6, se verifica/reutiliza esa tabla en lugar de crearla de nuevo. Si hace referencia a entidades de notificación puntuales, adaptar al módulo y tabla unificados.

- [ ] **F16-T001** Feature flag OFF.
- [ ] **F16-T002** Migración `sesiones_acompanamiento` si se aprueba persistencia.
- [ ] **F16-T003** Configurar adaptadores `WHATSAPP` y `GESTOR` sin acoplar registro base.
- [ ] **F16-T004** Contract tests feature off/on.
- [ ] **F16-T005** Integration test: derivación exitosa.
- [ ] **F16-T006** Integration test: canal/gestor no disponible no marca ATENDIDA.
- [ ] **F16-T007** Implementar `OnboardingAsistidoService`.
- [ ] **F16-T008** Endpoints.
- [ ] **F16-T009** Aplicar política de privacidad: Gestor nunca recibe dirección exacta salvo autorización explícita ajena a este SPEC.

### Contratos API de origen

| Método | Endpoint | Resultado |
|---|---|---|
| POST | `/api/v1/onboarding/asistencia` | `202 { sesionId, estado }` si feature habilitada |
| GET | `/api/v1/onboarding/asistencia/{id}` | estado propio |


## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F16-FE-01** Acceso opcional a ayuda, solicitud, estado y canal real de respuesta.
- [ ] **F16-FE-02** No anunciar acompañamiento completado si gestor/canal no respondió.
- [ ] **F16-FE-03** Permitir continuar registro/perfil sin usar asistencia con flag OFF o proveedor caído.

Aplicar [estados y contrato de cliente](../01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación

- [ ] **F16-QA-01** Propiedad de sesión de ayuda, caducidad y transición validada.
- [ ] **F16-QA-02** No crear identidad anónima sin decisión D-16.
- [ ] **F16-QA-03** Desactivar asistencia y completar registro del Prestador de extremo a extremo.
- [ ] **F16-QA-04** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Requisitos y criterios de éxito de origen

Los identificadores FR/SC son locales al SPEC: deben referenciarse como SPEC-16/FR-xxx y SPEC-16/SC-xxx.

- **FR-091**: El sistema PUEDE proporcionar un proceso de onboarding asistido mediante WhatsApp o un Gestor comunitario, y DEBE permitir que el registro base de un Prestador (`spec-01`) se complete de forma autónoma si esta capacidad no está disponible o no está habilitada. [UC091]
- **SC-001**: El 100% de los registros de Prestador se puede completar de forma autónoma, con o sin onboarding asistido habilitado.
- **SC-002**: Ninguna sesión de acompañamiento se presenta como completada sin que el Gestor o el canal de WhatsApp efectivamente haya respondido.
