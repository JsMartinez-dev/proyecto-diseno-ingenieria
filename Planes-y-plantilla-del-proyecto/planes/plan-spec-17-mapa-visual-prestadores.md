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
├── presentation/controller/       MapaPrestadoresController
├── application/service/           MapaPrestadoresService
└── application/dto/               RepresentacionGeograficaPrestadorDTO
```

**Arquitectura por capas**: este SPEC conserva la organización modular y aplica Arquitectura Limpia según las secciones 7.1–7.5 de [plan-general-ALIADO](plan-general-ALIADO.md#7-estructura-lógica-del-repositorio). Las rutas del árbol son relativas a cada módulo: `domain/` contiene modelos, reglas y puertos; `application/` coordina los casos de uso; `presentation/` expone HTTP; `infrastructure/` implementa los detalles técnicos. El dominio no importa Spring, JPA ni DTO HTTP; la aplicación depende de contratos de dominio/aplicación, nunca de adaptadores concretos. Los DTO de aplicación van en `application/dto/` y los contratos HTTP en `presentation/dto/`, con conversión en presentación cuando corresponda.

Cuando haya persistencia, los `*Repository` del árbol son puertos en `domain/repository/`, sin heredar de Spring Data. Las tareas existentes de persistencia incluyen sus implementaciones en `infrastructure/persistence/`: `entity/` para entidades JPA, `jpa/` para repositorios Spring Data, `adapter/` para implementar los puertos y `mapper/` para convertir dominio y persistencia. Las integraciones externas se definen mediante puertos de aplicación y adaptadores en `infrastructure/adapter/`; los contratos compartidos existentes de `common/` permanecen libres de detalles técnicos. Las dependencias entre módulos utilizan contratos de dominio o servicios públicos de aplicación, sin acceder a entidades JPA ni adaptadores ajenos. Los filtros de seguridad y la configuración de Spring pertenecen a infraestructura técnica; los controladores y la traducción de errores HTTP pertenecen a presentación. Se crean solo las carpetas necesarias para las tareas ya definidas; se conservan sus identificadores, orden y dependencias.

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
