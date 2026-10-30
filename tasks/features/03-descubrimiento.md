# F03 — Descubrimiento y perfil público

**Alcance:** MVP. **Estado:** planificado, sin implementación.
**Dependencias:** 01 04 05 10.publico. **Decisiones relacionadas:** D-02 D-03 (ver [registro](../03-decisiones-y-dependencias.md)).

## Resultado esperado

Búsqueda por categoría y zona y consulta directa del perfil público, exclusiva de Cliente.

## Fuentes y trazabilidad

- [SPEC original](../fuentes/specs/spec-03-descubrimiento-prestadores.md): historias, escenarios, requisitos y criterios de éxito.
- [Plan de origen](../fuentes/planes/plan-spec-03-descubrimiento.md): fases, tareas y dependencias detalladas.
- [Manual de datos](../fuentes/manual-base-de-datos-aliado.md), [modelo PDF](../fuentes/modelo-logico-ALIADO.pdf) y [reglas transversales](../01-arquitectura-y-stack.md).

Los IDs `F03-Txxx` conservan el identificador Txxx de origen, ahora con prefijo para evitar colisiones entre SPEC. No implican que el trabajo ya exista. Las tareas adicionales DB/BE/FE/QA desglosan integración y clientes, sin reemplazar requisitos. Las correcciones explícitas de 03 prevalecen sobre notas antiguas del plan fuente; no implementar tablas puntuales de notificaciones ni JWT por copiar una referencia.

## Historias cubiertas

- User Story 1 - Buscar y explorar prestadores [UC014, UC015] (Priority: P1)

## Base de datos

- [ ] **F03-DB-01** No crear tablas propias: consultar modelos existentes mediante contratos del módulo propietario y proyecciones autorizadas; cualquier columna adicional exige registrar migración y decisión.
- [ ] **F03-DB-02** Verificar planes de consulta e índices de las tablas consultadas con dataset representativo; no duplicar fuentes de verdad.

## Backend — integración y arquitectura

- [ ] **F03-BE-01** Concretar los contratos de F03 en OpenAPI: DTO request/response, validación, rol, propiedad, paginación, errores e idempotencia, conservando endpoints fuente salvo decisión explícita.
- [ ] **F03-BE-02** Definir las interfaces `application/usecase/*UseCase` y sus implementaciones `application/service/*Service implements *UseCase` según la tabla de esta feature. Inyectar solo interfaces por constructor en controladores/filtros/worker. Service usa dominio y puertos; ninguna dependencia hacia Spring/JPA/HTTP/adaptadores concretos. Llamadas entre módulos mediante interfaces públicas, nunca clases Service ni repositorios JPA ajenos.
- [ ] **F03-BE-03** Integrar los casos de uso de las tareas de origen con transacciones, autorización por recurso y tratamiento de fallos. Donde aplique, notificación persistida junto al negocio y entrega externa posterior al commit.

### Interfaces de entrada e implementaciones

Esta tabla concreta la separación del ejemplo del usuario: cada nombre base origina una interfaz `<Nombre>UseCase` en `application/usecase/` y una clase `<Nombre>Service implements <Nombre>UseCase` en `application/service/`, dentro del módulo indicado. Son nombres previstos de contratos, no endpoints nuevos ni prueba de implementación. Conservar responsabilidades y dependencias de las tareas de origen; sus nombres de servicio agrupado se descomponen conforme a esta tabla.

| Módulo | Interfaz de entrada | Implementación |
|---|---|---|
| `descubrimiento` | `BuscarPrestadoresUseCase` | `BuscarPrestadoresService` |
| `descubrimiento` | `ConsultarPerfilPublicoUseCase` | `ConsultarPerfilPublicoService` |

Puertos de salida previstos: ConsultaPerfilesPublicosPort, ConsultaConfianzaPort y consultas públicas del catálogo. Los repositorios siguen siendo contratos en `domain/repository/`; los puertos externos/consultas requeridos por aplicación van en `application/port/`, con adaptadores de infraestructura. No crear un puerto adicional cuando ya exista un contrato público equivalente.

Controllers reciben UseCase por constructor y convierten Request/Response mediante mapper de presentación. Commands/Queries/Results de aplicación no contienen objetos HTTP o JPA. Excepciones de negocio en `domain/exception/`; wiring/transacciones en infraestructura/configuración. Ver [árbol completo y reglas](../04-estructura-y-casos-de-uso.md).

### Tareas existentes del plan fuente

Conservar el orden por fases y las dependencias `Txxx` del documento de origen; una referencia `SPEC-n/Txxx` se interpreta como `Fn-Txxx`. Las rutas de origen son relativas a `backend/`. Si una tarea habla de crear una tabla ya incluida en V1–V6, se verifica/reutiliza esa tabla en lugar de crearla de nuevo. Si hace referencia a entidades de notificación puntuales, adaptar al módulo y tabla unificados.

- [ ] **F03-T001** Crear el paquete `descubrimiento/` con sus subcarpetas (`controller`, `service`, `dto`)
- [ ] **F03-T002** Definir fixtures/mocks de `PerfilProfesional`, `Reputacion` y catálogo de `Categoria`/`Zona` para poder probar este módulo antes de que existan SPEC-05/06, SPEC-10 y SPEC-12
- [ ] **F03-T003** [P] [US1] Contract tests `GET /descubrimiento/prestadores` (con y sin resultados), `GET /descubrimiento/prestadores/{id}/perfil` (200, 404) — `tests/contract/test_descubrimiento.java`
- [ ] **F03-T004** [P] [US1] Integration test: búsqueda con resultados, búsqueda sin resultados, perfil desde búsqueda, perfil directo, perfil no disponible, actor no autorizado — `tests/integration/test_descubrimiento.java` (sobre fixtures mientras SPEC-05/06/10/12 no existan)
- [ ] **F03-T005** [P] [US1] DTO `PrestadorPublicoDTO` y `CriterioBusqueda` — `descubrimiento/application/dto`
- [ ] **F03-T006** [US1] `DescubrimientoService.buscar(categoria, zona)` — consulta cross-módulo (depends on T002; depends en producción de los repositorios reales de SPEC-05/06, SPEC-10, SPEC-12)
- [ ] **F03-T007** [US1] `DescubrimientoService.consultarPerfilPublico(id)` — mapeo único reutilizado tanto desde búsqueda como desde acceso directo, garantizando SC-002
- [ ] **F03-T008** [US1] Reutilizar el interceptor de autorización por rol de SPEC-01 (T018) para restringir ambos endpoints a Cliente
- [ ] **F03-T009** [US1] Endpoints `GET /prestadores`, `GET /prestadores/{id}/perfil` — `descubrimiento/presentation/controller`

### Contratos API de origen

| Método | Endpoint | Request | Respuesta éxito | Errores |
|---|---|---|---|---|
| GET | `/api/v1/descubrimiento/prestadores?categoria=&zona=` | query params | `200 [PrestadorPublicoDTO, ...]` *(lista vacía si no hay coincidencias, nunca error)*; si la categoría/zona no existe en el catálogo, `200` con `sugerencias: [...]` en vez de rechazar la solicitud | `403` si el actor no tiene rol Cliente |
| GET | `/api/v1/descubrimiento/prestadores/{id}/perfil` | — | `200 PrestadorPublicoDTO` *(idéntico sin importar si se llegó por búsqueda o por acceso directo — un único mapeo)* | `404` detalle no disponible (perfil incompleto, oculto o inexistente — mismo mensaje genérico para los tres casos); `403` si el actor no tiene rol Cliente |


## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F03-FE-01** Lista de Prestadores con filtros de catálogos servidos por API, paginación y restablecimiento de filtros.
- [ ] **F03-FE-02** Detalle público accesible desde resultados y enlace directo con el mismo DTO de exposición.
- [ ] **F03-FE-03** Mostrar portafolio, cobertura, reputación y verificación solo cuando estén disponibles; conectar confianza al completar F10.
- [ ] **F03-FE-04** Mostrar sin resultados o detalle no disponible sin revelar si hubo bloqueo o privacidad.

Aplicar [estados y contrato de cliente](../01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación

- [ ] **F03-QA-01** Contrato idéntico al consultar desde lista o enlace directo y a la vista previa del Prestador.
- [ ] **F03-QA-02** Datos de distintos clientes/prestadores para comprobar rol, cobertura y privacidad.
- [ ] **F03-QA-03** Medir p95 < 300 ms con el dataset del piloto.
- [ ] **F03-QA-04** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Requisitos y criterios de éxito de origen

Los identificadores FR/SC son locales al SPEC: deben referenciarse como SPEC-03/FR-xxx y SPEC-03/SC-xxx.

- **FR-014**: El sistema DEBE permitir que un Cliente busque prestadores filtrando por categoría de servicio y zona, devolviendo únicamente prestadores cuya zona de cobertura declarada coincida, sin revelar direcciones exactas ni concederla a otros roles. _(UC014)_
- **FR-015**: El sistema DEBE permitir que un Cliente consulte el perfil público de un prestador, tanto desde un resultado de búsqueda (extensión de UC014) como por acceso directo, mostrando en ambos casos la misma información pública y sin exponer datos privados del prestador ni concederla a otros roles. _(UC015)_
- **SC-001**: El 100% de las búsquedas ejecutadas por un Cliente devuelve únicamente prestadores que coinciden con la categoría y zona indicadas, sin exponer ubicación exacta.
- **SC-002**: El 100% de las consultas de perfil, sin importar si se originan desde una búsqueda o de forma directa, muestra la misma información pública y ninguna información privada.
- **SC-003**: El 100% de los intentos de búsqueda o consulta de perfil por un actor sin rol Cliente es denegado.
- **SC-004**: Ante un perfil sin información pública disponible, el sistema informa la falta de detalle en el 100% de los casos sin revelar la causa específica.
- **SC-005**: [NEEDS CLARIFICATION: definir] catálogo válido de categorías y zonas, y la política de coincidencia (exacta, parcial, por cercanía) antes de implementar.
