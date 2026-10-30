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

## Arquitectura y trazabilidad de implementación

Este SPEC se implementa como parte del monolito modular con Arquitectura Limpia. Se conservan historias, requisitos, entidades conceptuales y criterios de éxito anteriores; esta sección fija la separación técnica de responsabilidades.

**Contrato de arquitectura**: cada operación tiene una interfaz `application/usecase/*UseCase` y una implementación `application/service/*Service implements *UseCase`. Controllers, filtros, gateways y workers inyectan las interfaces por constructor; no servicios concretos ni repositorios JPA. Los servicios coordinan dominio y puertos sin importar Spring, JPA o HTTP. Dominio contiene modelos, reglas, excepciones de negocio y repositorios propios; infraestructura implementa los puertos y configura transacciones. Los DTO HTTP y sus mappers pertenecen a presentación; Command/Query/Result de aplicación son independientes del transporte.

Los contratos entre módulos son interfaces públicas de aplicación; no se accede a Service concreto, repositorio interno o entidad JPA de otro módulo. Cuando se requiera persistencia se separan `domain/repository`, `infrastructure/persistence/entity`, `mapper`, `jpa` y `adapter`. La configuración de Spring conecta puertos y adaptadores, y conserva la transacción completa del caso de uso. Solo crear clases/carpetas con responsabilidad real. `common` contiene infraestructura/contratos transversales acotados; el contexto de Spring Security no entra a aplicación. `SesionAutenticada` es contrato puro en `auth/application/port`; generación aleatoria segura del token y huella SHA-256 son responsabilidades separadas.

El [plan técnico de SPEC-20](../../Planes-y-plantilla-del-proyecto/planes/plan-spec-20-pasarela-pagos-futura.md) contiene el árbol de paquetes, puertos, persistencia, tareas backend, frontend e integración actualizados.

### Interfaces de entrada e implementaciones

| Módulo | UseCase (interfaz) | Service (implementación) |
|---|---|---|
| `pagos` | `IniciarPagoPilotoUseCase` | `IniciarPagoPilotoService` |
| `pagos` | `ConsultarPagoPilotoUseCase` | `ConsultarPagoPilotoService` |
| `pagos` | `ProcesarConfirmacionPagoUseCase` | `ProcesarConfirmacionPagoService` |
| `pagos` | `ReconciliarPagoPilotoUseCase` | `ReconciliarPagoPilotoService` |

Puertos de salida: PasarelaPago y ConsultaServicioElegiblePort; FakePasarelaPago implementa el mismo puerto antes del proveedor. Las interfaces de entrada no crean endpoints nuevos; mantener API Contracts y las condiciones Could/Future. Las tareas existentes conservan IDs, historias, dependencias y orden: los nombres de servicio agrupado de origen se descomponen en estas operaciones, sin añadir tareas funcionales.

Persistencia de referencia: `transacciones_pago_piloto`. Cualquier tabla opcional se diseña/aplica solo con aprobación de la feature; no es parte de las 42 tablas MVP. El [manual entregado](../../tasks/fuentes/manual-base-de-datos-aliado.md) detalla el modelo MVP; no implica que los scripts V1–V6 ya estén disponibles o ejecutados.
