# Feature Specification: UC-03 — Prestador: perfil y oportunidades

**Creado**: 2026-09-11  

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Crear perfil profesional [US-014] (Priority: P1)

Como prestador, quiero crear un perfil profesional para presentar mis servicios y poder participar en oportunidades compatibles.

**Why this priority**: Es la base de la oferta: concentra categorías, zonas y experiencia necesarias para descubrimiento y matching.

**Independent Test**: Se prueba creando un perfil con los subdatos obligatorios y verificando que queda disponible para las funciones de prestador definidas.

**Acceptance Scenarios**:

1. **Scenario**: Creación de perfil
   - **Given** un prestador autenticado aún no tiene perfil profesional completo
   - **When** registra las categorías, zonas y experiencia requeridas
   - **Then** el sistema crea/persiste el perfil profesional

2. **Scenario**: Perfil incompleto
   - **Given** faltan datos obligatorios definidos para el perfil
   - **When** el prestador intenta finalizar su creación
   - **Then** el sistema identifica lo pendiente y no lo considera completo

---

### User Story 2 - Seleccionar categorías de servicio [US-016] (Priority: P1)

Como prestador, quiero seleccionar las categorías de servicios que ofrezco para aparecer en búsquedas y oportunidades pertinentes.

**Why this priority**: Es un dato obligatorio del perfil y una entrada principal del matching.

**Independent Test**: Se prueba asociando categorías activas al perfil y verificando que quedan disponibles para compatibilidad.

**Acceptance Scenarios**:

1. **Scenario**: Categorías válidas
   - **Given** existen categorías activas
   - **When** el prestador selecciona las que ofrece
   - **Then** el perfil queda asociado a esas categorías

---

### User Story 3 - Configurar zonas de atención [US-017] (Priority: P1)

Como prestador, quiero indicar las zonas en las que atiendo para recibir oportunidades geográficamente pertinentes.

**Why this priority**: Es una entrada obligatoria del perfil y del cálculo de compatibilidad.

**Independent Test**: Se prueba configurando zonas y comprobando que solicitudes fuera/dentro de ellas se tratan conforme a la compatibilidad.

**Acceptance Scenarios**:

1. **Scenario**: Zonas de atención
   - **Given** el prestador edita su perfil
   - **When** selecciona zonas de atención válidas
   - **Then** las zonas quedan asociadas a su oferta

---

### User Story 4 - Registrar experiencia profesional [US-018] (Priority: P1)

Como prestador, quiero registrar mi experiencia profesional para aportar contexto a potenciales clientes.

**Why this priority**: Es un subcomportamiento incluido en la creación del perfil y contribuye a confianza/decisión.

**Independent Test**: Se prueba guardando la información de experiencia y consultando la vista previa del perfil.

**Acceptance Scenarios**:

1. **Scenario**: Experiencia guardada
   - **Given** un prestador está completando su perfil
   - **When** registra información válida de experiencia
   - **Then** el sistema la asocia al perfil conforme a su visibilidad

---

### User Story 5 - Determinar compatibilidad de solicitudes [US-039] (Priority: P1)

Como prestador, quiero que las solicitudes compatibles con mi oferta sean identificadas para concentrarme en oportunidades pertinentes.

**Why this priority**: Es el motor funcional del tablero de oportunidades.

**Independent Test**: Se prueba con solicitudes y perfiles de categorías/zonas conocidas, verificando inclusión y exclusión conforme a criterios definidos.

**Acceptance Scenarios**:

1. **Scenario**: Solicitud compatible
   - **Given** la solicitud y el perfil cumplen los criterios de compatibilidad definidos
   - **When** se evalúa la oportunidad para el prestador
   - **Then** la solicitud se clasifica como compatible

2. **Scenario**: Solicitud incompatible
   - **Given** la solicitud no cumple al menos un criterio obligatorio
   - **When** se evalúa la oportunidad
   - **Then** no se presenta como coincidencia compatible

---

### User Story 6 - Ver tablero de oportunidades [US-040] (Priority: P1)

Como prestador, quiero ver un tablero de solicitudes compatibles para identificar trabajos a los que podría cotizar.

**Why this priority**: Entrega valor directo al prestador y depende del matching de solicitudes.

**Independent Test**: Se prueba con un prestador que tenga coincidencias y verificando que el tablero muestra oportunidades compatibles activas.

**Acceptance Scenarios**:

1. **Scenario**: Tablero con oportunidades
   - **Given** existen solicitudes abiertas compatibles
   - **When** el prestador abre el tablero
   - **Then** el sistema muestra las oportunidades compatibles disponibles

---

### User Story 7 - Consultar detalle de oportunidad [US-042] (Priority: P1)

Como prestador, quiero revisar el detalle de una oportunidad para decidir si deseo cotizar.

**Why this priority**: Es el paso de evaluación previo a crear propuesta y debe incluir validación de elegibilidad.

**Independent Test**: Se prueba abriendo una oportunidad y verificando datos autorizados y resultado de elegibilidad.

**Acceptance Scenarios**:

1. **Scenario**: Detalle autorizado
   - **Given** una oportunidad compatible está disponible
   - **When** el prestador abre su detalle
   - **Then** el sistema muestra la información autorizada de la solicitud sin exponer dirección exacta y evalúa elegibilidad

---

### User Story 8 - Validar elegibilidad para cotizar [US-043] (Priority: P1)

Como prestador, quiero saber si soy elegible para cotizar una oportunidad antes de enviar una propuesta.

**Why this priority**: Evita propuestas inválidas y protege reglas de estado/categoría/zona.

**Independent Test**: Se prueba intentando cotizar oportunidades elegibles y no elegibles según condiciones controladas.

**Acceptance Scenarios**:

1. **Scenario**: Prestador elegible
   - **Given** se cumplen las reglas de elegibilidad
   - **When** el prestador intenta continuar hacia cotización
   - **Then** el sistema permite el flujo

2. **Scenario**: Prestador no elegible
   - **Given** falla una regla obligatoria de elegibilidad
   - **When** intenta continuar
   - **Then** el sistema bloquea la cotización e informa la condición aplicable

---

### User Story 9 - Editar perfil profesional [US-015] (Priority: P2)

Como prestador, quiero editar mi perfil para mantener actualizados mis servicios, zonas y datos profesionales.

**Why this priority**: Permite que descubrimiento y matching reflejen la oferta vigente.

**Independent Test**: Se prueba modificando campos editables y verificando que el perfil y compatibilidad futura usan la información actualizada.

**Acceptance Scenarios**:

1. **Scenario**: Edición válida
   - **Given** un prestador tiene perfil profesional
   - **When** actualiza datos permitidos
   - **Then** los cambios quedan persistidos y visibles donde corresponda

---

### User Story 10 - Agregar servicio al portafolio [US-019] (Priority: P2)

Como prestador, quiero agregar elementos a mi portafolio para mostrar evidencia de trabajos o servicios que ofrezco.

**Why this priority**: Fortalece la evaluación del perfil sin ser requisito para el matching básico.

**Independent Test**: Se prueba agregando un elemento válido y verificando su aparición en la vista previa/pública según reglas.

**Acceptance Scenarios**:

1. **Scenario**: Agregar al portafolio
   - **Given** un prestador edita su perfil
   - **When** agrega un elemento de portafolio válido
   - **Then** el elemento queda asociado al perfil

---

### User Story 11 - Eliminar servicio de portafolio [US-020] (Priority: P2)

Como prestador, quiero eliminar un elemento de mi portafolio cuando ya no deba mostrarse.

**Why this priority**: Permite mantener contenido profesional vigente.

**Independent Test**: Se prueba eliminando un elemento propio y confirmando que deja de estar disponible en el perfil.

**Acceptance Scenarios**:

1. **Scenario**: Eliminar elemento propio
   - **Given** existe un elemento de portafolio asociado al prestador
   - **When** solicita eliminarlo
   - **Then** el sistema deja de mostrarlo en el portafolio

---

### User Story 12 - Configurar disponibilidad horaria [US-021] (Priority: P2)

Como prestador, quiero definir mi disponibilidad general para contextualizar cuándo puedo atender servicios.

**Why this priority**: Ayuda a cotización y compatibilidad operativa, aunque los criterios exactos no están definidos en la fuente.

**Independent Test**: Se prueba guardando disponibilidad y verificando su persistencia/uso en las vistas definidas.

**Acceptance Scenarios**:

1. **Scenario**: Disponibilidad guardada
   - **Given** un prestador edita su disponibilidad
   - **When** registra franjas válidas
   - **Then** el sistema conserva la configuración

---

### User Story 13 - Gestionar agenda [US-022] (Priority: P2)

Como prestador, quiero gestionar mi agenda y franjas horarias para organizar mi capacidad de atención.

**Why this priority**: Reduce conflictos operativos y complementa la disponibilidad general.

**Independent Test**: Se prueba creando/modificando una franja de agenda y verificando que el estado resultante es coherente.

**Acceptance Scenarios**:

1. **Scenario**: Gestionar franja
   - **Given** el prestador consulta su agenda
   - **When** agrega o modifica una franja válida
   - **Then** la agenda refleja el cambio sin generar superposiciones prohibidas según la regla definida

---

### User Story 14 - Consultar vista previa del perfil [US-023] (Priority: P2)

Como prestador, quiero ver una vista previa de mi perfil para saber cómo se presenta a los clientes.

**Why this priority**: Permite controlar calidad y privacidad antes de exposición pública.

**Independent Test**: Se prueba comparando la vista previa con los campos públicos configurados en el perfil.

**Acceptance Scenarios**:

1. **Scenario**: Vista previa
   - **Given** un prestador tiene datos de perfil
   - **When** abre la vista previa
   - **Then** el sistema muestra la representación que corresponde a la exposición pública autorizada

---

### User Story 15 - Filtrar oportunidades [US-041] (Priority: P2)

Como prestador, quiero filtrar el tablero de oportunidades para priorizar las que me interesan.

**Why this priority**: Mejora eficiencia cuando existe volumen de oportunidades.

**Independent Test**: Se prueba aplicando un filtro definido y verificando que los resultados respetan el criterio.

**Acceptance Scenarios**:

1. **Scenario**: Filtro válido
   - **Given** el tablero contiene varias oportunidades
   - **When** el prestador aplica un filtro
   - **Then** el tablero presenta únicamente los registros que cumplen el criterio

---

### User Story 16 - Notificar nueva oportunidad compatible [US-044] (Priority: P2)

Como prestador, quiero ser avisado cuando aparezca una oportunidad compatible para reaccionar a tiempo.

**Why this priority**: Aumenta activación y velocidad de respuesta, pero es una extensión condicionada del matching.

**Independent Test**: Se prueba creando/publicando una solicitud compatible y verificando la generación/entrega de la notificación según preferencias y canal habilitado.

**Acceptance Scenarios**:

1. **Scenario**: Nueva oportunidad compatible
   - **Given** una nueva solicitud se clasifica compatible y las notificaciones aplican
   - **When** se completa el matching
   - **Then** se genera un aviso para el prestador

2. **Scenario**: Sin compatibilidad
   - **Given** una solicitud nueva no cumple criterios del prestador
   - **When** se ejecuta matching
   - **Then** no se genera un aviso de oportunidad compatible para ese prestador

---

### Edge Cases

- El prestador elimina una categoría o zona que hacía compatible una oportunidad ya visible: el tablero debe recalcular coherentemente y no permitir cotización si deja de ser elegible.
- Una solicitud se cancela mientras está abierta en el tablero del prestador: al intentar actuar, debe validarse el estado actual y bloquear cotización.
- Cambios simultáneos de disponibilidad/agenda generan solapamientos: la política de conflictos debe ser determinista.
- Un elemento de portafolio falla validación o carga: el resto del perfil no debe quedar corrupto ni perder cambios válidos.
- Una oportunidad compatible contiene ubicación: solo puede mostrar zona aproximada antes de contratación.
- Se generan múltiples eventos de matching para la misma oportunidad/prestador: las notificaciones deben evitar duplicados conforme a una clave/evento idempotente definido.

## Requirements *(mandatory)*

### Requisitos Funcionales 

- **FR-001**: El sistema DEBE permitir a los Prestadores crear un perfil profesional que incluya categorías de servicio, zonas de servicio y experiencia profesional como elementos obligatorios del perfil. 
- **FR-002**: El sistema DEBE permitir a los Prestadores editar su perfil profesional y mantener actualizada la información relevante para la asignación de coincidencias (*matching*).
- **FR-003**: El sistema DEBE permitir a los Prestadores seleccionar entre las categorías de servicio activas.
- **FR-004**: El sistema DEBE permitir a los Prestadores configurar las zonas de servicio con cobertura.
- **FR-005**: El sistema DEBE permitir a los Prestadores registrar su experiencia profesional en el perfil. 
- **FR-006**: El sistema DEBE permitir a los Prestadores agregar elementos a su portafolio bajo las reglas de contenido y archivos definidas. 
- **FR-007**: El sistema DEBE permitir a los Prestadores eliminar sus propios elementos del portafolio.
- **FR-008**: El sistema DEBE permitir a los Prestadores configurar su disponibilidad general o basada en horarios.
- **FR-009**: El sistema DEBE permitir a los Prestadores gestionar su agenda y franjas horarias.
- **FR-010**: El sistema DEBE proporcionar una vista previa del perfil del Prestador acorde con sus reglas de visibilidad pública. 
- **FR-011**: El sistema DEBE determinar las solicitudes abiertas compatibles mediante criterios definidos por el producto que incluyan al menos las dimensiones de perfil/solicitud representadas por la categoría y la zona de servicio.
- **FR-012**: El sistema DEBE presentar las solicitudes activas compatibles en el tablero de oportunidades del Prestador. 
- **FR-013**: El sistema DEBE admitir el filtrado del tablero de oportunidades utilizando criterios definidos por el producto.
- **FR-014**: El sistema DEBE permitir a un Prestador consultar el detalle de la oportunidad sin exponer la dirección exacta del Cliente mientras la solicitud permanezca abierta.
- **FR-015**: El sistema DEBE validar la elegibilidad del Prestador antes de permitir el flujo de cotización o propuesta. 
- **FR-016**: El sistema DEBE admitir la notificación de una nueva oportunidad compatible cuando las reglas o preferencias de notificación lo permitan.

### Key Entities *(include if feature involves data)*

- **Perfil profesional**: Representación profesional del Prestador; relaciona categorías, zonas, experiencia, disponibilidad y contenido público.
- **Categoría de servicio**: Servicio que el Prestador declara ofrecer y que participa en descubrimiento/matching.
- **Zona de atención**: Área aproximada donde el Prestador está dispuesto a prestar servicios.
- **Experiencia profesional**: Información declarada por el Prestador para contextualizar su trayectoria.
- **Elemento de portafolio**: Contenido asociado al perfil que representa trabajos/servicios del Prestador.
- **Disponibilidad**: Configuración general u horaria de capacidad declarada del Prestador.
- **Agenda / franja horaria**: Bloque temporal administrado por el Prestador.
- **Oportunidad**: Vista de una solicitud abierta que resulta compatible para un Prestador.
- **Elegibilidad**: Resultado de reglas que determinan si un Prestador puede avanzar a cotizar una oportunidad.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% de oportunidades mostradas en pruebas deterministas cumplen los criterios obligatorios de compatibilidad definidos.
- **SC-002**: 100% de intentos de cotizar una oportunidad no elegible son bloqueados antes de crear una propuesta.
- **SC-003**: 100% de detalles de oportunidad abierta ocultan la dirección exacta del Cliente.
- **SC-004**: Al menos 95% de prestadores de prueba completan un perfil mínimo válido sin asistencia.
- **SC-005**: Los cambios de categorías y zonas del perfil se reflejan en nuevas evaluaciones de compatibilidad sin requerir intervención administrativa.
- **SC-006**: Una oportunidad compatible genera como máximo una notificación equivalente por evento lógico, salvo reintentos internos no visibles al usuario.
