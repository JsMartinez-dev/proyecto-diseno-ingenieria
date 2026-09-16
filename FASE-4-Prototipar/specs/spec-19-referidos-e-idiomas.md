# Feature Specification: SPEC-19 — Programa de referidos e idiomas adicionales

**Creado**: 2026-09-16  
**Casos de uso cubiertos**: UC089 y UC092

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Referidos (Priority: P2)

Como usuario, quiero recomendar la plataforma a otra persona para ampliar la comunidad mediante un programa de referidos.

**Why this priority**: Esta funcionalidad aporta valor directo al flujo de la plataforma y su prioridad refleja su dependencia y relevancia para el alcance definido.

**Independent Test**: Generar una referencia válida y comprobar que el evento queda registrado sin duplicar beneficios.

**Acceptance Scenarios**:

1. **Scenario**: Flujo exitoso de referidos
   - **Given** el actor tiene permisos y los datos requeridos son válidos
   - **When** ejecuta la acción principal del caso de uso
   - **Then** el sistema completa la operación y deja el resultado trazable

2. **Scenario**: Datos inválidos o condición no permitida en referidos
   - **Given** falta un dato obligatorio o el estado no permite la operación
   - **When** el actor intenta completar la acción
   - **Then** el sistema rechaza la operación, explica el motivo y conserva la información válida

---

### User Story 2 - Preferencia de idioma (Priority: P2)

Como usuario, quiero seleccionar un idioma adicional para comprender la plataforma en mi idioma preferido.

**Why this priority**: Esta funcionalidad aporta valor directo al flujo de la plataforma y su prioridad refleja su dependencia y relevancia para el alcance definido.

**Independent Test**: Cambiar el idioma, navegar por las vistas compatibles y conservar la preferencia.

**Acceptance Scenarios**:

1. **Scenario**: Flujo exitoso de preferencia de idioma
   - **Given** el actor tiene permisos y los datos requeridos son válidos
   - **When** ejecuta la acción principal del caso de uso
   - **Then** el sistema completa la operación y deja el resultado trazable

2. **Scenario**: Datos inválidos o condición no permitida en preferencia de idioma
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

- **FR-001**: El sistema DEBE generar referencias con identificadores únicos y vigencia definida.
- **FR-002**: El sistema DEBE registrar el origen de un referido sin exponer datos innecesarios.
- **FR-003**: El sistema DEBE evitar contabilizar dos veces el mismo referido elegible.
- **FR-004**: El sistema DEBE permitir seleccionar un idioma disponible.
- **FR-005**: El sistema DEBE conservar el idioma elegido en sesiones posteriores.

### Key Entities *(include if feature involves data)*

- **Referencia**: emisor, código, fecha, vigencia y estado.
- **Conversión de referido**: código, receptor, evento elegible y beneficio.
- **Preferencia lingüística**: usuario, idioma, estado y fecha de cambio.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un código expirado o ya utilizado no genera una nueva conversión.
- **SC-002**: El idioma no disponible deja la preferencia anterior sin cambios.
- **SC-003**: Los textos no traducidos conservan una alternativa comprensible sin romper la navegación.

## Trazabilidad

- **Diagrama de origen**: Casos de uso UC089 y UC092.
- **Alcance**: La especificación describe el comportamiento observable y no prescribe tecnologías ni rutas de implementación.
