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
│   └── realtime/          ChatRealtimeGateway, ChatAuthorizationService
├── soporte/
│   ├── controller/        SoporteController
│   ├── service/           SoporteWhatsAppService
│   └── model/             InteraccionSoporte (si se decide persistir)
└── common/featureflags/
```

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
