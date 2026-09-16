# Feature Specification: SPEC-15 — Chat interno y soporte por WhatsApp

**Creado**: 2026-09-16  
**Casos de uso cubiertos**: UC086 y UC090

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Chat interno (Priority: P2)

Como cliente o prestador, quiero conversar en tiempo real dentro de la plataforma para coordinar una interacción permitida.

**Why this priority**: Esta funcionalidad aporta valor directo al flujo de la plataforma y su prioridad refleja su dependencia y relevancia para el alcance definido.

**Independent Test**: Abrir una conversación autorizada, enviar mensajes y comprobar su entrega y orden.

**Acceptance Scenarios**:

1. **Scenario**: Flujo exitoso de chat interno
   - **Given** el actor tiene permisos y los datos requeridos son válidos
   - **When** ejecuta la acción principal del caso de uso
   - **Then** el sistema completa la operación y deja el resultado trazable

2. **Scenario**: Datos inválidos o condición no permitida en chat interno
   - **Given** falta un dato obligatorio o el estado no permite la operación
   - **When** el actor intenta completar la acción
   - **Then** el sistema rechaza la operación, explica el motivo y conserva la información válida

---

### User Story 2 - Soporte por WhatsApp (Priority: P2)

Como usuario, quiero acceder al soporte por WhatsApp cuando necesite ayuda fuera del flujo principal.

**Why this priority**: Esta funcionalidad aporta valor directo al flujo de la plataforma y su prioridad refleja su dependencia y relevancia para el alcance definido.

**Independent Test**: Solicitar soporte y abrir el canal configurado sin compartir datos innecesarios.

**Acceptance Scenarios**:

1. **Scenario**: Flujo exitoso de soporte por whatsapp
   - **Given** el actor tiene permisos y los datos requeridos son válidos
   - **When** ejecuta la acción principal del caso de uso
   - **Then** el sistema completa la operación y deja el resultado trazable

2. **Scenario**: Datos inválidos o condición no permitida en soporte por whatsapp
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

- **FR-001**: El sistema DEBE permitir conversaciones únicamente entre participantes autorizados.
- **FR-002**: El sistema DEBE conservar el orden y estado de entrega de los mensajes.
- **FR-003**: El sistema DEBE permitir iniciar el canal de soporte externo mediante un enlace configurado.
- **FR-004**: El sistema DEBE informar cuando el chat o el canal externo no estén disponibles.
- **FR-005**: El sistema DEBE minimizar los datos incluidos en una derivación a soporte.

### Key Entities *(include if feature involves data)*

- **Conversación**: participantes, contexto, estado, fecha de apertura y cierre.
- **Mensaje**: autor, contenido, fecha, estado de entrega y lectura.
- **Derivación de soporte**: usuario, motivo, enlace y fecha de solicitud.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un participante no autorizado no puede leer ni enviar mensajes en la conversación.
- **SC-002**: Un mensaje fallido conserva estado de error y no se presenta como entregado.
- **SC-003**: El enlace de WhatsApp se abre sin incluir información sensible en parámetros públicos.

## Trazabilidad

- **Diagrama de origen**: Casos de uso UC086 y UC090.
- **Alcance**: La especificación describe el comportamiento observable y no prescribe tecnologías ni rutas de implementación.
