# F01 — Acceso, identidad y sesiones

**Alcance:** MVP. **Estado:** planificado, sin implementación.
**Dependencias:** 00. **Decisiones relacionadas:** D-01 D-04 D-14 (ver [registro](../03-decisiones-y-dependencias.md)).

## Resultado esperado

Registro Cliente/Prestador, login/logout, recuperación, sesión revocable y permisos por rol.

## Fuentes y trazabilidad

- [SPEC original](../fuentes/specs/spec-01-autenticacion-registro-control-acceso.md): historias, escenarios, requisitos y criterios de éxito.
- [Plan de origen](../fuentes/planes/plan-spec-01-autenticacion.md): fases, tareas y dependencias detalladas.
- [Manual de datos](../fuentes/manual-base-de-datos-aliado.md), [modelo PDF](../fuentes/modelo-logico-ALIADO.pdf) y [reglas transversales](../01-arquitectura-y-stack.md).

Los IDs `F01-Txxx` conservan el identificador Txxx de origen, ahora con prefijo para evitar colisiones entre SPEC. No implican que el trabajo ya exista. Las tareas adicionales DB/BE/FE/QA desglosan integración y clientes, sin reemplazar requisitos. Las correcciones explícitas de 03 prevalecen sobre notas antiguas del plan fuente; no implementar tablas puntuales de notificaciones ni JWT por copiar una referencia.

## Historias cubiertas

- User Story 1 - Registro por rol [UC001, UC002, UC007] (Priority: P1)
- User Story 2 - Autenticación y acceso seguro [UC003, UC004, UC005, UC006] (Priority: P1)

## Base de datos

- [ ] **F01-DB-01** Implementar o verificar V1: `usuarios`, `consentimientos`, `sesiones`, `tokens_recuperacion`. Aplicar columnas, PK/FK, nulabilidad y CHECK del manual; las tablas compartidas se crean una sola vez.
- [ ] **F01-DB-02** Agregar/verificar restricciones e índices de esta feature según 02-base-de-datos.md; probar integridad con PostgreSQL 16 y Flyway, incluyendo inserciones inválidas y concurrencia.
- [ ] **F01-DB-03** Implementar modelos de dominio independientes, puertos, entidades JPA, repositorios Spring Data, mappers y adaptadores; no serializar entidades JPA en API.

## Backend — integración y arquitectura

- [ ] **F01-BE-01** Concretar los contratos de F01 en OpenAPI: DTO request/response, validación, rol, propiedad, paginación, errores e idempotencia, conservando endpoints fuente salvo decisión explícita.
- [ ] **F01-BE-02** Definir las interfaces `application/usecase/*UseCase` y sus implementaciones `application/service/*Service implements *UseCase` según la tabla de esta feature. Inyectar solo interfaces por constructor en controladores/filtros/worker. Service usa dominio y puertos; ninguna dependencia hacia Spring/JPA/HTTP/adaptadores concretos. Llamadas entre módulos mediante interfaces públicas, nunca clases Service ni repositorios JPA ajenos.
- [ ] **F01-BE-03** Integrar los casos de uso de las tareas de origen con transacciones, autorización por recurso y tratamiento de fallos. Donde aplique, notificación persistida junto al negocio y entrega externa posterior al commit.

### Interfaces de entrada e implementaciones

Esta tabla concreta la separación del ejemplo del usuario: cada nombre base origina una interfaz `<Nombre>UseCase` en `application/usecase/` y una clase `<Nombre>Service implements <Nombre>UseCase` en `application/service/`, dentro del módulo indicado. Son nombres previstos de contratos, no endpoints nuevos ni prueba de implementación. Conservar responsabilidades y dependencias de las tareas de origen; sus nombres de servicio agrupado se descomponen conforme a esta tabla.

| Módulo | Interfaz de entrada | Implementación |
|---|---|---|
| `auth` | `RegistrarUsuarioUseCase` | `RegistrarUsuarioService` |
| `auth` | `IniciarSesionUseCase` | `IniciarSesionService` |
| `auth` | `CerrarSesionUseCase` | `CerrarSesionService` |
| `auth` | `ResolverSesionUseCase` | `ResolverSesionService` |
| `auth` | `SolicitarRecuperacionAccesoUseCase` | `SolicitarRecuperacionAccesoService` |
| `auth` | `ConfirmarRecuperacionAccesoUseCase` | `ConfirmarRecuperacionAccesoService` |
| `auth` | `ConsultarUsuarioActualUseCase` | `ConsultarUsuarioActualService` |

Puertos de salida previstos: HasheadorPassword, GeneradorTokenSesion, HuellaToken, NotificadorRecuperacion, UsuarioConsultaPort, SesionAutenticada. Los repositorios siguen siendo contratos en `domain/repository/`; los puertos externos/consultas requeridos por aplicación van en `application/port/`, con adaptadores de infraestructura. No crear un puerto adicional cuando ya exista un contrato público equivalente.

Controllers reciben UseCase por constructor y convierten Request/Response mediante mapper de presentación. Commands/Queries/Results de aplicación no contienen objetos HTTP o JPA. Excepciones de negocio en `domain/exception/`; wiring/transacciones en infraestructura/configuración. Ver [árbol completo y reglas](../04-estructura-y-casos-de-uso.md).

`ResolverSesionUseCase` es consumido por seguridad; `ConsultarUsuarioActualUseCase`/`UsuarioConsultaPort` proporcionan identidad interna cuando haga falta. No se añade automáticamente un `GET /auth/me` ni un CRUD de usuarios por aparecer en este ejemplo: cualquier API adicional necesita contrato aprobado.

### Tareas existentes del plan fuente

Conservar el orden por fases y las dependencias `Txxx` del documento de origen; una referencia `SPEC-n/Txxx` se interpreta como `Fn-Txxx`. Las rutas de origen son relativas a `backend/`. Si una tarea habla de crear una tabla ya incluida en V1–V6, se verifica/reutiliza esa tabla en lugar de crearla de nuevo. Si hace referencia a entidades de notificación puntuales, adaptar al módulo y tabla unificados.

- [ ] **F01-T001** Crear el paquete `auth/` con sus subcarpetas en capas de Arquitectura Limpia (según Project Structure)
- [ ] **F01-T002** Migración Flyway inicial: tablas `usuarios`, `consentimientos`, `sesiones`, `tokens_recuperacion`
- [ ] **F01-T003** Configurar Spring Security 
- [ ] **F01-T004** Configurar `PasswordEncoder` BCrypt en `common/config/PasswordConfig`, implementar `HasheadorPassword` mediante `BCryptHasheadorAdapter` y conectar el puerto en ApplicationConfig.
- [ ] **F01-T005** Configurar manejo de errores global (`@ControllerAdvice`) con el formato de respuesta de error estándar del proyecto
- [ ] **F01-T006** Configurar perfiles de entorno (`dev`/`prod`) y variables sensibles fuera del repositorio
- [ ] **F01-T007** [P] [US1] Contract test `POST /auth/registro` (201, 400, 409) — `tests/contract/test_auth_registro.java`
- [ ] **F01-T008** [P] [US1] Integration test: registro exitoso Cliente/Prestador, términos no aceptados, correo duplicado - `tests/integration/test_registro.java`
- [ ] **F01-T009** [P] [US1] Modelo `Usuario` y `Consentimiento` - `auth/domain/model`
- [ ] **F01-T010** [US1] `RegistrarUsuarioService implements RegistrarUsuarioUseCase`: valida unicidad de correo (FR-003), exige términos (FR-002) y usa HasheadorPassword; puertos y transacción según el árbol de auth (depends on T009, T004).
- [ ] **F01-T011** [US1] Endpoint `POST /api/v1/auth/registro`: AuthController recibe RegistrarUsuarioUseCase; AuthPresentationMapper convierte RegistroRequest a RegistroCommand y resultado a respuesta HTTP.
- [ ] **F01-T012** [US1] Manejo transaccional del edge case "pérdida de conexión durante el registro"
- [ ] **F01-T013** [P] [US2] Contract tests `POST /auth/login`, `/logout`, `/recuperacion`, `/recuperacion/confirmar` -`tests/contract/test_auth_sesion.java`
- [ ] **F01-T014** [P] [US2] Integration test: login válido/inválido sin filtrar cuál dato falló (FR-004), token de recuperación usado dos veces, acceso restringido por rol (FR-007)  -`tests/integration/test_autenticacion.java`
- [ ] **F01-T015** [P] [US2] Modelo `Sesion` y `TokenRecuperacion`  -`auth/domain/model` (depends on T009)
- [ ] **F01-T016** [US2] `IniciarSesionService implements IniciarSesionUseCase`, `CerrarSesionService implements CerrarSesionUseCase` y `ResolverSesionService implements ResolverSesionUseCase` — `auth/application/service`; sesión opaca y revocación por puertos.
- [ ] **F01-T017** [US2] SolicitarRecuperacionAccesoUseCase y ConfirmarRecuperacionAccesoUseCase con sus Service; GeneradorTokenSesion/HuellaToken/NotificadorRecuperacion abstraen aleatoriedad segura, hash, expiración, un solo uso y correo — `auth/application`.
- [ ] **F01-T018** [US2] AutorizacionRolFilter en common/security recibe ResolverSesionUseCase; SesionAutenticada es contrato puro en auth/application/port y SesionAutenticadaAdapter traduce contexto técnico. No pasar Spring Security a servicios o dominio.
- [ ] **F01-T019** [US2] Endpoints login, logout, recuperacion y recuperacion/confirmar: AuthController recibe interfaces UseCase por constructor y usa AuthPresentationMapper; ningún Service concreto en presentación.

### Contratos API de origen

| Método | Endpoint | Request body | Respuesta éxito | Errores |
|---|---|---|---|---|
| POST | `/api/v1/auth/registro` | `{ email, password, rol, aceptaTerminos, versionTerminos }` | `201 { id, email, rol }` | `400` datos inválidos/términos no aceptados; `409` correo ya registrado (sin revelar rol) |
| POST | `/api/v1/auth/login` | `{ email, password }` | `200 { sessionToken, rol }` | `401` credenciales inválidas (mensaje genérico) |
| POST | `/api/v1/auth/logout` | *(header Authorization)* | `204` | `401` sin sesión activa |
| POST | `/api/v1/auth/recuperacion` | `{ email }` | `202 { mensaje }` *(idéntico exista o no la cuenta)* | — |
| POST | `/api/v1/auth/recuperacion/confirmar` | `{ token, nuevaPassword }` | `200 { mensaje }` | `400/410` token inválido, usado o expirado |


## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F01-FE-01** Registro, consentimiento, inicio/cierre y recuperación en app; login exclusivo para Administrador en panel.
- [ ] **F01-FE-02** Persistir sesión en almacenamiento seguro del dispositivo; panel usa sesión en memoria con política de reautenticación documentada, sin localStorage para tokens.
- [ ] **F01-FE-03** Navegación según rol, expiración y revocación; mostrar el mismo mensaje para correo inexistente y recuperación válida.
- [ ] **F01-FE-04** Sustituir acceso rápido por rol y correo simulado de la demo por API y correo de desarrollo real.

Aplicar [estados y contrato de cliente](../01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación

- [ ] **F01-QA-01** Probar registro duplicado concurrente y recuperación usada dos veces.
- [ ] **F01-QA-02** Revocar sesiones previas según política acordada; verificar acceso cruzado de los tres roles.
- [ ] **F01-QA-03** E2E registrar ambos roles, login, logout, recuperar y volver a entrar sin revelar hashes.
- [ ] **F01-QA-04** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Requisitos y criterios de éxito de origen

Los identificadores FR/SC son locales al SPEC: deben referenciarse como SPEC-01/FR-xxx y SPEC-01/SC-xxx.

- **FR-001**: El sistema DEBE permitir registrar una cuenta como Cliente o Prestador. *(UC001, UC002)*
- **FR-002**: El sistema DEBE exigir la aceptación de términos y tratamiento de datos antes de finalizar el registro, para ambos roles. *(UC007)*
- **FR-003**: El sistema DEBE rechazar el registro con un correo ya asociado a una cuenta existente, sin revelar el rol de esa cuenta. *(UC001, UC002)*
- **FR-004**: El sistema DEBE autenticar credenciales válidas y rechazar las inválidas sin revelar cuál de los dos datos (correo o contraseña) fue incorrecto. *(UC003)*
- **FR-005**: El sistema DEBE permitir cerrar sesión de forma verificable. *(UC004)*
- **FR-006**: El sistema DEBE permitir recuperar el acceso mediante un mecanismo que no confirme ni niegue la existencia de una cuenta asociada al correo indicado. *(UC005)*
- **FR-007**: El sistema DEBE aplicar las capacidades permitidas exclusivamente según el rol autenticado, denegando cualquier acción fuera de ese alcance. *(UC006)*
- **SC-001**: Una persona puede completar un registro válido (Cliente o Prestador) en menos de 3 minutos.
- **SC-002**: El 100% de los intentos de inicio de sesión con credenciales inválidas es rechazado sin crear sesión.
- **SC-003**: Ningún usuario autenticado puede ejecutar una capacidad exclusiva de un rol distinto al suyo, en el 100% de los casos de prueba.
- **SC-004**: El 100% de las solicitudes de recuperación de acceso, existan o no en la base de datos, reciben la misma respuesta observable por parte del sistema.
