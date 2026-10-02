# Implementation Plan: ALIADO — Plataforma para trabajadores independientes en Santa Marta

**Date**: 2026-09-18 **Spec**: `spec-01` a `spec-20` (7 diagramas UC-01 a UC-07, 93 casos de uso)

## Summary

ALIADO es una plataforma que conecta Clientes con Prestadores de servicios técnicos a domicilio en Santa Marta, para resolver la gestión fragmentada de oportunidades comerciales identificada en `Planteamiento-del-problema.md` y confirmada mediante entrevistas. El enfoque técnico seleccionado (Sección 4.4 de la plantilla del capstone) es: backend único en Java/Spring Boot con arquitectura **modular por dominio, cada módulo organizado en capas**, expuesto como API REST; cliente móvil multiplataforma (React Native) para Cliente y Prestador; panel web (React) exclusivo para Administrador.

## Technical Context

> Los valores marcados como (propuesta) son una decisión inicial del equipo a validar, no algo ya cerrado con el profesor. Los marcados `[NEEDS CLARIFICATION]` dependen de vacíos ya señalados en los SPEC (ej. `spec-13`) o de decisiones de negocio aún no tomadas.

**Language/Version**: Java 21 (LTS) (propuesta) **Primary Dependencies**: Spring Boot 3.3.x — Spring Web, Spring Data JPA, Spring Security, Spring Validation, springdoc-openapi (documentación OpenAPI/Swagger), Flyway (migraciones de esquema) (propuesta) **Build tool**: Maven (confirmado) **Storage**: PostgreSQL 16 **Testing**: JUnit 5 + Mockito (unitarias); Spring Boot Test + Testcontainers con PostgreSQL real (integración) (propuesta) **Target Platform**: VPS Hostinger (confirmado), Linux Ubuntu 24.04, desplegado con Docker Compose (backend + PostgreSQL + reverse proxy Nginx). Plan de referencia: VPS KVM de Hostinger desde aprox. USD 4.99–6.49/mes, con panel de gestión propio y soporte de plantillas preconfiguradas; se recomienda el nivel con al menos 4 GB de RAM para que la JVM y PostgreSQL convivan en la misma máquina sin degradar el rendimiento. [NEEDS CLARIFICATION: plan específico de Hostinger a contratar (RAM/CPU/almacenamiento) y región del datacenter más cercana a Colombia disponible en su catálogo] **Project Type**: Web + Mobile — backend API único, consumido por app móvil (React Native, Cliente/Prestador) y panel web (React, Administrador) **Performance Goals**: (propuesta inicial, sujeta a ajuste una vez se prueben con datos reales) p95 < 300 ms en endpoints de lectura del tablero de oportunidades (`spec-06`) y del descubrimiento de prestadores (`spec-03`) bajo la carga del piloto. Relacionado con RNF-003, aún sin umbral numérico oficial (ver `[NEEDS CLARIFICATION]` heredado). **Constraints**: los 10 RNF ya definidos en la Sección 4.1 de la plantilla del capstone (RNF-001 a RNF-010): disponibilidad con conectividad débil, usabilidad para baja alfabetización digital, seguridad/privacidad de ubicación, auditoría, integridad transaccional, notificaciones casi en tiempo real, escalabilidad, compatibilidad con gama media/baja, cumplimiento Ley 1581 de 2012. **Scale/Scope**: (propuesta, solo para dimensionar el piloto académico, no una proyección real de mercado) ~50–100 Prestadores y ~200–500 Clientes registrados durante la validación del semestre. [NEEDS CLARIFICATION: cifra real de usuarios objetivo, si se define alguna meta de adopción para la sustentación]

## Project Structure

### Documentation (this feature)

```text
09-Documentacion/
├── plan.md                          # Este archivo — arquitectura general del sistema
└── specs/
    ├── spec-01-autenticacion-registro-control-acceso.md
    ├── spec-02-gestion-perfil-privacidad.md
    ├── ...                          # spec-03 a spec-20
    └── spec-20-pasarela-pagos-futura.md
```

### Source Code (repository root)

**Structure Decision**: Monolito modular en un único deployable Spring Boot, organizado por **módulo de dominio** (uno por cada agrupación temática de SPEC), y dentro de cada módulo, separación estricta en **capas** (`controller` → `service` → `repository` → `model`/`dto`). Se eligió monolito modular (no microservicios) porque el equipo es pequeño, el plazo es un semestre, y las 7 áreas de dominio comparten la misma base de datos relacional sin necesidad de escalado independiente todavía (ver Alternativa C, Sección 4.4 de la plantilla del capstone). Un monolito modular también simplifica el despliegue en un único VPS Hostinger, en lugar de requerir orquestación de múltiples servicios.

```text
backend/
├── src/main/java/com/ALIADO/
│   ├── auth/                        # spec-01: autenticación, registro, control de acceso
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── model/
│   │   └── dto/
│   ├── perfil/                      # spec-02: gestión de perfil y privacidad
│   │   ├── controller/ ...
│   ├── descubrimiento/              # spec-03, spec-04: descubrimiento + solicitudes
│   │   ├── controller/ ...
│   ├── prestador/                   # spec-05, spec-06: perfil profesional + oportunidades
│   │   ├── controller/ ...
│   ├── propuestas/                  # spec-07, spec-08, spec-09: propuestas, contratación, notificaciones
│   │   ├── controller/ ...
│   ├── confianza/                   # spec-10, spec-11, spec-12: calificaciones, reportes, administración
│   │   ├── controller/ ...
│   ├── formalizacion/               # spec-13, spec-14: ruta de formalización, preferencias/historial
│   │   ├── controller/ ...
│   ├── futuro/                      # spec-15 a spec-20: capacidades Could/Future, deshabilitadas por defecto
│   │   ├── controller/ ...
│   └── common/                      # infraestructura compartida: seguridad, manejo de errores, auditoría
│       ├── config/
│       ├── security/
│       └── exception/
└── src/test/java/com/ALIADO/
    ├── auth/ ...                    # un paquete de test espejo por módulo
    └── ...

app-movil/                           # React Native — Cliente y Prestador
├── src/
│   ├── screens/
│   ├── components/
│   ├── services/                    # clientes HTTP hacia el backend
│   └── navigation/
└── tests/

panel-admin/                         # React — Administrador (spec-12)
├── src/
│   ├── pages/
│   ├── components/
│   └── services/
└── tests/
```

### Tabla de trazabilidad módulo ↔ SPEC ↔ diagrama

|Módulo (backend)|SPEC|Diagrama|Prioridad|
|---|---|---|---|
|`auth`|SPEC-01|UC-01|P1|
|`perfil`|SPEC-02|UC-01|P1|
|`descubrimiento`|SPEC-03, SPEC-04|UC-02|P1|
|`prestador`|SPEC-05, SPEC-06|UC-03|P1|
|`propuestas`|SPEC-07, SPEC-08, SPEC-09|UC-04|P1|
|`confianza`|SPEC-10, SPEC-11, SPEC-12|UC-05|P1–P2|
|`formalizacion`|SPEC-13, SPEC-14|UC-06|P1–P2|
|`futuro`|SPEC-15 a SPEC-20|UC-07|P2–P4, deshabilitado por defecto|

---

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 Crear el repositorio backend con estructura de paquetes `com.ALIADO.*` según la estructura anterior
- [ ] T002 Inicializar proyecto Maven con Spring Boot 3.3.x, Spring Web, Spring Data JPA, Spring Security, Flyway
- [ ] T003 Configurar Docker Compose local (backend + PostgreSQL 16) para desarrollo, replicable en el VPS Hostinger
- [ ] T004 Configurar linting/formato (Checkstyle o Spotless) y `springdoc-openapi` para documentación automática de la API
- [ ] T005 Inicializar proyecto React Native (`app-movil`) y proyecto React (`panel-admin`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**CRITICAL**: ningún módulo de dominio puede iniciarse antes de completar esta fase.

- [ ] T006 Configurar esquema base de PostgreSQL y framework de migraciones (Flyway) — `common`
- [ ] T007 Implementar el módulo `auth` completo (SPEC-01): registro, login, logout, recuperación, control de acceso por rol — es prerrequisito de todos los demás módulos
- [ ] T008 Configurar Spring Security (JWT o sesión — pendiente de decidir) integrado con `auth`
- [ ] T009 Configurar manejo de errores global y logging estructurado — `common/exception`
- [ ] T010 Configurar gestión de variables de entorno (perfiles `dev`/`prod`, credenciales del VPS Hostinger fuera del repositorio) — `common/config`
- [ ] T011 Implementar el módulo `perfil` (SPEC-02): datos básicos, separación zona aproximada/dirección exacta (RNF-004) — usado transversalmente por `descubrimiento`, `prestador` y `confianza`

**Checkpoint**: con `auth` + `perfil` completos, cualquier módulo de dominio puede empezar a implementarse en paralelo.

---

## Phase 3: Módulo `descubrimiento` (UC-02, SPEC-03/04) — Priority P1

**Goal**: permitir que el Cliente publique solicitudes y descubra Prestadores compatibles.

**Independent Test**: un Cliente autenticado publica una solicitud con categoría y zona, y el sistema la deja visible para Prestadores compatibles (ver Phase 4).

- [ ] T012 [P] Modelo `Solicitud` y `Categoria`/`Zona` (catálogo administrable, SPEC-12) — `descubrimiento/model`
- [ ] T013 [P] Servicio de publicación y edición de solicitudes (incluye manejo de borradores — edge case de categoría desactivada) — `descubrimiento/service`
- [ ] T014 Endpoints REST de descubrimiento y solicitudes — `descubrimiento/controller`
- [ ] T015 Validaciones y manejo de errores específicos del módulo

**Checkpoint**: un Cliente puede publicar, editar y consultar sus propias solicitudes de forma independiente.

---

## Phase 4: Módulo `prestador` (UC-03, SPEC-05/06) — Priority P1

**Goal**: perfil profesional del Prestador y tablero de oportunidades con matching por categoría/zona.

**Independent Test**: un Prestador configura categorías y zonas de cobertura, y ve en su tablero las solicitudes compatibles publicadas en `descubrimiento`.

- [ ] T016 [P] Modelo `PerfilProfesional`, `CategoriaOfrecida`, `ZonaCobertura` — `prestador/model`
- [ ] T017 Servicio de matching (recalculo de compatibilidad — edge case de categoría/zona eliminada mientras hay oportunidad visible) — `prestador/service`
- [ ] T018 Endpoints de perfil profesional y tablero de oportunidades — `prestador/controller`
- [ ] T019 Validación de elegibilidad en el momento de cotizar (no solo al mostrar el tablero)

**Checkpoint**: el tablero de un Prestador refleja siempre su configuración de perfil vigente, no una copia desactualizada.

---

## Phase 5: Módulo `propuestas` (UC-04, SPEC-07/08/09) — Priority P1

**Goal**: ciclo de vida completo de una propuesta: creación, contratación, ejecución y finalización del servicio, con notificaciones asociadas.

**Independent Test**: un Prestador cotiza una oportunidad, el Cliente la acepta, y el servicio recorre sus estados hasta "finalizado" de forma trazable (RNF-006, integridad transaccional).

- [ ] T020 [P] Modelos `Propuesta` y `Servicio` (máquina de estados) — `propuestas/model`
- [ ] T021 Servicio de transición de estados atómico (propuesta → contratación → ejecución → finalización) — `propuestas/service`
- [ ] T022 Servicio de notificaciones desacoplado (preferencias configurables, RNF-007) — `propuestas/service`
- [ ] T023 Endpoints de propuestas y ciclo de vida del servicio — `propuestas/controller`

**Checkpoint**: ningún servicio puede quedar en un estado intermedio inconsistente ante un fallo o reintento.

---

## Phase 6: Módulo `confianza` (UC-05, SPEC-10/11/12) — Priority P1–P2

**Goal**: calificaciones, reseñas, verificación de Prestadores, reportes y su moderación administrativa.

**Independent Test**: un Cliente califica un servicio finalizado (recalcula reputación automáticamente); un reporte generado en cualquier módulo llega a la cola de moderación del Administrador y sigue el flujo cola → detalle → resolución sin saltarse pasos.

- [ ] T024 [P] Modelos `Calificacion`, `Reputacion`, `Reporte`, `Evidencia` — `confianza/model`
- [ ] T025 Servicio de recálculo automático de reputación (`<<include>>`, SPEC-10) — `confianza/service`
- [ ] T026 Servicio de cola de moderación con validación de secuencia obligatoria (SPEC-12, UC070→071→072) — `confianza/service`
- [ ] T027 Endpoints de calificaciones, reportes y panel de moderación (consumidos por `panel-admin`) — `confianza/controller`
- [ ] T028 Servicio de bloqueo preventivo y auditoría de acciones administrativas (RNF-005) — `confianza/service`

**Checkpoint**: ningún reporte puede resolverse sin haber pasado por revisión de detalle.

---

## Phase 7: Módulo `formalizacion` (UC-06, SPEC-13/14) — Priority P1–P2

**Goal**: ruta orientativa de formalización, preferencias, historial de trabajos e indicadores del Prestador.

**Independent Test**: un Prestador consulta su historial de trabajos y sus indicadores básicos (conectado directamente con la necesidad expresada en las entrevistas).

- [ ] T029 [P] Modelo `HistorialTrabajo`, `IndicadorBasico`, `PreferenciaNotificacion` — `formalizacion/model`
- [ ] T030 Servicio de cálculo de indicadores (política de inclusión/exclusión de servicios cancelados/moderados — `[NEEDS CLARIFICATION]` heredado de SPEC-14) — `formalizacion/service`
- [ ] T031 Endpoints de ruta de formalización, historial e indicadores — `formalizacion/controller`

> Bloqueo conocido: el módulo `formalizacion` no puede completar la funcionalidad de "mostrar progreso" (SPEC-13, UC079) hasta resolver el vacío ya señalado: no existe un CU que defina cómo se declara/calcula ese progreso. Este vacío debe resolverse antes de estimar tiempo real para T029–T031, no durante la implementación.

**Checkpoint**: el historial y los indicadores de un Prestador son reproducibles a partir de los mismos datos de entrada.

---

## Phase 8: Módulo `futuro` (UC-07, SPEC-15 a 20) — Priority P2–P4, deshabilitado por defecto

**Goal**: dejar la estructura lista para capacidades Could/Future sin comprometerlas en el MVP.

**Independent Test**: con el módulo `futuro` completamente deshabilitado, todos los módulos anteriores (Phases 3 a 7) funcionan sin ninguna dependencia hacia él.

- [ ] T032 Definir mecanismo de feature flags para habilitar/deshabilitar cada capacidad Could/Future de forma independiente — `common/config`
- [ ] T033 [P] Estructura base (sin lógica de negocio final) para chat interno, soporte WhatsApp, onboarding asistido, mapa visual, insignia, referidos, idiomas, pasarela de pago — `futuro/*`

**Checkpoint**: apagar todos los feature flags de `futuro` no rompe ninguna prueba de los módulos P1.

---

## Phase 9: Polish & Cross-Cutting Concerns

- [ ] T034 Pruebas de integración con Testcontainers sobre los flujos críticos (registro→autenticación, solicitud→matching→propuesta→servicio, reporte→moderación)
- [ ] T035 Documentación OpenAPI completa y publicada
- [ ] T036 Endurecimiento de seguridad (RNF-004, RNF-010): revisión de cifrado en tránsito/reposo y cumplimiento Ley 1581
- [ ] T037 Pruebas de carga básicas contra los objetivos de rendimiento propuestos (Technical Context)
- [ ] T038 Despliegue en el VPS Hostinger vía Docker Compose (backend + PostgreSQL + Nginx como proxy inverso con certificado TLS)

---

## Dependencies & Execution Order

- **Setup (Phase 1)** → sin dependencias.
- **Foundational (Phase 2)**: `auth` y `perfil` — bloquea todas las fases 3 a 8.
- **Phases 3 a 7 (P1/P2)**: pueden avanzar en paralelo tras Phase 2, en el orden de prioridad P1 → P2 si el equipo no puede paralelizar (recomendado dado que son pocos integrantes): `descubrimiento` → `prestador` → `propuestas` → `confianza`/`formalizacion`.
- **Phase 8 (`futuro`)**: puede iniciarse en cualquier momento después de Phase 2, ya que no bloquea ni es bloqueada por las fases P1.
- **Phase 9 (Polish)**: depende de que las fases P1 estén completas.

## Notes

- Cada módulo respeta estrictamente la separación en capas (`controller` → `service` → `repository` → `model`), sin que una capa superior acceda directamente a una capa inferior distinta de la inmediata.
- Los `[NEEDS CLARIFICATION]` y bloqueos heredados de los SPEC (especialmente el de `spec-13`/`spec-18`) deben resolverse antes de comenzar la fase correspondiente, no durante la implementación.
- Los valores marcados como "(propuesta)" en Technical Context deben confirmarse con el equipo antes de iniciar Phase 1.
- El plan específico de Hostinger (RAM/CPU/almacenamiento/región) queda pendiente de confirmar; T038 no debe ejecutarse hasta cerrarlo.