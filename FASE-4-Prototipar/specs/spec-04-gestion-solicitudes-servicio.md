# Feature Specification: SPEC-04 — Gestión de solicitudes de servicio

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC016,UC017,UC018,UC019,UC020,UC021,UC022,UC023

## User Scenarios & Testing *(mandatory)*

> Relaciones del diagrama: UC017 se incluye al publicar; UC016 y UC019 extienden la publicación; UC020–UC023 operan sobre solicitudes del Cliente.
### User Story 1 - Adjuntar fotos [UC016] (Priority: P1)
Como cliente, quiero adjuntar fotos, para gestionar específicamente adjuntar fotos dentro de CONectaSM.

**Why this priority**: UC016 permite a Cliente adjuntar fotos; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de cliente y un registro de prueba de «Adjuntar fotos», verificar que UC016 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Adjuntar fotos para UC016
   - **Given** un cliente autorizado dispone de los datos de «Adjuntar fotos»
   - **When** ejecuta la acción «Adjuntar fotos»
   - **Then** el sistema guarda «Adjuntar fotos» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC016
   - **Given** la solicitud de «Adjuntar fotos» no identifica un registro válido o el actor no tiene el rol Cliente
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 2 - Definir zona aproximada y urgencia [UC017] (Priority: P1)
Como cliente, quiero definir zona aproximada y urgencia, para gestionar específicamente definir zona aproximada y urgencia dentro de CONectaSM.

**Why this priority**: UC017 permite a Cliente definir zona aproximada y urgencia; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de cliente y un registro de prueba de «Definir zona aproximada y urgencia», verificar que UC017 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Definir zona aproximada y urgencia para UC017
   - **Given** un cliente autorizado dispone de los datos de «Definir zona aproximada y urgencia»
   - **When** ejecuta la acción «Definir zona aproximada y urgencia»
   - **Then** el sistema guarda «Definir zona aproximada y urgencia» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC017
   - **Given** la solicitud de «Definir zona aproximada y urgencia» no identifica un registro válido o el actor no tiene el rol Cliente
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 3 - Publicar solicitud [UC018] (Priority: P1)
Como cliente, quiero publicar solicitud, para gestionar específicamente publicar solicitud dentro de CONectaSM.

**Why this priority**: UC018 permite a Cliente publicar solicitud; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de cliente y un registro de prueba de «Publicar solicitud», verificar que UC018 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Publicar solicitud para UC018
   - **Given** un cliente autorizado dispone de los datos de «Publicar solicitud»
   - **When** ejecuta la acción «Publicar solicitud»
   - **Then** el sistema guarda «Publicar solicitud» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC018
   - **Given** la solicitud de «Publicar solicitud» no identifica un registro válido o el actor no tiene el rol Cliente
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 4 - Conservar borrador [UC019] (Priority: P1)
Como cliente, quiero conservar borrador, para gestionar específicamente conservar borrador dentro de CONectaSM.

**Why this priority**: UC019 permite a Cliente conservar borrador; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de cliente y un registro de prueba de «Conservar borrador», verificar que UC019 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Conservar borrador para UC019
   - **Given** un cliente autorizado dispone de los datos de «Conservar borrador»
   - **When** ejecuta la acción «Conservar borrador»
   - **Then** el sistema guarda «Conservar borrador» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC019
   - **Given** la solicitud de «Conservar borrador» no identifica un registro válido o el actor no tiene el rol Cliente
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 5 - Editar solicitud abierta [UC020] (Priority: P1)
Como cliente, quiero editar solicitud abierta, para gestionar específicamente editar solicitud abierta dentro de CONectaSM.

**Why this priority**: UC020 permite a Cliente editar solicitud abierta; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de cliente y un registro de prueba de «Editar solicitud abierta», verificar que UC020 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Editar solicitud abierta para UC020
   - **Given** un cliente autorizado dispone de los datos de «Editar solicitud abierta»
   - **When** ejecuta la acción «Editar solicitud abierta»
   - **Then** el sistema guarda «Editar solicitud abierta» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC020
   - **Given** la solicitud de «Editar solicitud abierta» no identifica un registro válido o el actor no tiene el rol Cliente
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 6 - Cancelar solicitud abierta [UC021] (Priority: P1)
Como cliente, quiero cancelar solicitud abierta, para gestionar específicamente cancelar solicitud abierta dentro de CONectaSM.

**Why this priority**: UC021 permite a Cliente cancelar solicitud abierta; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de cliente y un registro de prueba de «Cancelar solicitud abierta», verificar que UC021 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Cancelar solicitud abierta para UC021
   - **Given** un cliente autorizado dispone de los datos de «Cancelar solicitud abierta»
   - **When** ejecuta la acción «Cancelar solicitud abierta»
   - **Then** el sistema aplica «Cancelar solicitud abierta» al registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC021
   - **Given** la solicitud de «Cancelar solicitud abierta» no identifica un registro válido o el actor no tiene el rol Cliente
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 7 - Consultar mis solicitudes [UC022] (Priority: P1)
Como cliente, quiero consultar mis solicitudes, para gestionar específicamente consultar mis solicitudes dentro de CONectaSM.

**Why this priority**: UC022 permite a Cliente consultar mis solicitudes; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de cliente y un registro de prueba de «Consultar mis solicitudes», verificar que UC022 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Consultar mis solicitudes para UC022
   - **Given** un cliente autorizado dispone de los datos de «Consultar mis solicitudes»
   - **When** ejecuta la acción «Consultar mis solicitudes»
   - **Then** el sistema muestra la información específica de «Consultar mis solicitudes».

2. **Scenario**: Datos insuficientes o actor no autorizado en UC022
   - **Given** la solicitud de «Consultar mis solicitudes» no identifica un registro válido o el actor no tiene el rol Cliente
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 8 - Consultar detalle y estado de solicitud [UC023] (Priority: P1)
Como cliente, quiero consultar detalle y estado de solicitud, para gestionar específicamente consultar detalle y estado de solicitud dentro de CONectaSM.

**Why this priority**: UC023 permite a Cliente consultar detalle y estado de solicitud; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de cliente y un registro de prueba de «Consultar detalle y estado de solicitud», verificar que UC023 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Consultar detalle y estado de solicitud para UC023
   - **Given** un cliente autorizado dispone de los datos de «Consultar detalle y estado de solicitud»
   - **When** ejecuta la acción «Consultar detalle y estado de solicitud»
   - **Then** el sistema muestra la información específica de «Consultar detalle y estado de solicitud».

2. **Scenario**: Datos insuficientes o actor no autorizado en UC023
   - **Given** la solicitud de «Consultar detalle y estado de solicitud» no identifica un registro válido o el actor no tiene el rol Cliente
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

---

### Edge Cases

- Si se pierde la conexión durante una publicación o edición, debe conservarse el último estado confirmado y no duplicarse la solicitud.
- La solicitud debe separar la zona aproximada de cualquier dirección exacta y conservar sus estados observables.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-016**: El sistema DEBE permitir que cliente ejecute «Adjuntar fotos» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC016]
- **FR-017**: El sistema DEBE permitir que cliente ejecute «Definir zona aproximada y urgencia» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC017]
- **FR-018**: El sistema DEBE permitir que cliente ejecute «Publicar solicitud» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC018]
- **FR-019**: El sistema DEBE permitir que cliente ejecute «Conservar borrador» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC019]
- **FR-020**: El sistema DEBE permitir que cliente ejecute «Editar solicitud abierta» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC020]
- **FR-021**: El sistema DEBE permitir que cliente ejecute «Cancelar solicitud abierta» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC021]
- **FR-022**: El sistema DEBE permitir que cliente ejecute «Consultar mis solicitudes» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC022]
- **FR-023**: El sistema DEBE permitir que cliente ejecute «Consultar detalle y estado de solicitud» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC023]
### Key Entities *(include if feature involves data)*

- **Registro específico de Gestión de solicitudes de servicio**: información que los CUs (UC016,UC017,UC018,UC019,UC020,UC021,UC022,UC023) consultan, crean, actualizan o muestran.
- **Actor asignado y autorización**: identidad del actor indicado en el diagrama y permiso requerido para cada operación.
- **Estado y resultado de cada operación**: valor confirmado, mensaje mostrado y evidencia asociada; retención y formatos quedan [NEEDS CLARIFICATION: definir].

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los CUs UC016,UC017,UC018,UC019,UC020,UC021,UC022,UC023 solo permite la acción al actor asignado en su diagrama y devuelve el resultado de su operación específica.
- **SC-002**: Ante datos faltantes, registro inexistente o rol incorrecto, ninguna operación cambia datos y la interfaz informa la causa.
- **SC-003**: Los estados, filtros, evidencias o políticas no definidos en los diagramas se presentan como [NEEDS CLARIFICATION: definir política antes de implementar].
