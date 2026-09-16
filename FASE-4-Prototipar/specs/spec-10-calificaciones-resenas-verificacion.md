# Feature Specification: SPEC-10 — Calificaciones, reseñas y verificación

**Creado**: 2026-09-16  
**Casos de uso cubiertos**: UC059–UC064

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Evaluación del servicio (Priority: P1)

Como cliente, quiero calificar un servicio finalizado y agregar una reseña para compartir mi experiencia.

**Why this priority**: Esta funcionalidad aporta valor directo al flujo de la plataforma y su prioridad refleja su dependencia y relevancia para el alcance definido.

**Independent Test**: Finalizar un servicio, registrar una calificación y comprobar que actualiza la reputación.

**Acceptance Scenarios**:

1. **Scenario**: Flujo exitoso de evaluación del servicio
   - **Given** el actor tiene permisos y los datos requeridos son válidos
   - **When** ejecuta la acción principal del caso de uso
   - **Then** el sistema completa la operación y deja el resultado trazable

2. **Scenario**: Datos inválidos o condición no permitida en evaluación del servicio
   - **Given** falta un dato obligatorio o el estado no permite la operación
   - **When** el actor intenta completar la acción
   - **Then** el sistema rechaza la operación, explica el motivo y conserva la información válida

---

### User Story 2 - Verificación y moderación de reseñas (Priority: P2)

Como prestador o usuario, quiero consultar el nivel de verificación y reportar una reseña problemática.

**Why this priority**: Esta funcionalidad aporta valor directo al flujo de la plataforma y su prioridad refleja su dependencia y relevancia para el alcance definido.

**Independent Test**: Consultar la verificación y enviar un reporte que quede disponible para moderación.

**Acceptance Scenarios**:

1. **Scenario**: Flujo exitoso de verificación y moderación de reseñas
   - **Given** el actor tiene permisos y los datos requeridos son válidos
   - **When** ejecuta la acción principal del caso de uso
   - **Then** el sistema completa la operación y deja el resultado trazable

2. **Scenario**: Datos inválidos o condición no permitida en verificación y moderación de reseñas
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

- **FR-001**: El sistema DEBE permitir calificar únicamente servicios finalizados y elegibles.
- **FR-002**: El sistema DEBE permitir agregar una reseña textual asociada a la calificación.
- **FR-003**: El sistema DEBE calcular y mostrar una reputación agregada conforme a las reglas definidas.
- **FR-004**: El sistema DEBE mostrar el nivel de verificación del prestador.
- **FR-005**: El sistema DEBE permitir reportar reseñas problemáticas.

### Key Entities *(include if feature involves data)*

- **Calificación**: servicio, autor, puntuación, fecha y estado.
- **Reseña**: texto, calificación, visibilidad y estado de moderación.
- **Verificación**: prestador, nivel, evidencias, vigencia y estado.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: No se permite más de una calificación válida por participante y servicio.
- **SC-002**: Una puntuación fuera del rango configurado se rechaza.
- **SC-003**: Una reseña reportada conserva trazabilidad y puede ocultarse sin alterar el historial original.

## Trazabilidad

- **Diagrama de origen**: Casos de uso UC059–UC064.
- **Alcance**: La especificación describe el comportamiento observable y no prescribe tecnologías ni rutas de implementación.
