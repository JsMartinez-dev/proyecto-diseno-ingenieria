# Feature Specification: SPEC-16 — Onboarding asistido

**Creado**: 2026-09-16  
**Casos de uso cubiertos**: UC091

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Acompañamiento inicial (Priority: P2)

Como prestador, quiero recibir orientación asistida por WhatsApp o un gestor para completar los primeros pasos de la plataforma.

**Why this priority**: Esta funcionalidad aporta valor directo al flujo de la plataforma y su prioridad refleja su dependencia y relevancia para el alcance definido.

**Independent Test**: Solicitar onboarding, elegir el canal disponible y comprobar que queda una solicitud de acompañamiento.

**Acceptance Scenarios**:

1. **Scenario**: Flujo exitoso de acompañamiento inicial
   - **Given** el actor tiene permisos y los datos requeridos son válidos
   - **When** ejecuta la acción principal del caso de uso
   - **Then** el sistema completa la operación y deja el resultado trazable

2. **Scenario**: Datos inválidos o condición no permitida en acompañamiento inicial
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

- **FR-001**: El sistema DEBE permitir solicitar onboarding asistido.
- **FR-002**: El sistema DEBE ofrecer WhatsApp o gestor comunitario según disponibilidad.
- **FR-003**: El sistema DEBE registrar el estado de la solicitud de acompañamiento.
- **FR-004**: El sistema DEBE informar al usuario qué datos se compartirán con el canal elegido.

### Key Entities *(include if feature involves data)*

- **Solicitud de onboarding**: usuario, canal, necesidad, estado y fechas.
- **Gestor comunitario**: identidad, disponibilidad, zona y asignaciones.
- **Consentimiento de derivación**: usuario, datos compartidos, canal y fecha.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Una solicitud no puede asignarse a un gestor no disponible.
- **SC-002**: El usuario puede cancelar la derivación antes de compartir datos.
- **SC-003**: La plataforma confirma la creación de la solicitud sin prometer una atención inmediata.

## Trazabilidad

- **Diagrama de origen**: Casos de uso UC091.
- **Alcance**: La especificación describe el comportamiento observable y no prescribe tecnologías ni rutas de implementación.
