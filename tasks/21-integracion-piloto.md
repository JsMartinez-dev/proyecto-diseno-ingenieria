# F21 — Integración, calidad y preparación del piloto

Estado: pendiente. Estas tareas son planificación, no implementación ejecutada.

## Integración de recorridos

- [ ] **F21-E2E-01** Cliente y Prestador en sesiones/dispositivos independientes: registro → perfil → solicitud → oportunidad → propuesta → aceptar → ejecutar → terminar → confirmar → calificar/reseñar → historial/exportación.
- [ ] **F21-E2E-02** Administrador en panel: revisar reportes de reseña/cuenta/servicio con evidencia → resolver/descartar con motivo → moderar contenido → bloquear/desbloquear → consultar auditoría; verificación según D-11.
- [ ] **F21-E2E-03** Probar registro, sesión vencida, recuperación real, privacidad, solicitud de eliminación y bloqueo por servicio activo; completar integración diferida F02/F08.
- [ ] **F21-E2E-04** Interrumpir red antes/después del commit, reintentar mismos comandos y recargar clientes; comprobar una única operación lógica y notificación.
- [ ] **F21-E2E-05** Forzar aceptación simultánea, resolución concurrente, calificación duplicada y caída correo/storage/push; comprobar rollback, compensación y recuperación.
- [ ] **F21-E2E-06** Verificar que las funciones F15–F20 y UC080 apagadas no aparecen ni pueden invocarse; MVP completo sin providers opcionales.

## Rendimiento, seguridad y experiencia

- [ ] **F21-QA-01** Medir p95 de login/perfil/descubrimiento <300 ms bajo carga piloto; lecturas <=500 ms y comandos <=800 ms como objetivos provisionales del general hasta fijar RNF-003. Registrar hardware, dataset, concurrencia y medición.
- [ ] **F21-QA-02** Revisar planes SQL N+1/paginación/índices con EXPLAIN ANALYZE; medir backlog del worker, tiempos de entrega y uso de recursos con los dos clientes.
- [ ] **F21-QA-03** Probar API directamente con roles y propietarios ajenos, links/URLs firmadas vencidos, token revocado, datos públicos, uploads falsos y logs; guards UI por sí solos no acreditan autorización.
- [ ] **F21-QA-04** Validar accesibilidad y usabilidad de formularios, navegación, feedback, conflictos y conexión intermitente en app/panel; anotar evidencia y problemas corregidos.
- [ ] **F21-QA-05** Escanear dependencias y artefactos sin secretos; cerrar hallazgos bloqueantes con evidencia y sin afirmar cumplimiento por pasar un escáner.

## Preparación de infraestructura y recuperación

- [ ] **F21-OPS-01** Preparar Docker images y Compose de piloto para reverse proxy/TLS, backend, PostgreSQL privado y storage privado; solo proxy publica tráfico de usuario. Worker puede correr en el monolito.
- [ ] **F21-OPS-02** Preparar configuración/secretos externos, liveness/readiness, métricas/restricción de Actuator, rotación de logs y alertas de disco/DB/cola; versionar ejemplos sin credenciales.
- [ ] **F21-OPS-03** Documentar backup DB diario, retención mínima 7 días y copia semanal, cifrado fuera del volumen principal; copia/versionado de objetos con política de privacidad.
- [ ] **F21-OPS-04** Ejecutar restauración en entorno aislado y verificar schema/FK/datos/claves de objetos y recorridos básicos; registrar tiempo y pérdida de datos para acordar RTO/RPO.
- [ ] **F21-OPS-05** Preparar pipeline staging, smoke, publicación móvil y rollback de aplicación; evaluar compatibilidad de migración hacia atrás sin automatizar down-migrations destructivas.
- [ ] **F21-OPS-06** Preparar checklist concreto de release con hashes de artefactos, migraciones, configuración, responsables y evidencias. Desplegar/publicar requiere una instrucción posterior; este plan no ejecuta producción.
