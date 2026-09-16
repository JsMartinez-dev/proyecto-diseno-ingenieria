# Feature Specification: SPEC-09 — Notificaciones de propuestas y servicios

**Creado**: 2026-09-16  
**Casos de uso cubiertos**: UC057–UC058

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Aviso de aceptación (Priority: P1)

Como participante, quiero recibir una notificación cuando una propuesta sea aceptada para actuar oportunamente.

**Why this priority**: Esta funcionalidad aporta valor directo al flujo de la plataforma y su prioridad refleja su dependencia y relevancia para el alcance definido.

**Independent Test**: Aceptar una propuesta y verificar que el destinatario recibe el evento correspondiente.

**Acceptance Scenarios**:

1. **Scenario**: Flujo exitoso de aviso de aceptación
   - **Given** el actor tiene permisos y los datos requeridos son válidos
   - **When** ejecuta la acción principal del caso de uso
   - **Then** el sistema completa la operación y deja el resultado trazable

2. **Scenario**: Datos inválidos o condición no permitida en aviso de aceptación
   - **Given** falta un dato obligatorio o el estado no permite la operación
   - **When** el actor intenta completar la acción
   - **Then** el sistema rechaza la operación, explica el motivo y conserva la información válida

---

### User Story 2 - Avisos de cambios de estado (Priority: P1)

Como participante, quiero recibir avisos de los cambios relevantes del servicio para mantenerme informado.

**Why this priority**: Esta funcionalidad aporta valor directo al flujo de la plataforma y su prioridad refleja su dependencia y relevancia para el alcance definido.

**Independent Test**: Cambiar estados del servicio y comprobar que cada evento autorizado genera una notificación.

**Acceptance Scenarios**:

1. **Scenario**: Flujo exitoso de avisos de cambios de estado
   - **Given** el actor tiene permisos y los datos requeridos son válidos
   - **When** ejecuta la acción principal del caso de uso
   - **Then** el sistema completa la operación y deja el resultado trazable

2. **Scenario**: Datos inválidos o condición no permitida en avisos de cambios de estado
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

- **FR-001**: El sistema DEBE generar una notificación cuando se acepta una propuesta.
- **FR-002**: El sistema DEBE generar avisos para los cambios relevantes del ciclo del servicio.
- **FR-003**: El sistema DEBE dirigir cada aviso a los participantes autorizados.
- **FR-004**: El sistema DEBE evitar notificaciones duplicadas para el mismo evento.

### Key Entities *(include if feature involves data)*

- **Evento de notificación**: tipo, entidad origen, actor, fecha e identificador único.
- **Preferencia de usuario**: canal, tipo de aviso, habilitación y horario.
- **Entrega**: destinatario, canal, estado, reintentos y fecha.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Cada evento produce un único aviso lógico por destinatario y canal.
- **SC-002**: Un fallo temporal de entrega queda registrado para reintento sin duplicar el evento.
- **SC-003**: No se notifica información protegida a personas no autorizadas.

## Trazabilidad

- **Diagrama de origen**: Casos de uso UC057–UC058.
- **Alcance**: La especificación describe el comportamiento observable y no prescribe tecnologías ni rutas de implementación.
