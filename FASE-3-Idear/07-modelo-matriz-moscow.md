

## 1. Criterios de priorización aplicados

| Categoría            | Criterio aplicado al proyecto                                                                                                                                                      |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Must Have**        | Sin esta capacidad el ciclo principal no puede completarse de extremo a extremo, se vulnera una regla crítica de seguridad/privacidad o el sistema no es operable de forma mínima. |
| **Should Have**      | Aporta valor importante, confianza, eficiencia o administración, pero existe una alternativa temporal y el MVP puede validar su hipótesis central sin ella.                        |
| **Could Have**       | Mejora experiencia, adopción o diferenciación; puede incorporarse si existe capacidad después de cerrar los Must, sin poner en riesgo el MVP.                                      |
| **Won’t Have (MVP)** | Se excluye deliberadamente del release inicial por complejidad, dependencia, riesgo o porque el propio alcance la reserva para una etapa posterior. No significa “nunca”.          |

## 2. Resumen ejecutivo de la matriz

| Prioridad            |                               Historias | Lectura del alcance                                                                                                    |
| -------------------- | --------------------------------------: | ---------------------------------------------------------------------------------------------------------------------- |
| **Must Have**        |                                  **62** | Núcleo transaccional, identidad, privacidad, matching, propuestas, servicio, reputación, reportes mínimos y auditoría. |
| **Should Have**      |                                  **32** | Portafolio, disponibilidad avanzada, administración, formalización, notificaciones, historial y analítica.             |
| **Could Have**       |                                   **8** | Integraciones y mejoras de experiencia/evolución que no bloquean la validación del MVP.                                |
| **Won’t Have (MVP)** | **1 historia + exclusiones explícitas** | Capacidades reservadas para fases posteriores, especialmente pagos y funcionalidades de alta complejidad.              |

## 3. Matriz detallada por épica

### EP-01 — Identidad, acceso y roles

| MoSCoW   | ID     | Historia                                      | Justificación de priorización                                                                       |
| -------- | ------ | --------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Must** | US-001 | Registro de cliente                           | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-002 | Registro de prestador                         | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-003 | Inicio de sesión                              | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-004 | Cierre de sesión                              | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-005 | Recuperación de acceso                        | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-006 | Enrutamiento por rol                          | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-007 | Aceptación de términos y tratamiento de datos | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |

### EP-02 — Cuenta, privacidad y consentimiento

| MoSCoW | ID | Historia | Justificación de priorización |
|---|---|---|---|
| **Must** | US-008 | Editar datos básicos de cuenta | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-009 | Gestionar zona aproximada | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-010 | Controlar visibilidad de datos personales | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-012 | Solicitar eliminación de cuenta | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-013 | Separar ubicación aproximada y dirección exacta | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Should** | US-011 | Consultar mis datos almacenados | Valor alto, pero el MVP puede operar temporalmente sin esta capacidad. |

### EP-03 — Perfil profesional del prestador

| MoSCoW | ID | Historia | Justificación de priorización |
|---|---|---|---|
| **Must** | US-014 | Crear perfil profesional | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-015 | Editar perfil profesional | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-016 | Seleccionar categorías de servicio | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-017 | Configurar zonas de atención | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-018 | Registrar experiencia profesional | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-024 | Consultar perfil público de prestador | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Should** | US-019 | Cargar portafolio de trabajos | Valor alto, pero el MVP puede operar temporalmente sin esta capacidad. |
| **Should** | US-020 | Eliminar elemento de portafolio | Valor alto, pero el MVP puede operar temporalmente sin esta capacidad. |
| **Should** | US-021 | Configurar disponibilidad general | Valor alto, pero el MVP puede operar temporalmente sin esta capacidad. |
| **Should** | US-022 | Gestionar agenda y franjas horarias | Valor alto, pero el MVP puede operar temporalmente sin esta capacidad. |
| **Should** | US-023 | Consultar vista previa del perfil | Valor alto, pero el MVP puede operar temporalmente sin esta capacidad. |

### EP-04 — Catálogo, categorías y descubrimiento

| MoSCoW | ID | Historia | Justificación de priorización |
|---|---|---|---|
| **Must** | US-025 | Explorar categorías de servicios | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Should** | US-026 | Descubrir prestadores por categoría y zona | Valor alto, pero el MVP puede operar temporalmente sin esta capacidad. |
| **Should** | US-027 | Filtrar y ordenar prestadores | Valor alto, pero el MVP puede operar temporalmente sin esta capacidad. |
| **Should** | US-028 | Administrar categorías | Valor alto, pero el MVP puede operar temporalmente sin esta capacidad. |
| **Should** | US-029 | Administrar zonas | Valor alto, pero el MVP puede operar temporalmente sin esta capacidad. |

### EP-05 — Solicitudes de servicio

| MoSCoW | ID | Historia | Justificación de priorización |
|---|---|---|---|
| **Must** | US-030 | Crear borrador de solicitud | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-031 | Definir categoría y descripción | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-032 | Adjuntar fotos a solicitud | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-033 | Definir zona aproximada y urgencia | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-034 | Publicar solicitud | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-035 | Editar solicitud abierta | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-036 | Cancelar solicitud abierta | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-037 | Consultar mis solicitudes | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-038 | Consultar detalle y estado de solicitud | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |

### EP-06 — Matching y oportunidades

| MoSCoW | ID | Historia | Justificación de priorización |
|---|---|---|---|
| **Must** | US-039 | Generar compatibilidad de solicitudes | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-040 | Ver tablero de oportunidades | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-041 | Filtrar oportunidades | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-042 | Consultar detalle de oportunidad | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-043 | Evitar cotización de oportunidades no elegibles | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Should** | US-044 | Notificar nueva oportunidad compatible | Valor alto, pero el MVP puede operar temporalmente sin esta capacidad. |

### EP-07 — Propuestas, comparación y selección

| MoSCoW | ID | Historia | Justificación de priorización |
|---|---|---|---|
| **Must** | US-045 | Crear propuesta | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-046 | Definir precio o rango en propuesta | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-047 | Indicar disponibilidad en propuesta | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-048 | Agregar mensaje de propuesta | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-049 | Editar propuesta activa | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-050 | Retirar propuesta | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-052 | Consultar propuestas recibidas | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-053 | Comparar propuestas y perfiles | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-054 | Aceptar propuesta | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-055 | Cerrar propuestas no seleccionadas | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Should** | US-051 | Notificar propuesta recibida | Valor alto, pero el MVP puede operar temporalmente sin esta capacidad. |

### EP-08 — Coordinación y ciclo de vida del servicio

| MoSCoW | ID | Historia | Justificación de priorización |
|---|---|---|---|
| **Must** | US-056 | Crear registro de servicio contratado | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-057 | Habilitar datos de coordinación | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-058 | Consultar detalle del servicio | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-059 | Marcar servicio en ejecución | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-060 | Marcar trabajo como terminado | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-061 | Confirmar finalización del servicio | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-062 | Cancelar servicio contratado | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-063 | Consultar historial de estados del servicio | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-064 | Usar canal de coordinación autorizado | Must condicionado: la coordinación posterior a la aceptación es indispensable, aunque el canal concreto depende de la decisión PD-05. |

### EP-09 — Reputación, verificación y confianza

| MoSCoW | ID | Historia | Justificación de priorización |
|---|---|---|---|
| **Must** | US-065 | Calificar servicio finalizado | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-066 | Impedir calificación duplicada | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-067 | Agregar reseña textual | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-068 | Calcular reputación agregada | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-069 | Mostrar nivel de verificación con significado explícito | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-071 | Reportar reseña o reputación problemática | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Should** | US-070 | Solicitar verificación documental ampliada | Valor alto, pero el MVP puede operar temporalmente sin esta capacidad. |

### EP-10 — Reportes, moderación y administración

| MoSCoW | ID | Historia | Justificación de priorización |
|---|---|---|---|
| **Must** | US-072 | Reportar usuario | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-073 | Reportar solicitud, propuesta o servicio | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-074 | Adjuntar evidencia a reporte | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Must** | US-081 | Auditar acciones administrativas | Necesaria para el flujo principal o para una condición mínima de seguridad, privacidad u operación. |
| **Should** | US-075 | Consultar cola de reportes | Valor alto, pero el MVP puede operar temporalmente sin esta capacidad. |
| **Should** | US-076 | Revisar detalle de reporte | Valor alto, pero el MVP puede operar temporalmente sin esta capacidad. |
| **Should** | US-077 | Cambiar estado y resolver reporte | Valor alto, pero el MVP puede operar temporalmente sin esta capacidad. |
| **Should** | US-078 | Bloquear preventivamente una cuenta | Valor alto, pero el MVP puede operar temporalmente sin esta capacidad. |
| **Should** | US-079 | Moderar perfil o contenido | Valor alto, pero el MVP puede operar temporalmente sin esta capacidad. |
| **Should** | US-080 | Buscar usuarios y perfiles en administración | Valor alto, pero el MVP puede operar temporalmente sin esta capacidad. |
| **Should** | US-082 | Gestionar servicios/categorías reguladas o de alto riesgo | Should condicionado: pasa a Must si el piloto habilita servicios regulados o de alto riesgo. |

### EP-11 — Ruta de formalización progresiva

| MoSCoW | ID | Historia | Justificación de priorización |
|---|---|---|---|
| **Should** | US-083 | Consultar ruta de formalización | Valor alto, pero el MVP puede operar temporalmente sin esta capacidad. |
| **Should** | US-084 | Consultar checklist por cuatro dimensiones | Valor alto, pero el MVP puede operar temporalmente sin esta capacidad. |
| **Should** | US-085 | Registrar avance declarado en checklist | Valor alto, pero el MVP puede operar temporalmente sin esta capacidad. |
| **Should** | US-086 | Abrir enlaces oficiales de formalización | Valor alto, pero el MVP puede operar temporalmente sin esta capacidad. |
| **Should** | US-087 | Mostrar progreso sin declarar estatus legal | Valor alto, pero el MVP puede operar temporalmente sin esta capacidad. |
| **Could** | US-088 | Vincular ruta institucional futura | Mejora evolutiva; no bloquea la hipótesis central ni el ciclo principal. |

### EP-12 — Notificaciones, historial y analítica básica

| MoSCoW | ID | Historia | Justificación de priorización |
|---|---|---|---|
| **Should** | US-089 | Notificar aceptación de propuesta | Valor alto, pero el MVP puede operar temporalmente sin esta capacidad. |
| **Should** | US-090 | Notificar cambios de estado del servicio | Valor alto, pero el MVP puede operar temporalmente sin esta capacidad. |
| **Should** | US-091 | Configurar preferencias de notificación | Valor alto, pero el MVP puede operar temporalmente sin esta capacidad. |
| **Should** | US-092 | Consultar historial de trabajos | Valor alto, pero el MVP puede operar temporalmente sin esta capacidad. |
| **Should** | US-093 | Descargar historial | Valor alto, pero el MVP puede operar temporalmente sin esta capacidad. |
| **Should** | US-094 | Consultar indicadores básicos del prestador | Valor alto, pero el MVP puede operar temporalmente sin esta capacidad. |
| **Should** | US-095 | Consultar actividad reciente | Valor alto, pero el MVP puede operar temporalmente sin esta capacidad. |

### EP-13 — Capacidades Could Have / evolución

| MoSCoW | ID | Historia | Justificación de priorización |
|---|---|---|---|
| **Could** | US-096 | Chat interno en tiempo real | Mejora evolutiva; no bloquea la hipótesis central ni el ciclo principal. |
| **Could** | US-097 | Mapa visual de prestadores | Mejora evolutiva; no bloquea la hipótesis central ni el ciclo principal. |
| **Could** | US-098 | Insignia de progreso de formalización | Mejora evolutiva; no bloquea la hipótesis central ni el ciclo principal. |
| **Could** | US-099 | Programa de referidos | Mejora evolutiva; no bloquea la hipótesis central ni el ciclo principal. |
| **Could** | US-100 | Soporte por WhatsApp | Mejora evolutiva; no bloquea la hipótesis central ni el ciclo principal. |
| **Could** | US-101 | Onboarding asistido por WhatsApp o gestor comunitario | Mejora evolutiva; no bloquea la hipótesis central ni el ciclo principal. |
| **Could** | US-102 | Idiomas adicionales | Mejora evolutiva; no bloquea la hipótesis central ni el ciclo principal. |
| **Won't** | US-103 | Piloto de pasarela de pago | Won’t Have del MVP: el backlog la ubica como piloto posterior y el alcance excluye pagos integrados/billetera del release inicial. |
