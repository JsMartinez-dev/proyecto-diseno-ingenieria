# Feature Specification: SPEC-15 — Chat interno y soporte por WhatsApp

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC086, UC090 
## User Scenarios & Testing _(mandatory)_


### User Story 1 - Chat interno en tiempo real `<<Could>>` [UC086] (Priority: P3)

Como Cliente o Prestador, quiero coordinarme mediante un chat interno con la otra parte de un servicio, sin depender de un canal externo como WhatsApp.

**Why this priority**: Aporta valor de coordinación, pero compite con canales externos ya usados hoy (WhatsApp, llamadas) y no es necesaria para que el MVP funcione.

**Independent Test**: Con dos cuentas que tienen una relación de coordinación vigente (ej. una propuesta aceptada), intercambiar mensajes y verificar que un tercero sin esa relación no puede acceder a la conversación.

**Acceptance Scenarios**:

1. **Scenario**: Capacidad deshabilitada (comportamiento por defecto)
    
    - **Given** el chat interno no está habilitado
    - **When** un Cliente o Prestador busca esta opción en la plataforma
    - **Then** el sistema no la presenta como disponible
2. **Scenario**: Mensaje entre participantes autorizados
    
    - **Given** el chat está habilitado y existe una relación de coordinación exigida por producto entre un Cliente y un Prestador (ej. propuesta aceptada de `spec-04`)
    - **When** uno de los dos envía un mensaje
    - **Then** el mensaje queda disponible para ambos participantes autorizados de esa relación
3. **Scenario**: Acceso de un tercero
    
    - **Given** una conversación existe entre dos participantes autorizados
    - **When** un usuario que no pertenece a esa relación intenta acceder
    - **Then** el sistema deniega el acceso

---

### User Story 2 - Soporte por WhatsApp `<<Could>>` [UC090] (Priority: P3)

Como Usuario, quiero acceder a soporte por WhatsApp para resolver dudas mediante un canal que ya conozco y uso habitualmente.

**Why this priority**: Responde a una necesidad real observada en las entrevistas (baja familiaridad con herramientas digitales nuevas), pero depende de una integración externa y de decisiones operativas (horario, personal de atención) que no son de ingeniería de software.

**Independent Test**: Con la integración habilitada y configurada, iniciar el flujo de soporte desde CONectaSM y verificar que dirige al canal oficial configurado.

**Acceptance Scenarios**:

1. **Scenario**: Capacidad deshabilitada (comportamiento por defecto)
    
    - **Given** el soporte por WhatsApp no está habilitado
    - **When** un Usuario busca esta opción
    - **Then** el sistema no la presenta como disponible ni simula una conversación de soporte
2. **Scenario**: Derivación a soporte habilitado
    
    - **Given** el soporte por WhatsApp está habilitado y configurado con un canal oficial
    - **When** un Usuario inicia soporte desde CONectaSM
    - **Then** el sistema lo dirige al canal oficial configurado, identificándolo claramente como un canal externo


---

### Edge Cases

- El chat se habilita para una relación que luego se cancela o finaliza: debe definirse si queda lectura histórica, solo lectura, o cierre total del canal.
- El canal de soporte por WhatsApp no está disponible (fuera de horario, sin respuesta): el flujo principal de la plataforma no debe quedar bloqueado esperando esa respuesta.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-086**: El sistema PUEDE proporcionar un chat interno en tiempo real, únicamente a los Usuarios autorizados por la relación de coordinación correspondiente, y DEBE permanecer deshabilitado sin afectar UC-01 a UC-06 mientras no exista aprobación explícita. [UC086]
- **FR-090**: El sistema PUEDE proporcionar acceso a soporte mediante una integración oficial de WhatsApp, identificada claramente como canal externo, y DEBE permanecer deshabilitado sin afectar UC-01 a UC-06 mientras no exista aprobación explícita. [UC090]

### Key Entities _(include if feature involves data)_

- **Conversación / Mensaje**: entidad candidata de chat interno entre participantes autorizados por una relación de coordinación vigente.
- **Interacción de soporte**: derivación o conversación iniciada hacia el canal oficial de WhatsApp.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 0 usuarios no autorizados acceden a una conversación interna en los casos de prueba del chat, si llega a habilitarse.
- **SC-002**: El 100% de las superficies de CONectaSM no presenta UC086 ni UC090 como disponibles mientras no exista una decisión de habilitación documentada.
- **SC-003**: La desactivación de ambas capacidades no impide completar ningún flujo comprometido en UC-01 a UC-06.

