# Historias de Usuario

> La trazabilidad de cada historia apunta directamente a `05-modelo-user-persona-y-pov.md`.
---

## 1. Trabajador independiente

##### HU-T01 — Perfil visible de servicios
**Como**  trabajador independiente,  **quiero**  crear un perfil con los servicios que ofrezco y mi zona de cobertura en Santa Marta,  **para**  captar y conseguir nuevos clientes de forma recurrente, más allá de mi red de contactos del voz a voz.
**Criterios de aceptación:**
*  El perfil incluye al menos: nombre/alias, oficio(s), zona de cobertura, medio de contacto.
*  El perfil es visible para cualquier cliente que busque ese tipo de servicio.

##### HU-T02 — Bandeja centralizada de solicitudes
**Como**  trabajador independiente,  **quiero**  recibir todas las solicitudes de servicio en un solo lugar dentro de la aplicación,  **para**  no perder mensajes que hoy me llegan por WhatsApp, llamadas y redes al mismo tiempo.
**Criterios de aceptación:**
*  Toda solicitud generada desde la app queda registrada y visible en un solo listado.
*  Puedo ver el estado de cada solicitud (pendiente, aceptada, rechazada).

##### HU-T03 — Aviso automático de retraso o disponibilidad
**Como**  trabajador independiente,  **quiero**  poder avisar con pocos toques que voy a llegar tarde o que no puedo atender una cita,  **para**  no perder la confianza del cliente sin tener que escribir un mensaje largo mientras trabajo.
**Criterios de aceptación:**
*  Puedo enviar un aviso de retraso o cancelación en máximo 2 pasos.
*  El aviso no requiere escribir texto libre (opciones predefinidas o por voz).

##### HU-T04 — Registro de trabajo por voz o de forma mínima
**Como**  trabajador independiente,  **quiero**  registrar los detalles de un trabajo terminado usando comandos de voz o muy pocos clics,  **para**  llevar un historial sin tener que escribir con las manos ocupadas, mojadas o sucias.
**Criterios de aceptación:**
*  Puedo registrar un servicio completado en menos de 30 segundos.
*  Existe al menos una forma de entrada distinta a escribir texto (voz, selección rápida).

##### HU-T05 — Resumen de ingresos y rentabilidad
**Como**  trabajador independiente,  **quiero**  ver un resumen de los trabajos realizados y lo cobrado en un periodo,  **para**  saber si mi trabajo me está siendo rentable.
**Criterios de aceptación:**
*  Puedo ver el total de servicios and el total cobrado en un rango de fechas.
*  El resumen se genera automáticamente a partir de los registros de HU-T04, sin captura manual adicional.

##### HU-T06 — Agenda organizada por cercanía
**Como**  trabajador independiente,  **quiero**  ver mis citas del día agrupadas por zona o cercanía,  **para**  evitar cruces de horario y desplazamientos innecesarios por la ciudad.
**Criterios de aceptación:**
*  Las citas del día se muestran ordenadas cronológicamente.
*  Si dos citas se superponen en horario, la app me lo señala.

##### HU-T01 — Registro de prestador
**Como** Prestador independiente, **quiero** crear una cuenta como prestador, **para** iniciar la configuración de su oferta y acceder a oportunidades.

**Criterios de aceptación:**
* Dado un visitante, cuando selecciona el rol Prestador y completa los datos mínimos, entonces se crea una cuenta con rol Prestador.
* Dado el alta exitosa, cuando ingresa por primera vez, entonces el sistema lo dirige al onboarding del perfil profesional.
* Dado un perfil aún incompleto, cuando termina el registro, entonces la cuenta queda activa pero el perfil no se publica hasta cumplir los mínimos definidos.
* Dado un intento de acceder a funciones exclusivas de cliente, cuando el usuario solo posee rol Prestador, entonces el acceso se deniega.

##### HU-T02 — Editar perfil profesional
**Como** Prestador, **quiero** actualizar la información de mi perfil, **para** mantener vigente mi oferta y experiencia.

**Criterios de aceptación:**
* Dado un prestador propietario del perfil, cuando modifica campos editables y guarda, entonces se actualiza el perfil.
* Dado un usuario distinto, cuando intenta editar el perfil de otro prestador, entonces el sistema deniega la operación.
* Dado un cambio que afecte campos verificados, cuando se modifica, entonces el sistema conserva o invalida el estado de verificación según la regla definida.
* Dado un contenido inválido o no permitido, cuando se intenta guardar, entonces se rechaza sin sobrescribir la versión válida.

##### HU-T03 — Seleccionar categorías de servicio
**Como** Prestador, **quiero** indicar los servicios que realizo, **para** recibir solicitudes relacionadas con mis capacidades.

**Criterios de aceptación:**
* Dado un prestador, cuando selecciona una o más categorías activas, entonces quedan asociadas a su perfil.
* Dada una categoría desactivada por administración, cuando el prestador edita su perfil, entonces no puede agregarla nuevamente.
* Dado un perfil sin ninguna categoría cuando el mínimo exige al menos una, cuando intenta publicarlo, entonces la publicación se bloquea.
* Dado un cambio de categorías, cuando se guarda, entonces el matching futuro utiliza la nueva configuración.

##### HU-T04 — Configurar zonas de atención
**Como** Prestador, **quiero** definir las zonas en las que puedo desplazarme, **para** evitar oportunidades inviables por ubicación.

**Criterios de aceptación:**
* Dado un prestador, cuando selecciona sus zonas de atención, entonces quedan asociadas a su perfil.
* Dado un cambio de zonas, cuando se confirma, entonces nuevas oportunidades se filtran según la configuración vigente.
* Dada una zona inactiva, cuando el prestador consulta el selector, entonces no puede agregarla como nueva zona.
* Dado un perfil sin zonas cuando el negocio exige al menos una, cuando intenta publicarlo, entonces se solicita completar la información.

##### HU-T05 — Registrar experiencia profesional
**Como** Prestador, **quiero** describir mi experiencia y trayectoria, **para** dar al cliente contexto para evaluar mi capacidad.

**Criterios de aceptación:**
* Dado un prestador, cuando registra experiencia en los campos permitidos, entonces la información se guarda y puede mostrarse en el perfil público.
* Dado contenido que excede límites o contiene formato no soportado, cuando se guarda, entonces el sistema valida y muestra instrucciones claras.
* Dada información declarada por el prestador, cuando se muestra al cliente, entonces no se presenta como verificada si no existe validación real.

##### HU-T06 — Cargar portafolio de trabajos
**Como** Prestador, **quiero** agregar fotografías de trabajos anteriores, **para** demostrar visualmente mi experiencia.

**Criterios de aceptación:**
* Dado un archivo permitido dentro del tamaño máximo, cuando se carga, entonces queda asociado al portafolio del prestador.
* Dado un archivo con formato, tamaño o contenido no permitido por las reglas técnicas, cuando se intenta cargar, entonces se rechaza antes de publicarse.
* Dada una carga exitosa, cuando el cliente consulta el perfil, entonces puede visualizar el elemento aprobado/publicado.
* Dado un fallo de carga, cuando ocurre, entonces el sistema no crea un registro huérfano ni muestra una imagen rota.

##### HU-T07 — Eliminar elemento de portafolio
**Como** Prestador, **quiero** retirar una evidencia de mi portafolio, **para** mantener actualizado el contenido que deseo mostrar.

**Criterios de aceptación:**
* Dado un elemento propio, cuando el prestador confirma su eliminación, entonces deja de mostrarse públicamente.
* Dado un elemento ajeno, cuando intenta eliminarlo, entonces el sistema deniega la operación.
* Dado un elemento relacionado con una moderación activa, cuando su eliminación deba conservarar evidencia, entonces se aplica la política de auditoría sin mantenerlo visible públicamente.

##### HU-T08 — Configurar disponibilidad general
**Como** Prestador, **quiero** indicar cuándo suelo estar disponible, **para** facilitar que el cliente compare opciones viables.

**Criterios de aceptación:**
* Dado un prestador, cuando define disponibilidad general, entonces esta queda visible en su perfil o propuestas según el diseño.
* Dado que modifica su disponibilidad, cuando guarda, entonces las nuevas propuestas y vistas usan la información actualizada.
* Dado que no desea publicar disponibilidad, cuando la deja sin configurar, entonces el sistema no inventa horarios ni la presenta como disponible.

##### HU-T09 — Gestionar agenda y franjas horarias
**Como** Prestador, **quiero** configurar franjas específicas de disponibilidad, **para** reducir propuestas incompatibles con mi agenda.

**Criterios de aceptación:**
* Dado un prestador, cuando crea una franja válida, entonces queda asociada a su agenda.
* Dadas franjas superpuestas, cuando el sistema detecta un conflicto no permitido, entonces solicita corrección antes de guardar.
* Dada una franja pasada, cuando se consulta la disponibilidad futura, entonces no se ofrece como opción vigente.
* Dada una propuesta con disponibilidad declarada, cuando contradice una restricción dura de agenda, entonces el sistema advierte al prestador antes de enviarla.

##### HU-T10 — Consultar vista previa del perfil
**Como** Prestador, **quiero** ver cómo se presenta mi perfil al cliente, **para** corregir información antes de depender de ella comercialmente.

**Criterios de aceptación:**
* Dado un prestador, cuando abre la vista previa, entonces visualiza solo los campos que un cliente tendría permitido ver.
* Dado un dato privado, cuando se genera la vista previa pública, entonces no aparece.
* Dado un campo pendiente de verificación, cuando se muestra, entonces utiliza la etiqueta correspondiente y no una afirmación de validación.

##### HU-T11 — Filtrar oportunidades
**Como** Prestador, **quiero** filtrar solicitudes por categoría, zona y estado, **para** priorizar las oportunidades que puedo atender.

**Criterios de aceptación:**
* Dado un tablero con resultados, cuando aplica categoría, zona o estado, entonces el listado cumple los filtros seleccionados.
* Dado un conjunto de filtros sin coincidencias, cuando se aplica, entonces se presenta un estado vacío y opción de limpiar filtros.
* Dado un filtro inválido manipulado desde la URL/API, cuando se procesa, entonces el servidor valida los valores admitidos.

##### HU-T12 — Consultar detalle de oportunidad
**Como** Prestador, **quiero** ver el contexto permitido de una solicitud, **para** decidir si conviene enviar una propuesta.

**Criterios de aceptación:**
* Dada una oportunidad compatible, cuando el prestador abre el detalle, entonces visualiza categoría, descripción, fotos autorizadas, zona aproximada, urgencia y estado.
* Dada la fase previa a aceptación, cuando consulta, entonces no recibe la dirección exacta ni datos de contacto privados del cliente.
* Dada una solicitud cerrada entre la carga del listado y el detalle, cuando intenta cotizar, entonces el sistema informa que ya no está disponible.

##### HU-T13 — Notificar nueva oportunidad compatible
**Como** Prestador, **quiero** recibir aviso de nuevas solicitudes relevantes, **para** responder a tiempo y reducir pérdida de trabajos.

**Criterios de aceptación:**
* Dada una nueva solicitud compatible, cuando se genera el matching, entonces se crea una notificación por los canales habilitados sin duplicados innecesarios.
* Dado que el prestador desactivó un canal opcional, cuando se envía el evento, entonces se respeta su preferencia.
* Dada una solicitud que se cierra antes de que el prestador abra la notificación, cuando accede, entonces el sistema informa el estado real y no permite cotizar.

##### HU-T14 — Crear propuesta
**Como** Prestador, **quiero** enviar una cotización a una solicitud, **para** competir por el trabajo con condiciones claras.

**Criterios de aceptación:**
* Dada una solicitud elegible, cuando el prestador completa los campos mínimos de propuesta and confirma, entonces se crea una propuesta asociada a esa solicitud y prestador.
* Dado un intento de enviar múltiples propuestas activas del mismo prestador a la misma solicitud cuando la regla no lo permite, entonces el sistema exige editar la existente.
* Dada una solicitud cerrada durante el envío, cuando se confirma, entonces el servidor rechaza la propuesta y muestra el estado actualizado.
* Dada una propuesta creada, cuando finaliza, entonces queda registrada su fecha y estado inicial.

##### HU-T15 — Definir precio o rango en propuesta
**Como** Prestador, **quiero** indicar el valor o rango estimado del trabajo, **para** dar al cliente una base explícita para comparar.

**Criterios de aceptación:**
* Dado un prestador, cuando registra un precio o rango válido según la configuración, entonces el valor queda asociado a la propuesta.
* Dado un rango, cuando el mínimo supera el máximo o los valores son inválidos, entonces el sistema impide el envío.
* Dado que el valor es estimado y puede variar por alcance/materiales, cuando se muestra al cliente, entonces la interfaz debe distinguir claramente precio/rango estimado de precio final si esa diferencia aplica.
* Dado un valor monetario, cuando se presenta, entonces utiliza formato y moneda definidos para el piloto.

##### HU-T16 — Indicar disponibilidad en propuesta
**Como** Prestador, **quiero** informar cuándo puedo atender el servicio, **para** permitir que el cliente compare opciones realizables.

**Criterios de aceptación:**
* Dado un prestador, cuando selecciona o escribe una disponibilidad válida, entonces queda asociada a la propuesta.
* Dada una disponibilidad en el pasado, cuando intenta enviar, entonces el sistema solicita una fecha/franja válida.
* Dada una agenda habilitada, cuando selecciona disponibilidad, entonces el sistema puede usar sus franjas configuradas como apoyo sin imponer horarios inexistentes.

##### HU-T17 — Agregar mensaje de propuesta
**Como** Prestador, **quiero** acompañar mi propuesta con aclaraciones breves, **para** explicar condiciones o supuestos relevantes.

**Criterios de aceptación:**
* Dado un prestador, cuando agrega un mensaje dentro de los límites permitidos, entonces este se guarda con la propuesta.
* Dado contenido prohibido o no permitido por reglas de moderación, cuando se intenta enviar, entonces el sistema lo rechaza o lo somete al tratamiento definido.
* Dado que aún no hay aceptación, cuando se diseña el mensaje, entonces la plataforma puede aplicar reglas para evitar exposición prematura de datos privados si así se define.

##### HU-T18 — Editar propuesta activa
**Como** Prestador, **quiero** corregir una propuesta antes de que sea aceptada, **para** mantener vigentes precio y disponibilidad.

**Criterios de aceptación:**
* Dada una propuesta activa propia, cuando el prestador modifica campos permitidos, entonces se guarda una nueva versión o se registra el cambio según la estrategia de auditoría.
* Dada una propuesta ya aceptada, retirada o cerrada, cuando intenta editarla, entonces la operación se bloquea.
* Dado un cambio material, cuando se confirma, entonces el cliente ve los valores actuales y la trazabilidad técnica conserva el evento.

##### HU-T19 — Retirar propuesta
**Como** Prestador, **quiero** retirar una propuesta que ya no puedo cumplir, **para** evitar que el cliente seleccione una oferta inválida.

**Criterios de aceptación:**
* Dada una propuesta activa propia, cuando el prestador confirma Retirar, entonces cambia a estado RETIRADA y deja de ser aceptable.
* Dada una propuesta aceptada, cuando intenta retirarla, entonces se dirige al flujo de cancelación/gestión del servicio.
* Dada una retirada, cuando el cliente consulta propuestas, entonces ve el estado correspondiente o la propuesta se excluye de opciones activas según diseño, sin perder trazabilidad.

##### HU-T20 — Marcar servicio en ejecución
**Como** Prestador seleccionado, **quiero** indicar que el trabajo comenzó, **para** mantener trazabilidad operativa.

**Criterios de aceptación:**
* Dado un servicio listo para iniciar, cuando el prestador confirma el inicio, entonces cambia a EN_EJECUCION.
* Dado un servicio ya finalizado o cancelado, cuando intenta iniciar, entonces la transición se rechaza.
* Dada una transición válida, cuando ocurre, entonces se registra actor, fecha y estado anterior/nuevo.

##### HU-T21 — Solicitar verificación documental ampliada
**Como** Prestador, **quiero** aportar documentación adicional, **para** mejorar mis señales de confianza cuando el piloto habilite ese proceso.

**Criterios de aceptación:**
* Dado un prestador, cuando inicia la verificación, entonces el sistema solicita únicamente los documentos definidos para el nivel correspondiente.
* Dado un documento sensible, cuando se carga, entonces no se publica directamente en el perfil.
* Dado un archivo inválido o no admitido, cuando se intenta cargar, entonces se rechaza de forma segura.
* Dado un resultado de revisión, cuando se completa, entonces el prestador visualiza el estado sin exponer información interna innecesaria.

##### HU-T22 — Consultar ruta de formalización
**Como** Prestador, **quiero** acceder a una ruta progresiva de formalización, **para** conocer posibles siguientes pasos sin que la plataforma me etiquete legalmente.

**Criterios de aceptación:**
* Dado un prestador, cuando abre la ruta, entonces visualiza las dimensiones y pasos informativos definidos para el producto.
* Dado contenido de orientación, cuando se presenta, entonces se deja claro que la plataforma orienta y no sustituye a las entidades oficiales.
* Dado que una fuente oficial cambia o queda desactualizada, cuando se mantiene el contenido, entonces debe poder actualizarse sin alterar el historial del prestador.

##### HU-T23 — Consultar checklist por cuatro dimensiones
**Como** Prestador, **quiero** ver la formalización separada en entrada, insumos, producción y tributaria, **para** comprender que el proceso es multidimensional.

**Criterios de aceptación:**
* Dado un prestador, cuando consulta la ruta, entonces puede diferenciar Entrada, Insumos, Producción y Tributaria.
* Dado un paso no aplicable universalmente, cuando se presenta, entonces se redacta como orientación condicionada y no como obligación legal automática.
* Dado un enlace asociado a un paso, cuando se abre, entonces identifica la fuente oficial correspondiente.

##### HU-T24 — Registrar avance declarado en checklist
**Como** Prestador, **quiero** marcar qué pasos he revisado o completado, **para** seguir mi progreso de manera personal.

**Criterios de aceptación:**
* Dado un paso del checklist, cuando el prestador marca su avance, entonces el sistema guarda el estado como progreso declarado salvo que exista verificación independiente.
* Dado un paso declarado como completado, cuando se muestra públicamente, entonces no se transforma automáticamente en una insignia de verificación.
* Dado un cambio de estado del paso, cuando se guarda, entonces queda disponible en consultas posteriores del prestador.

##### HU-T25 — Abrir enlaces oficiales de formalización
**Como** Prestador, **quiero** acceder a fuentes oficiales desde cada paso, **para** realizar trámites o informarme en el canal correcto.

**Criterios de aceptación:**
* Dado un paso con fuente oficial, cuando el prestador selecciona el enlace, entonces se abre el destino configurado y se identifica como externo/oficial.
* Dado un enlace deshabilitado por administración, cuando se consulta la ruta, entonces no se ofrece como válido.
* Dado un cambio de URL, cuando el contenido se actualiza, entonces no requiere cambios en el código de negocio si el modelo de configuración lo permite.

##### HU-T26 — Vincular ruta institucional futura
**Como** Prestador, **quiero** acceder a iniciativas institucionales como Ruta 500+ cuando exista articulación, **para** continuar el proceso fuera del marketplace con aliados pertinentes.

**Criterios de aceptación:**
* Dado un aliado institucional configurado, cuando el prestador consulta la ruta, entonces puede acceder a la información o deivación autorizada.
* Dado que no existe integración técnica, cuando se ofrece un enlace, entonces no se presenta como intercambio automático de datos.
* Dado que una futura integración comparte datos, cuando se diseñe, entonces requerirá consentimiento, alcance y reglas de privacidad específicas antes de habilitarse.

##### HU-T27 — Notificar aceptación de propuesta
**Como** Prestador, **quiero** recibir aviso cuando mi propuesta es aceptada, **para** coordinar el servicio oportunamente.

**Criterios de aceptación:**
* Dada una aceptación exitosa, cuando se confirma, entonces el prestador recibe una notificación vinculada al servicio creado.
* Dado que el evento ya fue notificado, cuando se reintenta la entrega, entonces el sistema evita duplicados visuales innecesarios.
* Dado que la aceptación fue revertida solo mediante un flujo válido de cancelación, cuando el prestador abre una notificación antigua, entonces ve el estado real del servicio.

##### HU-T28 — Consultar historial de trabajos
**Como** Prestador, **quiero** ver servicios realizados y su estado, **para** construir evidencia de actividad y reputación acumulada.

**Criterios de aceptación:**
* Dado un prestador, cuando consulta su historial, entonces visualiza servicios autorizados con fecha, categoría, estado y calificación cuando exista.
* Dado un servicio cancelado, cuando se muestra, entonces se diferencia de un trabajo finalizado.
* Dado un usuario ajeno, cuando intenta acceder al historial privado del prestador, entonces no recibe datos más allá de lo que el perfil público permita.

##### HU-T29 — Insignia de progreso de formalización
**Como** Prestador, **quiero** mostrar un nivel de progreso claramente definido, **para** comunicar avances sin afirmar un estatus legal inexistente.

**Criterios de aceptación:**
* Dado un prestador con progreso elegible, cuando se muestra una insignia, entonces el significado exacto es consultable.
* Dado un progreso declarado pero no verificado, cuando se presenta, entonces la insignia no utiliza lenguaje que implique validación oficial.
* Dado un cambio de criterios, cuando se recalcula, entonces se conserva la trazabilidad del origen del estado visible.

##### HU-T30 — Onboarding asistido por WhatsApp o gestor comunitario
**Como** Prestador, **quiero** recibir acompañamiento para completar el onboarding, **para** usar la plataforma aun con baja alfabetización digital.

**Criterios de aceptación:**
* Dado un prestador que requiere ayuda, cuando inicia onboarding asistido, entonces el gestor/canal solo puede registrar información con autorización del usuario.
* Dado que se modifica el perfil mediante asistencia, cuando se guarda, entonces queda trazabilidad del mecanismo/actor autorizado según la política.
* Dado que el prestador continúa por sí mismo, cuando accede a su cuenta, entonces mantiene control sobre su información.

---

## 2. Cliente

##### HU-C01 — Búsqueda de trabajadores por servicio y zona
**Como**  cliente,  **quiero**  buscar trabajadores independientes disponibles según el tipo de servicio y mi ubicación,  **para**  encontrar rápidamente a alguien calificado sin depender solo de referencias personales.
**Criterios de aceptación:**
*  Puedo filtrar por tipo de servicio (aires acondicionados, electricidad, plomería, etc.).
*  Los resultados muestran trabajadores cuya zona de cobertura incluye mi ubicación.

##### HU-C02 — Evidencia social del trabajador
**Como**  cliente,  **quiero**  ver en el perfil del trabajador fotos de trabajos anteriores y reseñas de otros clientes,  **para**  elegir con más confianza antes de contratarlo.
**Criterios de aceptación:**
*  El perfil del trabajador muestra al menos reseñas o fotos de servicios previos (cuando existan).
*  Solo clientes que contrataron el servicio pueden dejar una reseña.

##### HU-C03 — Presupuesto de referencia antes de la visita
**Como**  cliente,  **quiero**  recibir un rango de precio estimado antes de que el trabajador llegue a mi casa,  **para**  evitar sorpresas en el costo final del servicio.
**Criterios de aceptación:**
*  Antes de confirmar la cita, veo un rango de precio estimado según el tipo de servicio.
*  El presupuesto final solo puede ajustarse con justificación visible.

##### HU-C04 — Notificación de llegada o retraso
**Como**  cliente,  **quiero**  recibir una notificación si el trabajador se va a retrasar o está en camino,  **para**  no perder tiempo esperando sin saber qué está pasando.
**Criterios de aceptación:**
*  Recibo una notificación automática cuando el trabajador marca un retraso o confirma llegada.
*  El aviso incluye una razón breve o un nuevo horario estimado.

##### HU-C05 — Respaldo del servicio realizado
**Como**  cliente,  **quiero**  tener una constancia digital del servicio realizado,  **para**  poder reclamar si el problema reaparece o se genera un daño posterior.
**Criterios de aceptación:**
*  Al finalizar un servicio, queda un registro accesible con fecha, tipo de servicio y trabajador.
*  Ese registro es consultable posteriormente por el cliente.

##### HU-C01 — Registro de cliente
**Como** Cliente, **quiero** crear una cuenta con datos mínimos, **para** publicar necesidades y conservar su historial sin un onboarding extenso.

**Criterios de aceptación:**
* Dado un visitante sin cuenta, cuando completa los campos obligatorios y acepta los términos aplicables, entonces el sistema crea una cuenta con rol Cliente.
* Dado un contacto ya asociado a una cuenta activa, cuando intenta registrarlo nuevamente, entonces el sistema impide el duplicado e informa que debe iniciar sesión o recuperar acceso.
* Dado un registro válido, cuando finaliza el proceso, entonces el usuario puede seleccionar su zona aproximada y acceder al inicio de cliente.
* Dado un campo obligatorio inválido o vacío, cuando intenta continuar, entonces el sistema muestra el error junto al campo sin perder los datos válidos ya ingresados.

##### HU-C02 — Separar ubicación aproximada y dirección exacta
**Como** Cliente, **quiero** registrar una dirección exacta de forma privada para un servicio, **para** coordinar el trabajo sin exponer mi hogar durante la fase abierta.

**Criterios de aceptación:**
* Dado un cliente que registra una dirección exacta, cuando la solicitud está abierta, entonces los prestadores solo reciben la zona aproximada.
* Dado que una propuesta es aceptada, cuando se habilita la coordinación, entonces únicamente el prestador seleccionado puede acceder a los datos autorizados para el servicio.
* Dado un prestador no seleccionado, cuando consulta la solicitud después de la aceptación, entonces nunca recibe la dirección exacta.
* Dada una cancelación previa a la aceptación, cuando ocurre, entonces la dirección exacta no se revela a ningún prestador.

##### HU-C03 — Filtrar y ordenar prestadores
**Como** Cliente, **quiero** refinar el listado de prestadores, **para** reducir el esfuerzo de comparación.

**Criterios de aceptación:**
* Dado un listado, cuando aplica filtros disponibles como categoría, zona o reputación, entonces los resultados se actualizan de acuerdo con esos criterios.
* Dado un filtro sin resultados, cuando se aplica, entonces el sistema muestra un estado vacío comprensible y permite modificarlo.
* Dado un criterio no pertinente a la prestación del servicio, cuando se diseñan filtros, entonces no se incorporan atributos personales discriminatorios.

##### HU-C04 — Crear borrador de solicitud
**Como** Cliente, **quiero** iniciar una solicitud y conservarla antes de publicar, **para** completar la necesidad sin perder información por interrupciones.

**Criterios de aceptación:**
* Dado un cliente, cuando inicia una nueva solicitud, entonces el sistema crea o mantiene un borrador privado.
* Dado un borrador incompleto, cuando el usuario sale y vuelve posteriormente, entonces puede continuar si la política de producto así lo habilita.
* Dado un borrador, cuando otro prestador consulta oportunidades, entonces nunca aparece hasta ser publicado.

##### HU-C05 — Definir categoría y descripción
**Como** Cliente, **quiero** describir qué servicio necesito, **para** permitir que los prestadores comprendan el alcance inicial.

**Criterios de aceptación:**
* Dado un borrador, cuando el cliente selecciona una categoría activa y escribe una descripción válida, entonces la información queda asociada a la solicitud.
* Dado que falta categoría o descripción mínima, cuando intenta publicar, entonces el sistema impide la publicación e identifica los campos pendientes.
* Dado texto que excede límites o incumple reglas de contenido, cuando se guarda/publica, entonces el sistema solicita corrección.

##### HU-C06 — Adjuntar fotos a solicitud
**Como** Cliente, **quiero** agregar fotografías del problema o necesidad, **para** dar contexto visual para recibir propuestas más pertinentes.

**Criterios de aceptación:**
* Dado un archivo permitido, cuando el cliente lo carga, entonces queda asociado a la solicitud.
* Dado un archivo no permitido o que excede límites, cuando intenta subirlo, entonces se rechaza con un mensaje claro.
* Dado que una foto contiene metadatos sensibles y la política técnica exige removerlos, cuando se procesa, entonces se aplica la sanitización definida antes de su publicación.
* Dado un error de carga, cuando ocurre, entonces no se publica una referencia inválida.

##### HU-C07 — Definir zona aproximada y urgencia
**Como** Cliente, **quiero** indicar dónde y con qué urgencia necesito el servicio, **para** recibir propuestas compatibles sin revelar mi dirección exacta.

**Criterios de aceptación:**
* Dado un cliente, cuando selecciona una zona activa y un nivel de urgencia disponible, entonces la solicitud conserva ambos datos.
* Dada una solicitud abierta, cuando un prestador la consulta, entonces visualiza la zona aproximada y urgencia, no la dirección exacta.
* Dada una zona no disponible para nuevas solicitudes, cuando el cliente intenta seleccionarla, entonces el sistema no permite publicarla.

##### HU-C08 — Publicar solicitud
**Como** Cliente, **quiero** publicar una necesidad completa, **para** hacerla visible a prestadores compatibles.

**Criterios de aceptación:**
* Dado un borrador completo, cuando el cliente confirma Publicar, entonces la solicitud cambia a estado SOLICITADA/ABIERTA y entra al proceso de matching.
* Dado un borrador incompleto, cuando intenta publicarlo, entonces permanece como borrador y se muestran faltantes.
* Dada una publicación exitosa, cuando finaliza, entonces queda registrada la fecha de publicación y el cliente puede ver el estado actual.
* Dada una solicitud publicada, cuando se consulta desde otro cliente, entonces no se expone información privada del solicitante.

##### HU-C09 — Editar solicitud abierta
**Como** Cliente, **quiero** corregir una solicitud antes de contratar, **para** mantener actualizada la información que reciben los prestadores.

**Criterios de aceptación:**
* Dada una solicitud abierta propia, cuando el cliente edita campos permitidos, entonces los cambios se guardan.
* Dada una solicitud con propuestas activas, cuando se modifica información material como categoría, zona o alcance, entonces el sistema aplica la regla definida para informar/invalidar propuestas afectadas antes de confirmar.
* Dada una propuesta ya aceptada, cuando el cliente intenta editar campos que cambian el acuerdo, entonces la edición directa se bloquea y se dirige al flujo de coordinación/cancelación correspondiente.
* Dado un usuario que no es propietario, cuando intenta editar, entonces se deniega el acceso.

##### HU-C10 — Cancelar solicitud abierta
**Como** Cliente, **quiero** cancelar una necesidad que ya no requiere, **para** detener nuevas propuestas y evitar trabajo innecesario.

**Criterios de aceptación:**
* Dada una solicitud abierta propia, cuando el cliente confirma Cancelar, entonces cambia a estado CANCELADA y deja de aceptar propuestas.
* Dada una solicitud cancelada, cuando un prestador actualiza el tablero, entonces ya no aparece como oportunidad activa.
* Dada una propuesta ya aceptada, cuando el cliente intenta usar Cancelar solicitud, entonces el sistema dirige al flujo de cancelación de servicio, no al de solicitud abierta.
* Dada una cancelación, cuando se ejecuta, entonces se conserva el historial de estado.

##### HU-C11 — Consultar mis solicitudes
**Como** Cliente, **quiero** ver solicitudes activas y anteriores, **para** hacer seguimiento sin depender de mensajes externos.

**Criterios de aceptación:**
* Dado un cliente con solicitudes, cuando abre su historial/listado, entonces visualiza al menos identificación, categoría, fecha y estado.
* Dado un cliente sin solicitudes, cuando consulta, entonces se muestra un estado vacío con acción para publicar.
* Dado un usuario distinto, cuando intenta consultar solicitudes privadas ajenas, entonces el sistema deniega el acceso.
* Dado un listado extenso, cuando aumenta el volumen, entonces la consulta debe soportar paginación o mecanismo equivalente.

##### HU-C12 — Consultar detalle y estado de solicitud
**Como** Cliente, **quiero** ver el detalle y evolución de una solicitud, **para** comprender qué está ocurriendo y qué acciones siguen disponibles.

**Criterios de aceptación:**
* Dado un cliente propietario, cuando abre el detalle, entonces visualiza la información publicada, estado, propuestas asociadas autorizadas y acciones disponibles.
* Dado un cambio de estado, cuando vuelve a consultar, entonces visualiza el estado actual y, cuando aplique, su historial.
* Dada una solicitud cancelada o cerrada, cuando se consulta, entonces no se muestran acciones incompatibles con el estado.

##### HU-C13 — Notificar propuesta recibida
**Como** Cliente, **quiero** recibir aviso cuando un prestador cotiza, **para** comparar opciones sin revisar constantemente la plataforma.

**Criterios de aceptación:**
* Dada una propuesta nueva, cuando se crea, entonces el cliente recibe una notificación por el canal habilitado.
* Dadas múltiples propuestas, cuando se generan avisos, entonces cada evento se asocia a la solicitud correcta.
* Dada una propuesta retirada antes de abrir el aviso, cuando el cliente accede, entonces visualiza el estado real y no puede aceptarla.

##### HU-C14 — Consultar propuestas recibidas
**Como** Cliente, **quiero** ver todas las propuestas activas de una solicitud, **para** comparar alternativas en un solo flujo.

**Criterios de aceptación:**
* Dada una solicitud con propuestas, cuando el cliente abre la sección correspondiente, entonces visualiza las propuestas autorizadas con precio/rango, disponibilidad, prestador y estado.
* Dada una solicitud sin propuestas, cuando consulta, entonces se muestra un estado vacío claro.
* Dado otro usuario, cuando intenta consultar propuestas de una solicitud ajena, entonces el sistema deniega el acceso.

##### HU-C15 — Comparar propuestas y perfiles
**Como** Cliente, **quiero** comparar precio, reputación, experiencia, portafolio, disponibilidad y verificación, **para** elegir con mayor confianza.

**Criterios de aceptación:**
* Dado un conjunto de propuestas, cuando el cliente compara, entonces dispone de los atributos mínimos definidos para decisión sin mezclar datos privados.
* Dado un indicador no disponible, cuando se presenta la comparación, entonces se muestra como no disponible y no se inventa un valor.
* Dado un nivel de verificación, cuando se muestra, entonces puede consultarse su significado exacto.
* Dado un prestador, cuando el cliente abre su perfil desde la propuesta, entonces mantiene el contexto para regresar a la comparación.

##### HU-C16 — Aceptar propuesta
**Como** Cliente, **quiero** seleccionar al prestador elegido, **para** confirmar quién realizará el servicio.

**Criterios de aceptación:**
* Dada una propuesta activa, cuando el cliente confirma la aceptación, entonces esa propuesta cambia a ACEPTADA y la solicitud cambia al estado contractual correspondiente.
* Dado que la aceptación es exitosa, cuando se completa, entonces se crea/habilita el registro del servicio y la coordinación entre las partes.
* Dadas otras propuestas activas de la misma solicitud, cuando una se acepta, entonces dejan de ser seleccionables y pasan al estado definido de cierre/rechazo.
* Dada una aceptación concurrente desde dos sesiones, cuando el servidor procesa ambas, entonces solo una puede confirmarse y la segunda recibe el estado actualizado.

##### HU-C17 — Confirmar finalización del servicio
**Como** Cliente, **quiero** confirmar que el servicio puede cerrarse, **para** evitar reputación sobre trabajos que siguen abiertos.

**Criterios de aceptación:**
* Dado un servicio que puede finalizarse, cuando el cliente confirma el cierre, entonces el estado pasa a FINALIZADO si así lo define el flujo.
* Dado un desacuerdo o problema, cuando el cliente no confirma, entonces puede usar el canal de reporte/disputa previsto en lugar de generar una finalización silenciosa.
* Dado un servicio ya finalizado, cuando intenta confirmarlo otra vez, entonces la operación es idempotente o se rechaza sin duplicar eventos.

##### HU-C18 — Calificar servicio finalizado
**Como** Cliente, **quiero** calificar un servicio realmente completado, **para** ayudar a otros clientes y construir reputación del prestador.

**Criterios de aceptación:**
* Dado un servicio finalizado sin calificación del cliente, cuando este registra una puntuación válida, entonces se crea una calificación vinculada al servicio y prestador.
* Dado un servicio no finalizado, cuando intenta calificar, entonces el sistema impide la acción.
* Dado un cliente ajeno al servicio, cuando intenta calificarlo, entonces se deniega la operación.
* Dada una calificación creada, cuando se guarda, entonces actualiza la reputación agregada según la regla definida.

##### HU-C19 — Agregar reseña textual
**Como** Cliente, **quiero** acompañar mi puntuación con un comentario, **para** dar contexto cualitativo a futuros clientes.

**Criterios de aceptación:**
* Dado un cliente autorizado, cuando registra un comentario dentro de los límites, entonces queda asociado a la calificación.
* Dado contenido reportable o prohibido, cuando se detecta/reporta, entonces puede ser moderado sin eliminar la evidencia de auditoría necesaria.
* Dado que no desea comentar, cuando la regla permite solo puntuación, entonces puede finalizar la calificación sin texto.

##### HU-C20 — Mapa visual de prestadores
**Como** Cliente, **quiero** ver prestadores en una representación geográfica aproximada, **para** comprender cercanía sin exponer ubicaciones exactas.

**Criterios de aceptación:**
* Dado un conjunto de prestadores, cuando se muestra el mapa, entonces utiliza ubicaciones aproximadas o zonas y no domicilios privados.
* Dado un prestador sin dato geográfico publicable, cuando se carga el mapa, entonces no se inventa una ubicación.
* Dado un filtro por categoría/zona, cuando se aplica, entonces el mapa refleja el mismo conjunto de resultados que la lista correspondiente.

---

## 3. Soporte, Administración y Sistema

##### HU-SA01 — Inicio de sesión
**Como** Usuario registrado, **quiero** autenticarme con mis credenciales, **para** acceder de forma segura a las funciones asociadas a mi rol.

**Criterios de aceptación:**
* Dado un usuario activo con credenciales válidas, cuando inicia sesión, entonces se crea una sesión autenticada y se carga su contexto de rol.
* Dadas credenciales inválidas, cuando intenta iniciar sesión, entonces el sistema responde con un mensaje genérico que no revela si falló el usuario o la contraseña.
* Dado un usuario autenticado, cuando solicita una ruta protegida no autorizada para su rol, entonces recibe acceso denegado.
* Dada una cuenta bloqueada preventivamente, cuando intenta autenticarse, entonces el sistema impide el acceso y muestra el canal de soporte o revisión definido.

##### HU-SA02 — Cierre de sesión
**Como** Usuario autenticado, **quiero** cerrar mi sesión, **para** evitar que otra persona continúe usando mi cuenta en el dispositivo.

**Criterios de aceptación:**
* Dado un usuario autenticado, cuando selecciona Cerrar sesión, entonces la sesión actual queda invalidada.
* Dado que la sesión fue cerrada, cuando intenta volver a una ruta protegida mediante el historial del navegador, entonces el sistema exige autenticación.
* Dado un cierre exitoso, cuando finaliza, entonces el sistema redirige a una pantalla pública o de acceso.

##### HU-SA03 — Recuperación de acceso
**Como** Usuario registrado, **quiero** restablecer mis credenciales, **para** recuperar la cuenta sin perder solicitudes, propuestas o reputación.

**Criterios de aceptación:**
* Dado un usuario que no recuerda su contraseña, cuando solicita recuperación, entonces el sistema inicia un flujo de restablecimiento por el medio de contacto configurado.
* Dado un enlace/código expirado o ya utilizado, cuando se intenta usar, entonces el sistema lo rechaza y permite solicitar uno nuevo.
* Dado un restablecimiento exitoso, cuando define una nueva contraseña válida, entonces la anterior deja de ser aceptada.
* Dado un correo/teléfono no registrado, cuando se solicita recuperación, entonces la respuesta no revela si existe o no una cuenta.

##### HU-SA04 — Enrutamiento por rol
**Como** Usuario autenticado, **quiero** ver una experiencia acorde a mi rol, **para** evitar confusión y exposición de funciones no pertinentes.

**Criterios de aceptación:**
* Dado un cliente autenticado, cuando entra al producto, entonces visualiza navegación y acciones propias del flujo de cliente.
* Dado un prestador autenticado, cuando entra al producto, entonces visualiza oportunidades, propuestas, perfil and reputación.
* Dado un administrador autenticado, cuando entra al producto, entonces visualiza únicamente las funciones administrativas autorizadas.
* Dado cualquier rol, cuando intenta invocar una operación de otro rol por URL o API, entonces la autorización se valida también en servidor.

##### HU-SA05 — Aceptación de términos y tratamiento de datos
**Como** Usuario, **quiero** conocer y aceptar las condiciones aplicables, **para** usar la plataforma con consentimiento informado.

**Criterios de aceptación:**
* Dado un registro nuevo, cuando no se han aceptado los términos obligatorios, entonces el sistema no permite finalizar el alta.
* Dado que existen documentos de términos y privacidad, cuando el usuario los consulta, entonces puede acceder al texto vigente antes de aceptar.
* Dado que el usuario acepta, cuando se registra el consentimiento, entonces se conserva la versión del documento y fecha de aceptación.
* Dado un cambio material que requiera nueva aceptación, cuando el usuario vuelve a ingresar, entonces el sistema solicita el consentimiento correspondiente antes de continuar con funciones afectadas.

##### HU-SA06 — Editar datos básicos de cuenta
**Como** Usuario autenticado, **quiero** actualizar mis datos básicos, **para** mantener correcta mi información de contacto y perfil.

**Criterios de aceptación:**
* Dado un usuario autenticado, cuando modifica datos editables y guarda, entonces los cambios válidos quedan persistidos.
* Dado un nuevo contacto que debe ser único, cuando ya pertenece a otra cuenta, entonces la modificación se rechaza.
* Dado un dato inválido, cuando intenta guardar, entonces se conserva el valor anterior y se informa el error.
* Dado un cambio exitoso, cuando vuelve a consultar su cuenta, entonces visualiza la información actualizada.

##### HU-SA07 — Gestionar zona aproximada
**Como** Usuario autenticado, **quiero** definir o cambiar mi zona de referencia, **para** recibir contenido pertinente sin publicar mi dirección exacta.

**Criterios de aceptación:**
* Dado un usuario autenticado, cuando selecciona una zona válida del catálogo, entonces esta queda asociada a su cuenta.
* Dado un cambio de zona, cuando se confirma, entonces futuras búsquedas u oportunidades usan la nueva zona según el rol.
* Dado que la plataforma trabaja con zonas configurables, cuando una zona se desactiva, entonces no puede seleccionarse para nuevos registros sin borrar el historial existente.

##### HU-SA08 — Controlar visibilidad de datos personales
**Como** Usuario autenticado, **quiero** saber qué datos son públicos y cuáles privados, **para** reducir exposición innecesaria de información.

**Criterios de aceptación:**
* Dado un usuario autenticado, cuando revisa sus preferencias de privacidad, entonces distingue claramente información pública, visible tras aceptación y privada.
* Dado un dato clasificado como privado, cuando otro usuario consulta el perfil, entonces ese dato no aparece.
* Dado un dato cuya visibilidad puede configurarse, cuando el usuario cambia la preferencia, entonces la nueva regla se aplica a consultas posteriores.
* Dada la dirección exacta de un cliente, cuando no existe una propuesta aceptada, entonces permanece oculta para prestadores.

##### HU-SA09 — Consultar mis datos almacenados
**Como** Usuario autenticado, **quiero** consultar la información principal asociada a mi cuenta, **para** comprender qué información mantiene la plataforma.

**Criterios de aceptación:**
* Dado un usuario autenticado, cuando abre la sección de cuenta y privacidad, entonces puede consultar sus datos básicos, rol y preferencias relevantes.
* Dado que existen datos no editables por seguridad o auditoría, cuando se muestran, entonces se identifican como solo lectura.
* Dado que un dato proviene de una verificación, cuando se presenta, entonces se diferencia de la información declarada por el usuario.

##### HU-SA10 — Solicitar eliminación de cuenta
**Como** Usuario autenticado, **quiero** solicitar la eliminación de mi cuenta, **para** ejercer control sobre mis datos personales.

**Criterios de aceptación:**
* Dado un usuario autenticado, cuando solicita eliminar su cuenta, entonces el sistema muestra las consecuencias antes de confirmar.
* Dado que existen servicios o registros que deban conservarse por trazabilidad, cuando la cuenta se elimina, entonces se aplica la política de anonimización/retención definida sin exponer datos innecesarios.
* Dada una eliminación confirmada, cuando finaliza, entonces el usuario no puede iniciar sesión con la cuenta eliminada.
* Dado que la operación es sensible, cuando se confirma, entonces queda registro técnico de la solicitud y resultado.

##### HU-SA11 — Administrar categorías
**Como** Administrador, **quiero** crear, editar, ordenar, activar o desactivar categorías, **para** mantener el catálogo sin cambios de código.

**Criterios de aceptación:**
* Dado un administrador autorizado, cuando crea una categoría válida, entonces queda disponible según su estado de publicación.
* Dada una categoría con historial, cuando se desactiva, entonces deja de poder elegirse para nuevos registros sin borrar solicitudes o servicios históricos.
* Dado un nombre/clave duplicado no permitido, cuando intenta guardar, entonces el sistema rechaza el conflicto.
* Dado un cambio administrativo, cuando se confirma, entonces queda auditado.

##### HU-SA12 — Administrar zonas
**Como** Administrador, **quiero** configurar las zonas usadas por perfiles y solicitudes, **para** adaptar el piloto territorial sin despliegues de código.

**Criterios de aceptación:**
* Dado un administrador, cuando crea o edita una zona válida, entonces la configuración queda disponible para nuevas selecciones.
* Dada una zona ya usada, cuando se desactiva, entonces se conserva la referencia histórica.
* Dado un cambio de nombre o estado, cuando se guarda, entonces el sistema evita romper solicitudes y perfiles existentes.
* Dada una modificación, cuando se completa, entonces se registra en auditoría administrativa.

##### HU-SA13 — Generar compatibilidad de solicitudes
**Como** Sistema, **quiero** identificar prestadores compatibles con cada solicitud publicada, **para** reducir ruido y mejorar la pertinencia de oportunidades.

**Criterios de aceptación:**
* Dada una solicitud abierta, cuando se ejecuta el matching, entonces solo considera prestadores publicados cuya categoría y zona sean compatibles con la solicitud.
* Dado un prestador bloqueado, cuando se genera compatibilidad, entonces queda excluido.
* Dada una solicitud cancelada, finalizada o ya adjudicada, cuando se recalcula el matching, entonces no se ofrece como nueva oportunidad activa.
* Dado un cambio de configuración del prestador, cuando el matching se actualiza, entonces futuras oportunidades reflejan la configuración vigente.

##### HU-SA14 — Evitar cotización de oportunidades no elegibles
**Como** Sistema, **quiero** impedir propuestas sobre solicitudes incompatibles o cerradas, **para** mantener consistencia y reducir abuso.

**Criterios de aceptación:**
* Dada una solicitud cancelada, adjudicada o finalizada, cuando se intenta enviar una nueva propuesta, entonces la operación se rechaza.
* Dado un prestador bloqueado o sin perfil habilitado, cuando intenta cotizar, entonces se rechaza la operación.
* Dada una solicitud válida pero fuera de los criterios obligatorios definidos para el piloto, cuando el sistema aplica restricción de elegibilidad, entonces la cotización se impide y se informa la razón aplicable.

##### HU-SA15 — Cerrar propuestas no seleccionadas
**Como** Sistema, **quiero** cerrar automáticamente las propuestas restantes, **para** evitar dobles adjudicaciones y expectativas incorrectas.

**Criterios de aceptación:**
* Dada una solicitud con varias propuestas activas, cuando una se acepta, entonces todas las demás pasan al estado no seleccionado/cerrado definido.
* Dado un prestador cuya propuesta fue cerrada, cuando consulta su propuesta, entonces puede ver que la solicitud fue adjudicada sin acceder a datos privados del servicio.
* Dado un cierre automático, cuando ocurre, entonces queda asociado al evento de aceptación que lo originó.

##### HU-SA16 — Crear registro de servicio contratado
**Como** Sistema, **quiero** crear el servicio a partir de una propuesta aceptada, **para** separar la fase de contratación de la solicitud abierta y mantener trazabilidad.

**Criterios de aceptación:**
* Dada una aceptación confirmada, cuando finaliza la transacción, then existe un único registro de servicio vinculado a la solicitud, propuesta, cliente y prestador.
* Dado un fallo parcial, cuando no puede crearse el servicio, entonces la aceptación no debe quedar en un estado inconsistente.
* Dado el registro creado, cuando se consulta, entonces inicia en el estado definido posterior a aceptación y conserva referencias a la propuesta seleccionada.

##### HU-SA17 — Habilitar datos de coordinación
**Como** Cliente y prestador seleccionado, **quiero** acceder a la información necesaria para coordinar el trabajo, **para** ejecutar el servicio sin exponer datos a terceros.

**Criterios de aceptación:**
* Dado un servicio contratado, cuando cliente y prestador seleccionado consultan la coordinación, entonces visualizan únicamente los datos autorizados para esa etapa.
* Dado un prestador no seleccionado, cuando intenta acceder a esos datos, entonces el sistema deniega el acceso.
* Dado que la dirección exacta está incluida entre los datos autorizados, cuando se revela, entonces ocurre solo después de la aceptación y queda sujeta a controles de acceso.
* Dado un servicio cancelado, cuando se consulta posteriormente, entonces la visibilidad sensible se rige por la política de privacidad/retención definida.

##### HU-SA18 — Consultar detalle del servicio
**Como** Cliente o prestador participante, **quiero** ver el acuerdo y estado actual del servicio, **para** coordinar acciones con una única fuente de verdad.

**Criterios de aceptación:**
* Dado un participante autorizado, cuando abre el servicio, entonces visualiza categoría, descripción pertinente, propuesta aceptada, estado, coordinación y acciones permitidas.
* Dado un usuario ajeno, cuando intenta acceder, entonces se deniega la consulta.
* Dado un estado finalizado o cancelado, cuando se consulta, entonces las acciones incompatibles quedan deshabilitadas.

##### HU-SA19 — Cancelar servicio contratado
**Como** Cliente o prestador autorizado, **quiero** registrar una cancelación posterior a la aceptación, **para** cerrar correctamente trabajos que no serán ejecutados.

**Criterios de aceptación:**
* Dado un participante autorizado, cuando inicia la cancelación, entonces el sistema solicita confirmación y los datos mínimos definidos por la política.
* Dada una cancelación válida, cuando se confirma, entonces el servicio cambia a CANCELADO y se registra actor, fecha y motivo cuando aplique.
* Dado un servicio finalizado, cuando se intenta cancelar, entonces la transición se rechaza.
* Dada una cancelación, cuando se ejecuta, entonces no se elimina el historial del servicio.

##### HU-SA20 — Consultar historial de estados del servicio
**Como** Cliente o prestador participante, **quiero** ver las transiciones relevantes del servicio, **para** resolver dudas y disputas básicas con evidencia de trazabilidad.

**Criterios de aceptación:**
* Dado un participante autorizado, cuando consulta el historial, entonces visualiza la secuencia de estados con fecha y actor cuando corresponda.
* Dado un evento administrativo que no deba exponerse íntegramente, cuando se presenta al usuario, entonces se muestra solo la información permitida.
* Dado un servicio cancelado/finalizado, cuando se consulta, entonces el historial permanece disponible según política de retención.

##### HU-SA21 — Usar canal de coordinación autorizado
**Como** Cliente y prestador seleccionado, **quiero** comunicarse mediante el canal habilitado para el servicio, **para** coordinar horario y detalles sin exponer información antes de la aceptación.

**Criterios de aceptación:**
* Dado un servicio contratado, cuando las partes acceden a Coordinar, entonces el sistema habilita el mecanismo de comunicación definido para el piloto.
* Dado que aún no existe aceptación, cuando un prestador consulta la solicitud, entonces ese mecanismo no expone datos de contacto privados.
* Dado un cambio futuro del canal elegido, cuando se implemente, entonces las reglas de autorización deben mantenerse independientemente de si es chat interno, teléfono o integración con WhatsApp.

##### HU-SA22 — Impedir calificación duplicada
**Como** Sistema, **quiero** garantizar una calificación válida por servicio, **para** evitar manipulación simple de reputación.

**Criterios de aceptación:**
* Dado un servicio ya calificado por el cliente autorizado, cuando intenta crear otra calificación, entonces el sistema la rechaza o dirige al mecanismo de edición si este se define.
* Dadas solicitudes concurrentes para calificar el mismo servicio, cuando se procesan, entonces la restricción se garantiza en servidor/base de datos.
* Dado un fallo del cliente tras enviar, cuando reintenta la misma operación, entonces no se generan duplicados.

##### HU-SA23 — Calcular reputación agregada
**Como** Sistema, **quiero** calcular y mostrar la reputación a partir de trabajos calificados, **para** ofrecer una señal comparable basada en servicios trazables.

**Criterios de aceptación:**
* Dadas calificaciones válidas no moderadas según la regla aplicable, cuando se calcula reputación, entonces solo se incluyen registros elegibles.
* Dado un prestador sin calificaciones, cuando se muestra su perfil, entonces aparece como sin reputación suficiente y no con una puntuación inventada.
* Dado un cambio por nueva calificación o moderación, cuando se recalcula, entonces el resultado visible se actualiza de forma consistente.

##### HU-SA24 — Reportar reseña o reputación problemática
**Como** Usuario afectado o Administrador, **quiero** reportar una reseña que incumpla las reglas, **para** evitar que la reputación reproduzca abuso o contenido inadecuado.

**Criterios de aceptación:**
* Dado un usuario autorizado para reportar, cuando selecciona un motivo y confirma, entonces se crea un reporte vinculado a la reseña.
* Dado un reporte abierto, cuando moderación resuelve ocultar o mantener la reseña, entonces la decisión queda auditada.
* Dada una reseña moderada, cuando se recalcula reputación, entonces se aplica la regla definida de inclusión/exclusión.

##### HU-SA25 — Reportar usuario
**Como** Usuario autenticado, **quiero** reportar un comportamiento problemático de otro usuario, **para** contribuir a la seguridad de la comunidad.

**Criterios de aceptación:**
* Dado un usuario autenticado, cuando selecciona Reportar sobre un perfil/usuario y completa motivo obligatorio, entonces se crea un reporte.
* Dado un reporte creado, cuando finaliza, entonces recibe un identificador/estado consultable si el diseño lo contempla.
* Dado contenido sensible en la denuncia, cuando se almacena, entonces su visibilidad queda restringida al flujo autorizado de moderación.
* Dado un reporte duplicado exacto en un periodo corto, cuando se envía, entonces el sistema puede advertir o consolidar según la regla sin perder evidencia.

##### HU-SA26 — Reportar solicitud, propuesta o servicio
**Como** Usuario participante, **quiero** reportar contenido o conducta vinculada a una interacción, **para** dejar evidencia contextual de un problema.

**Criterios de aceptación:**
* Dado un usuario autorizado, cuando reporta una solicitud, propuesta o servicio, entonces el reporte conserva la referencia al objeto y su estado al momento del reporte.
* Dado un usuario sin relación ni permiso, cuando intenta acceder a información privada para reportar, entonces el sistema no amplía sus permisos.
* Dado un reporte, cuando el objeto cambia posteriormente, entonces la moderación conserva suficiente contexto/auditoría para analizar el caso.

##### HU-SA27 — Adjuntar evidencia a reporte
**Como** Usuario reportante, **quiero** adjuntar evidencia permitida, **para** facilitar la revisión del incidente.

**Criterios de aceptación:**
* Dado un archivo permitido, cuando se adjunta, entonces queda vinculado al reporte y accesible solo para actores autorizados.
* Dado un archivo inválido o peligroso, cuando se intenta cargar, entonces se rechaza.
* Dado un reporte cerrado, cuando la política impide cambios, entonces no se permiten nuevas evidencias sin una reapertura autorizada.

##### HU-SA28 — Consultar cola de reportes
**Como** Administrador, **quiero** ver reportes pendientes y su prioridad/estado, **para** gestionar moderación de forma ordenda.

**Criterios de aceptación:**
* Dado un administrador autorizado, cuando abre la cola, entonces visualiza reportes con filtros por estado, tipo, fecha y otros criterios definidos.
* Dado un administrador sin permiso suficiente, cuando intenta acceder, entonces se deniega la consulta.
* Dado un reporte resuelto, cuando se filtran pendientes, entonces no aparece como abierto.

##### HU-SA29 — Revisar detalle de reporte
**Como** Administrador, **quiero** consultar contexto y evidencia de un reporte, **para** tomar una decisión de moderación informada.

**Criterios de aceptación:**
* Dado un reporte, cuando se abre, entonces se muestra motivo, entidad relacionada, evidencia permitida, fechas y estado.
* Dados datos personales no necesarios para la decisión, cuando se presenta el detalle, entonces se minimiza la exposición según permisos.
* Dado un acceso administrativo, cuando se consulta evidencia sensible, entonces queda sujeto a la auditoría definida.

##### HU-SA30 — Cambiar estado y resolver reporte
**Como** Administrador, **quiero** registrar la resolución de un reporte, **para** cerrar casos con trazabilidad.

**Criterios de aceptación:**
* Dado un reporte abierto, cuando el administrador registra una decisión válida, entonces cambia al estado correspondiente y conserva motivo/nota interna según diseño.
* Dada una resolución, cuando se ejecuta una acción asociada como bloqueo u ocultamiento, entonces ambas operaciones quedan vinculadas en auditoría.
* Dado un reporte ya cerrado, cuando se intenta resolver nuevamente sin reapertura, entonces el sistema evita estados inconsistentes.

##### HU-SA31 — Bloquear preventivamente una cuenta
**Como** Administrador, **quiero** restringir temporalmente una cuenta ante riesgo, **para** reducir exposición mientras se revisa un caso.

**Criterios de aceptación:**
* Dado un administrador autorizado, cuando aplica un bloqueo preventivo, entonces la cuenta no puede ejecutar las operaciones restringidas definidas.
* Dado un bloqueo, cuando se confirma, entonces se registra motivo, administrador, fecha y alcance.
* Dado un usuario bloqueado, cuando intenta una operación restringida, entonces recibe una respuesta consistente sin exponer información interna de moderación.
* Dado que el bloqueo se revoca, cuando se autoriza, entonces se restablecen únicamente los permisos que correspondan.

##### HU-SA32 — Moderar perfil o contenido
**Como** Administrador, **quiero** ocultar o restringir contenido que incumpla políticas, **para** mantener la calidad y seguridad del marketplace.

**Criterios de aceptación:**
* Dado contenido reportado o detectado, cuando el administrador aplica una acción permitida, entonces el contenido deja de ser visible según el alcance de la medida.
* Dada una acción de moderación, cuando se ejecuta, entonces no se borra silenciosamente la evidencia necesaria para auditoría.
* Dado contenido restablecido tras revisión, cuando se habilita, entonces vuelve a mostrarse solo si cumple las condiciones de publicación.

##### HU-SA33 — Buscar usuarios y perfiles en administración
**Como** Administrador, **quiero** localizar cuentas y perfiles por criterios permitidos, **para** investigar reportes y gestionar calidad.

**Criterios de aceptación:**
* Dado un administrador, cuando busca por identificadores permitidos, entonces recibe resultados limitados a sus permisos.
* Dado un criterio sensible no necesario, cuando no está autorizado, entonces no se ofrece como filtro.
* Dado un resultado, cuando abre el detalle, entonces el acceso a datos sensibles respeta minimización y auditoría.

##### HU-SA34 — Auditar acciones administrativas
**Como** Sistema o Administrador autorizado, **quiero** conservar un registro de acciones de moderación y configuración, **para** garantizar trazabilidad y rendición de cuentas.

**Criterios de aceptación:**
* Dada una acción auditable, cuando se ejecuta, entonces se registra administrador, acción, entidad, fecha and resultado, además de valores anterior/posterior cuando aplique.
* Dado un usuario sin privilegio de auditoría, cuando intenta consultar el registro, entonces se deniega el acceso.
* Dado un evento de auditoría, cuando un administrador edita la entidad posteriormente, entonces el evento histórico no se sobrescribe.

##### HU-SA35 — Gestionar servicios o categorías reguladas o de alto riesgo
**Como** Administrador o Product Owner, **quiero** configurar restricciones adicionales cuando una categoría lo requiera, **para** evitar habilitar servicios con obligaciones no definidas.

**Criterios de aceptación:**
* Dado que una categoría requiere condiciones especiales, cuando se activa para el piloto, entonces el sistema puede asociar reglas/requisitos definidos por el producto.
* Dado que la política aún no está aprobada, cuando se administra la categoría, entonces no se presenta como habilitada si ello crea un riesgo no evaluado.
* Dado un requisito específico, cuando un prestador no lo cumple según la regla definida, entonces la publicación/cotización se restringe de forma trazable.

---

##### HU-SA36 — Mostrar progreso sin declarar estatus legal
**Como** Sistema, **quiero** diferenciar progreso, declaración y verificación, **para** evitar etiquetar erróneamente a una persona como formal o informal.

**Criterios de aceptación:**
* Dado un prestador con pasos marcados, cuando se presenta su progreso, entonces la interfaz evita términos que impliquen un estatus legal no verificado.
* Dado un dato declarado por el prestador, cuando se muestra, entonces se identifica como declarado si corresponde.
* Dado un dato validado por una integración futura, cuando se muestra, entonces se identifica el origen de la validación.

##### HU-SA37 — Notificar cambios de estado del servicio
**Como** Cliente y prestador, **quiero** recibir avisos sobre cambios relevantes, **para** mantener coordinación sin revisar manualmente el sistema.

**Criterios de aceptación:**
* Dada una transición configurada como notificable, cuando ocurre, entonces se crea un aviso para los participantes autorizados.
* Dado un canal deshabilitado por el usuario, cuando se genera el evento, entonces se respeta la preferencia salvo notificaciones obligatorias definidas por política.
* Dado que un usuario abre el aviso, cuando navega al servicio, entonces se muestra el estado actual y no una copia obsoleta.

##### HU-SA38 — Configurar preferencias de notificación
**Como** Usuario, **quiero** elegir canales opcionales de notificación, **para** recibir avisos de forma útil sin exceso de mensajes.

**Criterios de aceptación:**
* Dado un usuario, cuando activa o desactiva un canal opcional, entonces la preferencia se guarda.
* Dado un evento que la política considera obligatorio, cuando ocurre, entonces la interfaz informa que no puede desactivarse si aplica.
* Dado un canal no disponible técnicamente, cuando se consultan preferencias, entonces no se presenta como habilitable.

##### HU-SA39 — Descargar historial
**Como** Usuario, **quiero** descargar un resumen de mi historial, **para** conservar evidencia fuera de la plataforma.

**Criterios de aceptación:**
* Dado un usuario con historial, cuando solicita la descarga, entonces el sistema genera un archivo con únicamente sus datos autorizados.
* Dado que el historial contiene datos de terceros, cuando se exporta, entonces se aplica minimización y no se incluyen datos sensibles innecesarios.
* Dado un usuario sin registros, cuando solicita exportación, entonces el sistema genera un resultado vacío válido o informa que no existen datos.

##### HU-SA40 — Consultar actividad reciente
**Como** Usuario, **quiero** ver eventos recientes relevantes de mi cuenta, **para** retomar rápidamente el contexto al volver a la plataforma.

**Criterios de aceptación:**
* Dado un usuario, cuando abre su inicio/panel, entonces visualiza eventos relevantes de su propio contexto como nuevas propuestas, aceptaciones o cambios de estado.
* Dado un evento de otra cuenta, cuando se construye la actividad, entonces nunca se mezcla por error entre usuarios.
* Dado un evento ya obsoleto, cuando se abre, entonces el destino muestra el estado actual.

##### HU-SA41 — Chat interno en tiempo real
**Como** Cliente y prestador seleccionado, **quiero** comunicarse dentro de la plataforma, **para** coordinar sin depender de canales externos y conservar trazabilidad.

**Criterios de aceptación:**
* Dado un servicio con comunicación habilitada, cuando una parte envía un mensaje válido, entonces la otra puede recibirlo dentro del hilo autorizado.
* Dado un usuario ajeno, cuando intenta acceder al hilo, entonces se deniega.
* Dado contenido reportable, cuando se reporta, entonces moderación puede revisar únicamente según las reglas de privacidad aprobadas.

##### HU-SA42 — Programa de referidos
**Como** Usuario, **quiero** invitar a nuevos usuarios mediante un mecanismo trazable, **para** favorecer adquisición orgánica durante una fase posterior.

**Criterios de aceptación:**
* Dado un usuario elegible, cuando genera/usa una referencia, entonces la relación se registra sin exponer datos de terceros.
* Dado un código inválido o expirado, cuando se usa, entonces el sistema no atribuye el referido.
* Dado que no existe incentivo definido, cuando se implemente la referencia, entonces no se promete beneficio económico no aprobado.

##### HU-SA43 — Soporte por WhatsApp
**Como** Usuario, **quiero** acceder a soporte o acompañamiento mediante WhatsApp, **para** reducir barreras de adopción móvil.

**Criterios de aceptación:**
* Dado un usuario, cuando selecciona soporte por WhatsApp, entonces se dirige únicamente al canal oficial configurado.
* Dado que el canal es externo, cuando se abre, entonces se informa de forma adecuada el cambio de contexto si la política lo requiere.
* Dado que se comparten datos con el canal externo, cuando se diseña la integración, entonces se minimiza la información transferida.

##### HU-SA44 — Idiomas adicionales
**Como** Usuario, **quiero** cambiar el idioma de la interfaz, **para** usar la plataforma en un idioma adicional cuando la expansión lo requiera.

**Criterios de aceptación:**
* Dado un idioma disponible, cuando el usuario lo selecciona, entonces la interfaz cambia los textos localizables sin alterar datos del negocio.
* Dado contenido generado por usuarios, cuando cambia el idioma de interfaz, entonces no se traduce automáticamente salvo funcionalidad expresa.
* Dada una traducción faltante, cuando se carga una pantalla, entonces se aplica la estrategia de fallback definida.

##### HU-SA45 — Piloto de pasarela de pago
**Como** Cliente y prestador, **quiero** probar un flujo de pago externo/integrado limitado, **para** validar viabilidad antes de incorporar pagos al producto central.

**Criterios de aceptación:**
* Dado que el piloto de pagos no está habilitado, cuando se contrata un servicio, entonces la plataforma no obliga a pagar internamente.
* Dado que el piloto se habilita, cuando se inicia un pago, entonces se utiliza únicamente el proveedor y alcance aprobados.
* Dado un resultado de pago, cuando se recibe confirmación, entonces se registra de forma idempotente y nunca se interpreta un estado desconocido como pago exitoso.
* Dado que el documento excluye billetera y pagos integrados del MVP inicial, cuando se planifica esta historia, entonces se mantiene fuera del release inicial.

---
