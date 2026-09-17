# Feature Specification: SPEC-16 — Onboarding asistido

**Creado**: 2026-09-16 
**Casos de uso cubiertos**: UC091 
## User Scenarios & Testing _(mandatory)_

### User Story 1 - Onboarding asistido por WhatsApp o gestor `<<Could>>` [UC091] (Priority: P3)

Como Prestador, quiero recibir acompañamiento humano (por WhatsApp o por un Gestor comunitario) para completar mi registro y configuración inicial en la plataforma, cuando no me sienta cómodo haciéndolo solo.

**Why this priority**: Responde directamente a lo expresado por Jorge Ortiz en las entrevistas ("las aplicaciones modernas me parecen muy difíciles de manejar"), pero implica operación humana externa a la plataforma y no es indispensable para que el registro base (`spec-01`) funcione.

**Independent Test**: Con el canal de acompañamiento habilitado, un Prestador solicita asistencia y se verifica que queda derivado a WhatsApp o a un Gestor comunitario, sin que el registro base quede bloqueado si el canal no responde.

**Acceptance Scenarios**:

1. **Scenario**: Capacidad deshabilitada (comportamiento por defecto)
    
    - **Given** el onboarding asistido no está habilitado
    - **When** un Prestador busca esta opción durante su registro
    - **Then** el sistema no la presenta como disponible y el registro base (`spec-01`, UC001/UC002) sigue funcionando sin ella
2. **Scenario**: Derivación exitosa a acompañamiento
    
    - **Given** el onboarding asistido está habilitado y configurado
    - **When** un Prestador solicita asistencia
    - **Then** el sistema lo deriva a WhatsApp o a un Gestor comunitario según la configuración vigente
3. **Scenario**: Gestor o canal no disponible
    
    - **Given** un Prestador solicitó acompañamiento
    - **When** el Gestor comunitario o el canal de WhatsApp no está disponible en ese momento
    - **Then** el sistema no presenta el onboarding como completado ni simula una sesión de acompañamiento, y el Prestador puede continuar su registro de forma autónoma


---

### Edge Cases

- Un Prestador solicita acompañamiento fuera del horario disponible del Gestor: no debe presentarse como una sesión realizada.
- Un Gestor comunitario accede a datos del Prestador durante el acompañamiento: debe respetar las mismas reglas de privacidad de separación de zona aproximada y dirección exacta.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-091**: El sistema PUEDE proporcionar un proceso de onboarding asistido mediante WhatsApp o un Gestor comunitario, y DEBE permitir que el registro base de un Prestador (`spec-01`) se complete de forma autónoma si esta capacidad no está disponible o no está habilitada. [UC091]

### Key Entities _(include if feature involves data)_

- **Sesión de acompañamiento**: Prestador, canal (WhatsApp/Gestor), estado (solicitada/atendida/no disponible).
- **Gestor comunitario**: actor externo asociado a una o más sesiones de acompañamiento.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: El 100% de los registros de Prestador se puede completar de forma autónoma, con o sin onboarding asistido habilitado.
- **SC-002**: Ninguna sesión de acompañamiento se presenta como completada sin que el Gestor o el canal de WhatsApp efectivamente haya respondido.
