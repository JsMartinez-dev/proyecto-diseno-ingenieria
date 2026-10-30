# Implementation Plan: SPEC-17

**Date**: 2026-10-02  
**Spec**: [spec-17-mapa-visual-prestadores](../../FASE-4-Prototipar/specs/spec-17-mapa-visual-prestadores.md)
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

- **Arquitectura**: comprobar `Service implements UseCase`, constructores de entrada con interfaces, ausencia de Spring/JPA/HTTP en dominio/aplicación, mappers separados y transacciones verificadas con PostgreSQL cuando aplique.

- feature apagada no afecta descubrimiento lista/filtros;
- prestador sin zona válida se omite;
- tests explícitos verifican ausencia de dirección exacta;
- prueba de agrupación/precision en zona de baja densidad.

## Project Structure

```text
backend/src/main/java/com/aliado/
└── descubrimiento/
    ├── application/
    │   ├── usecase/
    │   │   ConsultarMapaPrestadoresUseCase
    │   ├── service/
    │   │   ConsultarMapaPrestadoresService
    │   ├── dto/
    │   │   Command/Query/Result de las operaciones del módulo (sin HTTP/JPA)
    │   └── port/
    │       ConsultaPrestadoresPublicosPort, RepresentacionGeograficaPort
    ├── infrastructure/
    │   └── adapter/
    │       Adaptadores de puertos requeridos; reutilizar contratos existentes
    └── presentation/
        ├── controller/
        │   MapaPrestadoresController
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
| `descubrimiento` | `ConsultarMapaPrestadoresUseCase` | `ConsultarMapaPrestadoresService` |

Puertos de salida: ConsultaPrestadoresPublicosPort y RepresentacionGeograficaPort sin dirección exacta. Las interfaces de entrada no crean endpoints nuevos; mantener API Contracts y las condiciones Could/Future. Las tareas existentes conservan IDs, historias, dependencias y orden: los nombres de servicio agrupado de origen se descomponen en estas operaciones, sin añadir tareas funcionales.

Persistencia de referencia: lecturas/proyecciones o extensión de tablas existentes; no crear tablas de lectura propias. Cualquier tabla opcional se diseña/aplica solo con aprobación de la feature; no es parte de las 42 tablas MVP. El [manual entregado](../../tasks/fuentes/manual-base-de-datos-aliado.md) detalla el modelo MVP; no implica que los scripts V1–V6 ya estén disponibles o ejecutados.


---

## Phase 1: Setup

- [ ] T001 Feature flag OFF.
- [ ] T002 Definir contrato `RepresentacionGeograficaPort` con adaptador, consumido por ConsultarMapaPrestadoresService.
- [ ] T003 No añadir FK/coordenadas de dirección exacta.

## Phase 2: User Story 1 - Mapa visual [UC087] (Priority: P3)

- [ ] T004 Tests disabled/enabled.
- [ ] T005 Test de privacidad de DTO.
- [ ] T006 Implementar read model reutilizando filtros de SPEC-03.
- [ ] T007 Omitir Prestadores sin zona aproximada válida.
- [ ] T008 Implementar agrupación que no incremente precisión en zonas con pocos Prestadores.
- [ ] T009 Endpoint.

## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F17-FE-01** Alternar lista/mapa con filtros compartidos, accesibilidad equivalente por lista.
- [ ] **F17-FE-02** Usar centroide/polígono autorizado de zona, nunca geocodificar dirección exacta.
- [ ] **F17-FE-03** Seleccionar punto abre perfil público; proveedor caído conserva búsqueda por lista.

Aplicar [estados y contrato de cliente](../../tasks/01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación de la feature

- [ ] **F17-QA-01** DTO y proveedor no reciben dirección exacta; niveles de zoom no aumentan precisión autorizada.
- [ ] **F17-QA-02** Filtros de mapa equivalen al descubrimiento y roles válidos.
- [ ] **F17-QA-03** Flag OFF no carga SDK cartográfico ni afecta lista.
- [ ] **F17-QA-04** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Notes

- `[NEEDS CLARIFICATION]`: proveedor cartográfico/geocodificación y si `Zona` almacenará polígono/centroide. No se inventa un proveedor en este plan.
- El mapa nunca consulta `direccionExacta`.
