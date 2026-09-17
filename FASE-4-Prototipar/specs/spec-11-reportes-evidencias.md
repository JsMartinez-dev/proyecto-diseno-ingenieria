# Feature Specification: SPEC-11 — Reportes y evidencias

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC065, UC066, UC067

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Reportar usuario [UC065] (Priority: P1)

Como Usuario, quiero reportar a otro usuario (Cliente o Prestador) por un comportamiento indebido, para que sea revisado por un Administrador.

**Why this priority**: Es uno de los mecanismos base de confianza de la plataforma; sin poder reportar usuarios, no hay forma de escalar un mal comportamiento.

**Independent Test**: Generar un reporte contra una cuenta existente y comprobar que queda registrado y disponible en la cola de moderación.

**Acceptance Scenarios**:

1. **Scenario**: Reporte de usuario registrado [UC065]
    
    - **Given** un Usuario identifica a otra cuenta con un comportamiento indebido
    - **When** la reporta indicando un motivo
    - **Then** el sistema registra el reporte asociado a la cuenta reportada y lo pone a disposición de la cola de moderación
2. **Scenario**: Reporte sin motivo indicado
    
    - **Given** un Usuario intenta reportar a otra cuenta sin seleccionar un motivo
    - **When** envía el reporte
    - **Then** el sistema rechaza la operación y solicita indicar un motivo


---

### User Story 2 - Reportar servicio [UC066] (Priority: P1)

Como Usuario, quiero reportar un servicio específico (contratado o en curso) que considero problemático, para que sea revisado por un Administrador.

**Why this priority**: Permite escalar problemas concretos de una transacción, distintos de un problema general de comportamiento de una cuenta.

**Independent Test**: Generar un reporte sobre un servicio existente y comprobar que queda registrado y disponible en la cola de moderación.

**Acceptance Scenarios**:

1. **Scenario**: Reporte de servicio registrado [UC066]
    - **Given** un Usuario participó en un servicio que considera problemático
    - **When** lo reporta indicando un motivo
    - **Then** el sistema registra el reporte asociado a ese servicio y lo pone a disposición de la cola de moderación

**

---

### User Story 3 - Adjuntar evidencia a un reporte [UC067] (Priority: P2)

Como Usuario, quiero adjuntar evidencia (capturas, fotos, documentos) a un reporte ya creado, para respaldar mi reclamo.

**Why this priority**: Es una extensión opcional que mejora la calidad de la revisión administrativa, pero el reporte ya es válido y procesable sin ella.

**Independent Test**: Sobre un reporte existente (de usuario, de servicio o de reseña), adjuntar un archivo y comprobar que queda asociado a ese reporte.

**Acceptance Scenarios**:

1. **Scenario**: Evidencia adjuntada exitosamente [UC067]
    
    - **Given** existe un reporte previamente creado (UC064, UC065 o UC066) y el usuario reportante lo puede editar
    - **When** adjunta un archivo de evidencia
    - **Then** el sistema lo asocia al reporte y lo deja disponible para el Administrador que lo revise
2. **Scenario**: Intento de adjuntar evidencia sin un reporte previo
    
    - **Given** no existe un reporte creado
    - **When** se intenta adjuntar un archivo de evidencia de forma aislada
    - **Then** el sistema rechaza la operación, ya que la evidencia depende de un reporte existente
3. **Scenario**: Archivo no compatible o demasiado grande
    
    - **Given** un usuario intenta adjuntar un archivo que excede el formato o tamaño permitido
    - **When** lo sube
    - **Then** el sistema rechaza el archivo sin afectar el reporte ya guardado


---

### Edge Cases

- Un mismo Usuario reporta al mismo objetivo (cuenta o servicio) más de una vez por el mismo motivo: El sistema debe consolidarlo como un solo reporte con evidencias acumuladas.
- Formatos y tamaño máximo de archivo de evidencia: El sistema debe definir límites concretos antes de implementar.
- Un reporte es resuelto por el Administrador mientras el reportante intenta adjuntar evidencia adicional: El sistema debe rechazar dicha evidencia adicional debido a que el reporte ya cerró.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-065**: El sistema DEBE permitir que un Usuario reporte a otra cuenta indicando un motivo obligatorio, dejando el reporte disponible para moderación. [UC065]
- **FR-066**: El sistema DEBE permitir que un Usuario reporte un servicio específico indicando un motivo obligatorio, dejando el reporte disponible para moderación. [UC066]
- **FR-067**: El sistema DEBE permitir adjuntar evidencia únicamente a un reporte ya existente, sin importar si el reporte es de usuario, de servicio o de reseña (SPEC-10, UC064). [UC067]

### Key Entities _(include if feature involves data)_

- **Reporte de usuario**: cuenta reportada, motivo, usuario reportante, estado.
- **Reporte de servicio**: servicio reportado, motivo, usuario reportante, estado.
- **Evidencia**: archivo adjunto, reporte asociado (de cualquiera de los tres tipos), fecha de carga.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: El 100% de los reportes de usuario y de servicio queda disponible en la cola de moderación (SPEC-12) inmediatamente después de registrarse.
- **SC-002**: Ningún reporte se crea sin un motivo indicado.
- **SC-003**: El 100% de las evidencias adjuntadas queda asociada a un reporte válido y preexistente; ninguna evidencia queda huérfana.
