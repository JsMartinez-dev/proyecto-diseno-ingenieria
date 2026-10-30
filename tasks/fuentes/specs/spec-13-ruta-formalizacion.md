# Feature Specification: SPEC-13 — Ruta de formalización

**Creado**: 2026-09-16 
**Casos de uso cubiertos**: UC077, UC078, UC079, UC080 

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Consultar ruta de formalización [UC077] (Priority: P1)

Como Prestador, quiero consultar una ruta orientativa de formalización para entender qué pasos puedo seguir, sin que esto implique una obligación legal impuesta por la plataforma.

**Why this priority**: Es la entrada principal al módulo; sin ella no existe ningún otro flujo de formalización.

**Independent Test**: Con una cuenta de Prestador, acceder al módulo y verificar que se presenta la ruta orientativa con sus pasos y recursos.

**Acceptance Scenarios**:

1. **Scenario**: Ruta disponible [UC077]
    - **Given** un Prestador autenticado accede al módulo de formalización
    - **When** consulta la ruta
    - **Then** el sistema presenta los pasos orientativos y los recursos asociados, identificándolos como informativos y no obligatorios


---

### User Story 2 - Abrir enlaces oficiales de formalización [UC078] (Priority: P2)

Como Prestador, quiero abrir enlaces oficiales desde la ruta de formalización para continuar trámites o consultar fuentes institucionales externas.

**Why this priority**: Es una extensión opcional de la consulta de la ruta (UC077); la ruta ya aporta valor informativo sin que el Prestador llegue a abrir ningún enlace.

**Independent Test**: Con la ruta ya cargada y un enlace configurado, abrirlo y verificar que dirige al destino institucional correspondiente, identificado como externo.

**Acceptance Scenarios**:

1. **Scenario**: Apertura de enlace oficial [UC078]
    
    - **Given** un paso de la ruta tiene un enlace institucional configurado
    - **When** el Prestador lo abre
    - **Then** el sistema dirige al recurso oficial definido, marcándolo claramente como un destino externo
2. **Scenario**: Enlace oficial roto o no disponible
    
    - **Given** un enlace configurado ya no responde o fue dado de baja por la entidad externa
    - **When** el Prestador intenta abrirlo
    - **Then** el sistema lo muestra como no disponible, sin afirmar en ningún momento que el trámite asociado fue completado


---

### User Story 3 - Mostrar progreso sin declarar estatus legal [UC079] (Priority: P1)

Como Prestador, quiero ver un progreso orientativo de mi ruta de formalización sin que la plataforma afirme o certifique automáticamente mi estatus legal.

**Why this priority**: Es una restricción crítica explícita: el progreso mostrado nunca puede interpretarse como una certificación, sin importar qué tan avanzado esté.

**Independent Test**: Con distintos niveles de avance simulados, consultar el progreso y verificar que el sistema nunca lo presenta como una declaración de estatus legal.

**Acceptance Scenarios**:

1. **Scenario**: Progreso orientativo mostrado [UC079]
    
    - **Given** un Prestador tiene algún avance registrado en su ruta
    - **When** consulta su progreso
    - **Then** el sistema muestra el avance junto con una indicación explícita de que es orientativo y no constituye una declaración legal
2. **Scenario**: Progreso al 100%
    
    - **Given** un Prestador completó todos los pasos orientativos de la ruta
    - **When** consulta su progreso
    - **Then** el sistema sigue mostrando la misma advertencia de que esto no equivale a una certificación o estatus legal verificado


---

### User Story 4 - Vincular ruta institucional futura  [UC080] (Priority: P3)

Como Prestador, quiero que en el futuro la ruta de formalización pueda vincularse con rutas institucionales oficiales, para ampliar el acompañamiento más allá de lo que ofrece la plataforma por sí sola.

**Why this priority**: Está marcado explícitamente como `<<Future>>` en el diagrama; no es parte del alcance comprometido del MVP, igual que las capacidades descritas en `spec-07`.

**Independent Test**: Solo en un entorno de prueba con la capacidad habilitada, vincular una ruta institucional simulada y verificar que no altera el comportamiento cuando la capacidad está deshabilitada.

**Acceptance Scenarios**:

1. **Scenario**: Capacidad deshabilitada (comportamiento por defecto)
    
    - **Given** la capacidad de vinculación institucional futura no está habilitada
    - **When** un Prestador consulta su ruta de formalización
    - **Then** el sistema funciona con normalidad (Historias 1 a 3) sin ofrecer ni sugerir esta vinculación
2. **Scenario**: Capacidad habilitada (futuro)
    
    - **Given** la capacidad está explícitamente habilitada y existe una ruta institucional configurada
    - **When** el Prestador accede al vínculo
    - **Then** el sistema enlaza la fuente externa sin declarar automáticamente cumplimiento legal


---

### Edge Cases

- Un enlace institucional expira o cambia de dirección: debe poder deshabilitarse o actualizarse sin convertirse en contenido "verificado" por defecto.
- El Prestador alcanza el máximo progreso posible: la advertencia de "no constituye estatus legal" debe seguir mostrándose igual que con cualquier otro nivel de avance.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-077**: El sistema DEBE proporcionar a los Prestadores una ruta orientativa de formalización, identificada explícitamente como informativa. [UC077]
- **FR-078**: El sistema DEBE permitir abrir enlaces oficiales de formalización configurados, identificándolos claramente como destinos externos. [UC078]
- **FR-079**: El sistema DEBE presentar el progreso de formalización como orientativo y NO DEBE declarar, certificar ni inferir automáticamente un estatus legal a partir de dicho progreso, sin importar su nivel de avance. [UC079]
- **FR-080**: El sistema PUEDE admitir en el futuro una vinculación con rutas institucionales externas, la cual DEBE permanecer deshabilitada sin afectar el funcionamiento de UC077–UC079 mientras no sea aprobada explícitamente. [UC080]

### Key Entities _(include if feature involves data)_

- **Ruta de formalización**: estructura orientativa de pasos y recursos para el Prestador.
- **Enlace institucional**: referencia a un recurso oficial externo, con estado (disponible/no disponible).
- **Progreso de formalización**: valor orientativo asociado a un Prestador.
- **Vinculación institucional futura**: configuración deshabilitada por defecto que conecta la ruta con una fuente institucional externa.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: El 100% de las vistas de progreso de formalización muestra explícitamente que el avance es orientativo y no una declaración de estatus legal.
- **SC-002**: El 100% de los enlaces identificados como oficiales dirige al destino institucional configurado y se distingue como externo.
- **SC-003**: La desactivación de la capacidad de vinculación institucional futura (UC080) no impide completar ningún flujo de UC077–UC079.
