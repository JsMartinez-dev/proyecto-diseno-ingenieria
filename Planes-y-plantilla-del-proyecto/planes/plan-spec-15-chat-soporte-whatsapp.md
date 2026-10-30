# Implementation Plan: SPEC-15

**Date**: 2026-10-02  
**Spec**: [spec-15-chat-soporte-whatsapp](../../FASE-4-Prototipar/specs/spec-15-chat-soporte-whatsapp.md)
**Depends on**: `plan-spec-01-autenticacion.md`, `plan-spec-08-contratacion-ciclo-servicio.md`

## Summary

SPEC-15 contiene dos capacidades `Could`, deshabilitadas por defecto: chat interno en tiempo real y acceso a soporte oficial por WhatsApp. Ninguna puede bloquear los flujos del MVP.

Para evitar duplicación con SPEC-08, el chat reutiliza el almacenamiento y autorización del canal de comunicación asociado a `ServicioContratado`; SPEC-15 agrega transporte en tiempo real y política de feature flag, no una segunda fuente de verdad de mensajes. El soporte WhatsApp es una derivación externa, no un chat simulado dentro de ALIADO.

## Technical Context

**Language/Version**: Java 21 LTS  
**Primary Dependencies**: Spring Boot 3.3.x; si se habilita chat real-time: Spring WebSocket `[NEEDS APPROVAL]`  
**Storage**: reutiliza mensajes/canal de SPEC-08; opcional `interacciones_soporte` para trazabilidad  
**Testing**: JUnit, Spring Boot Test, WebSocket integration tests si se habilita  
**Constraints**: feature flags OFF por defecto; RNF-004; ningún tercero accede a conversación  
**Scale/Scope**: Could, fuera del MVP comprometido

## Data Model

| Entidad | Decisión |
|---|---|
| `MensajeServicio` | reutilizado de SPEC-08 como persistencia del chat |
| `Conversacion` | conceptual: `ServicioContratado` actúa como boundary de conversación; no se duplica tabla inicialmente |
| `InteraccionSoporte` | opcional: `id`, `usuarioId`, `canal`, `estado`, `fechaInicio`, `fechaAtencion` |

## API / Realtime Contracts

- REST histórico: reutiliza `/api/v1/servicios/{id}/mensajes` de SPEC-08.
- Canal realtime propuesto si se habilita: `/ws/servicios/{servicioId}` con autorización de ambas partes.
- `GET /api/v1/soporte/whatsapp`: devuelve únicamente metadata/enlace oficial si feature habilitada.

## Testing Strategy

- **Arquitectura**: comprobar `Service implements UseCase`, constructores de entrada con interfaces, ausencia de Spring/JPA/HTTP en dominio/aplicación, mappers separados y transacciones verificadas con PostgreSQL cuando aplique.

- Feature deshabilitada: rutas/capacidades no se anuncian.
- Chat: 0 accesos por terceros.
- Estado del servicio cancelado/finalizado: `[NEEDS CLARIFICATION]` lectura histórica vs cierre total.
- WhatsApp no disponible nunca bloquea el sistema.

## Project Structure

```text
backend/src/main/java/com/aliado/
├── comunicacion/
│   ├── application/
│   │   ├── usecase/
│   │   │   AutorizarConversacionRealtimeUseCase, EnviarMensajeRealtimeUseCase
│   │   ├── service/
│   │   │   AutorizarConversacionRealtimeService, EnviarMensajeRealtimeService
│   │   ├── dto/
│   │   │   Command/Query/Result de las operaciones del módulo (sin HTTP/JPA)
│   │   └── port/
│   │       Contratos de mensajes/autorización de servicios y canal de soporte
│   └── infrastructure/
│       └── realtime/
│           ChatRealtimeGateway (consume interfaces UseCase)
└── soporte/
    ├── application/
    │   ├── usecase/
    │   │   SolicitarSoporteWhatsAppUseCase
    │   ├── service/
    │   │   SolicitarSoporteWhatsAppService
    │   ├── dto/
    │   │   Command/Query/Result de las operaciones del módulo (sin HTTP/JPA)
    │   └── port/
    │       Contratos de mensajes/autorización de servicios y canal de soporte
    ├── infrastructure/
    │   └── adapter/
    │       Adaptadores de puertos requeridos; reutilizar contratos existentes
    └── presentation/
        ├── controller/
        │   SoporteController
        ├── dto/
        │   Request/Response HTTP según API Contracts
        └── mapper/
            Conversión HTTP ↔ Command/Query/Result
```

**Contrato de arquitectura**: cada operación tiene una interfaz `application/usecase/*UseCase` y una implementación `application/service/*Service implements *UseCase`. Controllers, filtros, gateways y workers inyectan las interfaces por constructor; no servicios concretos ni repositorios JPA. Los servicios coordinan dominio y puertos sin importar Spring, JPA o HTTP. Dominio contiene modelos, reglas, excepciones de negocio y repositorios propios; infraestructura implementa los puertos y configura transacciones. Los DTO HTTP y sus mappers pertenecen a presentación; Command/Query/Result de aplicación son independientes del transporte.

Los contratos entre módulos son interfaces públicas de aplicación; no se accede a Service concreto, repositorio interno o entidad JPA de otro módulo. Cuando se requiera persistencia se separan `domain/repository`, `infrastructure/persistence/entity`, `mapper`, `jpa` y `adapter`. La configuración de Spring conecta puertos y adaptadores, y conserva la transacción completa del caso de uso. Solo crear clases/carpetas con responsabilidad real. `common` contiene infraestructura/contratos transversales acotados; el contexto de Spring Security no entra a aplicación. `SesionAutenticada` es contrato puro en `auth/application/port`; generación aleatoria segura del token y huella SHA-256 son responsabilidades separadas.

### Interfaces de entrada e implementaciones

| Módulo | UseCase (interfaz) | Service (implementación) |
|---|---|---|
| `comunicacion` | `AutorizarConversacionRealtimeUseCase` | `AutorizarConversacionRealtimeService` |
| `comunicacion` | `EnviarMensajeRealtimeUseCase` | `EnviarMensajeRealtimeService` |
| `soporte` | `SolicitarSoporteWhatsAppUseCase` | `SolicitarSoporteWhatsAppService` |

Puertos de salida: consulta de participantes/estado del servicio, contratos públicos de mensajes de F08 y canal oficial de soporte. Las interfaces de entrada no crean endpoints nuevos; mantener API Contracts y las condiciones Could/Future. Las tareas existentes conservan IDs, historias, dependencias y orden: los nombres de servicio agrupado de origen se descomponen en estas operaciones, sin añadir tareas funcionales.

Persistencia de referencia: lecturas/proyecciones o extensión de tablas existentes; no crear tablas de lectura propias. Cualquier tabla opcional se diseña/aplica solo con aprobación de la feature; no es parte de las 42 tablas MVP. El [manual entregado](../../tasks/fuentes/manual-base-de-datos-aliado.md) detalla el modelo MVP; no implica que los scripts V1–V6 ya estén disponibles o ejecutados.


---

## Phase 1: Setup / Feature Flags

- [ ] T001 `chat-interno.enabled=false`.
- [ ] T002 `soporte-whatsapp.enabled=false`.
- [ ] T003 Asegurar que UI/API base no dependen de ambas capacidades.

## Phase 2: User Story 1 - Chat interno realtime [UC086] (Priority: P3)

- [ ] T004 Tests de feature deshabilitada.
- [ ] T005 Tests de autorización Cliente/Prestador vs tercero.
- [ ] T006 Añadir gateway realtime solo bajo feature flag.
- [ ] T007 Reutilizar `MensajeServicio`/autorización de SPEC-08.
- [ ] T008 Sincronizar persistencia y entrega realtime.
- [ ] T009 Definir política de conversación tras cancelación/finalización antes de producción.

## Phase 3: User Story 2 - Soporte WhatsApp [UC090] (Priority: P3)

- [ ] T010 Tests disabled/enabled.
- [ ] T011 Configurar canal oficial externo por entorno.
- [ ] T012 `SolicitarSoporteWhatsAppService implements SolicitarSoporteWhatsAppUseCase` genera/entrega derivación sin simular conversación.
- [ ] T013 Opcional: persistir `InteraccionSoporte` para métricas operativas.

## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F15-FE-01** Conversación reutiliza mensajes_servicio, autenticación y reglas del canal; reconectar y deduplicar por id.
- [ ] **F15-FE-02** WhatsApp claramente externo, con URL oficial y disponibilidad real; estado no disponible honesto.
- [ ] **F15-FE-03** Ocultar ambas entradas con flags OFF sin bloquear comunicación REST del MVP.

Aplicar [estados y contrato de cliente](../../tasks/01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación de la feature

- [ ] **F15-QA-01** No transmitir a terceros; revalidar sesión/participación al conectar, suscribirse y enviar.
- [ ] **F15-QA-02** Reconexion y entrega duplicada conservan un mensaje lógico; cierre sigue política D-10.
- [ ] **F15-QA-03** Flags OFF y regresión completa de contratación sin realtime.
- [ ] **F15-QA-04** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Dependencies & Execution Order

Las dos historias son independientes y permanecen apagadas por defecto. Ninguna bloquea UC-01 a UC-06.

## Notes

- `[NEEDS CLARIFICATION]`: proveedor/URL oficial, horarios y operación humana de WhatsApp.
- `[NEEDS CLARIFICATION]`: comportamiento histórico del chat al cancelar/finalizar servicio.
- No se introduce otra tabla de mensajes mientras `MensajeServicio` de SPEC-08 sea suficiente.
