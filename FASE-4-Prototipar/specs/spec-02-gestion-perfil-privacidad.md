# Feature Specification: SPEC-02 — Gestión de perfil y privacidad

**Creado**: 2026-09-16  
**Casos de uso cubiertos**: UC008–UC013

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Administración de datos personales (Priority: P1)

Como usuario, quiero consultar y editar mis datos básicos para mantener mi información vigente.

**Why this priority**: Esta funcionalidad aporta valor directo al flujo de la plataforma y su prioridad refleja su dependencia y relevancia para el alcance definido.

**Independent Test**: Modificar un dato permitido y verificar que queda disponible en una consulta posterior autorizada.

**Acceptance Scenarios**:

1. **Scenario**: Flujo exitoso de administración de datos personales
   - **Given** el actor tiene permisos y los datos requeridos son válidos
   - **When** ejecuta la acción principal del caso de uso
   - **Then** el sistema completa la operación y deja el resultado trazable

2. **Scenario**: Datos inválidos o condición no permitida en administración de datos personales
   - **Given** falta un dato obligatorio o el estado no permite la operación
   - **When** el actor intenta completar la acción
   - **Then** el sistema rechaza la operación, explica el motivo y conserva la información válida

---

### User Story 2 - Privacidad y eliminación de cuenta (Priority: P1)

Como usuario, quiero controlar la visibilidad de mis datos y solicitar la eliminación de mi cuenta para proteger mi información.

**Why this priority**: Esta funcionalidad aporta valor directo al flujo de la plataforma y su prioridad refleja su dependencia y relevancia para el alcance definido.

**Independent Test**: Cambiar visibilidad, comprobar la separación entre zona aproximada y dirección exacta y solicitar eliminación.

**Acceptance Scenarios**:

1. **Scenario**: Flujo exitoso de privacidad y eliminación de cuenta
   - **Given** el actor tiene permisos y los datos requeridos son válidos
   - **When** ejecuta la acción principal del caso de uso
   - **Then** el sistema completa la operación y deja el resultado trazable

2. **Scenario**: Datos inválidos o condición no permitida en privacidad y eliminación de cuenta
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

- **FR-001**: El sistema DEBE permitir consultar los datos almacenados del usuario autenticado.
- **FR-002**: El sistema DEBE validar y persistir los cambios en datos básicos editables.
- **FR-003**: El sistema DEBE separar la zona aproximada de la dirección exacta.
- **FR-004**: El sistema DEBE aplicar las preferencias de visibilidad sin superar las reglas de privacidad base.
- **FR-005**: El sistema DEBE registrar y procesar la solicitud de eliminación de cuenta.

### Key Entities *(include if feature involves data)*

- **Perfil de usuario**: datos básicos y preferencias de visibilidad.
- **Ubicación**: zona aproximada y dirección exacta con reglas de exposición distintas.
- **Solicitud de eliminación**: usuario, fecha, estado y confirmación.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: La información exacta no se muestra en una solicitud abierta cuando solo corresponde publicar la zona.
- **SC-002**: Un dato inválido no modifica el valor previamente guardado.
- **SC-003**: Toda solicitud de eliminación queda registrada y no se ejecuta sin la confirmación requerida.

## Trazabilidad

- **Diagrama de origen**: Casos de uso UC008–UC013.
- **Alcance**: La especificación describe el comportamiento observable y no prescribe tecnologías ni rutas de implementación.
