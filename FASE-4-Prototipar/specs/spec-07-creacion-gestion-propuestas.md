# Feature Specification: SPEC-07 — Creación y gestión de propuestas

**Creado**: 2026-09-16  
**Casos de uso cubiertos**: UC039–UC047

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Presentación de propuesta (Priority: P1)

Como prestador, quiero crear una propuesta con disponibilidad y mensaje para ofrecer atender una solicitud.

**Why this priority**: Esta funcionalidad aporta valor directo al flujo de la plataforma y su prioridad refleja su dependencia y relevancia para el alcance definido.

**Independent Test**: Enviar una propuesta válida y comprobar que queda asociada a la solicitud.

**Acceptance Scenarios**:

1. **Scenario**: Flujo exitoso de presentación de propuesta
   - **Given** el actor tiene permisos y los datos requeridos son válidos
   - **When** ejecuta la acción principal del caso de uso
   - **Then** el sistema completa la operación y deja el resultado trazable

2. **Scenario**: Datos inválidos o condición no permitida en presentación de propuesta
   - **Given** falta un dato obligatorio o el estado no permite la operación
   - **When** el actor intenta completar la acción
   - **Then** el sistema rechaza la operación, explica el motivo y conserva la información válida

---

### User Story 2 - Administración y selección (Priority: P1)

Como prestador y cliente, quiero editar, retirar, consultar y aceptar propuestas para seleccionar una opción.

**Why this priority**: Esta funcionalidad aporta valor directo al flujo de la plataforma y su prioridad refleja su dependencia y relevancia para el alcance definido.

**Independent Test**: Consultar propuestas, modificar o retirar una propia y aceptar una propuesta válida como cliente.

**Acceptance Scenarios**:

1. **Scenario**: Flujo exitoso de administración y selección
   - **Given** el actor tiene permisos y los datos requeridos son válidos
   - **When** ejecuta la acción principal del caso de uso
   - **Then** el sistema completa la operación y deja el resultado trazable

2. **Scenario**: Datos inválidos o condición no permitida en administración y selección
   - **Given** falta un dato obligatorio o el estado no permite la operación
   - **When** el actor intenta completar la acción
   - **Then** el sistema rechaza la operación, explica el motivo y conserva la información válida

---

### Edge Cases

- Si faltan datos obligatorios, el sistema identifica cada campo pendiente y no crea un registro incompleto.
- Si el actor pierde la sesión o la red falla, el sistema no confirma una operación que no haya sido persistida.
- Si el estado del recurso cambió en otra operación, el sistema informa el conflicto y solicita consultar la información actualizada.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE permitir al prestador crear una propuesta sobre una solicitud elegible.
- **FR-002**: El sistema DEBE permitir indicar disponibilidad y agregar un mensaje.
- **FR-003**: El sistema DEBE permitir editar o retirar una propuesta activa bajo las reglas del estado.
- **FR-004**: El sistema DEBE permitir al cliente consultar propuestas recibidas y aceptar una.
- **FR-005**: El sistema DEBE cerrar las propuestas no seleccionadas cuando corresponda.

### Key Entities *(include if feature involves data)*

- **Propuesta**: prestador, solicitud, disponibilidad, mensaje, estado y fechas.
- **Selección**: propuesta elegida, cliente, fecha de aceptación y motivo de cierre.
- **Notificación**: evento de propuesta, destinatario y estado de entrega.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: No se puede proponer sobre una solicitud cancelada o cerrada.
- **SC-002**: Una propuesta retirada deja de estar disponible para aceptación.
- **SC-003**: Aceptar una propuesta cambia de forma consistente el estado de las demás propuestas.

## Trazabilidad

- **Diagrama de origen**: Casos de uso UC039–UC047.
- **Alcance**: La especificación describe el comportamiento observable y no prescribe tecnologías ni rutas de implementación.
