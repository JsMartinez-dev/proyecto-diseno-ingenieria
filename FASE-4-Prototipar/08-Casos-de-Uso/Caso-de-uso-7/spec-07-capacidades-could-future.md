# Feature Specification: UC-07 — Capacidades Could Have y evolución futura

**Creado**: 2026-09-11  


## User Scenarios & Testing *(mandatory)*

### User Story 1 - Chat interno en tiempo real [US-096] (Priority: P3)

Como participantes, queremos un chat interno para coordinarnos dentro de CONectaSM sin depender de un canal externo.

**Why this priority**: La fuente lo marca Could Have; aporta valor, pero está fuera del núcleo comprometido del MVP y además compite con otras opciones de coordinación.

**Independent Test**: Se prueba con dos participantes autorizados intercambiando mensajes y un tercero sin acceso.

**Acceptance Scenarios**:

1. **Scenario**: Chat entre participantes autorizados
   - **Given** existe la relación de coordinación exigida por producto
   - **When** un participante envía un mensaje al otro
   - **Then** el mensaje queda disponible para ambos participantes autorizados

2. **Scenario**: Acceso de tercero
   - **Given** un usuario no pertenece a la conversación
   - **When** intenta acceder
   - **Then** el sistema deniega acceso

---

### User Story 2 - Mapa visual de prestadores [US-097] (Priority: P3)

Como cliente, quiero visualizar prestadores en un mapa para explorar opciones geográficamente.

**Why this priority**: Es una mejora Could sobre el descubrimiento; debe respetar privacidad y no inferir/mostrar ubicaciones exactas no autorizadas.

**Independent Test**: Se prueba con prestadores en zonas conocidas verificando representación aproximada y controles de privacidad.

**Acceptance Scenarios**:

1. **Scenario**: Mapa con ubicación permitida
   - **Given** existen prestadores visibles con datos geográficos aptos para representación
   - **When** el cliente abre el mapa
   - **Then** el sistema muestra únicamente la precisión autorizada

---

### User Story 3 - Insignia de progreso de formalización [US-098] (Priority: P3)

Como usuario, quiero ver una insignia de progreso de formalización que resuma avance sin confundirlo con estatus legal verificado.

**Why this priority**: Es Could y depende del módulo de formalización; hereda la restricción de no declarar legalidad.

**Independent Test**: Se prueba con distintos niveles de avance declarado y verificando el significado mostrado.

**Acceptance Scenarios**:

1. **Scenario**: Insignia no engañosa
   - **Given** un prestador tiene progreso declarado
   - **When** se muestra la insignia
   - **Then** la insignia representa progreso y no afirma certificación/estatus legal

---

### User Story 4 - Programa de referidos [US-099] (Priority: P3)

Como usuario, quiero referir a otras personas para apoyar crecimiento de la plataforma y recibir el beneficio definido.

**Why this priority**: Es una capacidad Could de adquisición, no necesaria para el marketplace base.

**Independent Test**: Se prueba generando una referencia válida y atribuyendo el evento conforme a reglas de campaña aprobadas.

**Acceptance Scenarios**:

1. **Scenario**: Referido válido
   - **Given** existe un programa activo y el usuario es elegible
   - **When** comparte/usa un mecanismo de referido válido
   - **Then** el sistema registra la atribución conforme a las reglas

---

### User Story 5 - Soporte por WhatsApp [US-100] (Priority: P3)

Como usuario, quiero acceder a soporte por WhatsApp para resolver dudas mediante un canal familiar.

**Why this priority**: Es Could y depende de integración externa con WhatsApp.

**Independent Test**: Se prueba iniciando el flujo desde CONectaSM y verificando que dirige al canal/configuración aprobada.

**Acceptance Scenarios**:

1. **Scenario**: Acceso a soporte
   - **Given** WhatsApp está habilitado y configurado
   - **When** el usuario inicia soporte
   - **Then** el sistema conecta o dirige al canal oficial definido

---

### User Story 6 - Onboarding asistido por WhatsApp o gestor [US-101] (Priority: P3)

Como prestador, quiero recibir onboarding asistido por WhatsApp o un gestor para completar mi incorporación con acompañamiento.

**Why this priority**: Es Could, implica operación humana/externa y debe definirse antes de comprometer alcance.

**Independent Test**: Se prueba iniciando onboarding y verificando asignación/derivación al mecanismo configurado.

**Acceptance Scenarios**:

1. **Scenario**: Onboarding asistido
   - **Given** el prestador solicita asistencia y el canal está habilitado
   - **When** inicia el flujo
   - **Then** el sistema deriva al WhatsApp o gestor según la configuración

---

### User Story 7 - Idiomas adicionales [US-102] (Priority: P3)

Como usuario, quiero utilizar la plataforma en idiomas adicionales para mejorar accesibilidad lingüística.

**Why this priority**: Es una mejora Could y requiere definir idiomas, cobertura y estrategia de contenido.

**Independent Test**: Se prueba seleccionando un idioma soportado y verificando que el contenido dentro del alcance traducido cambia de forma consistente.

**Acceptance Scenarios**:

1. **Scenario**: Cambio de idioma
   - **Given** el usuario selecciona un idioma soportado
   - **When** cambia la preferencia
   - **Then** la interfaz/contenido localizado dentro del alcance se presenta en ese idioma

---

### User Story 8 - Piloto de pasarela de pago [US-103] (Priority: P4)

Como participantes, queremos evaluar un piloto de pago integrado para facilitar transacciones si el modelo de monetización es validado.

**Why this priority**: La fuente lo clasifica Future, explícitamente fuera del MVP inicial y condicionado a validar monetización.

**Independent Test**: Se prueba únicamente en un entorno/piloto aprobado, verificando que una transacción de prueba se asocia al servicio sin alterar el modelo de contratación si el piloto está deshabilitado.

**Acceptance Scenarios**:

1. **Scenario**: Piloto habilitado
   - **Given** el modelo de monetización fue validado y el piloto está explícitamente habilitado
   - **When** un cliente inicia el flujo de pago para un servicio elegible
   - **Then** el sistema deriva/procesa mediante la pasarela configurada y registra el resultado autorizado

2. **Scenario**: Piloto deshabilitado
   - **Given** la capacidad Future no está habilitada
   - **When** un usuario intenta iniciar pago integrado
   - **Then** el sistema no ofrece ni ejecuta el flujo

---

### Edge Cases

- El chat se habilita para una relación que luego se cancela/finaliza: debe definirse si queda lectura histórica, escritura o cierre. 
- El mapa podría revelar ubicación sensible por demasiada precisión o baja densidad: debe aplicarse una precisión/agrupación que preserve privacidad.
- Una insignia de progreso alcanza 100%: aun así no puede transformarse en claim de estatus legal.
- Referidos circulares, auto-referidos o abuso de múltiples cuentas: el programa debe definir controles antifraude antes de lanzamiento.
- WhatsApp/gestor no está disponible: el flujo principal de onboarding/soporte no debe quedar bloqueado si estas capacidades son Could.
- Una traducción no existe para un texto: debe existir comportamiento de fallback aprobado y evitar mezclar idiomas de forma confusa.
- La pasarela confirma pago después de un timeout o reintento: el procesamiento debe ser idempotente y reconciliable antes de cualquier piloto real.
- El piloto de pago está deshabilitado: ninguna UI/API del MVP debe asumir que existe pago integrado.

## Requirements *(mandatory)*

### Requisitos Funcionales

- **FR-001**: El sistema PUEDE proporcionar un chat interno en tiempo real únicamente a los Usuarios autorizados para la conversación o relación correspondiente.
- **FR-002**: El sistema PUEDE proporcionar un mapa visual de Prestadores utilizando únicamente el nivel de precisión de ubicación permitido por las reglas de privacidad.
- **FR-003**: El sistema PUEDE mostrar una insignia de progreso de formalización, pero NO DEBE representar dicha insignia como estado legal o certificación.
- **FR-004**: El sistema PUEDE implementar un programa de referidos sujeto a reglas explícitas de elegibilidad de campaña, atribución, prevención de abuso y recompensas.
- **FR-005**: El sistema PUEDE proporcionar acceso a soporte mediante una integración/canal oficial de WhatsApp.
- **FR-006**: El sistema PUEDE proporcionar un proceso de incorporación de Prestadores asistido mediante WhatsApp y/o un gestor comunitario.
- **FR-007**: El sistema PUEDE admitir idiomas adicionales.
- **FR-008**: El sistema DEBE mantener la funcionalidad de pasarela de pagos fuera del MVP inicial y SOLO DEBE habilitar un piloto después de validar el modelo de monetización y registrar una aprobación explícita del producto.
- **FR-009**: Si se habilita el piloto de pagos, el sistema DEBE asociar los intentos y resultados de pago con un servicio elegible y proteger los datos financieros/de pago de acuerdo con las responsabilidades del proveedor seleccionado.
- **FR-010**: El sistema DEBE permitir que todas las capacidades clasificadas como Podría/Futuro permanezcan deshabilitadas sin afectar los flujos del MVP definidos en los CU-01 a CU-06.

### Key Entities *(include if feature involves data)*

- **Conversación / Mensaje**: Entidad futura de chat interno entre participantes autorizados.
- **Representación geográfica de prestador**: Ubicación apta para mapa con precisión limitada por privacidad.
- **Insignia de formalización**: Representación resumida de progreso declarado, no de estatus legal.
- **Referido**: Atribución entre usuario referente, invitado y campaña/regla vigente.
- **Interacción de soporte**: Derivación o conversación a través de WhatsApp/gestor.
- **Preferencia de idioma**: Idioma seleccionado dentro del conjunto soportado.
- **Transacción de pago piloto**: Registro futuro de intento/resultado de pago vinculado a un servicio y proveedor externo.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: La desactivación de todas las capacidades Could/Future no impide completar ningún flujo comprometido en UC-01 a UC-06.
- **SC-002**: 100% de representaciones geográficas futuras respetan la precisión de ubicación autorizada y no revelan dirección exacta sin autorización.
- **SC-003**: 100% de insignias de formalización futuras incluyen semántica que evita presentarlas como certificación o estatus legal.
- **SC-004**: 0 usuarios no autorizados acceden a conversaciones internas en los casos de aceptación del chat.
- **SC-005**: El piloto de pagos permanece inaccesible mientras la bandera/aprobación de producto no esté habilitada.
- **SC-006**: Antes de habilitar pagos, 100% de los escenarios de prueba de reintento/confirmación tardía preservan una única interpretación del estado de la transacción.
