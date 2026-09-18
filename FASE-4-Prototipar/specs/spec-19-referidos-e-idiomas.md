# Feature Specification: SPEC-19 — Programa de referidos e idiomas adicionales

**Creado**: 2026-09-16 
**Casos de uso cubiertos**: UC089, UC092

## User Scenarios & Testing _(mandatory)_



### User Story 1 - Programa de referidos `<<Could>>` [UC089] (Priority: P3)

Como Usuario, quiero referir a otras personas a CONectaSM para apoyar el crecimiento de la plataforma y recibir el beneficio definido.

**Why this priority**: Es una capacidad de adquisición de usuarios, no necesaria para que el marketplace base funcione entre quienes ya están registrados.

**Independent Test**: Con el programa habilitado, generar una referencia válida y una inválida (auto-referido), y verificar que solo la primera genera atribución.

**Acceptance Scenarios**:

1. **Scenario**: Capacidad deshabilitada (comportamiento por defecto)
    
    - **Given** el programa de referidos no está habilitado
    - **When** un Usuario busca esta opción
    - **Then** el sistema no la presenta como disponible
2. **Scenario**: Referido válido
    
    - **Given** el programa está habilitado y un Usuario comparte su mecanismo de referido con una persona sin cuenta previa
    - **When** esa persona se registra usando el mecanismo de referido
    - **Then** el sistema registra la atribución conforme a las reglas de campaña vigentes
3. **Scenario**: Auto-referido o referido duplicado
    
    - **Given** un Usuario intenta usar su propio mecanismo de referido, o una cuenta ya registrada intenta ser referida de nuevo
    - **When** se procesa el intento
    - **Then** el sistema no genera ningún beneficio ni atribución


---

### User Story 2 - Seleccionar idioma `<<Could>>` [UC092] (Priority: P3)

Como Usuario, quiero usar la plataforma en un idioma adicional al español, para mejorar mi accesibilidad lingüística.

**Why this priority**: Mejora la accesibilidad para un segmento de usuarios, pero el problema central del proyecto (gestión de oportunidades en Santa Marta) no depende de soporte multilenguaje para su validación inicial.

**Independent Test**: Con al menos un idioma adicional habilitado y parcialmente traducido, cambiar la preferencia de idioma y verificar el contenido traducido y el comportamiento de fallback donde falte traducción.

**Acceptance Scenarios**:

1. **Scenario**: Capacidad deshabilitada (comportamiento por defecto)
    
    - **Given** no hay idiomas adicionales habilitados
    - **When** un Usuario busca esta opción
    - **Then** el sistema no la presenta como disponible y opera únicamente en español
2. **Scenario**: Cambio de idioma soportado
    
    - **Given** un idioma adicional está habilitado y soportado
    - **When** el Usuario lo selecciona
    - **Then** el contenido traducido dentro del alcance definido se presenta en ese idioma
3. **Scenario**: Texto sin traducción disponible
    
    - **Given** el Usuario seleccionó un idioma soportado
    - **When** el sistema debe mostrar un texto que no tiene traducción disponible en ese idioma
    - **Then** el sistema muestra ese texto puntual en español como respaldo, sin mezclar idiomas de forma confusa en el resto de la pantalla


---

### Edge Cases

- Un mismo dispositivo o persona genera múltiples cuentas para explotar el programa de referidos: requiere controles antifraude definidos antes del lanzamiento (más allá del bloqueo de auto-referido directo).
- Un idioma se retira del catálogo de soportados mientras usuarios lo tienen seleccionado como preferencia: debe definirse el idioma de respaldo aplicado automáticamente.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-089**: El sistema PUEDE implementar un programa de referidos, sujeto a reglas explícitas de elegibilidad, atribución y prevención de auto-referido/duplicados, y DEBE permanecer deshabilitado sin afectar el MVP mientras no exista aprobación explícita. [UC089]
- **FR-092**: El sistema PUEDE permitir seleccionar un idioma adicional, con un comportamiento de respaldo en español para cualquier texto sin traducción disponible, y DEBE mantener la selección deshabilitada (operando solo en español) sin afectar el MVP mientras no exista aprobación explícita. [UC092]

### Key Entities _(include if feature involves data)_

- **Referido**: usuario referente, invitado, mecanismo usado, estado de atribución.
- **Preferencia de idioma**: idioma seleccionado por el usuario, dentro del conjunto soportado.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 0 beneficios de referido se otorgan por auto-referido o cuentas duplicadas, en el 100% de los casos de prueba.
- **SC-002**: El 100% de los textos sin traducción disponible se muestra con el respaldo en español, sin mezclar idiomas de forma confusa.
- **SC-003**: La desactivación de ambas capacidades no impide completar ningún flujo comprometido en UC-01 a UC-06.

