# Feature Specification: SPEC-14 — Preferencias, historial e indicadores

**Creado**: 2026-09-16  
**Casos de uso cubiertos**: UC081–UC085

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Preferencias y actividad (Priority: P1)

Como usuario, quiero configurar notificaciones y consultar mi actividad reciente para controlar la información que recibo.

**Why this priority**: Esta funcionalidad aporta valor directo al flujo de la plataforma y su prioridad refleja su dependencia y relevancia para el alcance definido.

**Independent Test**: Cambiar una preferencia y comprobar que afecta los avisos posteriores; luego consultar actividad.

**Acceptance Scenarios**:

1. **Scenario**: Flujo exitoso de preferencias y actividad
   - **Given** el actor tiene permisos y los datos requeridos son válidos
   - **When** ejecuta la acción principal del caso de uso
   - **Then** el sistema completa la operación y deja el resultado trazable

2. **Scenario**: Datos inválidos o condición no permitida en preferencias y actividad
   - **Given** falta un dato obligatorio o el estado no permite la operación
   - **When** el actor intenta completar la acción
   - **Then** el sistema rechaza la operación, explica el motivo y conserva la información válida

---

### User Story 2 - Historial e indicadores (Priority: P2)

Como prestador, quiero consultar y descargar mi historial de trabajos e indicadores básicos para evaluar mi actividad.

**Why this priority**: Esta funcionalidad aporta valor directo al flujo de la plataforma y su prioridad refleja su dependencia y relevancia para el alcance definido.

**Independent Test**: Consultar el historial, descargarlo y verificar que los indicadores coinciden con los trabajos registrados.

**Acceptance Scenarios**:

1. **Scenario**: Flujo exitoso de historial e indicadores
   - **Given** el actor tiene permisos y los datos requeridos son válidos
   - **When** ejecuta la acción principal del caso de uso
   - **Then** el sistema completa la operación y deja el resultado trazable

2. **Scenario**: Datos inválidos o condición no permitida en historial e indicadores
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

- **FR-001**: El sistema DEBE permitir configurar preferencias de notificación por tipo y canal.
- **FR-002**: El sistema DEBE mostrar la actividad reciente del usuario autenticado.
- **FR-003**: El sistema DEBE permitir consultar el historial de trabajos autorizado.
- **FR-004**: El sistema DEBE permitir descargar el historial en un formato legible.
- **FR-005**: El sistema DEBE calcular indicadores básicos del prestador a partir de datos válidos.

### Key Entities *(include if feature involves data)*

- **Preferencia**: usuario, evento, canal, habilitación y fecha de cambio.
- **Historial**: servicio, estados, participantes, fechas y resultado.
- **Indicador**: nombre, valor, periodo, fuente y fecha de cálculo.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Una preferencia inválida no se guarda ni modifica las existentes.
- **SC-002**: La descarga incluye solo registros autorizados y conserva el orden temporal.
- **SC-003**: Los indicadores no muestran resultados si no existe un volumen mínimo definido.

## Trazabilidad

- **Diagrama de origen**: Casos de uso UC081–UC085.
- **Alcance**: La especificación describe el comportamiento observable y no prescribe tecnologías ni rutas de implementación.
