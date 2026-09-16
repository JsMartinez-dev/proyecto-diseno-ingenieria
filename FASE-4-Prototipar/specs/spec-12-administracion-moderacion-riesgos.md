# Feature Specification: SPEC-12 — Administración, moderación y gestión de riesgos

**Creado**: 2026-09-16  
**Casos de uso cubiertos**: UC068–UC076

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Gestión de catálogos (Priority: P1)

Como administrador, quiero administrar categorías y zonas para mantener consistentes las opciones de la plataforma.

**Why this priority**: Esta funcionalidad aporta valor directo al flujo de la plataforma y su prioridad refleja su dependencia y relevancia para el alcance definido.

**Independent Test**: Crear, editar y desactivar una categoría o zona y comprobar su efecto en nuevos formularios.

**Acceptance Scenarios**:

1. **Scenario**: Flujo exitoso de gestión de catálogos
   - **Given** el actor tiene permisos y los datos requeridos son válidos
   - **When** ejecuta la acción principal del caso de uso
   - **Then** el sistema completa la operación y deja el resultado trazable

2. **Scenario**: Datos inválidos o condición no permitida en gestión de catálogos
   - **Given** falta un dato obligatorio o el estado no permite la operación
   - **When** el actor intenta completar la acción
   - **Then** el sistema rechaza la operación, explica el motivo y conserva la información válida

---

### User Story 2 - Moderación y riesgos (Priority: P1)

Como administrador, quiero revisar reportes, moderar contenido, bloquear cuentas y gestionar servicios de alto riesgo.

**Why this priority**: Esta funcionalidad aporta valor directo al flujo de la plataforma y su prioridad refleja su dependencia y relevancia para el alcance definido.

**Independent Test**: Consultar la cola, revisar un reporte, ejecutar una decisión y comprobar la trazabilidad.

**Acceptance Scenarios**:

1. **Scenario**: Flujo exitoso de moderación y riesgos
   - **Given** el actor tiene permisos y los datos requeridos son válidos
   - **When** ejecuta la acción principal del caso de uso
   - **Then** el sistema completa la operación y deja el resultado trazable

2. **Scenario**: Datos inválidos o condición no permitida en moderación y riesgos
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

- **FR-001**: El sistema DEBE permitir administrar categorías de servicios y zonas.
- **FR-002**: El sistema DEBE mostrar al administrador una cola de reportes con estados y prioridades.
- **FR-003**: El sistema DEBE permitir revisar detalles y cambiar el estado de un reporte.
- **FR-004**: El sistema DEBE permitir bloquear preventivamente cuentas y moderar perfiles o contenido.
- **FR-005**: El sistema DEBE permitir identificar y gestionar servicios de alto riesgo.
- **FR-006**: El sistema DEBE registrar quién ejecutó cada acción administrativa y por qué.

### Key Entities *(include if feature involves data)*

- **Catálogo**: tipo, nombre, estado y fecha de actualización.
- **Caso de moderación**: reporte, objeto, decisión, responsable y evidencia.
- **Cuenta bloqueada**: usuario, motivo, alcance, inicio, vencimiento y estado.
- **Servicio de riesgo**: indicadores, nivel, acciones y seguimiento.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Toda acción administrativa deja una entrada de auditoría no editable.
- **SC-002**: Una cuenta bloqueada pierde inmediatamente las capacidades definidas por la política.
- **SC-003**: Un administrador no puede cerrar un reporte sin registrar una decisión válida.

## Trazabilidad

- **Diagrama de origen**: Casos de uso UC068–UC076.
- **Alcance**: La especificación describe el comportamiento observable y no prescribe tecnologías ni rutas de implementación.
