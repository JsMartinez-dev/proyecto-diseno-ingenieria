# Implementation Plan: SPEC-17

**Date**: 2026-10-02  
**Spec**: [spec-17-mapa-visual-prestadores](FASE-4-Prototipar/specs/spec-17-mapa-visual-prestadores)  
**Depends on**: `plan-spec-02-perfil.md` (zona aproximada), `plan-spec-03-descubrimiento.md`, `plan-spec-05-perfil-profesional.md`, `plan-spec-12-administracion-moderacion-riesgos.md` (catálogo de zonas administrable)

## Summary

SPEC-17 es una capacidad `Could` que presenta el descubrimiento de Prestadores en mapa usando exclusivamente la precisión autorizada de zona aproximada. No persiste una ubicación nueva del Prestador y nunca utiliza `direccionExacta`.

La representación geográfica es un DTO/read model derivado de la zona y del perfil público.

## Technical Context

**Storage**: sin tablas propias  
**Dependencies**: servicio de descubrimiento + catálogo `Zona`  
**Feature flag**: `mapa-prestadores.enabled=false`  
**External provider**: `[NEEDS CLARIFICATION]` proveedor cartográfico y representación de zonas  
**Constraints**: RNF-004; evitar reidentificación en zonas de baja densidad

## Data Model

`RepresentacionGeograficaPrestadorDTO`: `prestadorId`, `zonaId`, `zonaNombre`, `representacionAproximada`. No contiene dirección exacta ni coordenadas residenciales.

## API Contracts

`GET /api/v1/descubrimiento/mapa?categoria=&zona=` → lista de representaciones aproximadas, solo para Cliente y feature habilitada.

## Testing Strategy

- feature apagada no afecta descubrimiento lista/filtros;
- prestador sin zona válida se omite;
- tests explícitos verifican ausencia de dirección exacta;
- prueba de agrupación/precision en zona de baja densidad.

## Project Structure

```text
backend/src/main/java/com/aliado/descubrimiento/mapa/
├── controller/ MapaPrestadoresController
├── service/    MapaPrestadoresService
└── dto/        RepresentacionGeograficaPrestadorDTO
```

---

## Phase 1: Setup

- [ ] T001 Feature flag OFF.
- [ ] T002 Definir contrato `RepresentacionZonaService`.
- [ ] T003 No añadir FK/coordenadas de dirección exacta.

## Phase 2: User Story 1 - Mapa visual [UC087] (Priority: P3)

- [ ] T004 Tests disabled/enabled.
- [ ] T005 Test de privacidad de DTO.
- [ ] T006 Implementar read model reutilizando filtros de SPEC-03.
- [ ] T007 Omitir Prestadores sin zona aproximada válida.
- [ ] T008 Implementar agrupación que no incremente precisión en zonas con pocos Prestadores.
- [ ] T009 Endpoint.

## Notes

- `[NEEDS CLARIFICATION]`: proveedor cartográfico/geocodificación y si `Zona` almacenará polígono/centroide. No se inventa un proveedor en este plan.
- El mapa nunca consulta `direccionExacta`.
