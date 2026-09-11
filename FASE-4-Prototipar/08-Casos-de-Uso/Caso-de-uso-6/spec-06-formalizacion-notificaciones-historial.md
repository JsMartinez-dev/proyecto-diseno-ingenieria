# Feature Specification: UC-06 — Formalización progresiva, notificaciones e historial

**Creado**: 2026-09-11  


## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consultar ruta de formalización [US-083] (Priority: P1)

Como prestador, quiero consultar una ruta de formalización para entender pasos orientativos que puedo seguir.

**Why this priority**: Es la entrada principal al módulo de formalización progresiva.

**Independent Test**: Se prueba accediendo a la ruta y verificando que presenta el checklist y, cuando corresponda, enlaces oficiales sin declarar estatus legal.

**Acceptance Scenarios**:

1. **Scenario**: Ruta disponible
   - **Given** un prestador autenticado accede al módulo
   - **When** consulta la ruta de formalización
   - **Then** el sistema presenta la orientación y el checklist aplicable

---

### User Story 2 - Consultar checklist por cuatro dimensiones [US-084] (Priority: P1)

Como prestador, quiero consultar el checklist organizado en cuatro dimensiones para entender mi progreso declarado.

**Why this priority**: El diagrama establece explícitamente una estructura de cuatro dimensiones incluida en la ruta.

**Independent Test**: Se prueba verificando que las cuatro dimensiones definidas por producto están presentes y pueden consultarse.

**Acceptance Scenarios**:

1. **Scenario**: Checklist de cuatro dimensiones
   - **Given** la ruta de formalización está disponible
   - **When** el prestador abre el checklist
   - **Then** el sistema muestra las cuatro dimensiones configuradas y sus ítems

---

### User Story 3 - Mostrar progreso sin declarar estatus legal [US-087] (Priority: P1)

Como prestador, quiero ver un progreso orientativo sin que la plataforma afirme automáticamente mi estatus legal.

**Why this priority**: Es una restricción crítica explícita: el progreso es orientativo y no equivale a certificación/estatus legal.

**Independent Test**: Se prueba con distintos avances y verificando que la UI/texto no convierte el porcentaje/checklist en una declaración legal.

**Acceptance Scenarios**:

1. **Scenario**: Progreso orientativo
   - **Given** el prestador tiene avances declarados
   - **When** consulta su progreso
   - **Then** el sistema muestra avance y una delimitación clara de que no constituye declaración automática de estatus legal

---

### User Story 4 - Registrar avance declarado en checklist [US-085] (Priority: P2)

Como prestador, quiero registrar mi propio avance en el checklist para hacer seguimiento a mi ruta de formalización.

**Why this priority**: Permite continuidad del módulo, manteniendo el carácter declarado/orientativo.

**Independent Test**: Se prueba marcando/desmarcando un ítem y verificando persistencia y recálculo del progreso orientativo.

**Acceptance Scenarios**:

1. **Scenario**: Registrar avance
   - **Given** un prestador consulta un ítem de checklist
   - **When** declara su avance
   - **Then** el sistema guarda la declaración y actualiza el progreso orientativo sin convertirlo en verificación legal

---

### User Story 5 - Abrir enlaces oficiales de formalización [US-086] (Priority: P2)

Como prestador, quiero abrir enlaces oficiales para continuar trámites o consultar fuentes institucionales.

**Why this priority**: Conecta la orientación con fuentes externas confiables sin automatizar el estatus.

**Independent Test**: Se prueba abriendo un enlace configurado y verificando que se dirige al destino institucional correspondiente.

**Acceptance Scenarios**:

1. **Scenario**: Enlace oficial
   - **Given** un ítem/ruta posee un enlace institucional configurado
   - **When** el prestador lo abre
   - **Then** el sistema dirige al recurso oficial definido y mantiene claro que es externo

---

### User Story 6 - Vincular ruta institucional futura [US-088] (Priority: P3)

Como prestador, quiero que futuras rutas institucionales puedan vincularse al módulo para ampliar el acompañamiento.

**Why this priority**: Está planteado como integración futura y no debe confundirse con certificación automática.

**Independent Test**: Se prueba con una integración/configuración simulada validando que el vínculo externo no altera por sí solo el estatus legal.

**Acceptance Scenarios**:

1. **Scenario**: Vínculo institucional
   - **Given** existe una ruta institucional futura configurada
   - **When** el prestador accede al vínculo
   - **Then** el sistema enlaza la fuente externa sin declarar automáticamente cumplimiento

---

### User Story 7 - Configurar preferencias de notificación [US-091] (Priority: P1)

Como usuario, quiero configurar mis preferencias de notificación para decidir qué avisos recibir por los canales habilitados.

**Why this priority**: Controla la experiencia de avisos usada transversalmente por oportunidades, propuestas y estados.

**Independent Test**: Se prueba cambiando una preferencia y disparando un evento afectado para verificar respeto de la configuración.

**Acceptance Scenarios**:

1. **Scenario**: Preferencia aplicada
   - **Given** un usuario tiene una preferencia configurable
   - **When** la modifica
   - **Then** los eventos posteriores respetan la configuración dentro de las notificaciones obligatorias/permitidas definidas

---

### User Story 8 - Consultar historial de trabajos [US-092] (Priority: P1)

Como usuario, quiero consultar mi historial de trabajos para revisar servicios pasados.

**Why this priority**: Aporta trazabilidad de uso para Cliente y Prestador.

**Independent Test**: Se prueba con una cuenta con varios servicios y verificando que se listan únicamente los vinculados a la cuenta.

**Acceptance Scenarios**:

1. **Scenario**: Historial propio
   - **Given** el usuario participó en servicios
   - **When** consulta historial de trabajos
   - **Then** el sistema muestra los servicios asociados a su cuenta según permisos

---

### User Story 9 - Descargar historial [US-093] (Priority: P2)

Como usuario, quiero descargar mi historial para conservarlo o utilizarlo fuera de la plataforma.

**Why this priority**: Extiende la consulta de historial con portabilidad práctica.

**Independent Test**: Se prueba solicitando una descarga y verificando que el archivo contiene únicamente registros autorizados y coincide con el historial consultable.

**Acceptance Scenarios**:

1. **Scenario**: Descarga de historial
   - **Given** el usuario tiene elementos de historial
   - **When** solicita descargarlo
   - **Then** el sistema entrega una representación descargable de sus registros autorizados

---

### User Story 10 - Consultar indicadores básicos del prestador [US-094] (Priority: P2)

Como prestador, quiero consultar indicadores básicos de mi actividad para entender mi desempeño en la plataforma.

**Why this priority**: Aporta retroalimentación operativa, aunque las métricas concretas no están definidas.

**Independent Test**: Se prueba con datos conocidos y verificando que los indicadores aprobados se calculan de forma reproducible.

**Acceptance Scenarios**:

1. **Scenario**: Indicadores
   - **Given** el prestador tiene actividad registrada
   - **When** consulta sus indicadores
   - **Then** el sistema muestra las métricas básicas definidas para su propia cuenta

---

### User Story 11 - Consultar actividad reciente [US-095] (Priority: P2)

Como usuario, quiero consultar actividad reciente para recordar eventos relevantes de mi cuenta.

**Why this priority**: Mejora seguimiento sin reemplazar historiales específicos.

**Independent Test**: Se prueba generando eventos visibles y verificando orden, propiedad y alcance de la actividad reciente.

**Acceptance Scenarios**:

1. **Scenario**: Actividad reciente propia
   - **Given** el usuario tiene eventos recientes visibles
   - **When** abre la actividad
   - **Then** el sistema muestra eventos autorizados de su cuenta en orden coherente

---

### Edge Cases

- Un enlace institucional expira/cambia: el sistema debe poder deshabilitarlo/actualizarlo sin convertirlo en contenido verificado por defecto.
- El prestador marca todos los ítems: el sistema puede mostrar 100% de avance declarado, pero nunca afirmar automáticamente que está legalmente formalizado.
- Cambia la definición del checklist: debe preservarse trazabilidad de avances previos o existir una regla de migración/versionado.
- El usuario desactiva notificaciones que el producto considere obligatorias: debe distinguirse entre avisos configurables y no configurables. 
- La descarga de historial es solicitada por una cuenta con muchos registros: debe definirse paginación/exportación asíncrona o límites sin exponer datos de terceros. 
- Un indicador depende de datos cancelados/moderados: la fórmula debe definir inclusión/exclusión de esos estados.

## Requirements *(mandatory)*

### Requisitos Funcionales

- **FR-001**: El sistema DEBE proporcionar a los Prestadores una ruta orientativa de formalización.
- **FR-002**: El sistema DEBE organizar la lista de verificación de formalización en cuatro dimensiones definidas por el producto.
- **FR-003**: El sistema DEBE permitir que los Prestadores registren el progreso autodeclarado de la lista de verificación.
- **FR-004**: El sistema DEBE permitir abrir enlaces oficiales de formalización configurados e identificarlos claramente como destinos externos/oficiales.
- **FR-005**: El sistema DEBE presentar el progreso de formalización como orientativo y NO DEBE declarar, certificar ni inferir automáticamente el estado legal a partir de la finalización de la lista de verificación.
- **FR-006**: El sistema DEBERÍA admitir una futura vinculación con rutas institucionales sin considerar la vinculación externa como una validación del estado legal.
- **FR-007**: El sistema DEBE permitir que los Usuarios configuren sus preferencias de notificación para tipos y canales de notificación configurables.
- **FR-008**: El sistema DEBE permitir que los Usuarios consulten únicamente el historial de trabajos/servicios en los que estén autorizados como participantes.
- **FR-009**: El sistema DEBE permitir que los Usuarios descarguen su historial autorizado.
- **FR-010**: El sistema DEBE permitir que los Prestadores consulten indicadores básicos definidos por el producto y derivados de su propia actividad.
- **FR-011**: El sistema DEBE permitir que los Usuarios consulten su actividad reciente autorizada.
- **FR-012**: El sistema DEBE garantizar que los datos provenientes de destinos institucionales externos no sean representados como verificados por CONectaSM, a menos que exista un proceso explícito de verificación.

### Key Entities *(include if feature involves data)*

- **Ruta de formalización**: Estructura orientativa de pasos/recursos para el Prestador.
- **Dimensión de formalización**: Una de las cuatro agrupaciones del checklist definidas por producto.
- **Ítem de checklist**: Paso o condición que el Prestador puede consultar y declarar como avance.
- **Avance declarado**: Estado auto-reportado por el Prestador, sin equivaler a validación legal.
- **Enlace institucional**: Referencia a un recurso oficial externo.
- **Preferencia de notificación**: Configuración de avisos por tipo/canal permitido.
- **Historial de trabajos**: Colección de servicios vinculados al usuario.
- **Indicador básico**: Métrica aprobada de actividad del Prestador.
- **Actividad reciente**: Eventos visibles vinculados a la cuenta del usuario.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% de vistas de progreso de formalización muestran de forma explícita que el avance es orientativo y no una declaración automática de estatus legal.
- **SC-002**: El checklist presenta exactamente las cuatro dimensiones aprobadas por producto en 100% de las pruebas de aceptación.
- **SC-003**: 100% de enlaces identificados como oficiales dirigen al destino institucional configurado y se distinguen como externos.
- **SC-004**: 100% de consultas y descargas de historial están limitadas a servicios autorizados para el usuario solicitante.
- **SC-005**: Los indicadores básicos producen resultados reproducibles para 100% de los conjuntos de datos de prueba definidos por las fórmulas aprobadas.
- **SC-006**: Los eventos de notificación configurables respetan las preferencias activas del usuario en 100% de los casos de aceptación.
