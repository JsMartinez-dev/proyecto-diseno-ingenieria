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

### User Story 2 - Idiomas adicionales `<<Could>>` [UC092] (Priority: P3)

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
- **FR-092**: El sistema PUEDE admitir idiomas adicionales, con un comportamiento de respaldo en español para cualquier texto sin traducción disponible, y DEBE permanecer deshabilitado (operando solo en español) sin afectar el MVP mientras no exista aprobación explícita. [UC092]

### Key Entities _(include if feature involves data)_

- **Referido**: usuario referente, invitado, mecanismo usado, estado de atribución.
- **Preferencia de idioma**: idioma seleccionado por el usuario, dentro del conjunto soportado.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 0 beneficios de referido se otorgan por auto-referido o cuentas duplicadas, en el 100% de los casos de prueba.
- **SC-002**: El 100% de los textos sin traducción disponible se muestra con el respaldo en español, sin mezclar idiomas de forma confusa.
- **SC-003**: La desactivación de ambas capacidades no impide completar ningún flujo comprometido en UC-01 a UC-06.

## Arquitectura y trazabilidad de implementación

Este SPEC se implementa como parte del monolito modular con Arquitectura Limpia. Se conservan historias, requisitos, entidades conceptuales y criterios de éxito anteriores; esta sección fija la separación técnica de responsabilidades.

**Contrato de arquitectura**: cada operación tiene una interfaz `application/usecase/*UseCase` y una implementación `application/service/*Service implements *UseCase`. Controllers, filtros, gateways y workers inyectan las interfaces por constructor; no servicios concretos ni repositorios JPA. Los servicios coordinan dominio y puertos sin importar Spring, JPA o HTTP. Dominio contiene modelos, reglas, excepciones de negocio y repositorios propios; infraestructura implementa los puertos y configura transacciones. Los DTO HTTP y sus mappers pertenecen a presentación; Command/Query/Result de aplicación son independientes del transporte.

Los contratos entre módulos son interfaces públicas de aplicación; no se accede a Service concreto, repositorio interno o entidad JPA de otro módulo. Cuando se requiera persistencia se separan `domain/repository`, `infrastructure/persistence/entity`, `mapper`, `jpa` y `adapter`. La configuración de Spring conecta puertos y adaptadores, y conserva la transacción completa del caso de uso. Solo crear clases/carpetas con responsabilidad real. `common` contiene infraestructura/contratos transversales acotados; el contexto de Spring Security no entra a aplicación. `SesionAutenticada` es contrato puro en `auth/application/port`; generación aleatoria segura del token y huella SHA-256 son responsabilidades separadas.

El [plan técnico de SPEC-19](../../Planes-y-plantilla-del-proyecto/planes/plan-spec-19-referidos-e-idiomas.md) contiene el árbol de paquetes, puertos, persistencia, tareas backend, frontend e integración actualizados.

### Interfaces de entrada e implementaciones

| Módulo | UseCase (interfaz) | Service (implementación) |
|---|---|---|
| `referidos` | `GenerarReferidoUseCase` | `GenerarReferidoService` |
| `referidos` | `AtribuirReferidoUseCase` | `AtribuirReferidoService` |
| `internacionalizacion` | `ConsultarIdiomasUseCase` | `ConsultarIdiomasService` |
| `internacionalizacion` | `ConsultarPreferenciaIdiomaUseCase` | `ConsultarPreferenciaIdiomaService` |
| `internacionalizacion` | `ActualizarPreferenciaIdiomaUseCase` | `ActualizarPreferenciaIdiomaService` |

Puertos de salida: reglas/puertos de atribución e idiomas independientes del controlador de registro. Las interfaces de entrada no crean endpoints nuevos; mantener API Contracts y las condiciones Could/Future. Las tareas existentes conservan IDs, historias, dependencias y orden: los nombres de servicio agrupado de origen se descomponen en estas operaciones, sin añadir tareas funcionales.

Persistencia de referencia: `referidos`, `idiomas_soportados`, `preferencias_idioma`. Cualquier tabla opcional se diseña/aplica solo con aprobación de la feature; no es parte de las 42 tablas MVP. El [manual entregado](../../tasks/fuentes/manual-base-de-datos-aliado.md) detalla el modelo MVP; no implica que los scripts V1–V6 ya estén disponibles o ejecutados.
