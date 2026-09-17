# Feature Specification: SPEC-14 — Preferencias, historial e indicadores

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC081, UC082, UC083, UC084, UC085 

## User Scenarios & Testing _(mandatory)_



### User Story 1 - Configurar preferencias de notificación [UC081] (Priority: P1)

Como Usuario, quiero configurar mis preferencias de notificación para decidir qué avisos recibir y por qué canales.

**Why this priority**: Controla la experiencia de avisos usada transversalmente por otros módulos (oportunidades, propuestas, cambios de estado); es una configuración base.

**Independent Test**: Cambiar una preferencia y disparar un evento afectado, verificando que el sistema respeta la configuración.

**Acceptance Scenarios**:

1. **Scenario**: Preferencia aplicada [UC081]
    
    - **Given** un Usuario tiene una preferencia de notificación configurable
    - **When** la modifica
    - **Then** los eventos posteriores respetan esa configuración, dentro de los tipos de notificación marcados como configurables
2. **Scenario**: Intento de desactivar una notificación obligatoria
    
    - **Given** un tipo de notificación está marcado como no configurable (ej. avisos de seguridad de la cuenta)
    - **When** el Usuario intenta desactivarlo
    - **Then** el sistema no permite la desactivación y explica que ese tipo de aviso es obligatorio

---

### User Story 2 - Consultar historial de trabajos [UC082] (Priority: P1)

Como Usuario, quiero consultar mi historial de trabajos para revisar los servicios en los que participé.

**Why this priority**: Aporta trazabilidad directa al problema original del proyecto: la falta de historial de trabajos realizados identificada en las entrevistas (ej. Richard Núñez, Jorge Ortiz).

**Independent Test**: Con una cuenta que participó en varios servicios, consultar el historial y verificar que solo aparecen los servicios vinculados a esa cuenta.

**Acceptance Scenarios**:

1. **Scenario**: Historial propio [UC082]
    
    - **Given** un Usuario participó en uno o más servicios (como Cliente o como Prestador)
    - **When** consulta su historial
    - **Then** el sistema muestra únicamente los servicios asociados a su propia cuenta
2. **Scenario**: Usuario sin servicios previos
    
    - **Given** un Usuario no ha participado en ningún servicio todavía
    - **When** consulta su historial
    - **Then** el sistema muestra un historial vacío, sin error



---

### User Story 3 - Descargar historial [UC083 ] (Priority: P2)

Como Usuario, quiero descargar mi historial para conservarlo o usarlo fuera de la plataforma.

**Why this priority**: Es una extensión opcional sobre un historial que ya es consultable en pantalla (UC082); no es indispensable para el valor central del historial.

**Independent Test**: Solicitar la descarga del historial de una cuenta con varios registros y verificar que el archivo entregado coincide exactamente con lo consultable en pantalla.

**Acceptance Scenarios**:

1. **Scenario**: Descarga exitosa [UC083]
    
    - **Given** un Usuario tiene elementos en su historial
    - **When** solicita descargarlo
    - **Then** el sistema entrega un archivo descargable que contiene únicamente los registros autorizados de esa cuenta
2. **Scenario**: Descarga interrumpida
    
    - **Given** una descarga de historial se interrumpe a mitad de proceso (ej. pérdida de conexión)
    - **When** el Usuario reintenta
    - **Then** el sistema genera una descarga íntegra nuevamente, sin haber alterado el historial original ni expuesto registros de otro usuario


---

### User Story 4 - Consultar indicadores básicos del prestador [UC084] (Priority: P1)

Como Prestador, quiero consultar indicadores básicos de mi actividad para entender mi desempeño y la rentabilidad de mi trabajo en la plataforma.

**Why this priority**: Responde directamente a una necesidad expresada en las entrevistas (Richard Núñez: "sería útil tener una bitácora... para saber si el trabajo me está resultando rentable").

**Independent Test**: Con datos de actividad conocidos para una cuenta de Prestador, consultar sus indicadores y verificar que el cálculo es reproducible.

**Acceptance Scenarios**:

1. **Scenario**: Indicadores calculados [UC084]
    
    - **Given** un Prestador tiene actividad registrada (servicios finalizados, calificaciones)
    - **When** consulta sus indicadores
    - **Then** el sistema muestra las métricas básicas definidas por el producto, calculadas únicamente sobre su propia actividad
2. **Scenario**: Actividad con servicios cancelados o en moderación
    
    - **Given** parte de la actividad del Prestador incluye servicios cancelados o actualmente en revisión por un reporte
    - **When** se calculan los indicadores
    - **Then** los servicios se incluyen.


---

### User Story 5 - Consultar actividad reciente [UC085] (Priority: P2)

Como Usuario, quiero consultar mi actividad reciente para recordar eventos relevantes de mi cuenta sin tener que revisar todo el historial completo.

**Why this priority**: Es un complemento de conveniencia sobre el historial (UC082) y las notificaciones (UC081), no un flujo crítico por sí solo.

**Independent Test**: Generar varios eventos visibles para una cuenta y verificar que aparecen en orden y solo para esa cuenta.

**Acceptance Scenarios**:

1. **Scenario**: Actividad reciente propia [UC085]
    - **Given** un Usuario tiene eventos recientes visibles (ej. nueva propuesta recibida, cambio de estado de un servicio)
    - **When** abre su actividad reciente
    - **Then** el sistema muestra esos eventos en orden cronológico, limitados a su propia cuenta


---

### Edge Cases


- La descarga del historial es solicitada por una cuenta con un volumen muy grande de registros: El sistema debe realizar paginación.
- Un indicador depende de datos de servicios cancelados o moderados: la fórmula debe definir explícitamente su inclusión o exclusión antes de implementarse.
- Dos eventos ocurren en el mismo instante para la actividad reciente: debe existir un criterio de desempate para el orden mostrado.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-081**: El sistema DEBE permitir que los Usuarios configuren sus preferencias de notificación para los tipos y canales marcados como configurables, sin permitir desactivar los obligatorios. [UC081]
- **FR-082**: El sistema DEBE permitir que los Usuarios consulten únicamente el historial de servicios en los que estén autorizados como participantes. [UC082]
- **FR-083**: El sistema DEBE permitir que los Usuarios descarguen su historial autorizado, garantizando que el contenido descargado coincida con el historial consultable. [UC083]
- **FR-084**: El sistema DEBE permitir que los Prestadores consulten indicadores básicos definidos por el producto, calculados exclusivamente sobre su propia actividad. [UC084]
- **FR-085**: El sistema DEBE permitir que los Usuarios consulten su actividad reciente autorizada, en orden cronológico. [UC085]

### Key Entities _(include if feature involves data)_

- **Preferencia de notificación**: tipo de aviso, canal, configurable u obligatorio, usuario asociado.
- **Historial de trabajos**: colección de servicios vinculados a un usuario (como Cliente o Prestador).
- **Descarga de historial**: archivo generado a partir del historial, fecha de generación.
- **Indicador básico**: métrica aprobada de actividad del Prestador, con fórmula y periodo de cálculo.
- **Actividad reciente**: eventos visibles vinculados a la cuenta del usuario, con marca de tiempo.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: El 100% de las consultas y descargas de historial está limitado a servicios autorizados para el usuario solicitante.
- **SC-002**: Los indicadores básicos producen resultados reproducibles para el 100% de los conjuntos de datos de prueba definidos, una vez resuelta la política de inclusión/exclusión de la Historia 4.
- **SC-003**: Los eventos de notificación configurables respetan las preferencias activas del usuario en el 100% de los casos de prueba.
- **SC-004**: El contenido de toda descarga de historial coincide exactamente con el historial consultable en pantalla para la misma cuenta, en el 100% de los casos.
