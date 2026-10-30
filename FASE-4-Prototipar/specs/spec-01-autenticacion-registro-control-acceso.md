# Feature Specification: SPEC-01 — Autenticación, registro y control de acceso

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC001–UC007


## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registro por rol [UC001, UC002, UC007] (Priority: P1)

Como persona nueva, quiero registrarme como Cliente o Prestador aceptando los términos y el tratamiento de datos, para obtener una cuenta con el rol correcto.

**Why this priority**: Es la puerta de entrada a la plataforma; sin registro no existe ningún otro flujo posible para Cliente ni Prestador.

**Independent Test**: Crear una cuenta de cada rol con datos válidos y comprobar que el rol y el consentimiento quedan almacenados correctamente.

**Acceptance Scenarios**:

1. **Scenario**: Registro exitoso como Cliente [UC001]
   - **Given** una persona sin cuenta completa el formulario de registro con datos válidos y selecciona el rol Cliente
   - **When** envía el formulario
   - **Then** el sistema crea la cuenta con rol Cliente y la deja lista para autenticación

2. **Scenario**: Registro exitoso como Prestador [UC002]
   - **Given** una persona sin cuenta completa el formulario de registro con datos válidos y selecciona el rol Prestador
   - **When** envía el formulario
   - **Then** el sistema crea la cuenta con rol Prestador y la deja lista para autenticación

1. **Scenario**: Aceptación obligatoria de términos y tratamiento de datos [UC007]
   - **Given** una persona completa el formulario de registro, ya sea como Cliente o Prestador
   - **When** no marca la aceptación de términos y tratamiento de datos
   - **Then** el sistema no permite finalizar el registro y señala el campo pendiente

4. **Scenario**: Correo ya registrado
   - **Given** una persona intenta registrarse con un correo que ya tiene una cuenta asociada (en cualquier rol)
   - **When** envía el formulario
   - **Then** el sistema rechaza el registro sin revelar con qué rol está asociado el correo existente



---

### User Story 2 - Autenticación y acceso seguro [UC003, UC004, UC005, UC006] (Priority: P1)

Como usuario registrado, quiero iniciar, cerrar y recuperar mi sesión, y acceder únicamente a las capacidades autorizadas para mi rol.

**Why this priority**: Sin autenticación no hay forma de que un usuario registrado use ninguna otra funcionalidad de la plataforma.

**Independent Test**: Probar credenciales válidas e inválidas, cierre de sesión, recuperación de acceso y restricción por rol, sin exponer datos de la cuenta.

**Acceptance Scenarios**:

1. **Scenario**: Inicio de sesión exitoso [UC003]
   - **Given** un usuario registrado ingresa correo y contraseña correctos
   - **When** envía el formulario de inicio de sesión
   - **Then** el sistema crea una sesión válida y lo dirige a la vista correspondiente a su rol

2. **Scenario**: Credenciales inválidas [UC003]
   - **Given** un usuario ingresa un correo registrado con una contraseña incorrecta
   - **When** intenta iniciar sesión
   - **Then** el sistema rechaza el intento sin indicar si el correo existe o si fue la contraseña la que falló

3. **Scenario**: Cierre de sesión [UC004]
   - **Given** un usuario tiene una sesión activa
   - **When** solicita cerrar sesión
   - **Then** el sistema invalida la sesión y exige nueva autenticación para volver a acceder

4. **Scenario**: Recuperación de acceso [UC005]
   - **Given** un usuario registrado olvidó su contraseña
   - **When** solicita recuperación indicando su correo
   - **Then** el sistema envía un mecanismo de verificación sin confirmar ni negar si el correo está registrado

1. **Scenario**: Acceso restringido según rol [UC006]
   - **Given** un Cliente autenticado intenta acceder a una capacidad exclusiva de Prestador (o viceversa)
   - **When** realiza la solicitud
   - **Then** el sistema deniega el acceso

---

### Edge Cases

- Un usuario pierde la conexión justo después de enviar el formulario de registro: el sistema no debe dejar una cuenta a medio crear, o se completa el registro o no queda ningún rastro persistido.
- Un token de recuperación de acceso se usa dos veces o después de expirado: el sistema debe rechazarlo y exigir una nueva solicitud.
- Un usuario intenta mantener sesiones activas en múltiples dispositivos: el sistema deberá aplicar la política definida para sesiones simultáneas e invalidar las sesiones anteriores
- Un usuario intenta registrarse con un correo electrónico que ya está asociado a una cuenta con un rol diferente: el sistema deberá detectar que el correo ya está registrado, impedir la creación de una segunda cuenta y solicitar al usuario iniciar sesión con la cuenta existente.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE permitir registrar una cuenta como Cliente o Prestador. *(UC001, UC002)*
- **FR-002**: El sistema DEBE exigir la aceptación de términos y tratamiento de datos antes de finalizar el registro, para ambos roles. *(UC007)*
- **FR-003**: El sistema DEBE rechazar el registro con un correo ya asociado a una cuenta existente, sin revelar el rol de esa cuenta. *(UC001, UC002)*
- **FR-004**: El sistema DEBE autenticar credenciales válidas y rechazar las inválidas sin revelar cuál de los dos datos (correo o contraseña) fue incorrecto. *(UC003)*
- **FR-005**: El sistema DEBE permitir cerrar sesión de forma verificable. *(UC004)*
- **FR-006**: El sistema DEBE permitir recuperar el acceso mediante un mecanismo que no confirme ni niegue la existencia de una cuenta asociada al correo indicado. *(UC005)*
- **FR-007**: El sistema DEBE aplicar las capacidades permitidas exclusivamente según el rol autenticado, denegando cualquier acción fuera de ese alcance. *(UC006)*

### Key Entities *(include if feature involves data)*

- **Usuario**: identidad, credenciales, rol (Cliente/Prestador) y estado de cuenta.
- **Consentimiento**: versión de términos aceptada, fecha y usuario asociado.
- **Sesión**: estado de autenticación, inicio, expiración y cierre.
- **Token de recuperación**: código o enlace de un solo uso, con expiración, asociado a una solicitud de recuperación.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Una persona puede completar un registro válido (Cliente o Prestador) en menos de 3 minutos.
- **SC-002**: El 100% de los intentos de inicio de sesión con credenciales inválidas es rechazado sin crear sesión.
- **SC-003**: Ningún usuario autenticado puede ejecutar una capacidad exclusiva de un rol distinto al suyo, en el 100% de los casos de prueba.
- **SC-004**: El 100% de las solicitudes de recuperación de acceso, existan o no en la base de datos, reciben la misma respuesta observable por parte del sistema.

## Arquitectura y trazabilidad de implementación

Este SPEC se implementa como parte del monolito modular con Arquitectura Limpia. Se conservan historias, requisitos, entidades conceptuales y criterios de éxito anteriores; esta sección fija la separación técnica de responsabilidades.

**Contrato de arquitectura**: cada operación tiene una interfaz `application/usecase/*UseCase` y una implementación `application/service/*Service implements *UseCase`. Controllers, filtros, gateways y workers inyectan las interfaces por constructor; no servicios concretos ni repositorios JPA. Los servicios coordinan dominio y puertos sin importar Spring, JPA o HTTP. Dominio contiene modelos, reglas, excepciones de negocio y repositorios propios; infraestructura implementa los puertos y configura transacciones. Los DTO HTTP y sus mappers pertenecen a presentación; Command/Query/Result de aplicación son independientes del transporte.

Los contratos entre módulos son interfaces públicas de aplicación; no se accede a Service concreto, repositorio interno o entidad JPA de otro módulo. Cuando se requiera persistencia se separan `domain/repository`, `infrastructure/persistence/entity`, `mapper`, `jpa` y `adapter`. La configuración de Spring conecta puertos y adaptadores, y conserva la transacción completa del caso de uso. Solo crear clases/carpetas con responsabilidad real. `common` contiene infraestructura/contratos transversales acotados; el contexto de Spring Security no entra a aplicación. `SesionAutenticada` es contrato puro en `auth/application/port`; generación aleatoria segura del token y huella SHA-256 son responsabilidades separadas.

El [plan técnico de SPEC-01](../../Planes-y-plantilla-del-proyecto/planes/plan-spec-01-autenticacion.md) contiene el árbol de paquetes, puertos, persistencia, tareas backend, frontend e integración actualizados.

### Interfaces de entrada e implementaciones

| Módulo | UseCase (interfaz) | Service (implementación) |
|---|---|---|
| `auth` | `RegistrarUsuarioUseCase` | `RegistrarUsuarioService` |
| `auth` | `IniciarSesionUseCase` | `IniciarSesionService` |
| `auth` | `CerrarSesionUseCase` | `CerrarSesionService` |
| `auth` | `ResolverSesionUseCase` | `ResolverSesionService` |
| `auth` | `SolicitarRecuperacionAccesoUseCase` | `SolicitarRecuperacionAccesoService` |
| `auth` | `ConfirmarRecuperacionAccesoUseCase` | `ConfirmarRecuperacionAccesoService` |
| `auth` | `ConsultarUsuarioActualUseCase` | `ConsultarUsuarioActualService` |

Puertos de salida: HasheadorPassword, GeneradorTokenSesion, HuellaToken, NotificadorRecuperacion, UsuarioConsultaPort, SesionAutenticada. Las interfaces de entrada no crean endpoints nuevos; mantener API Contracts y las condiciones Could/Future. Las tareas existentes conservan IDs, historias, dependencias y orden: los nombres de servicio agrupado de origen se descomponen en estas operaciones, sin añadir tareas funcionales.

Persistencia de referencia: `usuarios`, `consentimientos`, `sesiones`, `tokens_recuperacion`. El [manual entregado](../../tasks/fuentes/manual-base-de-datos-aliado.md) detalla el modelo MVP; no implica que los scripts V1–V6 ya estén disponibles o ejecutados.
