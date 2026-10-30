# Feature Specification: SPEC-07 — Creación y gestión de propuestas

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC039, UC040, UC041, UC042, UC043, UC044 

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Crear una propuesta para una solicitud [UC039, UC040, UC041, UC044] (Priority: P1)

Como prestador, quiero crear una propuesta para una solicitud publicada indicando obligatoriamente mi disponibilidad, y agregar un mensaje si lo considero útil, para que el cliente reciba una propuesta completa y sea notificado de inmediato.

**Why this priority**: Es la acción con la que un Prestador convierte una oportunidad compatible (SPEC-06) en una posibilidad real de contratación; sin ella no hay nada que el Cliente pueda comparar ni aceptar.

**Independent Test**: Con una solicitud abierta compatible con un Prestador, crear una propuesta indicando disponibilidad sin mensaje y verificar que se crea y notifica igual; repetir agregando un mensaje y verificar que también queda incluido; intentar crear la propuesta sin disponibilidad y verificar el rechazo.

**Acceptance Scenarios**:

1. **Scenario**: Creación completa con disponibilidad obligatoria [UC040]
    
    - **Given** un Prestador tiene una solicitud abierta y compatible con su perfil
    - **When** crea una propuesta indicando su disponibilidad para atenderla
    - **Then** el sistema guarda la propuesta vinculada a esa solicitud, en estado activo
2. **Scenario**: Intento de crear una propuesta sin disponibilidad
    
    - **Given** un Prestador intenta crear una propuesta sin indicar su disponibilidad
    - **When** confirma la operación
    - **Then** el sistema rechaza la creación y señala el dato obligatorio faltante
3. **Scenario**: Agregar un mensaje de forma opcional [UC041]
    
    - **Given** un Prestador está creando su propuesta
    - **When** agrega un mensaje adicional para el Cliente
    - **Then** el sistema lo asocia a la propuesta; si no agrega ningún mensaje, la propuesta se crea igualmente sin él
4. **Scenario**: Notificar al cliente sobre la nueva propuesta [UC044 ]
    
    - **Given** un Prestador crea una propuesta para la solicitud de un Cliente
    - **When** la propuesta queda registrada
    - **Then** el sistema notifica automáticamente al Cliente sobre la propuesta recibida, sin que ningún actor deba disparar esa notificación por separado
5. **Scenario**: Propuesta sobre una solicitud que ya no está abierta
    
    - **Given** una solicitud ya fue cancelada o ya tiene un servicio contratado
    - **When** un Prestador intenta crear una propuesta para ella
    - **Then** el sistema rechaza la creación e indica que la solicitud ya no admite nuevas propuestas
6. **Scenario**: Actor no autorizado
    
    - **Given** un actor sin rol Prestador intenta crear una propuesta
    - **When** realiza la solicitud
    - **Then** el sistema deniega la operación

### User Story 2 - Editar una propuesta activa [UC042] (Priority: P1)

Como prestador, quiero editar una propuesta que sigue activa, para corregir o ajustar su contenido antes de que el cliente decida.

**Why this priority**: Las condiciones de una propuesta pueden cambiar (disponibilidad, mensaje) mientras el Cliente aún no ha decidido, y el Prestador necesita poder reflejarlo sin crear una propuesta duplicada.

**Independent Test**: Con una propuesta propia en estado activo, editar uno de sus datos y verificar el cambio; intentar editar una propuesta ya retirada o una que ya fue aceptada/rechazada y verificar el rechazo.

**Acceptance Scenarios**:

1. **Scenario**: Edición exitosa
    
    - **Given** un Prestador tiene una propuesta propia en estado activo
    - **When** modifica su disponibilidad o su mensaje y confirma
    - **Then** el sistema guarda el cambio y muestra el estado actualizado de la propuesta
2. **Scenario**: Intento de editar una propuesta que ya no está activa
    
    - **Given** una propuesta propia ya fue retirada, aceptada o cerrada
    - **When** el Prestador intenta editarla
    - **Then** el sistema rechaza la edición e indica que la propuesta ya no admite cambios
3. **Scenario**: Actor no autorizado o propuesta ajena
    
    - **Given** un actor sin rol Prestador, o un Prestador que intenta editar una propuesta que no es suya
    - **When** realiza la solicitud
    - **Then** el sistema deniega la operación sin modificar ningún registro

### User Story 3 - Retirar una propuesta [UC043] (Priority: P1)

Como prestador, quiero retirar una propuesta que ya no puedo o no quiero cumplir, para que el cliente no la considere entre sus opciones.

**Why this priority**: Sin poder retirarla, el Cliente podría aceptar una propuesta que el Prestador ya no está en condiciones de atender.

**Independent Test**: Con una propuesta propia activa, retirarla y verificar que deja de estar disponible para el Cliente; intentar retirarla nuevamente y verificar el rechazo.

**Acceptance Scenarios**:

1. **Scenario**: Retiro exitoso
    
    - **Given** un Prestador tiene una propuesta propia activa
    - **When** confirma su retiro
    - **Then** el sistema marca la propuesta como retirada y deja de mostrarla como opción para el Cliente
2. **Scenario**: Intento de retirar una propuesta ya inactiva
    
    - **Given** una propuesta propia ya fue retirada, aceptada o cerrada previamente
    - **When** el Prestador intenta retirarla de nuevo
    - **Then** el sistema rechaza la operación sin cambiar el estado actual
3. **Scenario**: Actor no autorizado o propuesta ajena
    
    - **Given** un actor sin rol Prestador, o un Prestador que intenta retirar una propuesta que no es suya
    - **When** realiza la solicitud
    - **Then** el sistema deniega la operación

---

### Edge Cases

- Un prestador intenta editar una propuesta, o el sistema intenta notificarla como nueva, después de que ya fue retirada: el sistema debe rechazar la edición y no debe generar una notificación de propuesta nueva sobre una propuesta inactiva.
- Un prestador crea una propuesta sin agregar mensaje: el sistema debe completar la creación igualmente, mostrando la propuesta sin mensaje adicional.
- Un prestador intenta crear una propuesta para una solicitud que ya no está abierta: el sistema debe rechazar la creación e indicar que la solicitud ya no admite nuevas propuestas.
- Se pierde la conexión mientras un prestador edita o retira una propuesta: El sistema conserva el último estado confirmado sin duplicar la propuesta ni dejarla en un estado ambiguo.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-039**: El sistema DEBE permitir que un Prestador cree una propuesta vinculada a una solicitud abierta y compatible con su perfil, únicamente si incluye su disponibilidad, y DEBE rechazar la creación si la solicitud ya no está abierta. _(UC039, incluye a UC040)_
- **FR-040**: El sistema DEBE exigir la disponibilidad del Prestador como dato obligatorio de toda propuesta creada. _(UC040, incluido en UC039)_
- **FR-041**: El sistema DEBE permitir, de forma opcional, agregar un mensaje a la propuesta al momento de crearla, sin que su ausencia impida crearla. _(UC041, extiende a UC039)_
- **FR-044**: El sistema DEBE notificar automáticamente al Cliente propietario de la solicitud cuando se cree una nueva propuesta para ella, sin que ningún actor deba solicitar esa notificación por separado. _(UC044, extiende a UC039)_
- **FR-042**: El sistema DEBE permitir que un Prestador edite una propuesta propia mientras esté activa, y DEBE rechazar la edición si la propuesta ya no está activa o no le pertenece. _(UC042)_
- **FR-043**: El sistema DEBE permitir que un Prestador retire una propuesta propia mientras esté activa, y DEBE rechazar el retiro si la propuesta ya no está activa o no le pertenece. _(UC043)_

### Key Entities _(include if feature involves data)_

- **Propuesta**: solicitud a la que responde, Prestador que la crea, disponibilidad indicada, mensaje opcional y estado (activa, editada, retirada, aceptada, cerrada).
- **Actor asignado y autorización**: solo el Prestador propietario de una propuesta puede editarla o retirarla.
- **Notificación de propuesta recibida**: aviso generado hacia el Cliente al crearse una propuesta.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: El 100% de las propuestas creadas incluye disponibilidad del Prestador; ninguna se crea sin este dato.
- **SC-002**: El 100% de las propuestas creadas para una solicitud que ya no está abierta es rechazada.
- **SC-003**: El 100% de las propuestas nuevas genera una notificación hacia el Cliente correspondiente.
- **SC-004**: El 100% de los intentos de editar o retirar una propuesta ajena o ya inactiva es rechazado sin modificar ningún registro.