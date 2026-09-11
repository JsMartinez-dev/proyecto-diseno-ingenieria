# Feature Specification: UC-01 — Acceso, identidad, cuenta y privacidad

**Creado**: 2026-09-11  

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registrarse como cliente [US-001] (Priority: P1)

Como cliente nuevo, quiero crear una cuenta para acceder a las funciones de búsqueda, solicitudes y contratación.

**Why this priority**: Es la puerta de entrada al flujo principal del cliente y habilita el resto de capacidades autenticadas.

**Independent Test**: Se prueba creando una cuenta de cliente desde un estado sin sesión y verificando que queda disponible para iniciar sesión con rol Cliente.

**Acceptance Scenarios**:

1. **Scenario**: Registro válido de cliente
   - **Given** una persona no autenticada y datos obligatorios válidos
   - **When** completa el registro como cliente y acepta términos y tratamiento de datos
   - **Then** la cuenta se crea con rol Cliente y queda disponible para autenticación

2. **Scenario**: Registro sin consentimiento
   - **Given** una persona no autenticada con datos de registro completos
   - **When** intenta finalizar sin aceptar términos o tratamiento de datos
   - **Then** el sistema no crea la cuenta e informa qué consentimiento falta

---

### User Story 2 - Registrarse como prestador [US-002] (Priority: P1)

Como prestador nuevo, quiero crear una cuenta para construir mi perfil profesional y participar en oportunidades de servicio.

**Why this priority**: Habilita la oferta de servicios y es esencial para el modelo de doble lado de la plataforma.

**Independent Test**: Se prueba registrando una cuenta de prestador y comprobando que el rol asignado permite acceder al flujo de perfil profesional.

**Acceptance Scenarios**:

1. **Scenario**: Registro válido de prestador
   - **Given** una persona no autenticada y datos obligatorios válidos
   - **When** completa el registro como prestador y acepta términos y tratamiento de datos
   - **Then** la cuenta se crea con rol Prestador y puede continuar al perfil profesional

2. **Scenario**: Identidad ya registrada
   - **Given** existe una cuenta asociada al identificador de acceso suministrado
   - **When** se intenta registrar otra cuenta con el mismo identificador
   - **Then** el sistema evita la duplicidad y orienta a iniciar o recuperar acceso

---

### User Story 3 - Iniciar sesión [US-003] (Priority: P1)

Como usuario registrado, quiero autenticarme para acceder de forma segura a las funciones de mi cuenta.

**Why this priority**: Es un control de acceso transversal para toda operación autenticada.

**Independent Test**: Se prueba con credenciales válidas e inválidas, verificando acceso únicamente en el primer caso.

**Acceptance Scenarios**:

1. **Scenario**: Inicio de sesión válido
   - **Given** existe una cuenta activa con credenciales válidas
   - **When** el usuario inicia sesión
   - **Then** el sistema autentica la cuenta y crea una sesión válida

2. **Scenario**: Credenciales inválidas
   - **Given** existe una cuenta pero se presentan credenciales incorrectas
   - **When** el usuario intenta iniciar sesión
   - **Then** el acceso es rechazado sin revelar información sensible sobre la cuenta

---

### User Story 4 - Acceder según rol [US-006] (Priority: P1)

Como usuario autenticado, quiero ver y ejecutar únicamente las capacidades permitidas para mi rol.

**Why this priority**: Evita accesos funcionales indebidos entre Cliente y Prestador y preserva la separación de responsabilidades.

**Independent Test**: Se prueba autenticando cuentas de ambos roles e intentando acceder a rutas/acciones exclusivas del rol contrario.

**Acceptance Scenarios**:

1. **Scenario**: Acceso autorizado
   - **Given** un usuario autenticado con un rol válido
   - **When** solicita una capacidad permitida para su rol
   - **Then** el sistema concede el acceso

2. **Scenario**: Acceso no autorizado por rol
   - **Given** un usuario autenticado intenta una capacidad exclusiva de otro rol
   - **When** solicita ejecutar la acción
   - **Then** el sistema deniega la acción y no modifica datos

---

### User Story 5 - Aceptar términos y tratamiento de datos [US-007] (Priority: P1)

Como usuario que se registra, quiero conocer y aceptar los términos y el tratamiento de datos requeridos para usar la plataforma.

**Why this priority**: Es un prerrequisito explícito incluido en ambos registros y afecta cumplimiento y trazabilidad del consentimiento.

**Independent Test**: Se prueba intentando completar los registros con y sin aceptación y comprobando que el consentimiento queda asociado a la cuenta.

**Acceptance Scenarios**:

1. **Scenario**: Consentimiento registrado
   - **Given** un registro nuevo muestra las condiciones vigentes
   - **When** el usuario las acepta y finaliza el registro
   - **Then** el sistema registra la aceptación vinculada a la cuenta

2. **Scenario**: Consentimiento obligatorio ausente
   - **Given** el usuario no ha aceptado una condición obligatoria
   - **When** intenta finalizar el registro
   - **Then** el sistema bloquea la finalización y no registra al usuario

---

### User Story 6 - Separar ubicación aproximada y dirección exacta [US-013] (Priority: P1)

Como usuario, quiero que la plataforma diferencie la zona aproximada de mi dirección exacta para preservar mi privacidad durante solicitudes abiertas.

**Why this priority**: Es una regla crítica de privacidad declarada explícitamente en los diagramas y condiciona varios flujos posteriores.

**Independent Test**: Se prueba creando/consultando una solicitud abierta y verificando que terceros solo reciben zona aproximada; tras contratación, se valida el flujo autorizado de coordinación.

**Acceptance Scenarios**:

1. **Scenario**: Solicitud abierta protege dirección
   - **Given** existe una solicitud abierta con zona aproximada y dirección exacta registrada
   - **When** otro participante consulta la solicitud
   - **Then** se muestra únicamente la zona aproximada y la dirección exacta permanece protegida

2. **Scenario**: Uso posterior a contratación
   - **Given** una propuesta ha sido aceptada y existe un servicio contratado
   - **When** se habilitan los datos de coordinación según las reglas del servicio
   - **Then** la dirección exacta solo puede quedar disponible dentro del flujo autorizado

---

### User Story 7 - Cerrar sesión [US-004] (Priority: P2)

Como usuario autenticado, quiero cerrar mi sesión para terminar el acceso desde el dispositivo actual.

**Why this priority**: Reduce exposición por sesiones abandonadas y completa el ciclo básico de autenticación.

**Independent Test**: Se prueba cerrando sesión y verificando que las funciones autenticadas dejan de estar disponibles hasta una nueva autenticación.

**Acceptance Scenarios**:

1. **Scenario**: Cierre de sesión exitoso
   - **Given** existe una sesión activa
   - **When** el usuario solicita cerrar sesión
   - **Then** la sesión actual deja de autorizar operaciones protegidas

---

### User Story 8 - Recuperar acceso [US-005] (Priority: P2)

Como usuario registrado que perdió acceso, quiero iniciar un proceso de recuperación para volver a entrar a mi cuenta.

**Why this priority**: Evita pérdida de cuentas y reduce soporte manual.

**Independent Test**: Se prueba iniciando recuperación para una cuenta existente y comprobando que el usuario puede restablecer el acceso mediante el mecanismo definido.

**Acceptance Scenarios**:

1. **Scenario**: Recuperación iniciada
   - **Given** existe una cuenta recuperable
   - **When** el usuario solicita recuperar acceso
   - **Then** el sistema inicia el mecanismo de recuperación sin exponer datos innecesarios

2. **Scenario**: Solicitud no verificable
   - **Given** la solicitud no puede validarse con el mecanismo definido
   - **When** se intenta completar la recuperación
   - **Then** el sistema no concede acceso y mantiene la cuenta protegida

---

### User Story 9 - Editar datos básicos [US-008] (Priority: P2)

Como usuario autenticado, quiero actualizar mis datos básicos para mantener mi información vigente.

**Why this priority**: Mantiene la calidad de los datos utilizados por otros flujos de la plataforma.

**Independent Test**: Se prueba modificando un dato editable y verificando que el nuevo valor persiste y aparece en consultas posteriores autorizadas.

**Acceptance Scenarios**:

1. **Scenario**: Actualización válida
   - **Given** un usuario autenticado consulta sus datos editables
   - **When** modifica valores válidos y guarda
   - **Then** el sistema persiste los cambios y presenta la información actualizada

2. **Scenario**: Dato inválido
   - **Given** un usuario introduce un valor que incumple las reglas del campo
   - **When** intenta guardar
   - **Then** el sistema rechaza ese cambio e indica el error

---

### User Story 10 - Gestionar zona aproximada [US-009] (Priority: P2)

Como usuario, quiero definir o actualizar una zona aproximada para soportar descubrimiento y compatibilidad sin publicar mi dirección exacta.

**Why this priority**: La zona aproximada habilita matching y búsqueda preservando privacidad.

**Independent Test**: Se prueba actualizando la zona y verificando que se usa como referencia aproximada sin exponer dirección exacta.

**Acceptance Scenarios**:

1. **Scenario**: Actualizar zona aproximada
   - **Given** un usuario autenticado tiene acceso a su configuración de ubicación
   - **When** selecciona una zona válida
   - **Then** el sistema guarda la zona aproximada separada de cualquier dirección exacta

---

### User Story 11 - Controlar visibilidad de datos personales [US-010] (Priority: P2)

Como usuario, quiero controlar qué datos personales pueden ser visibles para otros participantes.

**Why this priority**: Permite aplicar privacidad por diseño y minimizar exposición de información.

**Independent Test**: Se prueba cambiando una preferencia de visibilidad y consultando el perfil desde otra cuenta para verificar el efecto.

**Acceptance Scenarios**:

1. **Scenario**: Ocultar dato configurable
   - **Given** un usuario tiene un dato personal con visibilidad configurable
   - **When** lo marca como no visible
   - **Then** otros usuarios dejan de verlo donde aplique

2. **Scenario**: No sobrepasar privacidad base
   - **Given** una preferencia de usuario intenta ampliar visibilidad
   - **When** el dato está protegido por una regla superior, como la dirección exacta durante una solicitud abierta
   - **Then** el sistema mantiene la restricción superior

---

### User Story 12 - Consultar datos almacenados [US-011] (Priority: P3)

Como usuario, quiero consultar los datos que la plataforma mantiene sobre mi cuenta para tener transparencia sobre mi información.

**Why this priority**: Aporta control y transparencia, aunque no bloquea los flujos transaccionales principales del MVP.

**Independent Test**: Se prueba solicitando la consulta desde una cuenta autenticada y verificando que se presentan los datos asociados que correspondan.

**Acceptance Scenarios**:

1. **Scenario**: Consulta de datos propios
   - **Given** un usuario está autenticado
   - **When** solicita consultar sus datos almacenados
   - **Then** el sistema presenta la información correspondiente a su propia cuenta

---

### User Story 13 - Solicitar eliminación de cuenta [US-012] (Priority: P3)

Como usuario, quiero solicitar la eliminación de mi cuenta para dejar de utilizar la plataforma y ejercer control sobre mis datos.

**Why this priority**: Es importante para gestión del ciclo de vida de la cuenta y cumplimiento, pero puede depender de reglas de retención aún no definidas.

**Independent Test**: Se prueba enviando una solicitud de eliminación y verificando que entra al flujo correspondiente sin afectar cuentas de terceros.

**Acceptance Scenarios**:

1. **Scenario**: Solicitud de eliminación
   - **Given** un usuario autenticado desea eliminar su cuenta
   - **When** confirma la solicitud
   - **Then** el sistema registra la solicitud y aplica el estado definido para el proceso

2. **Scenario**: Cuenta con relaciones activas
   - **Given** la cuenta tiene servicios, reportes u obligaciones todavía activas
   - **When** el usuario solicita eliminación
   - **Then** el sistema aplica la política definida sin perder integridad ni trazabilidad obligatoria

---

### Edge Cases

- Un usuario intenta registrarse con un identificador ya asociado a una cuenta: el sistema evita duplicidad y dirige a autenticación o recuperación.
- Una sesión cerrada o expirada intenta ejecutar una operación protegida: la operación debe rechazarse sin modificar estado.
- Un Cliente intenta ejecutar una función exclusiva de Prestador, o viceversa: el control de rol debe impedirlo.
- La zona aproximada cambia mientras existen solicitudes abiertas: las solicitudes existentes deben conservar una representación coherente según la regla de producto definida.
- Una preferencia de visibilidad entra en conflicto con la protección obligatoria de dirección exacta: prevalece la regla más restrictiva.
- Se solicita eliminación con servicios o reportes activos: el sistema debe preservar integridad y trazabilidad según política de retención pendiente.

## Requirements *(mandatory)*

### Requisitos Funcionales

- **FR-001**: El sistema DEBE permitir la creación de una cuenta de Cliente únicamente después de que se hayan aceptado los términos requeridos y el consentimiento de tratamiento de datos.
- **FR-002**: El sistema DEBE permitir la creación de una cuenta de Prestador únicamente después de que se hayan aceptado los términos requeridos y el consentimiento de tratamiento de datos. 
- **FR-003**: El sistema DEBE autenticar a los usuarios registrados y rechazar los intentos de autenticación no válidos. 
- **FR-004**: El sistema DEBE invalidar la sesión autenticada actual cuando el usuario cierre sesión. 
- **FR-005**: El sistema DEBE proporcionar un flujo de recuperación de cuenta que no revele información confidencial de la cuenta. 
- **FR-006**: El sistema DEBE hacer cumplir el acceso basado en roles entre las funcionalidades de Cliente y Prestador. 
- **FR-007**: El sistema DEBE guardar y conservar evidencia de la aceptación de los términos aplicables y las condiciones de tratamiento de datos.
- **FR-008**: Los usuarios DEBEN poder editar los datos básicos de la cuenta designados como editables.
- **FR-009**: Los usuarios DEBEN poder definir y actualizar una zona aproximada de manera independiente de la dirección exacta. 
- **FR-010**: Los usuarios DEBEN poder gestionar la visibilidad configurable de sus datos personales, sujeto a reglas de privacidad estrictas. 
- **FR-011**: Los usuarios DEBEN poder consultar los datos almacenados para su propia cuenta. 
- **FR-012**: Los usuarios DEBEN poder solicitar la eliminación de su cuenta. 
- **FR-013**: El sistema DEBE evitar la divulgación de una dirección exacta mientras una solicitud de servicio permanezca abierta y DEBE mantener los datos de la dirección exacta diferenciados de los datos de ubicación aproximada. 
- **FR-014**: El sistema DEBE definir qué mecanismos de identificadores y credenciales son compatibles para la autenticación y la recuperación. 
- **FR-015**: El sistema DEBE aplicar una política de eliminación de cuentas y retención de datos.

### Key Entities *(include if feature involves data)*

- **Usuario**: Cuenta base de una persona que usa CONectaSM; incluye identidad de cuenta, rol, estado, preferencias y consentimientos.
- **Rol**: Clasificación funcional de acceso, al menos Cliente o Prestador.
- **Consentimiento**: Registro de aceptación de términos y tratamiento de datos aplicable a una cuenta.
- **Ubicación aproximada**: Zona usada para descubrimiento/matching sin revelar una dirección exacta.
- **Dirección exacta**: Dato sensible de coordinación, separado de la zona aproximada y protegido durante solicitudes abiertas.
- **Preferencia de privacidad**: Reglas configurables de visibilidad de datos personales, subordinadas a las restricciones obligatorias del sistema.
- **Solicitud de eliminación**: Petición del usuario para iniciar el proceso de cierre/eliminación de su cuenta.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% de los registros nuevos de Cliente y Prestador requieren consentimiento obligatorio antes de crear la cuenta.
- **SC-002**: 100% de las pruebas de autorización entre roles impiden acciones exclusivas del rol contrario.
- **SC-003**: En 100% de las solicitudes abiertas usadas en pruebas de aceptación, la dirección exacta no es visible para terceros.
- **SC-004**: Al menos 95% de usuarios de prueba completan registro e inicio de sesión en el primer intento sin asistencia.
- **SC-005**: 100% de las solicitudes de cierre de sesión invalidan el acceso autenticado de la sesión cerrada.
- **SC-006**: Las operaciones de consulta/edición de datos propios nunca exponen ni modifican información perteneciente a otra cuenta.
