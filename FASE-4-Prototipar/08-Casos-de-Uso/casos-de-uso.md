# Casos de uso del sistema

>Cada caso de uso se deriva de una Historia de Usuario ya aprobada en `08-historias-de-usuario.md`.

## CU-01 — Registrar y configurar perfil de Prestador

**Actor principal:** Prestador
**Historias relacionadas:** HU-T01–T10

**Precondiciones:** El prestador no tiene cuenta o su perfil está incompleto.

**Flujo principal:**
1. El prestador se registra con datos mínimos (rol Prestador).
2. El sistema dirige al onboarding del perfil profesional.
3. El prestador selecciona categorías de servicio que ofrece.
4. El prestador configura zonas de atención.
5. El prestador registra experiencia y carga portafolio de trabajos.
6. El prestador configura disponibilidad general y/o franjas horarias.
7. El prestador consulta la vista previa pública de su perfil.
8. El sistema publica el perfil si cumple los mínimos definidos.

**Flujos alternos:**
- Si el perfil no cumple los mínimos, la cuenta queda activa pero el perfil no se 
  publica (HU-T01).
- Si intenta cargar un archivo de portafolio no permitido, el sistema lo rechaza antes 
  de publicarse (HU-T06).

**Postcondiciones:** El perfil del prestador queda visible para los clientes, con la 
información autorizada según reglas de privacidad (HU-T10).

---

## CU-02 — Publicar solicitud de servicio

**Actor principal:** Cliente
**Historias relacionadas:** HU-C01, HU-C04–C10

**Precondiciones:** El cliente tiene cuenta activa (o se registra en este flujo).

**Flujo principal:**
1. El cliente se registra o inicia sesión.
2. El cliente inicia una solicitud (se crea un borrador privado).
3. El cliente define categoría y descripción del servicio requerido.
4. El cliente adjunta fotografías del problema (opcional).
5. El cliente define zona aproximada y nivel de urgencia (sin dirección exacta).
6. El cliente confirma y publica la solicitud.
7. La solicitud queda visible para prestadores compatibles (estado SOLICITADA/ABIERTA).

**Flujos alternos:**
- Si el borrador está incompleto, el sistema impide publicar y señala los campos 
  faltantes (HU-C05, HU-C08).
- El cliente puede editar la solicitud mientras esté abierta (HU-C09).
- El cliente puede cancelar la solicitud antes de aceptar una propuesta (HU-C10).

**Postcondiciones:** La solicitud queda disponible para el proceso de matching con 
prestadores, sin exponer la dirección exacta del cliente.

---

## CU-03 — Explorar oportunidades y enviar propuesta

**Actor principal:** Prestador
**Historias relacionadas:** HU-T11–T19

**Precondiciones:** Existe al menos una solicitud publicada (CU-02) compatible con el 
perfil del prestador (CU-01).

**Flujo principal:**
1. El prestador recibe notificación de una nueva oportunidad compatible.
2. El prestador filtra oportunidades por categoría, zona o estado.
3. El prestador consulta el detalle de una oportunidad (sin datos privados del cliente).
4. El prestador crea una propuesta: define precio o rango, disponibilidad y un mensaje 
   breve.
5. El prestador envía la propuesta.

**Flujos alternos:**
- Si la solicitud se cierra entre la consulta y el envío, el sistema rechaza la 
  propuesta e informa el estado actualizado (HU-T12, HU-T14).
- El prestador puede editar una propuesta activa antes de que sea aceptada (HU-T18).
- El prestador puede retirar una propuesta que ya no puede cumplir (HU-T19).

**Postcondiciones:** La propuesta queda registrada y visible para el cliente 
correspondiente.

---

## CU-04 — Comparar y aceptar propuesta

**Actor principal:** Cliente
**Historias relacionadas:** HU-C13–C15

**Precondiciones:** La solicitud del cliente (CU-02) tiene al menos una propuesta 
recibida (CU-03).

**Flujo principal:**
1. El cliente recibe notificación de una propuesta nueva.
2. El cliente consulta todas las propuestas activas de su solicitud.
3. El cliente compara precio, reputación, experiencia, portafolio y disponibilidad.
4. El cliente selecciona y acepta una propuesta.
5. El sistema habilita la coordinación: el prestador seleccionado accede a la dirección 
   exacta y datos necesarios para el servicio.

**Flujos alternos:**
- Si una propuesta fue retirada antes de que el cliente la abra, el sistema muestra el 
  estado real y no permite aceptarla (HU-C13).
- Los prestadores no seleccionados nunca reciben la dirección exacta (HU-C02).

**Postcondiciones:** Se genera un servicio activo entre el cliente y el prestador 
seleccionado; las demás propuestas quedan cerradas para esa solicitud.

---

## CU-05 — Ejecutar y cerrar el servicio

**Actor principal:** Prestador y Cliente
**Historias relacionadas:** HU-T20, HU-T27, HU-T28, HU-C (notificación de llegada, 
respaldo del servicio)

**Precondiciones:** Existe un servicio activo derivado de una propuesta aceptada (CU-04).

**Flujo principal:**
1. El prestador recibe notificación de que su propuesta fue aceptada.
2. El prestador marca el inicio del servicio (estado EN_EJECUCIÓN).
3. El cliente recibe notificación de llegada o retraso del prestador, si aplica.
4. El prestador marca el servicio como finalizado.
5. El sistema genera un registro/constancia del servicio (fecha, tipo, prestador).
6. Tanto prestador como cliente pueden consultar el historial del servicio 
   posteriormente.

**Flujos alternos:**
- Si el servicio se cancela antes de finalizar, se conserva el historial de estado sin 
  marcarlo como completado (HU-T20).

**Postcondiciones:** Queda un registro consultable del servicio, disponible para el 
historial del prestador (reputación/actividad) y como respaldo para el cliente.

---
