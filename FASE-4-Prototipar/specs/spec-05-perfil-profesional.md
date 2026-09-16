# Feature Specification: SPEC-05 — Creación y gestión del perfil profesional

**Creado**: 2026-09-16  
**Casos de uso cubiertos**: UC024–UC033

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Construcción del perfil (Priority: P1)

Como prestador, quiero crear y editar mi perfil profesional con categorías, zonas, experiencia y portafolio para presentar mis servicios.

**Why this priority**: Esta funcionalidad aporta valor directo al flujo de la plataforma y su prioridad refleja su dependencia y relevancia para el alcance definido.

**Independent Test**: Crear un perfil con información válida y comprobar que la vista pública refleja los datos permitidos.

**Acceptance Scenarios**:

1. **Scenario**: Flujo exitoso de construcción del perfil
   - **Given** el actor tiene permisos y los datos requeridos son válidos
   - **When** ejecuta la acción principal del caso de uso
   - **Then** el sistema completa la operación y deja el resultado trazable

2. **Scenario**: Datos inválidos o condición no permitida en construcción del perfil
   - **Given** falta un dato obligatorio o el estado no permite la operación
   - **When** el actor intenta completar la acción
   - **Then** el sistema rechaza la operación, explica el motivo y conserva la información válida

---

### User Story 2 - Disponibilidad y agenda (Priority: P1)

Como prestador, quiero configurar mi disponibilidad y agenda para indicar cuándo puedo atender servicios.

**Why this priority**: Esta funcionalidad aporta valor directo al flujo de la plataforma y su prioridad refleja su dependencia y relevancia para el alcance definido.

**Independent Test**: Definir horarios y consultar la agenda para comprobar que los bloques quedan registrados.

**Acceptance Scenarios**:

1. **Scenario**: Flujo exitoso de disponibilidad y agenda
   - **Given** el actor tiene permisos y los datos requeridos son válidos
   - **When** ejecuta la acción principal del caso de uso
   - **Then** el sistema completa la operación y deja el resultado trazable

2. **Scenario**: Datos inválidos o condición no permitida en disponibilidad y agenda
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

- **FR-001**: El sistema DEBE permitir crear y editar un perfil profesional.
- **FR-002**: El sistema DEBE permitir asociar categorías, zonas de atención, experiencia y servicios del portafolio.
- **FR-003**: El sistema DEBE permitir agregar y eliminar servicios del portafolio.
- **FR-004**: El sistema DEBE permitir configurar disponibilidad horaria y gestionar la agenda.
- **FR-005**: El sistema DEBE ofrecer una vista previa antes de publicar cambios.

### Key Entities *(include if feature involves data)*

- **Perfil profesional**: presentación, experiencia, categorías, zonas y estado.
- **Servicio de portafolio**: nombre, descripción, evidencia y estado.
- **Agenda**: franjas horarias, excepciones y compromisos registrados.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un prestador puede completar el perfil básico sin datos opcionales.
- **SC-002**: No se aceptan franjas horarias solapadas o con formato inválido.
- **SC-003**: La vista previa coincide con la información pública que vería un cliente.

## Trazabilidad

- **Diagrama de origen**: Casos de uso UC024–UC033.
- **Alcance**: La especificación describe el comportamiento observable y no prescribe tecnologías ni rutas de implementación.
