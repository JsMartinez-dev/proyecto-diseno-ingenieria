# Feature Specification: SPEC-11 — Reportes y evidencias

**Creado**: 2026-09-16  
**Casos de uso cubiertos**: UC065–UC067

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Creación de reportes (Priority: P1)

Como usuario, quiero reportar a otro usuario o servicio cuando detecte un comportamiento problemático.

**Why this priority**: Esta funcionalidad aporta valor directo al flujo de la plataforma y su prioridad refleja su dependencia y relevancia para el alcance definido.

**Independent Test**: Crear un reporte con categoría y descripción y comprobar que queda en estado pendiente.

**Acceptance Scenarios**:

1. **Scenario**: Flujo exitoso de creación de reportes
   - **Given** el actor tiene permisos y los datos requeridos son válidos
   - **When** ejecuta la acción principal del caso de uso
   - **Then** el sistema completa la operación y deja el resultado trazable

2. **Scenario**: Datos inválidos o condición no permitida en creación de reportes
   - **Given** falta un dato obligatorio o el estado no permite la operación
   - **When** el actor intenta completar la acción
   - **Then** el sistema rechaza la operación, explica el motivo y conserva la información válida

---

### User Story 2 - Adjuntar evidencia (Priority: P2)

Como usuario, quiero adjuntar evidencia a un reporte para facilitar su revisión.

**Why this priority**: Esta funcionalidad aporta valor directo al flujo de la plataforma y su prioridad refleja su dependencia y relevancia para el alcance definido.

**Independent Test**: Adjuntar un archivo válido y comprobar que queda asociado al reporte sin exposición pública.

**Acceptance Scenarios**:

1. **Scenario**: Flujo exitoso de adjuntar evidencia
   - **Given** el actor tiene permisos y los datos requeridos son válidos
   - **When** ejecuta la acción principal del caso de uso
   - **Then** el sistema completa la operación y deja el resultado trazable

2. **Scenario**: Datos inválidos o condición no permitida en adjuntar evidencia
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

- **FR-001**: El sistema DEBE permitir reportar usuarios y servicios con una categoría válida.
- **FR-002**: El sistema DEBE exigir una descripción suficiente para enviar un reporte.
- **FR-003**: El sistema DEBE permitir adjuntar evidencia compatible a un reporte.
- **FR-004**: El sistema DEBE registrar fecha, autor, objeto reportado y estado del reporte.
- **FR-005**: El sistema DEBE restringir la evidencia a los actores autorizados.

### Key Entities *(include if feature involves data)*

- **Reporte**: autor, objeto, categoría, descripción, estado y fechas.
- **Evidencia**: archivo, tipo, tamaño, reporte asociado y estado de revisión.
- **Objeto reportado**: usuario, perfil o servicio involucrado.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un reporte sin objeto válido no puede enviarse.
- **SC-002**: Una evidencia incompatible se rechaza sin eliminar el reporte.
- **SC-003**: El usuario reportado no puede alterar ni eliminar la evidencia de un reporte ajeno.

## Trazabilidad

- **Diagrama de origen**: Casos de uso UC065–UC067.
- **Alcance**: La especificación describe el comportamiento observable y no prescribe tecnologías ni rutas de implementación.
