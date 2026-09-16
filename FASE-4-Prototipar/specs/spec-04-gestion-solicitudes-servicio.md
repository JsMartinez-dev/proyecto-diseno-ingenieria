# Feature Specification: SPEC-04 — Gestión de solicitudes de servicio

**Creado**: 2026-09-16  
**Casos de uso cubiertos**: UC016–UC023

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Publicación de solicitud (Priority: P1)

Como cliente, quiero describir una necesidad, indicar urgencia y zona, adjuntar fotos y publicarla para recibir ayuda.

**Why this priority**: Esta funcionalidad aporta valor directo al flujo de la plataforma y su prioridad refleja su dependencia y relevancia para el alcance definido.

**Independent Test**: Completar una solicitud válida y comprobar que pasa al estado publicada.

**Acceptance Scenarios**:

1. **Scenario**: Flujo exitoso de publicación de solicitud
   - **Given** el actor tiene permisos y los datos requeridos son válidos
   - **When** ejecuta la acción principal del caso de uso
   - **Then** el sistema completa la operación y deja el resultado trazable

2. **Scenario**: Datos inválidos o condición no permitida en publicación de solicitud
   - **Given** falta un dato obligatorio o el estado no permite la operación
   - **When** el actor intenta completar la acción
   - **Then** el sistema rechaza la operación, explica el motivo y conserva la información válida

---

### User Story 2 - Administración de solicitudes (Priority: P1)

Como cliente, quiero guardar borradores, editar, cancelar y consultar mis solicitudes para controlar su ciclo inicial.

**Why this priority**: Esta funcionalidad aporta valor directo al flujo de la plataforma y su prioridad refleja su dependencia y relevancia para el alcance definido.

**Independent Test**: Crear un borrador, publicarlo, modificarlo, consultar su detalle y cancelarlo.

**Acceptance Scenarios**:

1. **Scenario**: Flujo exitoso de administración de solicitudes
   - **Given** el actor tiene permisos y los datos requeridos son válidos
   - **When** ejecuta la acción principal del caso de uso
   - **Then** el sistema completa la operación y deja el resultado trazable

2. **Scenario**: Datos inválidos o condición no permitida en administración de solicitudes
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

- **FR-001**: El sistema DEBE permitir definir descripción, categoría, zona aproximada y urgencia.
- **FR-002**: El sistema DEBE permitir adjuntar fotografías compatibles y conservar borradores.
- **FR-003**: El sistema DEBE validar los campos obligatorios antes de publicar.
- **FR-004**: El sistema DEBE permitir editar o cancelar una solicitud mientras su estado lo permita.
- **FR-005**: El sistema DEBE mostrar al cliente sus solicitudes, detalle y estado actual.

### Key Entities *(include if feature involves data)*

- **Solicitud**: descripción, categoría, zona, dirección protegida, urgencia, fotos y estado.
- **Borrador**: contenido parcial, propietario, fecha de actualización y vigencia.
- **Adjunto**: archivo, tipo, tamaño, solicitud asociada y estado de validación.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Una solicitud incompleta no puede publicarse y muestra los campos faltantes.
- **SC-002**: Un archivo no compatible se rechaza sin perder el resto del formulario.
- **SC-003**: Una solicitud cancelada no vuelve a aparecer como disponible para nuevas propuestas.

## Trazabilidad

- **Diagrama de origen**: Casos de uso UC016–UC023.
- **Alcance**: La especificación describe el comportamiento observable y no prescribe tecnologías ni rutas de implementación.
