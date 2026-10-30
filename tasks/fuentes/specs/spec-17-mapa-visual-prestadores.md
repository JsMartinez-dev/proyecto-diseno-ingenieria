# Feature Specification: SPEC-17 — Mapa visual de prestadores

**Creado**: 2026-09-16 
**Casos de uso cubiertos**: UC087 

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Mapa visual de prestadores `<<Could>>` [UC087] (Priority: P3)

Como Cliente, quiero visualizar Prestadores en un mapa para explorar opciones geográficamente, en lugar de solo verlos en una lista.

**Why this priority**: Es una mejora de descubrimiento (complementa `spec-02` de UC-02), pero la plataforma ya es funcional sin ella mediante la lista y filtros existentes.

**Independent Test**: Con Prestadores de prueba en zonas conocidas, abrir el mapa y verificar que solo se muestra la zona aproximada de cada uno, nunca su dirección exacta.

**Acceptance Scenarios**:

1. **Scenario**: Capacidad deshabilitada (comportamiento por defecto)
    
    - **Given** el mapa visual no está habilitado
    - **When** un Cliente busca esta opción
    - **Then** el sistema no la presenta como disponible; el descubrimiento por lista/filtros (`spec-02`) sigue funcionando con normalidad
2. **Scenario**: Mapa con precisión autorizada
    
    - **Given** el mapa está habilitado y existen Prestadores con zona aproximada configurada (`spec-02`, UC009)
    - **When** un Cliente lo abre
    - **Then** el sistema muestra únicamente marcadores a nivel de zona aproximada, nunca la dirección exacta de ningún Prestador
3. **Scenario**: Prestador sin zona aproximada válida
    
    - **Given** un Prestador no tiene una zona aproximada configurada
    - **When** se genera el mapa
    - **Then** el sistema omite a ese Prestador del mapa, sin sustituir el marcador por una dirección exacta ni una ubicación inventada


---

### Edge Cases

- Una zona con muy pocos Prestadores podría revelar indirectamente su ubicación aproximada por descarte: la agrupación visual debe evitar exponer una precisión mayor a la autorizada, incluso en zonas de baja densidad.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-087**: El sistema PUEDE proporcionar un mapa visual de Prestadores, utilizando exclusivamente el nivel de precisión de ubicación autorizado por las reglas de privacidad de `spec-02` (UC013), y DEBE permanecer deshabilitado sin afectar el descubrimiento base (`spec-02`) mientras no exista aprobación explícita. [UC087]

### Key Entities _(include if feature involves data)_

- **Representación geográfica de Prestador**: derivada de la zona aproximada (`spec-02`), nunca de la dirección exacta.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: El 100% de las representaciones geográficas del mapa respeta la precisión de ubicación autorizada y no revela dirección exacta sin autorización, en el 100% de los casos de prueba.
- **SC-002**: La desactivación del mapa no impide completar el descubrimiento de Prestadores por lista/filtros definido en `spec-02`.

