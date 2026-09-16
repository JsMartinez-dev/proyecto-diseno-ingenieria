# Feature Specification: SPEC-15 — Chat interno y soporte por WhatsApp

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC086,UC090

## User Scenarios & Testing *(mandatory)*

> Relaciones del diagrama: <<Could>> Estas capacidades son evolución futura y no deben presentarse como disponibles si no están habilitadas.
### User Story 1 - Chat interno en tiempo real <<Could>> [UC086] (Priority: P2)
Como cliente o prestador, quiero una capacidad candidata de chat interno en tiempo real [UC086], para evaluar si CONectaSM debería ofrecerla; el canal, disponibilidad, participantes, tratamiento de mensajes y activación quedan [NEEDS CLARIFICATION: definir].

**Why this priority**: UC086 es una capacidad informativa <<Could>> para Cliente o Prestador; no implica que esté habilitada ni define estados, persistencia o entrega de mensajes.

**Independent Test**: Con una cuenta de cliente o prestador, verificar que, si UC086 no está habilitado, no se presenta como disponible; si estuviera habilitado, confirmar que la activación y el comportamiento de mensajes corresponden a decisiones documentadas [NEEDS CLARIFICATION: definir].

**Acceptance Scenarios**:

1. **Scenario**: UC086 no habilitado
   - **Given** la capacidad candidata de chat interno en tiempo real [UC086] no está habilitada
   - **When** un cliente o prestador consulta las capacidades disponibles
   - **Then** el sistema no la presenta como disponible ni simula conversaciones, entregas o estados.

2. **Scenario**: UC086 habilitado sin reglas definidas
   - **Given** una activación de UC086 requiere decidir canal, disponibilidad, participantes, proveedor y manejo de datos
   - **When** se intenta habilitarlo
   - **Then** el sistema exige documentar esas decisiones [NEEDS CLARIFICATION: definir] y no afirma que guarde mensajes o muestre estados antes de ello.

### User Story 2 - Soporte por WhatsApp <<Could>> [UC090] (Priority: P2)
Como usuario, quiero soporte por whatsapp <<could>>, para gestionar específicamente soporte por whatsapp <<could>> dentro de CONectaSM.

**Why this priority**: UC090 permite a Usuario soporte por whatsapp <<could>>; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de usuario, verificar que, si UC090 no está habilitado, no se presenta como disponible; si se habilitara, confirmar la activación y reglas documentadas [NEEDS CLARIFICATION: definir].

**Acceptance Scenarios**:

1. **Scenario**: UC090 no habilitado
   - **Given** la capacidad candidata de soporte por WhatsApp [UC090] no está habilitada
   - **When** un usuario consulta las capacidades disponibles
   - **Then** el sistema no la presenta como disponible ni simula contacto, entrega, registro o estado de soporte.

2. **Scenario**: UC090 habilitado sin reglas definidas
   - **Given** una activación de UC090 requiere decidir canal, disponibilidad, proveedor, datos tratados y reglas de atención
   - **When** se intenta habilitarlo
   - **Then** el sistema exige documentar esas decisiones [NEEDS CLARIFICATION: definir] y no afirma que guarde conversaciones o muestre estados antes de ello.

---

### Edge Cases

- Una conversación o soporte no habilitado no debe presentarse como disponible ni simular entrega de mensajes.
- <<Could>> Estas capacidades son evolución futura y no deben presentarse como disponibles si no están habilitadas.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-086**: El sistema DEBE tratar «Chat interno en tiempo real <<Could>>» [UC086] como capacidad candidata e informativa para Cliente o Prestador; si no está habilitada, no debe presentarla como disponible. Canal, disponibilidad, participantes, proveedor y tratamiento de mensajes quedan [NEEDS CLARIFICATION: definir].
- **FR-090**: El sistema DEBE tratar «Soporte por WhatsApp <<Could>>» [UC090] como capacidad candidata e informativa para Usuario; si no está habilitada, no debe presentarla como disponible. Canal, disponibilidad, proveedor, datos tratados y reglas de atención quedan [NEEDS CLARIFICATION: definir].
### Key Entities *(include if feature involves data)*

- **Registro específico de Chat interno y soporte por WhatsApp**: entidad candidata asociada a los CUs (UC086,UC090); si se crea, consulta o actualiza información queda [NEEDS CLARIFICATION: definir].
- **Actor asignado y autorización**: identidad del actor indicado en el diagrama y permiso requerido para cada operación.
- **Estado y resultado de cada operación**: no definidos por el diagrama; cualquier mensaje, estado, evidencia, retención o formato queda [NEEDS CLARIFICATION: definir].

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de las superficies de CONectaSM no presenta UC086 ni UC090 como disponibles mientras no exista una decisión de habilitación documentada.
- **SC-002**: Si se evalúa su habilitación, ninguna operación cambia datos, inicia comunicación o muestra estados sin reglas documentadas [NEEDS CLARIFICATION: definir].
- **SC-003**: Los estados, filtros, evidencias o políticas no definidos en los diagramas se presentan como [NEEDS CLARIFICATION: definir política antes de implementar].
