# F17 — Mapa aproximado de Prestadores

**Alcance:** Could OFF. **Estado:** planificado, sin implementación.
**Dependencias:** 02 03 05; aprobación Could. **Decisiones relacionadas:** D-16 (ver [registro](../03-decisiones-y-dependencias.md)).

## Resultado esperado

Proyección geográfica aproximada de catálogo sin direcciones exactas, flag OFF.

## Fuentes y trazabilidad

- [SPEC original](../fuentes/specs/spec-17-mapa-visual-prestadores.md): historias, escenarios, requisitos y criterios de éxito.
- [Plan de origen](../fuentes/planes/plan-spec-17-mapa-visual-prestadores.md): fases, tareas y dependencias detalladas.
- [Manual de datos](../fuentes/manual-base-de-datos-aliado.md), [modelo PDF](../fuentes/modelo-logico-ALIADO.pdf) y [reglas transversales](../01-arquitectura-y-stack.md).

Los IDs `F17-Txxx` conservan el identificador Txxx de origen, ahora con prefijo para evitar colisiones entre SPEC. No implican que el trabajo ya exista. Las tareas adicionales DB/BE/FE/QA desglosan integración y clientes, sin reemplazar requisitos. Las correcciones explícitas de 03 prevalecen sobre notas antiguas del plan fuente; no implementar tablas puntuales de notificaciones ni JWT por copiar una referencia.

## Historias cubiertas

- User Story 1 - Mapa visual de prestadores `<<Could>>` [UC087] (Priority: P3)

## Base de datos

- [ ] **F17-DB-01** No crear tablas propias: consultar modelos existentes mediante contratos del módulo propietario y proyecciones autorizadas; cualquier columna adicional exige registrar migración y decisión.
- [ ] **F17-DB-02** Verificar planes de consulta e índices de las tablas consultadas con dataset representativo; no duplicar fuentes de verdad.

## Backend — integración y arquitectura

- [ ] **F17-BE-01** Concretar los contratos de F17 en OpenAPI: DTO request/response, validación, rol, propiedad, paginación, errores e idempotencia, conservando endpoints fuente salvo decisión explícita.
- [ ] **F17-BE-02** Definir las interfaces `application/usecase/*UseCase` y sus implementaciones `application/service/*Service implements *UseCase` según la tabla de esta feature. Inyectar solo interfaces por constructor en controladores/filtros/worker. Service usa dominio y puertos; ninguna dependencia hacia Spring/JPA/HTTP/adaptadores concretos. Llamadas entre módulos mediante interfaces públicas, nunca clases Service ni repositorios JPA ajenos.
- [ ] **F17-BE-03** Integrar los casos de uso de las tareas de origen con transacciones, autorización por recurso y tratamiento de fallos. Donde aplique, notificación persistida junto al negocio y entrega externa posterior al commit.
- [ ] **F17-BE-04** No implementar ni activar proveedor productivo durante MVP: cerrar decisiones y flags de forma independiente antes de ejecutar esta feature opcional.

### Interfaces de entrada e implementaciones

Esta tabla concreta la separación del ejemplo del usuario: cada nombre base origina una interfaz `<Nombre>UseCase` en `application/usecase/` y una clase `<Nombre>Service implements <Nombre>UseCase` en `application/service/`, dentro del módulo indicado. Son nombres previstos de contratos, no endpoints nuevos ni prueba de implementación. Conservar responsabilidades y dependencias de las tareas de origen; sus nombres de servicio agrupado se descomponen conforme a esta tabla.

| Módulo | Interfaz de entrada | Implementación |
|---|---|---|
| `descubrimiento` | `ConsultarMapaPrestadoresUseCase` | `ConsultarMapaPrestadoresService` |

Puertos de salida previstos: ConsultaPrestadoresPublicosPort y RepresentacionGeograficaPort sin dirección exacta. Los repositorios siguen siendo contratos en `domain/repository/`; los puertos externos/consultas requeridos por aplicación van en `application/port/`, con adaptadores de infraestructura. No crear un puerto adicional cuando ya exista un contrato público equivalente.

Controllers reciben UseCase por constructor y convierten Request/Response mediante mapper de presentación. Commands/Queries/Results de aplicación no contienen objetos HTTP o JPA. Excepciones de negocio en `domain/exception/`; wiring/transacciones en infraestructura/configuración. Ver [árbol completo y reglas](../04-estructura-y-casos-de-uso.md).

Mantener flag OFF y condición de aprobación de esta feature; la tabla no autoriza activación de proveedores.

### Tareas existentes del plan fuente

Conservar el orden por fases y las dependencias `Txxx` del documento de origen; una referencia `SPEC-n/Txxx` se interpreta como `Fn-Txxx`. Las rutas de origen son relativas a `backend/`. Si una tarea habla de crear una tabla ya incluida en V1–V6, se verifica/reutiliza esa tabla en lugar de crearla de nuevo. Si hace referencia a entidades de notificación puntuales, adaptar al módulo y tabla unificados.

- [ ] **F17-T001** Feature flag OFF.
- [ ] **F17-T002** Definir contrato `RepresentacionZonaService`.
- [ ] **F17-T003** No añadir FK/coordenadas de dirección exacta.
- [ ] **F17-T004** Tests disabled/enabled.
- [ ] **F17-T005** Test de privacidad de DTO.
- [ ] **F17-T006** Implementar read model reutilizando filtros de SPEC-03.
- [ ] **F17-T007** Omitir Prestadores sin zona aproximada válida.
- [ ] **F17-T008** Implementar agrupación que no incremente precisión en zonas con pocos Prestadores.
- [ ] **F17-T009** Endpoint.

### Contratos API de origen

`GET /api/v1/descubrimiento/mapa?categoria=&zona=` → lista de representaciones aproximadas, solo para Cliente y feature habilitada.


## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F17-FE-01** Alternar lista/mapa con filtros compartidos, accesibilidad equivalente por lista.
- [ ] **F17-FE-02** Usar centroide/polígono autorizado de zona, nunca geocodificar dirección exacta.
- [ ] **F17-FE-03** Seleccionar punto abre perfil público; proveedor caído conserva búsqueda por lista.

Aplicar [estados y contrato de cliente](../01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación

- [ ] **F17-QA-01** DTO y proveedor no reciben dirección exacta; niveles de zoom no aumentan precisión autorizada.
- [ ] **F17-QA-02** Filtros de mapa equivalen al descubrimiento y roles válidos.
- [ ] **F17-QA-03** Flag OFF no carga SDK cartográfico ni afecta lista.
- [ ] **F17-QA-04** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Requisitos y criterios de éxito de origen

Los identificadores FR/SC son locales al SPEC: deben referenciarse como SPEC-17/FR-xxx y SPEC-17/SC-xxx.

- **FR-087**: El sistema PUEDE proporcionar un mapa visual de Prestadores, utilizando exclusivamente el nivel de precisión de ubicación autorizado por las reglas de privacidad de `spec-02` (UC013), y DEBE permanecer deshabilitado sin afectar el descubrimiento base (`spec-02`) mientras no exista aprobación explícita. [UC087]
- **SC-001**: El 100% de las representaciones geográficas del mapa respeta la precisión de ubicación autorizada y no revela dirección exacta sin autorización, en el 100% de los casos de prueba.
- **SC-002**: La desactivación del mapa no impide completar el descubrimiento de Prestadores por lista/filtros definido en `spec-02`.
