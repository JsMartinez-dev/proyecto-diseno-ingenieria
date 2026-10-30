# F00 — Fundación técnica, datos y clientes

Estado: pendiente. Estas tareas son planificación, no implementación ejecutada.

## Decisiones y trazabilidad

- [ ] **F00-DEC-01** Resolver D-01: registrar parent/BOM Spring Boot, Java 21, Maven, React Native/React/Node y herramientas; documentar diferencias con backend-rifas antes de generar proyectos.
- [ ] **F00-DEC-02** Resolver D-14: buscar scripts SQL V1–V6; si faltan, aprobar reconstrucción y registrar qué restricciones se deducen o añaden. No atribuir scripts reconstruidos al esquema original.
- [ ] **F00-DEC-03** Definir OpenAPI inicial, convenciones de UUID/fechas/errores/paginación; matriz de rol y propietario de recursos; aprobar decisiones D-04 y D-18 para sesión/idempotencia.

## Backend e infraestructura local

- [ ] **F00-BE-01** Inicializar backend/ con Maven Wrapper, Java 21, package com.aliado y perfiles dev/test/prod; añadir dependencias conforme 01-arquitectura-y-stack.md y D-01.
- [ ] **F00-BE-02** Crear estructura por módulo según 04-estructura-y-casos-de-uso.md: UseCase como interfaz y Service como implementación; wiring en common/config o infraestructura. Verificar constructores de controllers/filtros contra interfaces y prohibir Spring/JPA/HTTP en dominio/aplicación y adaptadores en servicios.
- [ ] **F00-BE-03** Configurar errores HTTP estándar, Bean Validation, mappers y traceId; conservar status de specs. No exponer stacktraces ni entidades JPA.
- [ ] **F00-BE-04** Configurar seguridad deny-by-default, CORS por entorno, rate limits de acceso y transporte de sesión; contrato puro SesionAutenticada en auth/application/port, adaptador técnico y filtro que consume ResolverSesionUseCase.
- [ ] **F00-BE-05** Implementar infraestructura de idempotencia según D-18 con actor/operación/payload y transacción; probar carrera de dos comandos y registro antes de autenticación.
- [ ] **F00-BE-06** Definir puertos storage/correo/notificaciones y seguridad/huella/generación aleatoria, sus adaptadores y fake de desarrollo y configuración por entorno; correo capturado localmente, sin fingir entrega productiva.
- [ ] **F00-BE-07** Crear compose local PostgreSQL 16, MinIO y capturador de correo con volúmenes/healthchecks; .env.example sin secretos y guía de arranque.
- [ ] **F00-BE-08** Configurar Actuator restringido, logging estructurado sanitizado y métricas de API/pool/worker; separar liveness/readiness.
- [ ] **F00-BE-09** Configurar CI con compile, unit/contract/integration sobre PostgreSQL Testcontainers, validación Flyway, verificación arquitectura y análisis de dependencias; publicar JAR/imagen sin desplegar automáticamente a producción.

## Base de datos

- [ ] **F00-DB-01** Crear base/esquema y roles migración/aplicación con privilegio mínimo, variables de conexión y volumen; probar acceso privado y PostgreSQL 16.
- [ ] **F00-DB-02** Aplicar recuperación/reconstrucción de V1–V6 en orden de 02-base-de-datos.md; crear tablas padre antes que FK y no repetir tablas compartidas.
- [ ] **F00-DB-03** Definir CHECK/UNIQUE/default/ON DELETE/índices y triggers a partir de DDL verificado o decisiones registradas; crear pruebas por cada regla de integridad de 02.
- [ ] **F00-DB-04** Versionar seeds de catálogo aprobados y fixtures ficticios aislados por entorno; primer Administrador por comando/proceso controlado sin contraseña embebida.
- [ ] **F00-DB-05** Configurar ddl-auto=validate y Flyway validate; probar creación desde cero, reinicio y upgrade con datos preservados; documentar checksums sin repair forzado.
- [ ] **F00-DB-06** Exportar snapshot de schema/diccionario tras migración y verificar inventario de 42 tablas; documentar por separado migraciones aditivas de decisiones aprobadas.

## Frontend compartido

- [ ] **F00-FE-01** Inicializar frontend/app-movil con React Native/TypeScript y frontend/panel-admin con React/TypeScript; builds reproducibles y lockfiles según D-01.
- [ ] **F00-FE-02** Organizar features, navegación Cliente/Prestador y rutas Administrador; adaptar patrones de demo-exp_ing a móvil/panel sin transportar identidad simulada.
- [ ] **F00-FE-03** Crear componentes de formulario, feedback, estados vacíos/error/carga, confirmaciones y accesibilidad; fijar vocabulario y diseño reutilizable.
- [ ] **F00-FE-04** Crear cliente API compartido y contratos desde OpenAPI, manejo de errores/401/403/404/409, cancelación de consultas y paginación acordada.
- [ ] **F00-FE-05** Implementar sesión segura móvil y panel, restauración/reautenticación según D-04 y limpieza de datos de usuario al salir/cambiar cuenta.
- [ ] **F00-FE-06** Gestionar intención de comando e Idempotency-Key persistible durante reintento; no guardar documentos sensibles ni tokens en caches inseguros; prueba offline → reconexión.
- [ ] **F00-FE-07** Separar fixtures de referencia y adapters API reales; construir entornos dev/test/piloto y flags Could/Future OFF de servidor y cliente.
- [ ] **F00-FE-08** Configurar typecheck/lint, pruebas de interacción accesible y builds de cada cliente; herramienta E2E web y móvil seleccionada/documentada según runtime.

## Aceptación H0

- [ ] **F00-QA-01** En checkout limpio seguir README de backend/clientes y levantar dependencias locales sin pasos ocultos ni secretos reales.
- [ ] **F00-QA-02** Comprobar 42 tablas contra diccionario, validar migraciones y pruebas PostgreSQL, no solo compilación/H2.
- [ ] **F00-QA-03** Verificar reglas de dependencias UseCase/Service/puertos/mappers y transacciones sobre PostgreSQL real. Los dos clientes acceden al endpoint de salud/API de desarrollo; error y sesión expirada se renderizan sin exponer datos; CI backend/frontend verde.
