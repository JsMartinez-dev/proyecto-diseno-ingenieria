# Feature Specification: SPEC-05 — Creación y gestión del perfil profesional

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC024,UC025,UC026,UC027,UC028,UC029,UC030,UC031,UC032,UC033

## User Scenarios & Testing *(mandatory)*

> Relaciones del diagrama: UC027 y UC026 se incluyen al crear el perfil; UC028 puede extenderlo; la vista previa UC033 permite revisar antes de exponer.
### User Story 1 - Crear perfil profesional [UC024] (Priority: P1)
Como prestador, quiero crear perfil profesional, para gestionar específicamente crear perfil profesional dentro de CONectaSM.

**Why this priority**: UC024 permite a Prestador crear perfil profesional; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de prestador y un registro de prueba de «Crear perfil profesional», verificar que UC024 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Crear perfil profesional para UC024
   - **Given** un prestador autorizado dispone de los datos de «Crear perfil profesional»
   - **When** ejecuta la acción «Crear perfil profesional»
   - **Then** el sistema guarda «Crear perfil profesional» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC024
   - **Given** la solicitud de «Crear perfil profesional» no identifica un registro válido o el actor no tiene el rol Prestador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 2 - Editar perfil profesional [UC025] (Priority: P1)
Como prestador, quiero editar perfil profesional, para gestionar específicamente editar perfil profesional dentro de CONectaSM.

**Why this priority**: UC025 permite a Prestador editar perfil profesional; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de prestador y un registro de prueba de «Editar perfil profesional», verificar que UC025 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Editar perfil profesional para UC025
   - **Given** un prestador autorizado dispone de los datos de «Editar perfil profesional»
   - **When** ejecuta la acción «Editar perfil profesional»
   - **Then** el sistema guarda «Editar perfil profesional» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC025
   - **Given** la solicitud de «Editar perfil profesional» no identifica un registro válido o el actor no tiene el rol Prestador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 3 - Escoger categorías de servicio al perfil [UC026] (Priority: P1)
Como prestador, quiero escoger categorías de servicio al perfil, para gestionar específicamente escoger categorías de servicio al perfil dentro de CONectaSM.

**Why this priority**: UC026 permite a Prestador escoger categorías de servicio al perfil; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de prestador y un registro de prueba de «Escoger categorías de servicio al perfil», verificar que UC026 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Escoger categorías de servicio al perfil para UC026
   - **Given** un prestador autorizado dispone de los datos de «Escoger categorías de servicio al perfil»
   - **When** ejecuta la acción «Escoger categorías de servicio al perfil»
   - **Then** el sistema guarda «Escoger categorías de servicio al perfil» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC026
   - **Given** la solicitud de «Escoger categorías de servicio al perfil» no identifica un registro válido o el actor no tiene el rol Prestador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 4 - Configurar zonas de atención [UC027] (Priority: P1)
Como prestador, quiero configurar zonas de atención, para gestionar específicamente configurar zonas de atención dentro de CONectaSM.

**Why this priority**: UC027 permite a Prestador configurar zonas de atención; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de prestador y un registro de prueba de «Configurar zonas de atención», verificar que UC027 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Configurar zonas de atención para UC027
   - **Given** un prestador autorizado dispone de los datos de «Configurar zonas de atención»
   - **When** ejecuta la acción «Configurar zonas de atención»
   - **Then** el sistema guarda «Configurar zonas de atención» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC027
   - **Given** la solicitud de «Configurar zonas de atención» no identifica un registro válido o el actor no tiene el rol Prestador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 5 - Registrar experiencia profesional al perfil [UC028] (Priority: P1)
Como prestador, quiero registrar experiencia profesional al perfil, para gestionar específicamente registrar experiencia profesional al perfil dentro de CONectaSM.

**Why this priority**: UC028 permite a Prestador registrar experiencia profesional al perfil; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de prestador y un registro de prueba de «Registrar experiencia profesional al perfil», verificar que UC028 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Registrar experiencia profesional al perfil para UC028
   - **Given** un prestador autorizado dispone de los datos de «Registrar experiencia profesional al perfil»
   - **When** ejecuta la acción «Registrar experiencia profesional al perfil»
   - **Then** el sistema guarda «Registrar experiencia profesional al perfil» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC028
   - **Given** la solicitud de «Registrar experiencia profesional al perfil» no identifica un registro válido o el actor no tiene el rol Prestador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 6 - Agregar servicio al portafolio [UC029] (Priority: P1)
Como prestador, quiero agregar servicio al portafolio, para gestionar específicamente agregar servicio al portafolio dentro de CONectaSM.

**Why this priority**: UC029 permite a Prestador agregar servicio al portafolio; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de prestador y un registro de prueba de «Agregar servicio al portafolio», verificar que UC029 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Agregar servicio al portafolio para UC029
   - **Given** un prestador autorizado dispone de los datos de «Agregar servicio al portafolio»
   - **When** ejecuta la acción «Agregar servicio al portafolio»
   - **Then** el sistema guarda «Agregar servicio al portafolio» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC029
   - **Given** la solicitud de «Agregar servicio al portafolio» no identifica un registro válido o el actor no tiene el rol Prestador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 7 - Eliminar servicio de portafolio [UC030] (Priority: P1)
Como prestador, quiero eliminar servicio de portafolio, para gestionar específicamente eliminar servicio de portafolio dentro de CONectaSM.

**Why this priority**: UC030 permite a Prestador eliminar servicio de portafolio; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de prestador y un registro de prueba de «Eliminar servicio de portafolio», verificar que UC030 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Eliminar servicio de portafolio para UC030
   - **Given** un prestador autorizado dispone de los datos de «Eliminar servicio de portafolio»
   - **When** ejecuta la acción «Eliminar servicio de portafolio»
   - **Then** el sistema aplica «Eliminar servicio de portafolio» al registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC030
   - **Given** la solicitud de «Eliminar servicio de portafolio» no identifica un registro válido o el actor no tiene el rol Prestador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 8 - Configurar disponibilidad horaria [UC031] (Priority: P1)
Como prestador, quiero configurar disponibilidad horaria, para gestionar específicamente configurar disponibilidad horaria dentro de CONectaSM.

**Why this priority**: UC031 permite a Prestador configurar disponibilidad horaria; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de prestador y un registro de prueba de «Configurar disponibilidad horaria», verificar que UC031 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Configurar disponibilidad horaria para UC031
   - **Given** un prestador autorizado dispone de los datos de «Configurar disponibilidad horaria»
   - **When** ejecuta la acción «Configurar disponibilidad horaria»
   - **Then** el sistema guarda «Configurar disponibilidad horaria» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC031
   - **Given** la solicitud de «Configurar disponibilidad horaria» no identifica un registro válido o el actor no tiene el rol Prestador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 9 - Gestionar agenda [UC032] (Priority: P1)
Como prestador, quiero gestionar agenda, para gestionar específicamente gestionar agenda dentro de CONectaSM.

**Why this priority**: UC032 permite a Prestador gestionar agenda; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de prestador y un registro de prueba de «Gestionar agenda», verificar que UC032 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Gestionar agenda para UC032
   - **Given** un prestador autorizado dispone de los datos de «Gestionar agenda»
   - **When** ejecuta la acción «Gestionar agenda»
   - **Then** el sistema guarda «Gestionar agenda» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC032
   - **Given** la solicitud de «Gestionar agenda» no identifica un registro válido o el actor no tiene el rol Prestador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 10 - Consultar vista previa del perfil [UC033] (Priority: P1)
Como prestador, quiero consultar vista previa del perfil, para gestionar específicamente consultar vista previa del perfil dentro de CONectaSM.

**Why this priority**: UC033 permite a Prestador consultar vista previa del perfil; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de prestador y un registro de prueba de «Consultar vista previa del perfil», verificar que UC033 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Consultar vista previa del perfil para UC033
   - **Given** un prestador autorizado dispone de los datos de «Consultar vista previa del perfil»
   - **When** ejecuta la acción «Consultar vista previa del perfil»
   - **Then** el sistema muestra la información específica de «Consultar vista previa del perfil».

2. **Scenario**: Datos insuficientes o actor no autorizado en UC033
   - **Given** la solicitud de «Consultar vista previa del perfil» no identifica un registro válido o el actor no tiene el rol Prestador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

---

### Edge Cases

- Una edición concurrente no debe dejar categorías, zonas o agenda en un estado parcialmente guardado.
- El perfil público solo debe mostrar información que el prestador haya configurado para exposición.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-024**: El sistema DEBE permitir que un Prestador ejecute «Crear perfil profesional» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC024]
- **FR-025**: El sistema DEBE permitir que un Prestador ejecute «Editar perfil profesional» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC025]
- **FR-026**: El sistema DEBE permitir que un Prestador ejecute «Escoger categorías de servicio al perfil» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC026]
- **FR-027**: El sistema DEBE permitir que un Prestador ejecute «Configurar zonas de atención» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC027]
- **FR-028**: El sistema DEBE permitir que un Prestador ejecute «Registrar experiencia profesional al perfil» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC028]
- **FR-029**: El sistema DEBE permitir que un Prestador ejecute «Agregar servicio al portafolio» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC029]
- **FR-030**: El sistema DEBE permitir que un Prestador ejecute «Eliminar servicio de portafolio» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC030]
- **FR-031**: El sistema DEBE permitir que un Prestador ejecute «Configurar disponibilidad horaria» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC031]
- **FR-032**: El sistema DEBE permitir que un Prestador ejecute «Gestionar agenda» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC032]
- **FR-033**: El sistema DEBE permitir que un Prestador ejecute «Consultar vista previa del perfil» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC033]
### Key Entities *(include if feature involves data)*

- **Registro específico de Creación y gestión del perfil profesional**: información que los CUs (UC024,UC025,UC026,UC027,UC028,UC029,UC030,UC031,UC032,UC033) consultan, crean, actualizan o muestran.
- **Actor asignado y autorización**: identidad del actor indicado en el diagrama y permiso requerido para cada operación.
- **Estado y resultado de cada operación**: valor confirmado, mensaje mostrado y evidencia asociada; retención y formatos quedan [NEEDS CLARIFICATION: definir].

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los CUs UC024,UC025,UC026,UC027,UC028,UC029,UC030,UC031,UC032,UC033 solo permite la acción al actor asignado en su diagrama y devuelve el resultado de su operación específica.
- **SC-002**: Ante datos faltantes, registro inexistente o rol incorrecto, ninguna operación cambia datos y la interfaz informa la causa.
- **SC-003**: Los estados, filtros, evidencias o políticas no definidos en los diagramas se presentan como [NEEDS CLARIFICATION: definir política antes de implementar].
