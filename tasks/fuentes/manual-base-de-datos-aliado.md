# Manual de la base de datos ALIADO (MVP, SPEC-01 a SPEC-14)

Este manual describe las 42 tablas del modelo del MVP: qué guarda cada una, de qué SPEC proviene y cómo se relaciona con las demás. Se generó a partir de la base PostgreSQL 16 creada con las migraciones V1 a V6, así que refleja el esquema real.

## Cómo leer este manual

- **N a 1**: muchos registros de la tabla hija apuntan a un registro de la tabla padre (por ejemplo, muchas solicitudes de un mismo Cliente).
- **1 a 1**: cada registro de la tabla hija corresponde a un único registro del padre (por ejemplo, un perfil por usuario).
- **1 a N**: vista inversa de una relación N a 1, desde el padre hacia los hijos.
- **Tabla puente**: resuelve una relación muchos a muchos (por ejemplo, un perfil con varias categorías).
- Las enumeraciones (estados, roles, tipos) se guardan como texto con una restricción CHECK. Sus valores válidos aparecen en la columna "Observación".
- Las tablas de SPEC-03, SPEC-17 y SPEC-18 no existen: son lecturas o proyecciones de otras tablas.

## Resumen de todas las tablas

| Tabla | SPEC de origen | Depende de | Tablas que dependen de ella |
|---|---|---|---|
| `usuarios` | SPEC-01 | — | acciones_moderacion, auditoria_administrativa, bloqueos_preventivos, calificaciones, consentimientos, descargas_historial, historial_estado_servicio, idempotency_keys, marcas_alto_riesgo, mensajes_servicio, notificaciones, perfiles, perfiles_profesionales, preferencias_notificacion, progreso_formalizacion, propuestas, reportes, reputaciones_prestador, servicios_contratados, sesiones, solicitudes, solicitudes_eliminacion, solicitudes_verificacion, tokens_recuperacion, ubicaciones |
| `consentimientos` | SPEC-01 | usuarios | — |
| `sesiones` | SPEC-01 | usuarios | — |
| `tokens_recuperacion` | SPEC-01 | usuarios | — |
| `idempotency_keys` | Transversal (plan general, sección 14) | usuarios | — |
| `perfiles` | SPEC-02 | usuarios | — |
| `ubicaciones` | SPEC-02 | usuarios | — |
| `solicitudes_eliminacion` | SPEC-02 | usuarios | — |
| `categorias_servicio` | SPEC-04 (catálogo compartido) | — | perfil_categoria, solicitudes |
| `zonas` | SPEC-04 (catálogo compartido) | — | perfil_zona_atencion, solicitudes |
| `solicitudes` | SPEC-04 | categorias_servicio, usuarios, zonas | fotos_solicitud, historial_estado_solicitud, propuestas, servicios_contratados |
| `fotos_solicitud` | SPEC-04 | solicitudes | — |
| `historial_estado_solicitud` | SPEC-04 | solicitudes | — |
| `perfiles_profesionales` | SPEC-05 | usuarios | compromisos_agenda, disponibilidades, experiencias_profesionales, perfil_categoria, perfil_zona_atencion, servicios_portafolio |
| `perfil_categoria` | SPEC-05 | categorias_servicio, perfiles_profesionales | — |
| `perfil_zona_atencion` | SPEC-05 | perfiles_profesionales, zonas | — |
| `experiencias_profesionales` | SPEC-05 | perfiles_profesionales | — |
| `servicios_portafolio` | SPEC-05 | perfiles_profesionales | — |
| `disponibilidades` | SPEC-05 | perfiles_profesionales | — |
| `compromisos_agenda` | SPEC-05 | perfiles_profesionales | — |
| `propuestas` | SPEC-07 | solicitudes, usuarios | servicios_contratados |
| `servicios_contratados` | SPEC-08 | propuestas, solicitudes, usuarios | calificaciones, historial_estado_servicio, marcas_alto_riesgo, mensajes_servicio, reportes |
| `historial_estado_servicio` | SPEC-08 | servicios_contratados, usuarios | — |
| `mensajes_servicio` | SPEC-08 (canal del servicio; persistencia del chat de SPEC-15) | servicios_contratados, usuarios | — |
| `notificaciones` | SPEC-06, SPEC-07, SPEC-09 unificadas (plan general 6.2) | usuarios | — |
| `calificaciones` | SPEC-10 | servicios_contratados, usuarios | resenas |
| `resenas` | SPEC-10 | calificaciones | reportes |
| `reputaciones_prestador` | SPEC-10 (materialización derivada) | usuarios | — |
| `solicitudes_verificacion` | SPEC-10 | usuarios | documentos_verificacion |
| `documentos_verificacion` | SPEC-10 (storage privado) | solicitudes_verificacion | — |
| `reportes` | SPEC-10, SPEC-11, SPEC-12 (núcleo compartido) | resenas, servicios_contratados, usuarios | evidencias_reporte |
| `evidencias_reporte` | SPEC-11 | reportes | — |
| `bloqueos_preventivos` | SPEC-12 | usuarios | — |
| `acciones_moderacion` | SPEC-12 | usuarios | — |
| `marcas_alto_riesgo` | SPEC-12 | servicios_contratados, usuarios | — |
| `auditoria_administrativa` | SPEC-12 / RNF-005 | usuarios | — |
| `rutas_formalizacion` | SPEC-13 | — | pasos_formalizacion, progreso_formalizacion |
| `pasos_formalizacion` | SPEC-13 | rutas_formalizacion | enlaces_institucionales |
| `enlaces_institucionales` | SPEC-13 | pasos_formalizacion | — |
| `progreso_formalizacion` | SPEC-13 / SPEC-18 (origen pendiente) | rutas_formalizacion, usuarios | — |
| `preferencias_notificacion` | SPEC-14 | usuarios | — |
| `descargas_historial` | SPEC-14 | usuarios | — |

## Mapa de dependencias principales

```
usuarios
 ├── consentimientos, sesiones, tokens_recuperacion, idempotency_keys
 ├── perfiles (1 a 1), ubicaciones (1 a 1), solicitudes_eliminacion
 ├── solicitudes (cliente) ── fotos_solicitud, historial_estado_solicitud
 ├── perfiles_profesionales (1 a 1 con prestador) ── puentes, experiencias, portafolio, disponibilidades, agenda
 ├── propuestas (prestador) ── servicios_contratados ── historial, mensajes, calificaciones ── resenas
 ├── notificaciones, preferencias_notificacion, descargas_historial
 ├── reputaciones_prestador, solicitudes_verificacion ── documentos_verificacion
 ├── reportes ── evidencias_reporte
 ├── bloqueos_preventivos, acciones_moderacion, marcas_alto_riesgo, auditoria_administrativa
 └── progreso_formalizacion ── rutas_formalizacion ── pasos_formalizacion ── enlaces_institucionales
```

## Detalle por tabla

## usuarios

**Origen:** SPEC-01  
**Propósito:** Cuenta de cualquier actor del sistema: Cliente, Prestador o Administrador. Guarda identidad, rol y estado de la cuenta. Es la raíz de casi todo el modelo.

**Llave primaria:** `id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `id` | UUID | Sí |  |
| `email` | VARCHAR(255) | Sí |  |
| `password_hash` | VARCHAR(255) | Sí |  |
| `rol` | VARCHAR(20) | Sí | Valores: CLIENTE, PRESTADOR, ADMINISTRADOR |
| `estado_cuenta` | VARCHAR(40) | Sí | Valores: ACTIVA, BLOQUEADA_PREVENTIVAMENTE |
| `fecha_creacion` | TIMESTAMPTZ | Sí |  |

### Relaciones

- Sin dependencias hacia otras tablas.

Desde otras tablas (dependen de esta):

- `acciones_moderacion.administrador_id`: relación **1 a N**
- `auditoria_administrativa.administrador_id`: relación **1 a N**
- `bloqueos_preventivos.usuario_id`: relación **1 a N**
- `bloqueos_preventivos.administrador_id`: relación **1 a N**
- `calificaciones.cliente_id`: relación **1 a N**
- `calificaciones.prestador_id`: relación **1 a N**
- `consentimientos.usuario_id`: relación **1 a N**
- `descargas_historial.usuario_id`: relación **1 a N**
- `historial_estado_servicio.actor_id`: relación **1 a N**
- `idempotency_keys.usuario_id`: relación **1 a N**
- `marcas_alto_riesgo.administrador_id`: relación **1 a N**
- `mensajes_servicio.remitente_id`: relación **1 a N**
- `notificaciones.destinatario_id`: relación **1 a N**
- `perfiles.usuario_id`: relación **1 a 1**
- `perfiles_profesionales.prestador_id`: relación **1 a 1**
- `preferencias_notificacion.usuario_id`: relación **1 a N**
- `progreso_formalizacion.prestador_id`: relación **1 a N**
- `propuestas.prestador_id`: relación **1 a N**
- `reportes.reportante_id`: relación **1 a N**
- `reportes.usuario_objetivo_id`: relación **1 a N**
- `reportes.revisado_por`: relación **1 a N**
- `reputaciones_prestador.prestador_id`: relación **1 a 1**
- `servicios_contratados.cliente_id`: relación **1 a N**
- `servicios_contratados.prestador_id`: relación **1 a N**
- `sesiones.usuario_id`: relación **1 a N**
- `solicitudes.cliente_id`: relación **1 a N**
- `solicitudes_eliminacion.usuario_id`: relación **1 a N**
- `solicitudes_verificacion.prestador_id`: relación **1 a N**
- `tokens_recuperacion.usuario_id`: relación **1 a N**
- `ubicaciones.usuario_id`: relación **1 a 1**

## consentimientos

**Origen:** SPEC-01  
**Propósito:** Registro de la aceptación de términos y tratamiento de datos, con la versión aceptada y la fecha. Respalda RNF-010 (Ley 1581).

**Llave primaria:** `id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `id` | UUID | Sí |  |
| `usuario_id` | UUID | Sí | FK a `usuarios.id` |
| `version_terminos` | VARCHAR(50) | Sí |  |
| `fecha_aceptacion` | TIMESTAMPTZ | Sí |  |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `usuario_id` → `usuarios.id`: relación **N a 1**

- Ninguna tabla depende de esta.

## sesiones

**Origen:** SPEC-01  
**Propósito:** Sesiones autenticadas. Se guarda solo el hash SHA-256 del token opaco, nunca el token. Permite revocar sesiones.

**Llave primaria:** `id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `id` | UUID | Sí |  |
| `usuario_id` | UUID | Sí | FK a `usuarios.id` |
| `token_hash` | VARCHAR(64) | Sí |  |
| `fecha_inicio` | TIMESTAMPTZ | Sí |  |
| `fecha_expiracion` | TIMESTAMPTZ | Sí |  |
| `fecha_cierre` | TIMESTAMPTZ | No |  |
| `estado` | VARCHAR(20) | Sí | Valores: ACTIVA, CERRADA, EXPIRADA |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `usuario_id` → `usuarios.id`: relación **N a 1**

- Ninguna tabla depende de esta.

## tokens_recuperacion

**Origen:** SPEC-01  
**Propósito:** Tokens de recuperación de acceso de un solo uso y con expiración. Se guarda el hash del código.

**Llave primaria:** `id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `id` | UUID | Sí |  |
| `usuario_id` | UUID | Sí | FK a `usuarios.id` |
| `codigo_hash` | VARCHAR(64) | Sí |  |
| `fecha_creacion` | TIMESTAMPTZ | Sí |  |
| `fecha_expiracion` | TIMESTAMPTZ | Sí |  |
| `usado` | BOOLEAN | Sí | Por defecto: false |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `usuario_id` → `usuarios.id`: relación **N a 1**

- Ninguna tabla depende de esta.

## idempotency_keys

**Origen:** Transversal (plan general, sección 14)  
**Propósito:** Respuesta guardada de comandos reintentables, identificados por Idempotency-Key, para no duplicar operaciones con conexión inestable.

**Llave primaria:** `clave, operacion`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `clave` | UUID | Sí |  |
| `operacion` | VARCHAR(100) | Sí |  |
| `usuario_id` | UUID | No | FK a `usuarios.id` |
| `status_code` | INTEGER | Sí |  |
| `respuesta` | JSONB | Sí |  |
| `fecha_creacion` | TIMESTAMPTZ | Sí |  |
| `fecha_expiracion` | TIMESTAMPTZ | Sí |  |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `usuario_id` → `usuarios.id`: relación **N a 1**

- Ninguna tabla depende de esta.

## perfiles

**Origen:** SPEC-02  
**Propósito:** Datos básicos editables del usuario (nombre, teléfono) y su preferencia de visibilidad. Tiene control de concurrencia por versión.

**Llave primaria:** `usuario_id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `usuario_id` | UUID | Sí | FK a `usuarios.id` |
| `nombre` | VARCHAR(120) | No |  |
| `telefono` | VARCHAR(30) | No |  |
| `preferencia_visibilidad` | VARCHAR(50) | Sí |  |
| `version` | INTEGER | Sí | Por defecto: 0 |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `usuario_id` → `usuarios.id`: relación **1 a 1**

- Ninguna tabla depende de esta.

## ubicaciones

**Origen:** SPEC-02  
**Propósito:** Zona aproximada (pública por defecto) y dirección exacta cifrada (sensible, nunca en vistas públicas) de un usuario.

**Llave primaria:** `usuario_id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `usuario_id` | UUID | Sí | FK a `usuarios.id` |
| `zona_aproximada` | VARCHAR(100) | Sí |  |
| `direccion_exacta_cifrada` | TEXT | No |  |
| `version` | INTEGER | Sí | Por defecto: 0 |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `usuario_id` → `usuarios.id`: relación **1 a 1**

- Ninguna tabla depende de esta.

## solicitudes_eliminacion

**Origen:** SPEC-02  
**Propósito:** Solicitudes de eliminación de cuenta con estado y vencimiento a 24 horas. Solo puede haber una PENDIENTE por usuario.

**Llave primaria:** `id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `id` | UUID | Sí |  |
| `usuario_id` | UUID | Sí | FK a `usuarios.id` |
| `fecha_solicitud` | TIMESTAMPTZ | Sí |  |
| `fecha_expiracion` | TIMESTAMPTZ | Sí |  |
| `estado` | VARCHAR(20) | Sí | Valores: PENDIENTE, CONFIRMADA, EXPIRADA, RECHAZADA |
| `fecha_confirmacion` | TIMESTAMPTZ | No |  |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `usuario_id` → `usuarios.id`: relación **N a 1**

- Ninguna tabla depende de esta.

## categorias_servicio

**Origen:** SPEC-04 (catálogo compartido)  
**Propósito:** Catálogo de oficios técnicos (aires acondicionados, plomería, etc.). Lo administra el Administrador (SPEC-12).

**Llave primaria:** `id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `id` | UUID | Sí |  |
| `nombre` | VARCHAR(120) | Sí |  |
| `estado` | VARCHAR(10) | Sí | Valores: ACTIVO, INACTIVO |

### Relaciones

- Sin dependencias hacia otras tablas.

Desde otras tablas (dependen de esta):

- `perfil_categoria.categoria_id`: relación **1 a N**
- `solicitudes.categoria_id`: relación **1 a N**

## zonas

**Origen:** SPEC-04 (catálogo compartido)  
**Propósito:** Catálogo de zonas de atención de Santa Marta. Lo administra el Administrador (SPEC-12).

**Llave primaria:** `id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `id` | UUID | Sí |  |
| `nombre` | VARCHAR(120) | Sí |  |
| `cobertura_geografica` | VARCHAR(255) | No |  |
| `estado` | VARCHAR(10) | Sí | Valores: ACTIVO, INACTIVO |

### Relaciones

- Sin dependencias hacia otras tablas.

Desde otras tablas (dependen de esta):

- `perfil_zona_atencion.zona_id`: relación **1 a N**
- `solicitudes.zona_id`: relación **1 a N**

## solicitudes

**Origen:** SPEC-04  
**Propósito:** Necesidad publicada por un Cliente: categoría, zona, descripción y estado (borrador, publicada, cancelada o contratada).

**Llave primaria:** `id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `id` | UUID | Sí |  |
| `cliente_id` | UUID | Sí | FK a `usuarios.id` |
| `categoria_id` | UUID | Sí | FK a `categorias_servicio.id` |
| `zona_id` | UUID | Sí | FK a `zonas.id` |
| `descripcion` | TEXT | Sí |  |
| `urgencia` | VARCHAR(20) | No |  |
| `estado` | VARCHAR(20) | Sí | Valores: BORRADOR, PUBLICADA, CANCELADA, CONTRATADA |
| `fecha_creacion` | TIMESTAMPTZ | Sí |  |
| `fecha_actualizacion` | TIMESTAMPTZ | Sí |  |
| `version` | INTEGER | Sí | Por defecto: 0 |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `cliente_id` → `usuarios.id`: relación **N a 1**
- `categoria_id` → `categorias_servicio.id`: relación **N a 1**
- `zona_id` → `zonas.id`: relación **N a 1**

Desde otras tablas (dependen de esta):

- `fotos_solicitud.solicitud_id`: relación **1 a N**
- `historial_estado_solicitud.solicitud_id`: relación **1 a N**
- `propuestas.solicitud_id`: relación **1 a N**
- `servicios_contratados.solicitud_id`: relación **1 a 1**

## fotos_solicitud

**Origen:** SPEC-04  
**Propósito:** Fotos adjuntas a una solicitud. Guarda la clave del archivo en storage privado, no el binario.

**Llave primaria:** `id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `id` | UUID | Sí |  |
| `solicitud_id` | UUID | Sí | FK a `solicitudes.id` |
| `archivo_key` | VARCHAR(500) | Sí |  |
| `orden` | INTEGER | Sí |  |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `solicitud_id` → `solicitudes.id`: relación **N a 1**

- Ninguna tabla depende de esta.

## historial_estado_solicitud

**Origen:** SPEC-04  
**Propósito:** Registro de cada cambio de estado de una solicitud, para trazabilidad.

**Llave primaria:** `id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `id` | UUID | Sí |  |
| `solicitud_id` | UUID | Sí | FK a `solicitudes.id` |
| `estado_anterior` | VARCHAR(20) | No |  |
| `estado_nuevo` | VARCHAR(20) | Sí | Valores: BORRADOR, PUBLICADA, CANCELADA, CONTRATADA |
| `fecha` | TIMESTAMPTZ | Sí |  |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `solicitud_id` → `solicitudes.id`: relación **N a 1**

- Ninguna tabla depende de esta.

## perfiles_profesionales

**Origen:** SPEC-05  
**Propósito:** Perfil profesional del Prestador (uno por Prestador): datos generales, exposición pública y fechas.

**Llave primaria:** `id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `id` | UUID | Sí |  |
| `prestador_id` | UUID | Sí | FK a `usuarios.id` |
| `datos_generales` | JSONB | No |  |
| `estado_exposicion_publica` | VARCHAR(20) | Sí |  |
| `fecha_creacion` | TIMESTAMPTZ | Sí |  |
| `fecha_actualizacion` | TIMESTAMPTZ | Sí |  |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `prestador_id` → `usuarios.id`: relación **1 a 1**

Desde otras tablas (dependen de esta):

- `compromisos_agenda.perfil_id`: relación **1 a N**
- `disponibilidades.perfil_id`: relación **1 a N**
- `experiencias_profesionales.perfil_id`: relación **1 a N**
- `perfil_categoria.perfil_id`: relación **1 a N**
- `perfil_zona_atencion.perfil_id`: relación **1 a N**
- `servicios_portafolio.perfil_id`: relación **1 a N**

## perfil_categoria

**Origen:** SPEC-05  
**Propósito:** Tabla puente: categorías de servicio que ofrece un perfil profesional.

**Llave primaria:** `perfil_id, categoria_id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `perfil_id` | UUID | Sí | FK a `perfiles_profesionales.id` |
| `categoria_id` | UUID | Sí | FK a `categorias_servicio.id` |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `perfil_id` → `perfiles_profesionales.id`: relación **N a 1**
- `categoria_id` → `categorias_servicio.id`: relación **N a 1**

- Ninguna tabla depende de esta.

## perfil_zona_atencion

**Origen:** SPEC-05  
**Propósito:** Tabla puente: zonas de atención declaradas por un perfil profesional.

**Llave primaria:** `perfil_id, zona_id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `perfil_id` | UUID | Sí | FK a `perfiles_profesionales.id` |
| `zona_id` | UUID | Sí | FK a `zonas.id` |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `perfil_id` → `perfiles_profesionales.id`: relación **N a 1**
- `zona_id` → `zonas.id`: relación **N a 1**

- Ninguna tabla depende de esta.

## experiencias_profesionales

**Origen:** SPEC-05  
**Propósito:** Experiencia laboral declarada en el perfil profesional, con periodo.

**Llave primaria:** `id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `id` | UUID | Sí |  |
| `perfil_id` | UUID | Sí | FK a `perfiles_profesionales.id` |
| `descripcion` | TEXT | Sí |  |
| `fecha_inicio` | DATE | Sí |  |
| `fecha_fin` | DATE | No |  |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `perfil_id` → `perfiles_profesionales.id`: relación **N a 1**

- Ninguna tabla depende de esta.

## servicios_portafolio

**Origen:** SPEC-05  
**Propósito:** Trabajos previos mostrados en el portafolio, con evidencia opcional en storage privado.

**Llave primaria:** `id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `id` | UUID | Sí |  |
| `perfil_id` | UUID | Sí | FK a `perfiles_profesionales.id` |
| `descripcion` | TEXT | Sí |  |
| `evidencia_key` | VARCHAR(500) | No |  |
| `fecha_creacion` | TIMESTAMPTZ | Sí |  |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `perfil_id` → `perfiles_profesionales.id`: relación **N a 1**

- Ninguna tabla depende de esta.

## disponibilidades

**Origen:** SPEC-05  
**Propósito:** Franjas horarias en las que el Prestador declara estar disponible.

**Llave primaria:** `id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `id` | UUID | Sí |  |
| `perfil_id` | UUID | Sí | FK a `perfiles_profesionales.id` |
| `dia_semana` | SMALLINT | No |  |
| `hora_inicio` | TIME | Sí |  |
| `hora_fin` | TIME | Sí |  |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `perfil_id` → `perfiles_profesionales.id`: relación **N a 1**

- Ninguna tabla depende de esta.

## compromisos_agenda

**Origen:** SPEC-05  
**Propósito:** Compromisos ya agendados del Prestador, de origen manual o del sistema, usados para detectar solapamientos.

**Llave primaria:** `id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `id` | UUID | Sí |  |
| `perfil_id` | UUID | Sí | FK a `perfiles_profesionales.id` |
| `fecha_hora_inicio` | TIMESTAMPTZ | Sí |  |
| `fecha_hora_fin` | TIMESTAMPTZ | Sí |  |
| `origen` | VARCHAR(10) | Sí | Valores: MANUAL, SISTEMA |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `perfil_id` → `perfiles_profesionales.id`: relación **N a 1**

- Ninguna tabla depende de esta.

## propuestas

**Origen:** SPEC-07  
**Propósito:** Oferta de un Prestador sobre una solicitud, con disponibilidad, mensaje opcional y estado (activa, retirada, aceptada o cerrada).

**Llave primaria:** `id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `id` | UUID | Sí |  |
| `solicitud_id` | UUID | Sí | FK a `solicitudes.id` |
| `prestador_id` | UUID | Sí | FK a `usuarios.id` |
| `disponibilidad` | VARCHAR(255) | Sí |  |
| `mensaje` | VARCHAR(1000) | No |  |
| `estado` | VARCHAR(20) | Sí | Valores: ACTIVA, RETIRADA, ACEPTADA, CERRADA |
| `fecha_creacion` | TIMESTAMPTZ | Sí |  |
| `fecha_actualizacion` | TIMESTAMPTZ | Sí |  |
| `version` | INTEGER | Sí | Por defecto: 0 |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `prestador_id` → `usuarios.id`: relación **N a 1**
- `solicitud_id` → `solicitudes.id`: relación **N a 1**

Desde otras tablas (dependen de esta):

- `servicios_contratados.propuesta_id`: relación **1 a 1**

## servicios_contratados

**Origen:** SPEC-08  
**Propósito:** Servicio materializado al aceptar una propuesta: une solicitud, propuesta, Cliente y Prestador, con estado de ejecución y control de concurrencia.

**Llave primaria:** `id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `id` | UUID | Sí |  |
| `solicitud_id` | UUID | Sí | FK a `solicitudes.id` |
| `propuesta_id` | UUID | Sí | FK a `propuestas.id` |
| `cliente_id` | UUID | Sí | FK a `usuarios.id` |
| `prestador_id` | UUID | Sí | FK a `usuarios.id` |
| `estado` | VARCHAR(20) | Sí | Valores: CONTRATADO, EN_EJECUCION, TERMINADO, FINALIZADO, CANCELADO |
| `comunicacion_habilitada` | BOOLEAN | Sí |  |
| `fecha_contratacion` | TIMESTAMPTZ | Sí |  |
| `version` | INTEGER | Sí | Por defecto: 0 |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `solicitud_id` → `solicitudes.id`: relación **1 a 1**
- `propuesta_id` → `propuestas.id`: relación **1 a 1**
- `cliente_id` → `usuarios.id`: relación **N a 1**
- `prestador_id` → `usuarios.id`: relación **N a 1**

Desde otras tablas (dependen de esta):

- `calificaciones.servicio_id`: relación **1 a 1**
- `historial_estado_servicio.servicio_id`: relación **1 a N**
- `marcas_alto_riesgo.servicio_id`: relación **1 a N**
- `mensajes_servicio.servicio_id`: relación **1 a N**
- `reportes.servicio_id`: relación **1 a N**

## historial_estado_servicio

**Origen:** SPEC-08  
**Propósito:** Registro de cada transición de estado de un servicio contratado, con el actor que la ejecutó.

**Llave primaria:** `id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `id` | UUID | Sí |  |
| `servicio_id` | UUID | Sí | FK a `servicios_contratados.id` |
| `estado_anterior` | VARCHAR(20) | No |  |
| `estado_nuevo` | VARCHAR(20) | Sí | Valores: CONTRATADO, EN_EJECUCION, TERMINADO, FINALIZADO, CANCELADO |
| `actor_id` | UUID | Sí | FK a `usuarios.id` |
| `fecha` | TIMESTAMPTZ | Sí |  |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `servicio_id` → `servicios_contratados.id`: relación **N a 1**
- `actor_id` → `usuarios.id`: relación **N a 1**

- Ninguna tabla depende de esta.

## mensajes_servicio

**Origen:** SPEC-08 (canal del servicio; persistencia del chat de SPEC-15)  
**Propósito:** Mensajes intercambiados entre Cliente y Prestador dentro de un servicio contratado.

**Llave primaria:** `id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `id` | UUID | Sí |  |
| `servicio_id` | UUID | Sí | FK a `servicios_contratados.id` |
| `remitente_id` | UUID | Sí | FK a `usuarios.id` |
| `contenido` | TEXT | Sí |  |
| `fecha_envio` | TIMESTAMPTZ | Sí |  |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `servicio_id` → `servicios_contratados.id`: relación **N a 1**
- `remitente_id` → `usuarios.id`: relación **N a 1**

- Ninguna tabla depende de esta.

## notificaciones

**Origen:** SPEC-06, SPEC-07, SPEC-09 unificadas (plan general 6.2)  
**Propósito:** Notificaciones de oportunidades, propuestas y cambios de estado, con estado de entrega. Idempotente por evento.

**Llave primaria:** `id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `id` | UUID | Sí |  |
| `destinatario_id` | UUID | Sí | FK a `usuarios.id` |
| `tipo` | VARCHAR(40) | Sí | Valores: NUEVA_OPORTUNIDAD, PROPUESTA_RECIBIDA, ACEPTACION_PROPUESTA, CAMBIO_ESTADO_SERVICIO, AVISO_SEGURIDAD_CUENTA |
| `aggregate_id` | UUID | Sí |  |
| `event_version` | INTEGER | Sí | Por defecto: 1 |
| `detalle` | VARCHAR(500) | No |  |
| `canal` | VARCHAR(20) | Sí | Valores: PUSH, EMAIL |
| `estado_entrega` | VARCHAR(20) | Sí | Valores: PENDIENTE, ENTREGADA, FALLIDA |
| `intentos` | INTEGER | Sí | Por defecto: 0 |
| `fecha_generacion` | TIMESTAMPTZ | Sí |  |
| `fecha_entrega` | TIMESTAMPTZ | No |  |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `destinatario_id` → `usuarios.id`: relación **N a 1**

- Ninguna tabla depende de esta.

## calificaciones

**Origen:** SPEC-10  
**Propósito:** Calificación de 1 a 5 que un Cliente da a un servicio finalizado. Un solo registro por servicio.

**Llave primaria:** `id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `id` | UUID | Sí |  |
| `servicio_id` | UUID | Sí | FK a `servicios_contratados.id` |
| `cliente_id` | UUID | Sí | FK a `usuarios.id` |
| `prestador_id` | UUID | Sí | FK a `usuarios.id` |
| `valor` | SMALLINT | Sí |  |
| `fecha` | TIMESTAMPTZ | Sí |  |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `servicio_id` → `servicios_contratados.id`: relación **1 a 1**
- `cliente_id` → `usuarios.id`: relación **N a 1**
- `prestador_id` → `usuarios.id`: relación **N a 1**

Desde otras tablas (dependen de esta):

- `resenas.calificacion_id`: relación **1 a 1**

## resenas

**Origen:** SPEC-10  
**Propósito:** Texto opcional que acompaña a una calificación. Una reseña por calificación.

**Llave primaria:** `id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `id` | UUID | Sí |  |
| `calificacion_id` | UUID | Sí | FK a `calificaciones.id` |
| `texto` | TEXT | Sí |  |
| `fecha_creacion` | TIMESTAMPTZ | Sí |  |
| `estado_visibilidad` | VARCHAR(20) | Sí |  |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `calificacion_id` → `calificaciones.id`: relación **1 a 1**

Desde otras tablas (dependen de esta):

- `reportes.resena_id`: relación **1 a N**

## reputaciones_prestador

**Origen:** SPEC-10 (materialización derivada)  
**Propósito:** Reputación agregada de cada Prestador. Es derivada: se puede reconstruir desde calificaciones.

**Llave primaria:** `prestador_id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `prestador_id` | UUID | Sí | FK a `usuarios.id` |
| `valor_agregado` | NUMERIC(3,2) | Sí |  |
| `cantidad_calificaciones` | INTEGER | Sí |  |
| `fecha_calculo` | TIMESTAMPTZ | Sí |  |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `prestador_id` → `usuarios.id`: relación **1 a 1**

- Ninguna tabla depende de esta.

## solicitudes_verificacion

**Origen:** SPEC-10  
**Propósito:** Solicitudes de verificación documental ampliada de un Prestador. Solo una PENDIENTE a la vez.

**Llave primaria:** `id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `id` | UUID | Sí |  |
| `prestador_id` | UUID | Sí | FK a `usuarios.id` |
| `estado` | VARCHAR(10) | Sí | Valores: PENDIENTE, APROBADA, RECHAZADA |
| `fecha_solicitud` | TIMESTAMPTZ | Sí |  |
| `fecha_revision` | TIMESTAMPTZ | No |  |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `prestador_id` → `usuarios.id`: relación **N a 1**

Desde otras tablas (dependen de esta):

- `documentos_verificacion.solicitud_verificacion_id`: relación **1 a N**

## documentos_verificacion

**Origen:** SPEC-10 (storage privado)  
**Propósito:** Documentos enviados para una solicitud de verificación. Guarda la clave en storage privado.

**Llave primaria:** `id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `id` | UUID | Sí |  |
| `solicitud_verificacion_id` | UUID | Sí | FK a `solicitudes_verificacion.id` |
| `archivo_key` | VARCHAR(500) | Sí |  |
| `fecha_carga` | TIMESTAMPTZ | Sí |  |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `solicitud_verificacion_id` → `solicitudes_verificacion.id`: relación **N a 1**

- Ninguna tabla depende de esta.

## reportes

**Origen:** SPEC-10, SPEC-11, SPEC-12 (núcleo compartido)  
**Propósito:** Reporte de una reseña, de un usuario o de un servicio. Tiene exactamente un objetivo según su tipo, y su resolución exige revisión previa y justificación.

**Llave primaria:** `id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `id` | UUID | Sí |  |
| `tipo` | VARCHAR(10) | Sí | Valores: RESENA, USUARIO, SERVICIO |
| `reportante_id` | UUID | Sí | FK a `usuarios.id` |
| `resena_id` | UUID | No | FK a `resenas.id` |
| `usuario_objetivo_id` | UUID | No | FK a `usuarios.id` |
| `servicio_id` | UUID | No | FK a `servicios_contratados.id` |
| `motivo` | VARCHAR(500) | Sí |  |
| `estado` | VARCHAR(12) | Sí | Valores: PENDIENTE, EN_REVISION, RESUELTO, DESCARTADO |
| `detalle_revisado_en` | TIMESTAMPTZ | No |  |
| `justificacion_resolucion` | VARCHAR(1000) | No |  |
| `revisado_por` | UUID | No | FK a `usuarios.id` |
| `fecha_creacion` | TIMESTAMPTZ | Sí |  |
| `fecha_resolucion` | TIMESTAMPTZ | No |  |
| `version` | INTEGER | Sí | Por defecto: 0 |
| `objetivo_ref` | UUID | No | Columna generada |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `reportante_id` → `usuarios.id`: relación **N a 1**
- `resena_id` → `resenas.id`: relación **N a 1**
- `usuario_objetivo_id` → `usuarios.id`: relación **N a 1**
- `servicio_id` → `servicios_contratados.id`: relación **N a 1**
- `revisado_por` → `usuarios.id`: relación **N a 1**

Desde otras tablas (dependen de esta):

- `evidencias_reporte.reporte_id`: relación **1 a N**

## evidencias_reporte

**Origen:** SPEC-11  
**Propósito:** Archivos de evidencia adjuntos a un reporte, siempre asociados a uno existente.

**Llave primaria:** `id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `id` | UUID | Sí |  |
| `reporte_id` | UUID | Sí | FK a `reportes.id` |
| `archivo_key` | VARCHAR(500) | Sí |  |
| `tipo_contenido` | VARCHAR(100) | Sí |  |
| `fecha_carga` | TIMESTAMPTZ | Sí |  |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `reporte_id` → `reportes.id`: relación **N a 1**

- Ninguna tabla depende de esta.

## bloqueos_preventivos

**Origen:** SPEC-12  
**Propósito:** Bloqueos preventivos aplicados por un Administrador a una cuenta, con motivo y estado activo.

**Llave primaria:** `id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `id` | UUID | Sí |  |
| `usuario_id` | UUID | Sí | FK a `usuarios.id` |
| `administrador_id` | UUID | Sí | FK a `usuarios.id` |
| `motivo` | VARCHAR(1000) | Sí |  |
| `fecha_inicio` | TIMESTAMPTZ | Sí |  |
| `fecha_fin` | TIMESTAMPTZ | No |  |
| `activo` | BOOLEAN | Sí |  |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `usuario_id` → `usuarios.id`: relación **N a 1**
- `administrador_id` → `usuarios.id`: relación **N a 1**

- Ninguna tabla depende de esta.

## acciones_moderacion

**Origen:** SPEC-12  
**Propósito:** Acciones de moderación de contenido o perfiles ejecutadas por un Administrador.

**Llave primaria:** `id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `id` | UUID | Sí |  |
| `administrador_id` | UUID | Sí | FK a `usuarios.id` |
| `tipo` | VARCHAR(50) | Sí |  |
| `objetivo_tipo` | VARCHAR(30) | Sí |  |
| `objetivo_id` | UUID | Sí |  |
| `motivo` | VARCHAR(1000) | Sí |  |
| `fecha` | TIMESTAMPTZ | Sí |  |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `administrador_id` → `usuarios.id`: relación **N a 1**

- Ninguna tabla depende de esta.

## marcas_alto_riesgo

**Origen:** SPEC-12  
**Propósito:** Marcas administrativas de seguimiento sobre servicios de alto riesgo. Una activa por servicio.

**Llave primaria:** `id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `id` | UUID | Sí |  |
| `servicio_id` | UUID | Sí | FK a `servicios_contratados.id` |
| `criterio` | VARCHAR(200) | Sí |  |
| `administrador_id` | UUID | Sí | FK a `usuarios.id` |
| `fecha` | TIMESTAMPTZ | Sí |  |
| `activa` | BOOLEAN | Sí |  |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `servicio_id` → `servicios_contratados.id`: relación **N a 1**
- `administrador_id` → `usuarios.id`: relación **N a 1**

- Ninguna tabla depende de esta.

## auditoria_administrativa

**Origen:** SPEC-12 / RNF-005  
**Propósito:** Bitácora append-only de toda acción administrativa. No admite UPDATE ni DELETE (lo impide un trigger).

**Llave primaria:** `id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `id` | UUID | Sí |  |
| `administrador_id` | UUID | Sí | FK a `usuarios.id` |
| `accion` | VARCHAR(100) | Sí |  |
| `objetivo_tipo` | VARCHAR(30) | Sí |  |
| `objetivo_id` | UUID | Sí |  |
| `detalle` | VARCHAR(1000) | No |  |
| `fecha` | TIMESTAMPTZ | Sí |  |
| `trace_id` | VARCHAR(64) | Sí |  |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `administrador_id` → `usuarios.id`: relación **N a 1**

- Ninguna tabla depende de esta.

## rutas_formalizacion

**Origen:** SPEC-13  
**Propósito:** Ruta orientativa de formalización, con sus pasos. Informativa; nunca certifica estatus legal.

**Llave primaria:** `id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `id` | UUID | Sí |  |
| `nombre` | VARCHAR(200) | Sí |  |
| `descripcion` | TEXT | No |  |
| `activa` | BOOLEAN | Sí |  |

### Relaciones

- Sin dependencias hacia otras tablas.

Desde otras tablas (dependen de esta):

- `pasos_formalizacion.ruta_id`: relación **1 a N**
- `progreso_formalizacion.ruta_id`: relación **1 a N**

## pasos_formalizacion

**Origen:** SPEC-13  
**Propósito:** Pasos ordenados de una ruta de formalización.

**Llave primaria:** `id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `id` | UUID | Sí |  |
| `ruta_id` | UUID | Sí | FK a `rutas_formalizacion.id` |
| `titulo` | VARCHAR(200) | Sí |  |
| `descripcion` | TEXT | No |  |
| `orden` | INTEGER | Sí |  |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `ruta_id` → `rutas_formalizacion.id`: relación **N a 1**

Desde otras tablas (dependen de esta):

- `enlaces_institucionales.paso_id`: relación **1 a N**

## enlaces_institucionales

**Origen:** SPEC-13  
**Propósito:** Enlaces oficiales externos asociados a un paso, con disponibilidad.

**Llave primaria:** `id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `id` | UUID | Sí |  |
| `paso_id` | UUID | Sí | FK a `pasos_formalizacion.id` |
| `nombre` | VARCHAR(200) | Sí |  |
| `url` | VARCHAR(500) | Sí |  |
| `estado` | VARCHAR(15) | Sí | Valores: DISPONIBLE, NO_DISPONIBLE |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `paso_id` → `pasos_formalizacion.id`: relación **N a 1**

- Ninguna tabla depende de esta.

## progreso_formalizacion

**Origen:** SPEC-13 / SPEC-18 (origen pendiente)  
**Propósito:** Progreso orientativo de un Prestador en una ruta. Su origen de cálculo sigue sin definirse en el SPEC-13.

**Llave primaria:** `id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `id` | UUID | Sí |  |
| `prestador_id` | UUID | Sí | FK a `usuarios.id` |
| `ruta_id` | UUID | Sí | FK a `rutas_formalizacion.id` |
| `valor_orientativo` | SMALLINT | Sí |  |
| `fecha_actualizacion` | TIMESTAMPTZ | Sí |  |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `prestador_id` → `usuarios.id`: relación **N a 1**
- `ruta_id` → `rutas_formalizacion.id`: relación **N a 1**

- Ninguna tabla depende de esta.

## preferencias_notificacion

**Origen:** SPEC-14  
**Propósito:** Preferencias de aviso por tipo y canal. Los avisos obligatorios no se pueden deshabilitar.

**Llave primaria:** `usuario_id, tipo_aviso, canal`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `usuario_id` | UUID | Sí | FK a `usuarios.id` |
| `tipo_aviso` | VARCHAR(40) | Sí | Valores: NUEVA_OPORTUNIDAD, PROPUESTA_RECIBIDA, ACEPTACION_PROPUESTA, CAMBIO_ESTADO_SERVICIO, AVISO_SEGURIDAD_CUENTA |
| `canal` | VARCHAR(20) | Sí | Valores: PUSH, EMAIL |
| `habilitada` | BOOLEAN | Sí |  |
| `configurable` | BOOLEAN | Sí |  |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `usuario_id` → `usuarios.id`: relación **N a 1**

- Ninguna tabla depende de esta.

## descargas_historial

**Origen:** SPEC-14  
**Propósito:** Solicitudes de exportación del historial de trabajos y su archivo resultante.

**Llave primaria:** `id`

### Columnas

| Columna | Tipo | Obligatoria | Observación |
|---|---|---|---|
| `id` | UUID | Sí |  |
| `usuario_id` | UUID | Sí | FK a `usuarios.id` |
| `fecha_generacion` | TIMESTAMPTZ | Sí |  |
| `archivo_key` | VARCHAR(500) | No |  |
| `estado` | VARCHAR(15) | No | Valores: GENERANDO, LISTA, FALLIDA |

### Relaciones

Hacia otras tablas (esta tabla depende de):

- `usuario_id` → `usuarios.id`: relación **N a 1**

- Ninguna tabla depende de esta.
