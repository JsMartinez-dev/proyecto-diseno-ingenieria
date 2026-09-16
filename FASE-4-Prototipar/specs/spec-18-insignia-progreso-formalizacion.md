# Feature Specification: SPEC-18 — Insignia y progreso de formalización

**Creado**: 2026-09-16  
**Casos de uso cubiertos**: UC088

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visualización de progreso (Priority: P2)

Como prestador, quiero ver una insignia de progreso de formalización para reconocer los pasos informativos que he completado.

**Why this priority**: Esta funcionalidad aporta valor directo al flujo de la plataforma y su prioridad refleja su dependencia y relevancia para el alcance definido.

**Independent Test**: Completar un paso no legal y comprobar que cambia el progreso sin presentarlo como certificación.

**Acceptance Scenarios**:

1. **Scenario**: Flujo exitoso de visualización de progreso
   - **Given** el actor tiene permisos y los datos requeridos son válidos
   - **When** ejecuta la acción principal del caso de uso
   - **Then** el sistema completa la operación y deja el resultado trazable

2. **Scenario**: Datos inválidos o condición no permitida en visualización de progreso
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

- **FR-001**: El sistema DEBE mostrar el progreso informativo de la ruta de formalización.
- **FR-002**: El sistema DEBE asignar una insignia conforme a reglas transparentes.
- **FR-003**: El sistema DEBE permitir consultar qué pasos contribuyeron al progreso.
- **FR-004**: El sistema DEBE aclarar que la insignia no acredita un estatus legal.

### Key Entities *(include if feature involves data)*

- **Progreso**: prestador, pasos completados, porcentaje, fecha y versión de reglas.
- **Insignia**: nivel, nombre, descripción, condiciones y fecha de obtención.
- **Paso informativo**: contenido, estado y evidencia de consulta.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un paso no verificable no incrementa el progreso.
- **SC-002**: El porcentaje se calcula con la misma versión de reglas para todos los usuarios.
- **SC-003**: La insignia incluye una aclaración visible sobre su carácter no legal.

## Trazabilidad

- **Diagrama de origen**: Casos de uso UC088.
- **Alcance**: La especificación describe el comportamiento observable y no prescribe tecnologías ni rutas de implementación.
