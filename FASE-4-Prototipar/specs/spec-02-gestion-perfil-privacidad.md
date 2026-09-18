# Feature Specification: SPEC-02 — Gestión de perfil y privacidad

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC008–UC012
	

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Administración de datos personales [UC008, UC011] (Priority: P1)

Como usuario, quiero consultar y editar mis datos básicos para mantener mi información vigente.

**Why this priority**: Es la base de cualquier otra funcionalidad de perfil; sin poder consultar y editar sus datos, el usuario no puede mantener su cuenta actualizada.

**Independent Test**: Modificar un dato permitido y verificar que queda disponible en una consulta posterior autorizada.

**Acceptance Scenarios**:

1. **Scenario**: Consulta de datos almacenados [UC011]
   - **Given** un usuario autenticado accede a su perfil
   - **When** consulta sus datos almacenados
   - **Then** el sistema muestra únicamente los datos asociados a su propia cuenta

2. **Scenario**: Edición exitosa de datos básicos [UC008]
   - **Given** un usuario autenticado modifica un dato editable (ej. nombre, teléfono) con un valor válido
   - **When** guarda el cambio
   - **Then** el sistema persiste el nuevo valor y lo refleja en consultas posteriores

3. **Scenario**: Edición con dato inválido [UC008]
   - **Given** un usuario ingresa un dato con formato inválido (ej. correo mal formado)
   - **When** intenta guardar el cambio
   - **Then** el sistema rechaza la actualización y conserva el valor previamente guardado


---

### User Story 2 - Privacidad y visibilidad de ubicación [UC009, UC010; regla de privacidad UC013] (Priority: P1)

Como usuario, quiero controlar la visibilidad de mis datos de ubicación y de mi perfil en general, para proteger mi información frente a terceros.

**Why this priority**: La separación entre zona aproximada y dirección exacta es una restricción de privacidad crítica que atraviesa otros módulos, por lo cual debe quedar garantizada desde el perfil.

**Independent Test**: Cambiar la preferencia de visibilidad y comprobar que la separación entre zona aproximada y dirección exacta se respeta en lo que queda expuesto.

**Acceptance Scenarios**:

1. **Scenario**: Configurar zona aproximada [UC009]
   - **Given** un usuario edita su perfil
   - **When** define o actualiza su zona aproximada
   - **Then** el sistema la persiste como el dato de ubicación expuesto por defecto

2. **Scenario**: Cambiar visibilidad de datos personales [UC010]
   - **Given** un usuario tiene una preferencia de visibilidad configurable
   - **When** la modifica
   - **Then** el sistema aplica la nueva preferencia sin superar las reglas de privacidad base del producto

1. **Scenario**: Separación entre zona aproximada y dirección exacta [Regla UC013]
   - **Given** un usuario tiene registrada tanto su zona aproximada como su dirección exacta
   - **When** un tercero sin autorización explícita consulta su perfil
   - **Then** el sistema expone únicamente la zona aproximada, nunca la dirección exacta


---

### User Story 3 - Eliminación de cuenta [UC012] (Priority: P2)

Como usuario, quiero solicitar la eliminación de mi cuenta para dejar de tener presencia en la plataforma cuando ya no la necesite.

**Why this priority**: Es una funcionalidad independiente y menos frecuente que la edición de perfil; no bloquea el uso normal de la plataforma, pero es un derecho del usuario que debe estar disponible.

**Independent Test**: Solicitar la eliminación de una cuenta de prueba y verificar que queda registrada con el estado correcto hasta su confirmación.

**Acceptance Scenarios**:

1. **Scenario**: Solicitud de eliminación registrada [UC012]
   - **Given** un usuario autenticado solicita eliminar su cuenta
   - **When** confirma la solicitud
   - **Then** el sistema la registra con fecha, usuario y estado, sin ejecutar la eliminación de forma inmediata

2. **Scenario**: Eliminación no ejecutada sin confirmación [UC012]
   - **Given** existe una solicitud de eliminación pendiente
   - **When** no se completa el paso de confirmación requerido
   - **Then** el sistema no elimina la cuenta ni los datos asociados


---

### Edge Cases

- Un usuario solicita eliminar su cuenta mientras tiene un servicio en  ejecución: El sistema debe bloquear la solicitud de eliminación hasta que los servicios en ejecución hayan finalizado.
- Una solicitud de eliminación de cuenta permanece pendiente durante más de 24 horas: el sistema deberá marcar automáticamente la solicitud como expirada, mantener la cuenta activa y requerir que el usuario genere una nueva solicitud si desea eliminarla.
- Un usuario edita su zona aproximada mientras tiene una dirección exacta ya registrada para un servicio activo: el cambio de zona no debe alterar la dirección exacta ya comprometida con ese servicio.
- Dos actualizaciones de perfil llegan casi al mismo tiempo desde dos sesiones distintas del mismo usuario: el sistema no debe perder ninguno de los cambios válidos ni dejar el perfil en un estado parcialmente corrupto.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE permitir consultar los datos almacenados del usuario autenticado, limitados a su propia cuenta. *(UC011)*
- **FR-002**: El sistema DEBE validar y persistir los cambios en datos básicos editables, rechazando valores con formato inválido sin alterar el valor previo. *(UC008)*
- **FR-003**: El sistema DEBE permitir configurar y actualizar la zona aproximada del usuario. *(UC009)*
- **FR-004**: El sistema DEBE aplicar las preferencias de visibilidad configuradas por el usuario sin superar las reglas de privacidad base definidas por el producto. *(UC010)*
- **FR-005**: El sistema DEBE separar de forma estricta la zona aproximada de la dirección exacta, exponiendo esta última únicamente cuando la regla de negocio correspondiente lo autorice explícitamente. *(Regla de privacidad UC013 aplicada a UC009 y UC010)*
- **FR-006**: El sistema DEBE registrar toda solicitud de eliminación de cuenta con usuario, fecha y estado. *(UC012)*
- **FR-007**: El sistema NO DEBE ejecutar la eliminación de una cuenta sin la confirmación explícita requerida. *(UC012)*

### Key Entities *(include if feature involves data)*

- **Perfil de usuario**: datos básicos editables y preferencias de visibilidad.
- **Ubicación**: zona aproximada (expuesta por defecto) y dirección exacta (expuesta solo bajo reglas específicas), con reglas de exposición distintas.
- **Solicitud de eliminación**: usuario, fecha, estado (pendiente/confirmada/rechazada) y confirmación asociada.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: La dirección exacta no se muestra en el 100% de los casos donde solo corresponde exponer la zona aproximada.
- **SC-002**: Un dato con formato inválido nunca modifica el valor previamente guardado, en el 100% de los intentos de edición.
- **SC-003**: Toda solicitud de eliminación queda registrada y ninguna se ejecuta sin la confirmación requerida.
- **SC-004**: El 100% de las consultas de datos almacenados devuelve exclusivamente información de la cuenta del solicitante.

