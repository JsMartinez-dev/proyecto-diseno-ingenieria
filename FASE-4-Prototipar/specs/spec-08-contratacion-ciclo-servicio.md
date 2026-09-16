# Feature Specification: SPEC-08 — Contratación y ciclo de vida del servicio

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC048,UC049,UC050,UC051,UC052,UC053,UC054,UC055,UC056

## User Scenarios & Testing *(mandatory)*

> Relaciones del diagrama: UC048–UC049 se incluyen al aceptar; UC056 extiende la habilitación de comunicación; UC058 extiende cambios de estado.
### User Story 1 - Registrar servicio contratado [UC048] (Priority: P1)
Como cliente o prestador, quiero registrar servicio contratado, para gestionar específicamente registrar servicio contratado dentro de CONectaSM.

**Why this priority**: UC048 permite a Cliente o Prestador registrar servicio contratado; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de cliente o prestador y un registro de prueba de «Registrar servicio contratado», verificar que UC048 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Registrar servicio contratado para UC048
   - **Given** un cliente o prestador autorizado dispone de los datos de «Registrar servicio contratado»
   - **When** ejecuta la acción «Registrar servicio contratado»
   - **Then** el sistema guarda «Registrar servicio contratado» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC048
   - **Given** la solicitud de «Registrar servicio contratado» no identifica un registro válido o el actor no tiene el rol Cliente o Prestador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 2 - Habilitar datos de comunicación [UC049] (Priority: P1)
Como cliente o prestador, quiero habilitar datos de comunicación, para gestionar específicamente habilitar datos de comunicación dentro de CONectaSM.

**Why this priority**: UC049 permite a Cliente o Prestador habilitar datos de comunicación; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de cliente o prestador y un registro de prueba de «Habilitar datos de comunicación», verificar que UC049 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Habilitar datos de comunicación para UC049
   - **Given** un cliente o prestador autorizado dispone de los datos de «Habilitar datos de comunicación»
   - **When** ejecuta la acción «Habilitar datos de comunicación»
   - **Then** el sistema guarda «Habilitar datos de comunicación» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC049
   - **Given** la solicitud de «Habilitar datos de comunicación» no identifica un registro válido o el actor no tiene el rol Cliente o Prestador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 3 - Consultar detalle del servicio [UC050] (Priority: P1)
Como cliente o prestador, quiero consultar detalle del servicio, para gestionar específicamente consultar detalle del servicio dentro de CONectaSM.

**Why this priority**: UC050 permite a Cliente o Prestador consultar detalle del servicio; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de cliente o prestador y un registro de prueba de «Consultar detalle del servicio», verificar que UC050 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Consultar detalle del servicio para UC050
   - **Given** un cliente o prestador autorizado dispone de los datos de «Consultar detalle del servicio»
   - **When** ejecuta la acción «Consultar detalle del servicio»
   - **Then** el sistema muestra la información específica de «Consultar detalle del servicio».

2. **Scenario**: Datos insuficientes o actor no autorizado en UC050
   - **Given** la solicitud de «Consultar detalle del servicio» no identifica un registro válido o el actor no tiene el rol Cliente o Prestador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 4 - Marcar servicio en ejecución [UC051] (Priority: P1)
Como prestador, quiero marcar servicio en ejecución, para gestionar específicamente marcar servicio en ejecución dentro de CONectaSM.

**Why this priority**: UC051 permite a Prestador marcar servicio en ejecución; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de prestador y un registro de prueba de «Marcar servicio en ejecución», verificar que UC051 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Marcar servicio en ejecución para UC051
   - **Given** un prestador autorizado dispone de los datos de «Marcar servicio en ejecución»
   - **When** ejecuta la acción «Marcar servicio en ejecución»
   - **Then** el sistema guarda «Marcar servicio en ejecución» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC051
   - **Given** la solicitud de «Marcar servicio en ejecución» no identifica un registro válido o el actor no tiene el rol Prestador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 5 - Marcar servicio como terminado [UC052] (Priority: P1)
Como prestador, quiero marcar servicio como terminado, para gestionar específicamente marcar servicio como terminado dentro de CONectaSM.

**Why this priority**: UC052 permite a Prestador marcar servicio como terminado; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de prestador y un registro de prueba de «Marcar servicio como terminado», verificar que UC052 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Marcar servicio como terminado para UC052
   - **Given** un prestador autorizado dispone de los datos de «Marcar servicio como terminado»
   - **When** ejecuta la acción «Marcar servicio como terminado»
   - **Then** el sistema guarda «Marcar servicio como terminado» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC052
   - **Given** la solicitud de «Marcar servicio como terminado» no identifica un registro válido o el actor no tiene el rol Prestador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 6 - Confirmar finalización [UC053] (Priority: P1)
Como cliente, quiero confirmar finalización, para gestionar específicamente confirmar finalización dentro de CONectaSM.

**Why this priority**: UC053 permite a Cliente confirmar finalización; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de cliente y un registro de prueba de «Confirmar finalización», verificar que UC053 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Confirmar finalización para UC053
   - **Given** un cliente autorizado dispone de los datos de «Confirmar finalización»
   - **When** ejecuta la acción «Confirmar finalización»
   - **Then** el sistema guarda «Confirmar finalización» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC053
   - **Given** la solicitud de «Confirmar finalización» no identifica un registro válido o el actor no tiene el rol Cliente
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 7 - Cancelar servicio contratado [UC054] (Priority: P1)
Como cliente o prestador, quiero cancelar servicio contratado, para gestionar específicamente cancelar servicio contratado dentro de CONectaSM.

**Why this priority**: UC054 permite a Cliente o Prestador cancelar servicio contratado; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de cliente o prestador y un registro de prueba de «Cancelar servicio contratado», verificar que UC054 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Cancelar servicio contratado para UC054
   - **Given** un cliente o prestador autorizado dispone de los datos de «Cancelar servicio contratado»
   - **When** ejecuta la acción «Cancelar servicio contratado»
   - **Then** el sistema aplica «Cancelar servicio contratado» al registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC054
   - **Given** la solicitud de «Cancelar servicio contratado» no identifica un registro válido o el actor no tiene el rol Cliente o Prestador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 8 - Consultar historial de estados del servicio [UC055] (Priority: P1)
Como cliente o prestador, quiero consultar historial de estados del servicio, para gestionar específicamente consultar historial de estados del servicio dentro de CONectaSM.

**Why this priority**: UC055 permite a Cliente o Prestador consultar historial de estados del servicio; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de cliente o prestador y un registro de prueba de «Consultar historial de estados del servicio», verificar que UC055 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Consultar historial de estados del servicio para UC055
   - **Given** un cliente o prestador autorizado dispone de los datos de «Consultar historial de estados del servicio»
   - **When** ejecuta la acción «Consultar historial de estados del servicio»
   - **Then** el sistema muestra la información específica de «Consultar historial de estados del servicio».

2. **Scenario**: Datos insuficientes o actor no autorizado en UC055
   - **Given** la solicitud de «Consultar historial de estados del servicio» no identifica un registro válido o el actor no tiene el rol Cliente o Prestador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 9 - Usar canal de comunicación autorizado [UC056] (Priority: P1)
Como cliente o prestador, quiero usar canal de comunicación autorizado, para gestionar específicamente usar canal de comunicación autorizado dentro de CONectaSM.

**Why this priority**: UC056 permite a Cliente o Prestador usar canal de comunicación autorizado; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de cliente o prestador y un registro de prueba de «Usar canal de comunicación autorizado», verificar que UC056 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Usar canal de comunicación autorizado para UC056
   - **Given** un cliente o prestador autorizado dispone de los datos de «Usar canal de comunicación autorizado»
   - **When** ejecuta la acción «Usar canal de comunicación autorizado»
   - **Then** el sistema guarda «Usar canal de comunicación autorizado» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC056
   - **Given** la solicitud de «Usar canal de comunicación autorizado» no identifica un registro válido o el actor no tiene el rol Cliente o Prestador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

---

### Edge Cases

- Dos transiciones simultáneas deben resolverse conservando un único historial ordenado y sin inventar una transición no autorizada.
- Aceptar una propuesta incluye registrar el servicio y habilitar comunicación; las transiciones deben conservar su historial sin inventar condiciones de cancelación.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-048**: El sistema DEBE permitir que un Cliente o Prestador ejecute «Registrar servicio contratado» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC048]
- **FR-049**: El sistema DEBE permitir que un Cliente o Prestador ejecute «Habilitar datos de comunicación» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC049]
- **FR-050**: El sistema DEBE permitir que un Cliente o Prestador ejecute «Consultar detalle del servicio» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC050]
- **FR-051**: El sistema DEBE permitir que un Prestador ejecute «Marcar servicio en ejecución» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC051]
- **FR-052**: El sistema DEBE permitir que un Prestador ejecute «Marcar servicio como terminado» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC052]
- **FR-053**: El sistema DEBE permitir que cliente ejecute «Confirmar finalización» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC053]
- **FR-054**: El sistema DEBE permitir que un Cliente o Prestador ejecute «Cancelar servicio contratado» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC054]
- **FR-055**: El sistema DEBE permitir que un Cliente o Prestador ejecute «Consultar historial de estados del servicio» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC055]
- **FR-056**: El sistema DEBE permitir que un Cliente o Prestador ejecute «Usar canal de comunicación autorizado» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC056]
### Key Entities *(include if feature involves data)*

- **Registro específico de Contratación y ciclo de vida del servicio**: información que los CUs (UC048,UC049,UC050,UC051,UC052,UC053,UC054,UC055,UC056) consultan, crean, actualizan o muestran.
- **Actor asignado y autorización**: identidad del actor indicado en el diagrama y permiso requerido para cada operación.
- **Estado y resultado de cada operación**: valor confirmado, mensaje mostrado y evidencia asociada; retención y formatos quedan [NEEDS CLARIFICATION: definir].

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los CUs UC048,UC049,UC050,UC051,UC052,UC053,UC054,UC055,UC056 solo permite la acción al actor asignado en su diagrama y devuelve el resultado de su operación específica.
- **SC-002**: Ante datos faltantes, registro inexistente o rol incorrecto, ninguna operación cambia datos y la interfaz informa la causa.
- **SC-003**: Los estados, filtros, evidencias o políticas no definidos en los diagramas se presentan como [NEEDS CLARIFICATION: definir política antes de implementar].
