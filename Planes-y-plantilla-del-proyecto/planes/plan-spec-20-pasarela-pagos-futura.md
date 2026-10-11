# Implementation Plan: SPEC-20

**Date**: 2026-10-02  
**Spec**: [spec-20-pasarela-pagos-futura](FASE-4-Prototipar/specs/spec-20-pasarela-pagos-futura)  
**Depends on**: `plan-spec-01-autenticacion.md`, `plan-spec-08-contratacion-ciclo-servicio.md`

## Summary

SPEC-20 define exclusivamente una capacidad `Future`: piloto de pago integrado. Debe permanecer inaccesible mientras no exista validación del modelo de monetización y aprobación explícita del producto.

El plan prepara contratos, idempotencia y modelo de transacción sin seleccionar ni conectar un proveedor real. El MVP de contratación de SPEC-08 continúa funcionando sin pagos.

## Technical Context

**Language/Version**: Java 21 LTS  
**Primary Dependencies**: infraestructura existente; cliente SDK de pasarela solo después de aprobación  
**Storage**: PostgreSQL 16 — `transacciones_pago_piloto`  
**Feature flag**: `pagos.piloto.enabled=false`  
**Constraints**: mayor riesgo financiero/regulatorio; no almacenar datos de tarjeta/credenciales financieras; confirmaciones idempotentes  
**Scale/Scope**: Future, no MVP

## Data Model

| Entidad | Campos |
|---|---|
| `TransaccionPagoPiloto` | `id`, `servicioId`, `proveedor`, `referenciaExterna`, `estado`, `resultado`, `claveIdempotencia`, `fechaCreacion`, `fechaActualizacion` |

No se agregan monto/moneda como requisitos obligatorios porque el SPEC no los define todavía.

## API Contracts

Solo cuando feature + aprobación estén activas:

| Método | Endpoint | Uso |
|---|---|---|
| POST | `/api/v1/pagos/piloto` | iniciar transacción para servicio elegible |
| GET | `/api/v1/pagos/piloto/{id}` | consultar estado |
| POST | `/api/v1/pagos/piloto/webhooks/{proveedor}` | confirmación externa idempotente |

Con feature apagada, la UI no ofrece pagos y la API no ejecuta operaciones financieras.

## Testing Strategy

Tres Acceptance Scenarios + edge cases de timeout, confirmación duplicada y reconciliación. Se usa un fake/sandbox adapter; ninguna prueba requiere dinero real.

## Project Structure

```text
backend/src/main/java/com/aliado/pagos/
├── controller/ PagoPilotoController, PagoWebhookController
├── service/    PagoPilotoService, ReconciliacionPagoService
├── gateway/    PasarelaPago (interfaz), FakePasarelaPago
├── repository/ TransaccionPagoRepository
└── model/      TransaccionPagoPiloto
```

---

## Phase 1: Preparación segura

- [ ] T001 Feature flag OFF y aprobación separada `pagos.piloto.approved=false`.
- [ ] T002 Migración `transacciones_pago_piloto`.
- [ ] T003 Interfaz `PasarelaPago`, sin proveedor productivo.
- [ ] T004 Clave de idempotencia única.
- [ ] T005 Prohibir persistencia de PAN/CVV u otros datos financieros sensibles.

## Phase 2: User Story 1 - Piloto de pasarela [UC093] (Priority: P4)

- [ ] T006 Test: feature/aprobación apagadas → capacidad inaccesible.
- [ ] T007 Test: transacción de sandbox asociada a servicio elegible.
- [ ] T008 Test: webhook duplicado produce una sola transición lógica.
- [ ] T009 Test: timeout + reconciliación.
- [ ] T010 `PagoPilotoService`.
- [ ] T011 `ReconciliacionPagoService`.
- [ ] T012 Endpoints solo tras doble habilitación.
- [ ] T013 Adapter fake/sandbox.
- [ ] T014 Verificar que SPEC-08 funciona sin pagos.

## Dependencies & Execution Order

No bloquea ningún otro SPEC. Solo puede activarse después de una decisión de producto fuera de este plan.

## Notes

- `[NEEDS CLARIFICATION]`: proveedor, país/moneda, comisiones, flujo de dispersión, reembolsos, tratamiento tributario y cumplimiento aplicable.
- Un proveedor productivo no debe incorporarse hasta resolver esas decisiones.
- `resultado` se persiste como código/detalle sanitizado; no se almacenan secretos ni datos completos de instrumento de pago.
