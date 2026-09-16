# Feature Specification: SPEC-09 — Notificaciones de propuestas y servicios

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC057,UC058

## User Scenarios & Testing *(mandatory)*

> Relaciones del diagrama: UC057 extiende la aceptación UC046 y UC058 extiende UC051–UC054.
### User Story 1 - Notificar aceptación de propuesta [UC057] (Priority: P1)
Como [NEEDS CLARIFICATION: el diagrama no asigna actor directo a UC057], quiero notificar aceptación de propuesta, para gestionar específicamente notificar aceptación de propuesta dentro de CONectaSM.

**Why this priority**: UC057 permite a [NEEDS CLARIFICATION: el diagrama no asigna actor directo a UC057] notificar aceptación de propuesta; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de [NEEDS CLARIFICATION: el diagrama no asigna actor directo a UC057] y un registro de prueba de «Notificar aceptación de propuesta», verificar que UC057 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Notificar aceptación de propuesta para UC057
   - **Given** un [NEEDS CLARIFICATION: el diagrama no asigna actor directo a UC057] autorizado dispone de los datos de «Notificar aceptación de propuesta»
   - **When** ejecuta la acción «Notificar aceptación de propuesta»
   - **Then** el sistema emite la notificación de «Notificar aceptación de propuesta» al destinatario definido.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC057
   - **Given** la solicitud de «Notificar aceptación de propuesta» no identifica un registro válido o el actor no tiene el rol [NEEDS CLARIFICATION: el diagrama no asigna actor directo a UC057]
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 2 - Notificar cambios de estado del servicio [UC058] (Priority: P1)
Como [NEEDS CLARIFICATION: el diagrama no asigna actor directo a UC058], quiero notificar cambios de estado del servicio, para gestionar específicamente notificar cambios de estado del servicio dentro de CONectaSM.

**Why this priority**: UC058 permite a [NEEDS CLARIFICATION: el diagrama no asigna actor directo a UC058] notificar cambios de estado del servicio; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de [NEEDS CLARIFICATION: el diagrama no asigna actor directo a UC058] y un registro de prueba de «Notificar cambios de estado del servicio», verificar que UC058 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Notificar cambios de estado del servicio para UC058
   - **Given** un [NEEDS CLARIFICATION: el diagrama no asigna actor directo a UC058] autorizado dispone de los datos de «Notificar cambios de estado del servicio»
   - **When** ejecuta la acción «Notificar cambios de estado del servicio»
   - **Then** el sistema emite la notificación de «Notificar cambios de estado del servicio» al destinatario definido.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC058
   - **Given** la solicitud de «Notificar cambios de estado del servicio» no identifica un registro válido o el actor no tiene el rol [NEEDS CLARIFICATION: el diagrama no asigna actor directo a UC058]
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

---

### Edge Cases

- Si un canal de notificación falla, el evento de aceptación o estado debe permanecer consultable sin duplicar avisos.
- Las notificaciones son extensiones de eventos de aceptación y cambios de estado; su configuración o entrega no debe alterar el estado fuente.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-057**: El sistema DEBE permitir que [NEEDS CLARIFICATION: el diagrama no asigna actor directo a UC057] ejecute «Notificar aceptación de propuesta» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC057]
- **FR-058**: El sistema DEBE permitir que [NEEDS CLARIFICATION: el diagrama no asigna actor directo a UC058] ejecute «Notificar cambios de estado del servicio» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC058]
### Key Entities *(include if feature involves data)*

- **Registro específico de Notificaciones de propuestas y servicios**: información que los CUs (UC057,UC058) consultan, crean, actualizan o muestran.
- **Actor asignado y autorización**: identidad del actor indicado en el diagrama y permiso requerido para cada operación.
- **Estado y resultado de cada operación**: valor confirmado, mensaje mostrado y evidencia asociada; retención y formatos quedan [NEEDS CLARIFICATION: definir].

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los CUs UC057,UC058 solo permite la acción al actor asignado en su diagrama y devuelve el resultado de su operación específica.
- **SC-002**: Ante datos faltantes, registro inexistente o rol incorrecto, ninguna operación cambia datos y la interfaz informa la causa.
- **SC-003**: Los estados, filtros, evidencias o políticas no definidos en los diagramas se presentan como [NEEDS CLARIFICATION: definir política antes de implementar].
