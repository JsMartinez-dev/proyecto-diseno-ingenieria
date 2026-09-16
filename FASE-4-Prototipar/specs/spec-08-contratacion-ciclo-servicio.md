# Feature Specification: SPEC-08 — Contratación y ciclo de vida del servicio

**Creado**: 2026-09-16  
**Casos de uso cubiertos**: UC048–UC056

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Formalización del servicio (Priority: P1)

Como cliente, quiero aceptar una propuesta y registrar el servicio contratado para iniciar la coordinación.

**Why this priority**: Esta funcionalidad aporta valor directo al flujo de la plataforma y su prioridad refleja su dependencia y relevancia para el alcance definido.

**Independent Test**: Aceptar una propuesta y comprobar que se crea un servicio con los datos autorizados.

**Acceptance Scenarios**:

1. **Scenario**: Flujo exitoso de formalización del servicio
   - **Given** el actor tiene permisos y los datos requeridos son válidos
   - **When** ejecuta la acción principal del caso de uso
   - **Then** el sistema completa la operación y deja el resultado trazable

2. **Scenario**: Datos inválidos o condición no permitida en formalización del servicio
   - **Given** falta un dato obligatorio o el estado no permite la operación
   - **When** el actor intenta completar la acción
   - **Then** el sistema rechaza la operación, explica el motivo y conserva la información válida

---

### User Story 2 - Seguimiento y cierre (Priority: P1)

Como cliente o prestador, quiero consultar y actualizar el estado del servicio hasta su finalización o cancelación.

**Why this priority**: Esta funcionalidad aporta valor directo al flujo de la plataforma y su prioridad refleja su dependencia y relevancia para el alcance definido.

**Independent Test**: Recorrer estados válidos, confirmar la finalización y consultar el historial.

**Acceptance Scenarios**:

1. **Scenario**: Flujo exitoso de seguimiento y cierre
   - **Given** el actor tiene permisos y los datos requeridos son válidos
   - **When** ejecuta la acción principal del caso de uso
   - **Then** el sistema completa la operación y deja el resultado trazable

2. **Scenario**: Datos inválidos o condición no permitida en seguimiento y cierre
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

- **FR-001**: El sistema DEBE registrar un servicio contratado al aceptar una propuesta.
- **FR-002**: El sistema DEBE habilitar datos de comunicación únicamente después de la contratación.
- **FR-003**: El sistema DEBE permitir consultar detalle, marcar ejecución, terminar, confirmar o cancelar según el estado.
- **FR-004**: El sistema DEBE conservar un historial ordenado de cambios de estado.
- **FR-005**: El sistema DEBE permitir usar el canal de comunicación autorizado dentro del servicio.

### Key Entities *(include if feature involves data)*

- **Servicio contratado**: cliente, prestador, solicitud, propuesta, datos autorizados y estado.
- **Transición de estado**: estado anterior, nuevo estado, actor, fecha y motivo.
- **Canal autorizado**: participantes, permisos, mensajes y vigencia.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Una transición inválida no modifica el estado del servicio.
- **SC-002**: La dirección exacta permanece protegida hasta que la contratación autoriza su uso.
- **SC-003**: Un servicio finalizado no puede volver a ejecución sin una regla explícita de reapertura.

## Trazabilidad

- **Diagrama de origen**: Casos de uso UC048–UC056.
- **Alcance**: La especificación describe el comportamiento observable y no prescribe tecnologías ni rutas de implementación.
