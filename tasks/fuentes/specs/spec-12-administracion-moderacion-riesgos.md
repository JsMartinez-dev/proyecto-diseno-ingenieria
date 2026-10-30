# Feature Specification: SPEC-12 — Administración, moderación y gestión de riesgos

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC068, UC069, UC070, UC071, UC072, UC073, UC074, UC075, UC076 

## User Scenarios & Testing _(mandatory)_


### User Story 1 - Administrar categorías de servicios [UC068] (Priority: P1)

Como Administrador, quiero crear, editar y desactivar categorías de servicio, para mantener el catálogo de la plataforma organizado y vigente.

**Why this priority**: El catálogo de categorías es usado por Prestadores (perfil) y Clientes (solicitudes) desde el primer día; sin él no hay forma de clasificar servicios.

**Independent Test**: Crear, editar y desactivar una categoría de prueba, y verificar que el catálogo refleja el cambio.

**Acceptance Scenarios**:

1. **Scenario**: Creación de categoría [UC068]
    
    - **Given** un Administrador autenticado define una nueva categoría con nombre único
    - **When** la guarda
    - **Then** el sistema la agrega al catálogo activo, disponible para Prestadores y Clientes
2. **Scenario**: Desactivación de categoría con solicitudes en borrador
    
    - **Given** una categoría está siendo usada por un borrador de solicitud de un Cliente
    - **When** el Administrador la desactiva
    - **Then** el sistema aplica la desactivación al catálogo, pero el borrador existente puede publicarse solo si seleccionar otra categoría.



---

### User Story 2 - Administrar zonas [UC069] (Priority: P1)

Como Administrador, quiero crear, editar y desactivar zonas geográficas, para mantener actualizada la cobertura de la plataforma en la ciudad.

**Why this priority**: Las zonas son usadas para el matching entre Prestadores y Clientes, su correcta administración es tan crítica como la de categorías.

**Independent Test**: Crear, editar y desactivar una zona de prueba, y verificar que el catálogo de zonas refleja el cambio.

**Acceptance Scenarios**:

1. **Scenario**: Creación de zona [UC069]
    
    - **Given** un Administrador define una nueva zona con nombre único
    - **When** la guarda
    - **Then** el sistema la agrega al catálogo activo de zonas
2. **Scenario**: Desactivación de zona en uso por un Prestador activo
    
    - **Given** un Prestador tiene configurada una zona como parte de su cobertura de atención
    - **When** el Administrador desactiva esa zona
    - **Then** el sistema aplica la desactivación al catálogo, pero el Prestador conserva temporalmente esa cobertura.

**Checkpoint**: El catálogo de zonas puede mantenerse actualizado por el Administrador sin intervención técnica.

---

### User Story 3 - Gestionar reportes: cola, revisión y resolución [UC070, UC071, UC072] (Priority: P1)

Como Administrador, quiero consultar la cola de reportes pendientes, revisar el detalle de cada uno y resolverlos, para mantener la confianza y seguridad de la plataforma.

**Why this priority**: Es el flujo central de moderación; sin él, los reportes generados en `SPEC-10` y `SPEC-11` (UC064, UC065, UC066) nunca llegan a una resolución.

**Independent Test**: Con reportes de prueba en distintos estados, verificar que el Administrador puede listarlos, abrir el detalle de uno y cambiar su estado a resuelto.

**Acceptance Scenarios**:

1. **Scenario**: Consulta de la cola de reportes [UC070]
    
    - **Given** existen reportes pendientes de usuario, de servicio o de reseña (`spec-10`, `spec-11`)
    - **When** un Administrador consulta la cola
    - **Then** el sistema muestra todos los reportes pendientes, sin importar su tipo de origen
2. **Scenario**: Revisión de detalle de un reporte [UC071]
    
    - **Given** un Administrador selecciona un reporte de la cola
    - **When** abre su detalle
    - **Then** el sistema muestra el motivo, el objetivo reportado y toda evidencia adjunta (`SPEC-11`, UC067)
3. **Scenario**: Resolución de un reporte [UC072]
    
    - **Given** un Administrador está revisando el detalle de un reporte
    - **When** cambia su estado a resuelto o descartado, con una justificación
    - **Then** el sistema actualiza el estado del reporte y lo retira de la cola de pendientes
4. **Scenario**: Intento de resolver un reporte sin haberlo revisado
    
    - **Given** un reporte está en la cola sin haber sido abierto en detalle
    - **When** se intenta cambiar directamente su estado a resuelto
    - **Then** el sistema exige que el reporte haya sido abierto en detalle antes de permitir su resolución



---

### User Story 4 - Bloquear preventivamente una cuenta [UC073] (Priority: P1)

Como Administrador, quiero bloquear preventivamente una cuenta bajo investigación, para prevenir daño mientras se resuelve un reporte grave.

**Why this priority**: Es una medida de contención necesaria antes de que un reporte grave (UC072) esté completamente resuelto.

**Independent Test**: Bloquear una cuenta de prueba y verificar que pierde acceso a las capacidades de su rol mientras el bloqueo esté activo.

**Acceptance Scenarios**:

1. **Scenario**: Bloqueo preventivo aplicado [UC073]
    - **Given** un Administrador está revisando un reporte grave sobre una cuenta
    - **When** aplica un bloqueo preventivo
    - **Then** el sistema restringe el acceso de esa cuenta a las capacidades de su rol, dejando trazabilidad del bloqueo (quién, cuándo, motivo)

---

### User Story 5 - Moderar perfil o contenido [UC074] (Priority: P1)

Como Administrador, quiero ocultar o corregir contenido de un perfil que incumple las normas de la plataforma, sin necesidad de bloquear la cuenta completa.

**Why this priority**: Permite una intervención proporcional (corregir contenido puntual) frente al bloqueo total de una cuenta (UC073).

**Independent Test**: Sobre un perfil de prueba con contenido inapropiado, moderarlo y verificar que el contenido deja de mostrarse públicamente mientras la cuenta permanece activa.

**Acceptance Scenarios**:

1. **Scenario**: Contenido moderado [UC074]
    - **Given** un Administrador identifica contenido de un perfil que incumple las normas
    - **When** lo modera (oculta o solicita corrección)
    - **Then** el sistema deja de exponer ese contenido públicamente, sin afectar el resto del perfil ni el acceso de la cuenta

---

### User Story 6 - Buscar usuarios y perfiles [UC075] (Priority: P2)

Como Administrador, quiero buscar cuentas o perfiles por nombre, correo o identificador, para ubicar rápidamente el objetivo de una investigación o soporte.

**Why this priority**: Es una herramienta de apoyo transversal a las demás historias de este SPEC, no un flujo de valor final por sí mismo.

**Independent Test**: Buscar una cuenta de prueba por distintos criterios y verificar que aparece en los resultados.

**Acceptance Scenarios**:

1. **Scenario**: Búsqueda exitosa [UC075]
    - **Given** existe una cuenta con datos conocidos
    - **When** un Administrador busca usando alguno de esos datos
    - **Then** el sistema muestra la cuenta correspondiente entre los resultados


---

### User Story 7 - Gestionar servicios de alto riesgo [UC076] (Priority: P1)

Como Administrador, quiero identificar y gestionar servicios clasificados como de alto riesgo, para aplicar controles adicionales antes o durante su ejecución.

**Why this priority**: Ciertos oficios o situaciones (ej. trabajos eléctricos de alto voltaje, servicios en menores de edad presentes en el hogar) pueden requerir supervisión adicional del Administrador.

**Independent Test**: Marcar un servicio de prueba como de alto riesgo y verificar que queda identificado y disponible para seguimiento administrativo.

**Acceptance Scenarios**:

1. **Scenario**: Servicio marcado como alto riesgo [UC076]
    - **Given** un servicio cumple un criterio de alto riesgo definido por el producto
    - **When** un Administrador lo marca como tal
    - **Then** el sistema lo identifica para seguimiento diferenciado



---

### Edge Cases

- Una categoría o zona se desactiva mientras está en uso por un borrador o por la cobertura activa de un Prestador: El sistema debe poder publicar el borrador solo si seleccionar otra categoría y zona.
- Dos Administradores intentan resolver el mismo reporte al mismo tiempo: el sistema debe evitar resultados contradictorios (ej. uno resuelve, otro descarta, simultáneamente).
- Una cuenta bloqueada preventivamente  es también objeto de una nueva búsqueda: debe seguir siendo localizable para que el Administrador revierta el bloqueo si corresponde.


## Requirements _(mandatory)_

### Functional Requirements

- **FR-068**: El sistema DEBE permitir que un Administrador cree, edite y desactive categorías de servicio del catálogo. [UC068]
- **FR-069**: El sistema DEBE permitir que un Administrador cree, edite y desactive zonas geográficas del catálogo. [UC069]
- **FR-070**: El sistema DEBE permitir que un Administrador consulte la cola de reportes pendientes, sin importar su origen (usuario, servicio o reseña). [UC070]
- **FR-071**: El sistema DEBE permitir que un Administrador revise el detalle completo de un reporte, incluyendo su evidencia asociada, antes de poder resolverlo. [UC071]
- **FR-072**: El sistema DEBE permitir que un Administrador cambie el estado de un reporte a resuelto o descartado, con una justificación registrada, únicamente después de haberlo revisado en detalle. [UC072]
- **FR-073**: El sistema DEBE permitir que un Administrador bloquee preventivamente una cuenta, dejando trazabilidad de quién lo hizo, cuándo y por qué. [UC073]
- **FR-074**: El sistema DEBE permitir que un Administrador modere contenido puntual de un perfil sin bloquear la cuenta completa. [UC074]
- **FR-075**: El sistema DEBE permitir que un Administrador busque cuentas o perfiles por distintos criterios (nombre, correo, identificador). [UC075]
- **FR-076**: El sistema DEBE permitir que un Administrador marque un servicio como de alto riesgo según los criterios definidos por el producto. [UC076]

### Key Entities _(include if feature involves data)_

- **Categoría de servicio**: nombre, estado (activa/inactiva).
- **Zona**: nombre, cobertura geográfica, estado (activa/inactiva).
- **Reporte**: tipo de origen, objetivo, estado (pendiente/en revisión/resuelto/descartado), justificación de resolución.
- **Bloqueo preventivo**: cuenta afectada, administrador que lo aplicó, fecha, motivo.
- **Acción de moderación**: contenido afectado, tipo de acción (ocultar/corregir), administrador responsable.
- **Marca de alto riesgo**: servicio asociado, criterio aplicado, administrador que la asignó.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: El 100% de los reportes creados en `SPEC-10` y `SPEC-11` es visible en la cola de este SPEC.
- **SC-002**: Ningún reporte cambia de estado a resuelto/descartado sin haber pasado primero por su revisión de detalle.
- **SC-003**: El 100% de los bloqueos preventivos queda con administrador, fecha y motivo registrados.
- **SC-004**: Ninguna acción de moderación de contenido (UC074) provoca por sí sola un bloqueo de cuenta (UC073); son acciones independientes.
