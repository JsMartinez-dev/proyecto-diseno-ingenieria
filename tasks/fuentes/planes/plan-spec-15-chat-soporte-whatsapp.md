# Implementation Plan: SPEC-15

**Date**: 2026-10-02  
**Spec**: [spec-15-chat-soporte-whatsapp](FASE-4-Prototipar/specs/spec-15-chat-soporte-whatsapp)  
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

- Feature deshabilitada: rutas/capacidades no se anuncian.
- Chat: 0 accesos por terceros.
- Estado del servicio cancelado/finalizado: `[NEEDS CLARIFICATION]` lectura histórica vs cierre total.
- WhatsApp no disponible nunca bloquea el sistema.

## Project Structure

```text
backend/src/main/java/com/aliado/
├── comunicacion/          # SPEC-08, reutilizado/extendido
│   ├── infrastructure/realtime/       ChatRealtimeGateway
│   └── application/service/           ChatAuthorizationService
├── soporte/
│   ├── presentation/controller/       SoporteController
│   ├── application/service/           SoporteWhatsAppService
│   └── domain/model/                  InteraccionSoporte (si se decide persistir)
└── common/featureflags/
```

**Arquitectura por capas**: este SPEC conserva la organización modular y aplica Arquitectura Limpia según las secciones 7.1–7.5 de [plan-general-ALIADO](plan-general-ALIADO.md#7-estructura-lógica-del-repositorio). Las rutas del árbol son relativas a cada módulo: `domain/` contiene modelos, reglas y puertos; `application/` coordina los casos de uso; `presentation/` expone HTTP; `infrastructure/` implementa los detalles técnicos. El dominio no importa Spring, JPA ni DTO HTTP; la aplicación depende de contratos de dominio/aplicación, nunca de adaptadores concretos. Los DTO de aplicación van en `application/dto/` y los contratos HTTP en `presentation/dto/`, con conversión en presentación cuando corresponda.

Cuando haya persistencia, los `*Repository` del árbol son puertos en `domain/repository/`, sin heredar de Spring Data. Las tareas existentes de persistencia incluyen sus implementaciones en `infrastructure/persistence/`: `entity/` para entidades JPA, `jpa/` para repositorios Spring Data, `adapter/` para implementar los puertos y `mapper/` para convertir dominio y persistencia. Las integraciones externas se definen mediante puertos de aplicación y adaptadores en `infrastructure/adapter/`; los contratos compartidos existentes de `common/` permanecen libres de detalles técnicos. Las dependencias entre módulos utilizan contratos de dominio o servicios públicos de aplicación, sin acceder a entidades JPA ni adaptadores ajenos. Los filtros de seguridad y la configuración de Spring pertenecen a infraestructura técnica; los controladores y la traducción de errores HTTP pertenecen a presentación. Se crean solo las carpetas necesarias para las tareas ya definidas; se conservan sus identificadores, orden y dependencias.

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
- [ ] T012 `SoporteWhatsAppService` genera/entrega derivación sin simular conversación.
- [ ] T013 Opcional: persistir `InteraccionSoporte` para métricas operativas.

## Dependencies & Execution Order

Las dos historias son independientes y permanecen apagadas por defecto. Ninguna bloquea UC-01 a UC-06.

## Notes

- `[NEEDS CLARIFICATION]`: proveedor/URL oficial, horarios y operación humana de WhatsApp.
- `[NEEDS CLARIFICATION]`: comportamiento histórico del chat al cancelar/finalizar servicio.
- No se introduce otra tabla de mensajes mientras `MensajeServicio` de SPEC-08 sea suficiente.
