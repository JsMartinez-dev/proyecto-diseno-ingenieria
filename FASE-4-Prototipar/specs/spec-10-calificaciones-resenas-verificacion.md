# Feature Specification: SPEC-10 — Calificaciones, reseñas y verificación

**Creado**: 2026-09-16 
**Casos de uso cubiertos**: UC059, UC060, UC062, UC063, UC064

## User Scenarios & Testing _(mandatory)_


### User Story 1 - Calificar servicio finalizado [UC059; regla UC061] (Priority: P1)

Como Cliente, quiero calificar un servicio ya finalizado para dejar constancia de mi experiencia y que la reputación del Prestador se actualice.

**Why this priority**: Es la base del sistema de confianza de la plataforma; sin calificaciones no existe reputación ni verificación posterior.

**Independent Test**: Con un servicio en estado "finalizado" asociado a un Cliente, calificarlo y verificar que la calificación queda registrada y la reputación agregada del Prestador se recalcula.

**Acceptance Scenarios**:

1. **Scenario**: Calificación exitosa de un servicio finalizado [UC059]
    
    - **Given** un Cliente tiene un servicio propio en estado "finalizado" sin calificación previa
    - **When** asigna una calificación (ej. de 1 a 5)
    - **Then** el sistema registra la calificación asociada a ese servicio y al Prestador correspondiente
2. **Scenario**: Recálculo automático de reputación agregada [Regla UC061]
    
    - **Given** se acaba de registrar una nueva calificación válida para un Prestador
    - **When** la calificación se confirma
    - **Then** el sistema recalcula automáticamente la reputación agregada del Prestador incluyendo el nuevo valor
3. **Scenario**: Intento de calificar un servicio no finalizado
    
    - **Given** un Cliente intenta calificar un servicio que aún no está en estado "finalizado"
    - **When** envía la calificación
    - **Then** el sistema rechaza la operación y no altera la reputación del Prestador
4. **Scenario**: Intento de calificación duplicada
    
    - **Given** un servicio ya fue calificado previamente por el Cliente
    - **When** intenta calificarlo de nuevo
    - **Then** el sistema rechaza la segunda calificación y conserva únicamente la primera

**

---

### User Story 2 - Agregar reseña textual [UC060] (Priority: P2)

Como Cliente, quiero agregar un comentario escrito a mi calificación para explicar mi experiencia con más detalle.

**Why this priority**: Es una extensión opcional de la calificación (UC059); aporta valor pero la plataforma es funcional sin ella.

**Independent Test**: Sobre una calificación ya existente del propio Cliente, agregar texto y verificar que queda asociado a esa calificación.

**Acceptance Scenarios**:

1. **Scenario**: Reseña agregada exitosamente [UC060]
    
    - **Given** un Cliente ya calificó un servicio finalizado (UC059)
    - **When** agrega un comentario textual a esa calificación
    - **Then** el sistema guarda la reseña asociada a la calificación y la muestra junto al Prestador calificado
2. **Scenario**: Intento de reseña sin calificación previa
    
    - **Given** un servicio no ha sido calificado todavía
    - **When** el Cliente intenta agregar una reseña textual directamente
    - **Then** el sistema rechaza la operación, ya que la reseña depende de una calificación existente



---

### User Story 3 - Consultar nivel de verificación [UC062] (Priority: P1)

Como Usuario (Cliente o Prestador), quiero ver el nivel de verificación de un Prestador para decidir con más confianza si contratarlo.

**Why this priority**: Es información de confianza consultada directamente por el Cliente antes de contratar; impacta la decisión comercial.

**Independent Test**: Consultar el perfil de un Prestador con un nivel de verificación conocido y comprobar que se muestra correctamente.

**Acceptance Scenarios**:

1. **Scenario**: Nivel de verificación visible [UC062]
    - **Given** un Prestador tiene un nivel de verificación asignado
    - **When** un Usuario consulta su perfil
    - **Then** el sistema muestra el nivel de verificación vigente de ese Prestador


---

### User Story 4 - Solicitar verificación documental ampliada [UC063] (Priority: P1)

Como Prestador, quiero solicitar una verificación documental ampliada para aumentar mi nivel de confianza frente a los Clientes.

**Why this priority**: Es la vía formal para que un Prestador mejore su nivel de verificación (UC062); sin esta solicitud, el nivel de verificación no puede evolucionar.

**Independent Test**: Con una cuenta de Prestador, iniciar una solicitud de verificación ampliada y comprobar que queda registrada en estado pendiente.

**Acceptance Scenarios**:

1. **Scenario**: Solicitud registrada exitosamente [UC063]
    
    - **Given** un Prestador autenticado no tiene una solicitud de verificación ampliada en curso
    - **When** envía su solicitud con los documentos requeridos
    - **Then** el sistema la registra en estado pendiente de revisión
2. **Scenario**: Solicitud duplicada mientras hay una pendiente
    
    - **Given** un Prestador ya tiene una solicitud de verificación ampliada pendiente
    - **When** intenta enviar una nueva solicitud
    - **Then** el sistema la rechaza e indica que ya existe una en curso



---

### User Story 5 - Reportar reseña problemática [UC064] (Priority: P2)

Como Usuario, quiero reportar una reseña que considero falsa, ofensiva o injusta para que sea revisada por un Administrador.

**Why this priority**: Protege la integridad del sistema de reputación, pero depende de que ya existan reseñas publicadas (UC060).

**Independent Test**: Sobre una reseña existente, generar un reporte y comprobar que queda registrado y disponible para moderación (SPEC-12).

**Acceptance Scenarios**:

1. **Scenario**: Reporte de reseña registrado [UC064]
    - **Given** existe una reseña textual publicada
    - **When** un Usuario la reporta indicando un motivo
    - **Then** el sistema registra el reporte y lo pone a disposición de la cola de moderación

---

### Edge Cases

- Un Cliente intenta calificar un servicio que fue cancelado en lugar de finalizado: la calificación debe rechazarse igual que un servicio no finalizado.
- Se reporta una reseña que ya fue eliminada previamente por moderación: el sistema debe evitar reportes duplicados sobre contenido inexistente.
- Un Prestador alcanza el nivel máximo de verificación y vuelve a solicitar verificación ampliada: El sistema debe notar el tope de nivel máximo de verificación y rechazar la solicitud.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-059**: El sistema DEBE permitir que un Cliente califique un servicio propio únicamente cuando esté en estado "finalizado", y como máximo una vez por servicio. [UC059]
- **FR-060**: El sistema DEBE permitir agregar una reseña textual únicamente sobre una calificación ya existente del mismo Cliente. [UC060]
- **FR-061**: El sistema DEBE recalcular automáticamente la reputación agregada del Prestador cada vez que se registra una nueva calificación válida. [Regla interna UC061 asociada a UC059]
- **FR-062**: El sistema DEBE mostrar el nivel de verificación vigente de un Prestador a cualquier Usuario que consulte su perfil. [UC062]
- **FR-063**: El sistema DEBE permitir que un Prestador solicite verificación documental ampliada, sin admitir una segunda solicitud mientras haya una pendiente. [UC063]
- **FR-064**: El sistema DEBE permitir que un Usuario reporte una reseña existente, registrando el reporte para su revisión posterior. [UC064]

### Key Entities _(include if feature involves data)_

- **Calificación**: valor numérico, servicio asociado, Cliente autor, fecha.
- **Reseña**: texto asociado a una calificación existente.
- **Reputación agregada**: valor calculado por Prestador, derivado del conjunto de sus calificaciones.
- **Nivel de verificación**: estado asignado a un Prestador (básico/ampliado, según resultado de revisión documental).
- **Solicitud de verificación ampliada**: Prestador, documentos adjuntos, estado (pendiente/aprobada/rechazada).
- **Reporte de reseña**: reseña reportada, motivo, usuario reportante, estado.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: El 100% de los servicios no finalizados o ya calificados rechaza intentos adicionales de calificación.
- **SC-002**: El 100% de las calificaciones nuevas produce un recálculo verificable de la reputación agregada del Prestador correspondiente.
- **SC-003**: Ningún nivel de verificación se presenta junto a lenguaje que sugiera una certificación legal.
- **SC-004**: El 100% de los reportes de reseña queda disponible en la cola de moderación (SPEC-12) inmediatamente después de registrarse.

