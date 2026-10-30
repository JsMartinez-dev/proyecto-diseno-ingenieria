# Feature Specification: SPEC-20 — Pasarela de pagos futura

**Creado**: 2026-09-16 
**Casos de uso cubiertos**: UC093 

## User Scenarios & Testing _(mandatory)_


### User Story 1 - Piloto de pasarela de pago `<<Future>>` [UC093] (Priority: P4)

Como Cliente o Prestador, quiero evaluar un piloto de pago integrado para facilitar transacciones, únicamente si el modelo de monetización de la plataforma ha sido validado y aprobado explícitamente.

**Why this priority**: Es la capacidad de mayor riesgo regulatorio y financiero de todo el proyecto; su prioridad más baja (P4) refleja que depende de una validación de negocio que todavía no existe, no solo de una decisión técnica.

**Independent Test**: Únicamente en un entorno de piloto aprobado, iniciar una transacción de prueba y verificar que se asocia correctamente a un servicio elegible sin alterar el modelo de contratación si el piloto está deshabilitado.

**Acceptance Scenarios**:

1. **Scenario**: Piloto deshabilitado (comportamiento por defecto)
    
    - **Given** la capacidad Future no está habilitada
    - **When** un Cliente o Prestador intenta iniciar un pago integrado
    - **Then** el sistema no ofrece ni ejecuta el flujo de pago, y el modelo de contratación actual (sin pago integrado) sigue funcionando con normalidad
2. **Scenario**: Piloto habilitado y transacción de prueba
    
    - **Given** el modelo de monetización fue validado y el piloto está explícitamente habilitado
    - **When** un Cliente inicia el flujo de pago para un servicio elegible
    - **Then** el sistema procesa la transacción mediante la pasarela configurada y registra el resultado autorizado
3. **Scenario**: Confirmación tardía o reintento
    
    - **Given** la pasarela confirma un pago después de un timeout o reintento
    - **When** el sistema recibe la confirmación duplicada
    - **Then** el procesamiento es idempotente: el servicio queda con una única interpretación del estado de la transacción, sin duplicar cobros ni confirmaciones


---

### Edge Cases

- El piloto está deshabilitado: ninguna UI ni API del MVP debe asumir que existe pago integrado disponible.
- Un intento de pago debe permanecer en modo informativo y no almacenar datos financieros reales hasta que el alcance Future esté formalmente aprobado.
- Una transacción de prueba queda en un estado intermedio (ni confirmada ni rechazada) por una falla de red: el sistema debe poder reconciliarla sin intervención manual improvisada.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-093**: El sistema DEBE mantener la funcionalidad de pasarela de pagos fuera del MVP inicial, y SOLO DEBE habilitar un piloto después de validar el modelo de monetización y registrar una aprobación explícita del producto. Si se habilita, DEBE procesar las confirmaciones de forma idempotente. [UC093]

### Key Entities _(include if feature involves data)_

- **Transacción de pago piloto**: servicio asociado, proveedor externo, estado (iniciada/confirmada/reconciliada), resultado.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: El piloto de pagos permanece inaccesible mientras la aprobación de producto no esté habilitada.
- **SC-002**: Antes de habilitar pagos, el 100% de los escenarios de prueba de reintento/confirmación tardía preserva una única interpretación del estado de la transacción.
- **SC-003**: La desactivación del piloto no impide completar ningún flujo comprometido en UC-01 a UC-06.

