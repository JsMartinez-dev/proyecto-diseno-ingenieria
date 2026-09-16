# Feature Specification: SPEC-03 — Descubrimiento de prestadores

**Creado**: 2026-09-16  
**Casos de uso cubiertos**: UC014–UC015

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Búsqueda filtrada (Priority: P1)

Como cliente, quiero buscar prestadores por categoría y zona para encontrar opciones relevantes.

**Why this priority**: Esta funcionalidad aporta valor directo al flujo de la plataforma y su prioridad refleja su dependencia y relevancia para el alcance definido.

**Independent Test**: Realizar una búsqueda con categoría y zona y comprobar que los resultados cumplen ambos filtros.

**Acceptance Scenarios**:

1. **Scenario**: Flujo exitoso de búsqueda filtrada
   - **Given** el actor tiene permisos y los datos requeridos son válidos
   - **When** ejecuta la acción principal del caso de uso
   - **Then** el sistema completa la operación y deja el resultado trazable

2. **Scenario**: Datos inválidos o condición no permitida en búsqueda filtrada
   - **Given** falta un dato obligatorio o el estado no permite la operación
   - **When** el actor intenta completar la acción
   - **Then** el sistema rechaza la operación, explica el motivo y conserva la información válida

---

### User Story 2 - Consulta de perfil público (Priority: P1)

Como cliente, quiero consultar el perfil público de un prestador para evaluar su experiencia antes de contactarlo.

**Why this priority**: Esta funcionalidad aporta valor directo al flujo de la plataforma y su prioridad refleja su dependencia y relevancia para el alcance definido.

**Independent Test**: Abrir un perfil desde los resultados y verificar que solo muestra información pública.

**Acceptance Scenarios**:

1. **Scenario**: Flujo exitoso de consulta de perfil público
   - **Given** el actor tiene permisos y los datos requeridos son válidos
   - **When** ejecuta la acción principal del caso de uso
   - **Then** el sistema completa la operación y deja el resultado trazable

2. **Scenario**: Datos inválidos o condición no permitida en consulta de perfil público
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

- **FR-001**: El sistema DEBE permitir buscar prestadores por categoría y zona aproximada.
- **FR-002**: El sistema DEBE devolver resultados compatibles con los filtros seleccionados.
- **FR-003**: El sistema DEBE permitir abrir el perfil público de un prestador desde los resultados.
- **FR-004**: El sistema DEBE ocultar datos personales y direcciones que no sean públicos.

### Key Entities *(include if feature involves data)*

- **Índice de prestadores**: categoría, zona, disponibilidad y estado visible.
- **Perfil público**: presentación, experiencia, portafolio y reputación visible.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Una búsqueda válida devuelve resultados o informa claramente que no hay coincidencias.
- **SC-002**: Los resultados se muestran en menos de 3 segundos en condiciones normales.
- **SC-003**: El perfil público nunca expone la dirección exacta ni datos marcados como privados.

## Trazabilidad

- **Diagrama de origen**: Casos de uso UC014–UC015.
- **Alcance**: La especificación describe el comportamiento observable y no prescribe tecnologías ni rutas de implementación.
