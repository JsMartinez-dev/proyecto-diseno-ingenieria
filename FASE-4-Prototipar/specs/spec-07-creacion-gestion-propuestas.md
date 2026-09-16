# Feature Specification: SPEC-07 — Creación y gestión de propuestas

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC039,UC040,UC041,UC042,UC043,UC044

## User Scenarios & Testing *(mandatory)*

> Relaciones del diagrama: UC040 se incluye al crear propuesta; UC041 y UC044 extienden ese flujo; UC046 incluye cierre UC047 y registro UC048/UC049.
### User Story 1 - Crear propuesta [UC039] (Priority: P1)
Como prestador, quiero crear propuesta, para gestionar específicamente crear propuesta dentro de CONectaSM.

**Why this priority**: UC039 permite a Prestador crear propuesta; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de prestador y un registro de prueba de «Crear propuesta», verificar que UC039 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Crear propuesta para UC039
   - **Given** un prestador autorizado dispone de los datos de «Crear propuesta»
   - **When** ejecuta la acción «Crear propuesta»
   - **Then** el sistema guarda «Crear propuesta» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC039
   - **Given** la solicitud de «Crear propuesta» no identifica un registro válido o el actor no tiene el rol Prestador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 2 - Indicar disponibilidad [UC040] (Priority: P1)
Como prestador, quiero indicar disponibilidad, para gestionar específicamente indicar disponibilidad dentro de CONectaSM.

**Why this priority**: UC040 permite a Prestador indicar disponibilidad; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de prestador y un registro de prueba de «Indicar disponibilidad», verificar que UC040 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Indicar disponibilidad para UC040
   - **Given** un prestador autorizado dispone de los datos de «Indicar disponibilidad»
   - **When** ejecuta la acción «Indicar disponibilidad»
   - **Then** el sistema guarda «Indicar disponibilidad» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC040
   - **Given** la solicitud de «Indicar disponibilidad» no identifica un registro válido o el actor no tiene el rol Prestador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 3 - Agregar mensaje [UC041] (Priority: P1)
Como prestador, quiero agregar mensaje, para gestionar específicamente agregar mensaje dentro de CONectaSM.

**Why this priority**: UC041 permite a Prestador agregar mensaje; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de prestador y un registro de prueba de «Agregar mensaje», verificar que UC041 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Agregar mensaje para UC041
   - **Given** un prestador autorizado dispone de los datos de «Agregar mensaje»
   - **When** ejecuta la acción «Agregar mensaje»
   - **Then** el sistema guarda «Agregar mensaje» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC041
   - **Given** la solicitud de «Agregar mensaje» no identifica un registro válido o el actor no tiene el rol Prestador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 4 - Editar propuesta activa [UC042] (Priority: P1)
Como prestador, quiero editar propuesta activa, para gestionar específicamente editar propuesta activa dentro de CONectaSM.

**Why this priority**: UC042 permite a Prestador editar propuesta activa; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de prestador y un registro de prueba de «Editar propuesta activa», verificar que UC042 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Editar propuesta activa para UC042
   - **Given** un prestador autorizado dispone de los datos de «Editar propuesta activa»
   - **When** ejecuta la acción «Editar propuesta activa»
   - **Then** el sistema guarda «Editar propuesta activa» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC042
   - **Given** la solicitud de «Editar propuesta activa» no identifica un registro válido o el actor no tiene el rol Prestador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 5 - Retirar propuesta [UC043] (Priority: P1)
Como prestador, quiero retirar propuesta, para gestionar específicamente retirar propuesta dentro de CONectaSM.

**Why this priority**: UC043 permite a Prestador retirar propuesta; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de prestador y un registro de prueba de «Retirar propuesta», verificar que UC043 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Retirar propuesta para UC043
   - **Given** un prestador autorizado dispone de los datos de «Retirar propuesta»
   - **When** ejecuta la acción «Retirar propuesta»
   - **Then** el sistema aplica «Retirar propuesta» al registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC043
   - **Given** la solicitud de «Retirar propuesta» no identifica un registro válido o el actor no tiene el rol Prestador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 6 - Notificar propuesta recibida [UC044] (Priority: P1)
Como prestador, quiero notificar propuesta recibida, para gestionar específicamente notificar propuesta recibida dentro de CONectaSM.

**Why this priority**: UC044 permite a Prestador notificar propuesta recibida; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de prestador y un registro de prueba de «Notificar propuesta recibida», verificar que UC044 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Notificar propuesta recibida para UC044
   - **Given** un prestador autorizado dispone de los datos de «Notificar propuesta recibida»
   - **When** ejecuta la acción «Notificar propuesta recibida»
   - **Then** el sistema emite la notificación de «Notificar propuesta recibida» al destinatario definido.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC044
   - **Given** la solicitud de «Notificar propuesta recibida» no identifica un registro válido o el actor no tiene el rol Prestador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

---

### Edge Cases

- Una propuesta retirada o inactiva no debe volver a editarse ni notificarse como nueva.
- La propuesta se vincula a una solicitud y sus extensiones son opcionales según el diagrama: mensaje y notificación no deben impedir el flujo base.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-039**: El sistema DEBE permitir que un Prestador ejecute «Crear propuesta» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC039]
- **FR-040**: El sistema DEBE permitir que un Prestador ejecute «Indicar disponibilidad» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC040]
- **FR-041**: El sistema DEBE permitir que un Prestador ejecute «Agregar mensaje» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC041]
- **FR-042**: El sistema DEBE permitir que un Prestador ejecute «Editar propuesta activa» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC042]
- **FR-043**: El sistema DEBE permitir que un Prestador ejecute «Retirar propuesta» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC043]
- **FR-044**: El sistema DEBE permitir que un Prestador ejecute «Notificar propuesta recibida» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC044]
### Key Entities *(include if feature involves data)*

- **Registro específico de Creación y gestión de propuestas**: información que los CUs (UC039,UC040,UC041,UC042,UC043,UC044) consultan, crean, actualizan o muestran.
- **Actor asignado y autorización**: identidad del actor indicado en el diagrama y permiso requerido para cada operación.
- **Estado y resultado de cada operación**: valor confirmado, mensaje mostrado y evidencia asociada; retención y formatos quedan [NEEDS CLARIFICATION: definir].

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los CUs UC039,UC040,UC041,UC042,UC043,UC044 solo permite la acción al actor asignado en su diagrama y devuelve el resultado de su operación específica.
- **SC-002**: Ante datos faltantes, registro inexistente o rol incorrecto, ninguna operación cambia datos y la interfaz informa la causa.
- **SC-003**: Los estados, filtros, evidencias o políticas no definidos en los diagramas se presentan como [NEEDS CLARIFICATION: definir política antes de implementar].
