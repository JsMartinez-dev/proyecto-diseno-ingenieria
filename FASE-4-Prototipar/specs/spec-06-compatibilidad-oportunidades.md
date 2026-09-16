# Feature Specification: SPEC-06 — Compatibilidad y oportunidades de servicio

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC034,UC035,UC036,UC037,UC038

## User Scenarios & Testing *(mandatory)*

> Relaciones del diagrama: UC034 se incluye en el tablero UC035; UC036 y UC038 extienden el tablero o la compatibilidad.
### User Story 1 - Determinar compatibilidad de solicitudes [UC034] (Priority: P1)
Como prestador, quiero determinar compatibilidad de solicitudes, para gestionar específicamente determinar compatibilidad de solicitudes dentro de CONectaSM.

**Why this priority**: UC034 permite a Prestador determinar compatibilidad de solicitudes; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de prestador y un registro de prueba de «Determinar compatibilidad de solicitudes», verificar que UC034 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Determinar compatibilidad de solicitudes para UC034
   - **Given** un prestador autorizado dispone de los datos de «Determinar compatibilidad de solicitudes»
   - **When** ejecuta la acción «Determinar compatibilidad de solicitudes»
   - **Then** el sistema guarda «Determinar compatibilidad de solicitudes» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC034
   - **Given** la solicitud de «Determinar compatibilidad de solicitudes» no identifica un registro válido o el actor no tiene el rol Prestador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 2 - Ver tablero de oportunidades [UC035] (Priority: P1)
Como prestador, quiero ver tablero de oportunidades, para gestionar específicamente ver tablero de oportunidades dentro de CONectaSM.

**Why this priority**: UC035 permite a Prestador ver tablero de oportunidades; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de prestador y un registro de prueba de «Ver tablero de oportunidades», verificar que UC035 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Ver tablero de oportunidades para UC035
   - **Given** un prestador autorizado dispone de los datos de «Ver tablero de oportunidades»
   - **When** ejecuta la acción «Ver tablero de oportunidades»
   - **Then** el sistema muestra la información específica de «Ver tablero de oportunidades».

2. **Scenario**: Datos insuficientes o actor no autorizado en UC035
   - **Given** la solicitud de «Ver tablero de oportunidades» no identifica un registro válido o el actor no tiene el rol Prestador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 3 - Filtrar oportunidades [UC036] (Priority: P1)
Como prestador, quiero filtrar oportunidades, para gestionar específicamente filtrar oportunidades dentro de CONectaSM.

**Why this priority**: UC036 permite a Prestador filtrar oportunidades; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de prestador y un registro de prueba de «Filtrar oportunidades», verificar que UC036 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Filtrar oportunidades para UC036
   - **Given** un prestador autorizado dispone de los datos de «Filtrar oportunidades»
   - **When** ejecuta la acción «Filtrar oportunidades»
   - **Then** el sistema guarda «Filtrar oportunidades» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC036
   - **Given** la solicitud de «Filtrar oportunidades» no identifica un registro válido o el actor no tiene el rol Prestador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 4 - Consultar detalle de oportunidad [UC037] (Priority: P1)
Como prestador, quiero consultar detalle de oportunidad, para gestionar específicamente consultar detalle de oportunidad dentro de CONectaSM.

**Why this priority**: UC037 permite a Prestador consultar detalle de oportunidad; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de prestador y un registro de prueba de «Consultar detalle de oportunidad», verificar que UC037 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Consultar detalle de oportunidad para UC037
   - **Given** un prestador autorizado dispone de los datos de «Consultar detalle de oportunidad»
   - **When** ejecuta la acción «Consultar detalle de oportunidad»
   - **Then** el sistema muestra la información específica de «Consultar detalle de oportunidad».

2. **Scenario**: Datos insuficientes o actor no autorizado en UC037
   - **Given** la solicitud de «Consultar detalle de oportunidad» no identifica un registro válido o el actor no tiene el rol Prestador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 5 - Notificar nueva oportunidad compatible [UC038] (Priority: P1)
Como prestador, quiero notificar nueva oportunidad compatible, para gestionar específicamente notificar nueva oportunidad compatible dentro de CONectaSM.

**Why this priority**: UC038 permite a Prestador notificar nueva oportunidad compatible; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de prestador y un registro de prueba de «Notificar nueva oportunidad compatible», verificar que UC038 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Notificar nueva oportunidad compatible para UC038
   - **Given** un prestador autorizado dispone de los datos de «Notificar nueva oportunidad compatible»
   - **When** ejecuta la acción «Notificar nueva oportunidad compatible»
   - **Then** el sistema emite la notificación de «Notificar nueva oportunidad compatible» al destinatario definido.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC038
   - **Given** la solicitud de «Notificar nueva oportunidad compatible» no identifica un registro válido o el actor no tiene el rol Prestador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

---

### Edge Cases

- Una solicitud sin datos suficientes para evaluar compatibilidad debe quedar identificada como no evaluable, no como compatible.
- La compatibilidad debe usar únicamente los datos disponibles de categoría, zona y disponibilidad; los criterios no especificados quedan pendientes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-034**: El sistema DEBE permitir que un Prestador ejecute «Determinar compatibilidad de solicitudes» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC034]
- **FR-035**: El sistema DEBE permitir que un Prestador ejecute «Ver tablero de oportunidades» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC035]
- **FR-036**: El sistema DEBE permitir que un Prestador ejecute «Filtrar oportunidades» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC036]
- **FR-037**: El sistema DEBE permitir que un Prestador ejecute «Consultar detalle de oportunidad» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC037]
- **FR-038**: El sistema DEBE permitir que un Prestador ejecute «Notificar nueva oportunidad compatible» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC038]
### Key Entities *(include if feature involves data)*

- **Registro específico de Compatibilidad y oportunidades de servicio**: información que los CUs (UC034,UC035,UC036,UC037,UC038) consultan, crean, actualizan o muestran.
- **Actor asignado y autorización**: identidad del actor indicado en el diagrama y permiso requerido para cada operación.
- **Estado y resultado de cada operación**: valor confirmado, mensaje mostrado y evidencia asociada; retención y formatos quedan [NEEDS CLARIFICATION: definir].

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los CUs UC034,UC035,UC036,UC037,UC038 solo permite la acción al actor asignado en su diagrama y devuelve el resultado de su operación específica.
- **SC-002**: Ante datos faltantes, registro inexistente o rol incorrecto, ninguna operación cambia datos y la interfaz informa la causa.
- **SC-003**: Los estados, filtros, evidencias o políticas no definidos en los diagramas se presentan como [NEEDS CLARIFICATION: definir política antes de implementar].
