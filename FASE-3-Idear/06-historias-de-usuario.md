# Historias de Usuario

> La trazabilidad de cada historia apunta directamente a `05-modelo-user-persona-y-pov.md`.
---

## 1. Trabajador independiente

### HU-T01 — Perfil visible de servicios
**Como** trabajador independiente,
**quiero** crear un perfil con los servicios que ofrezco y mi zona de cobertura en Santa Marta,
**para** captar y conseguir nuevos clientes de forma recurrente, más allá de mi red de contactos del voz a voz.

**Criterios de aceptación:**
- El perfil incluye al menos: nombre/alias, oficio(s), zona de cobertura, medio de contacto.
- El perfil es visible para cualquier cliente que busque ese tipo de servicio.

---

### HU-T02 — Bandeja centralizada de solicitudes
**Como** trabajador independiente,
**quiero** recibir todas las solicitudes de servicio en un solo lugar dentro de la aplicación,
**para** no perder mensajes que hoy me llegan por WhatsApp, llamadas y redes al mismo tiempo.

**Criterios de aceptación:**
- Toda solicitud generada desde la app queda registrada y visible en un solo listado.
- Puedo ver el estado de cada solicitud (pendiente, aceptada, rechazada).

---

### HU-T03 — Aviso automático de retraso o disponibilidad
**Como** trabajador independiente,
**quiero** poder avisar con pocos toques que voy a llegar tarde o que no puedo atender una cita,
**para** no perder la confianza del cliente sin tener que escribir un mensaje largo mientras trabajo.

**Criterios de aceptación:**
- Puedo enviar un aviso de retraso o cancelación en máximo 2 pasos.
- El aviso no requiere escribir texto libre (opciones predefinidas o por voz).

---

### HU-T04 — Registro de trabajo por voz o de forma mínima
**Como** trabajador independiente,
**quiero** registrar los detalles de un trabajo terminado usando comandos de voz o muy pocos clics,
**para** llevar un historial sin tener que escribir con las manos ocupadas, mojadas o sucias.

**Criterios de aceptación:**
- Puedo registrar un servicio completado en menos de 30 segundos.
- Existe al menos una forma de entrada distinta a escribir texto (voz, selección rápida).

---

### HU-T05 — Resumen de ingresos y rentabilidad
**Como** trabajador independiente,
**quiero** ver un resumen de los trabajos realizados y lo cobrado en un periodo,
**para** saber si mi trabajo me está siendo rentable.

**Criterios de aceptación:**
- Puedo ver el total de servicios y el total cobrado en un rango de fechas.
- El resumen se genera automáticamente a partir de los registros de HU-T04, sin captura manual adicional.

---

### HU-T06 — Agenda organizada por cercanía
**Como** trabajador independiente,
**quiero** ver mis citas del día agrupadas por zona o cercanía,
**para** evitar cruces de horario y desplazamientos innecesarios por la ciudad.

**Criterios de aceptación:**
- Las citas del día se muestran ordenadas cronológicamente.
- Si dos citas se superponen en horario, la app me lo señala.

---

## 2. Cliente

### HU-C01 — Búsqueda de trabajadores por servicio y zona
**Como** cliente,
**quiero** buscar trabajadores independientes disponibles según el tipo de servicio y mi ubicación,
**para** encontrar rápidamente a alguien calificado sin depender solo de referencias personales.

**Criterios de aceptación:**
- Puedo filtrar por tipo de servicio (aires acondicionados, electricidad, plomería, etc.).
- Los resultados muestran trabajadores cuya zona de cobertura incluye mi ubicación.

---

### HU-C02 — Evidencia social del trabajador
**Como** cliente,
**quiero** ver en el perfil del trabajador fotos de trabajos anteriores y reseñas de otros clientes,
**para** elegir con más confianza antes de contratarlo.

**Criterios de aceptación:**
- El perfil del trabajador muestra al menos reseñas o fotos de servicios previos (cuando existan).
- Solo clientes que contrataron el servicio pueden dejar una reseña.

---

### HU-C03 — Presupuesto de referencia antes de la visita
**Como** cliente,
**quiero** recibir un rango de precio estimado antes de que el trabajador llegue a mi casa,
**para** evitar sorpresas en el costo final del servicio.

**Criterios de aceptación:**
- Antes de confirmar la cita, veo un rango de precio estimado según el tipo de servicio.
- El presupuesto final solo puede ajustarse con justificación visible.

---

### HU-C04 — Notificación de llegada o retraso
**Como** cliente,
**quiero** recibir una notificación si el trabajador se va a retrasar o está en camino,
**para** no perder tiempo esperando sin saber qué está pasando.

**Criterios de aceptación:**
- Recibo una notificación automática cuando el trabajador marca un retraso o confirma llegada.
- El aviso incluye una razón breve o un nuevo horario estimado.

---

### HU-C05 — Respaldo del servicio realizado
**Como** cliente,
**quiero** tener una constancia digital del servicio realizado,
**para** poder reclamar si el problema reaparece o se genera un daño posterior.

**Criterios de aceptación:**
- Al finalizar un servicio, queda un registro accesible con fecha, tipo de servicio y trabajador.
- Ese registro es consultable posteriormente por el cliente.

---
