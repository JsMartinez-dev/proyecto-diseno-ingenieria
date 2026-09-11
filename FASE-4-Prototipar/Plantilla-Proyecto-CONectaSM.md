# PLANTILLA DE PROYECTO: EXPERIENCIA FINAL DE DISEÑO

> **Estado del documento**: en construcción progresiva. Las secciones 1 y 2 están
> completadas con la información y evidencia recolectada hasta el momento. Las
> secciones 3 a 8 quedan marcadas como **Pendiente** hasta que se trabajen en las
> siguientes etapas del proyecto (no se completan por anticipado para evitar
> inconsistencias con decisiones aún no tomadas formalmente).

---

## INFORMACIÓN GENERAL

* **Programa:** Ingeniería de Sistemas (Universidad del Magdalena)
* **Curso:** Proyecto Culminante de Diseño
* **Código del curso:** 9011655
* **Créditos:** 4
* **Periodo académico:** 2026-2
* **Semestre:** Décimo

---

## 1. IDENTIFICACIÓN DEL PROYECTO

* **Título del proyecto:** CONectaSM — Plataforma para la gestión de oportunidades comerciales y servicios de trabajadores independientes en Santa Marta
  > ⚠️ **Título propuesto, pendiente de confirmación.** Se deriva del nombre de producto usado en los archivos `spec-06` y `spec-07` ("CONectaSM"). Confírmalo o ajústalo antes de considerarlo definitivo.

* **Tipo de proyecto:**
  - [x] Productivo
  - [ ] Investigación aplicada
  - [ ] Innovación / transferencia tecnológica
  - [ ] Intervención agroambiental

* **Contexto real del problema:** Santa Marta, Colombia. El proyecto se enfoca en trabajadores independientes que prestan servicios técnicos a domicilio (reparación de aires acondicionados, electricidad, plomería, pintura, mantenimiento, reparación de electrodomésticos, instalación de equipos, entre otros) y en las personas que contratan dichos servicios (clientes). Este contexto fue confirmado directamente mediante 3 entrevistas a trabajadores independientes y 3 entrevistas a clientes en la ciudad.

* **Duración del proyecto:** ⚠️ **PENDIENTE — indicar número de semanas o fracción del año lectivo correspondiente al periodo 2026-2.**

* **Trabajo:**
  - [ ] Individual
  - [x] En equipo (Número de integrantes: ⚠️ **PENDIENTE**)
    * *Integrantes:* ⚠️ **PENDIENTE — nombre completo e identificación de cada miembro.**

---

## 2. DESCRIPCIÓN DEL PROBLEMA DE INGENIERÍA

*(Formulado como problema abierto, real y no trivial)*

### Situación problemática identificada

En Santa Marta existe una cantidad importante de personas que trabajan de manera independiente ofreciendo servicios técnicos a domicilio. Una parte de estos trabajadores obtiene sus clientes mediante mecanismos informales: voz a voz, llamadas telefónicas, WhatsApp, publicaciones en redes sociales, recomendaciones de conocidos o contacto directo por sectores de la ciudad.

Aunque estos mecanismos permiten conseguir clientes, la **gestión de las oportunidades de trabajo se encuentra fragmentada y depende en gran medida de procesos manuales**. Un trabajador puede recibir simultáneamente solicitudes por distintos canales; para cada una debe identificar la necesidad del cliente, solicitar ubicación, conocer disponibilidad, acordar horario, estimar costo, desplazarse y luego recordar o registrar la información del servicio, sin ningún sistema de apoyo.

Esta afirmación, inicialmente planteada como hipótesis, fue **confirmada mediante evidencia directa** en las entrevistas realizadas:

- Yuranis Martínez (instalaciones eléctricas) reportó que recibe solicitudes simultáneas por Facebook, WhatsApp y llamadas, y que "muchas solicitudes se me quedan acumuladas sin responder"; además perdió una cita por no transcribir una dirección a su bloc de notas.
- Jorge Ortiz (plomería) reportó que no lleva ningún registro de trabajos ni materiales, que ha perdido citas por anotar direcciones en papel suelto, y que ha perdido clientes porque "el cliente ya resolvió con otro plomero" mientras él no podía revisar el teléfono.
- Richard Núñez (aires acondicionados) confirmó que no registra los trabajos realizados y que le sería útil una bitácora para saber si su trabajo es rentable.
- Desde el lado del cliente, Patricia Mercado, Gladys Jiménez y Liliana Pulido reportaron dificultades de coordinación (falta de aviso ante retrasos, incertidumbre sobre el precio final, falta de mecanismos de confianza para dejar entrar a un desconocido a su vivienda).

Por lo tanto, el problema **no se plantea como la ausencia de una aplicación para ofrecer servicios**, sino como una **gestión fragmentada de las oportunidades comerciales y de los servicios recibidos**, tanto del lado del trabajador (Prestador) como del cliente que lo contrata.

### Necesidad o demanda del entorno

La necesidad de intervenir se sustenta en dos tipos de evidencia:

1. **Evidencia de contexto estadístico (DANE — EMICRON 2024/2025):** Santa Marta presenta la mayor proporción de trabajadores por cuenta propia (98,8%) entre las 24 ciudades principales del país, y la mayor participación de micronegocios de servicios (66,2%). A nivel nacional, la mayoría de estos micronegocios son unipersonales, informales (sin RUT ni matrícula mercantil) y una proporción alta no usa dispositivos electrónicos, aunque sí usa teléfono celular. Esto confirma que el segmento objetivo es numeroso, informal y depende de herramientas manuales, pero **no mide directamente** la fragmentación de la gestión de oportunidades — por eso se complementó con entrevistas.
2. **Evidencia directa (entrevistas):** las 6 entrevistas realizadas (3 a trabajadores, 3 a clientes) confirman de forma consistente los síntomas descritos en el planteamiento del problema: solicitudes sin responder, citas olvidadas, falta de registro/historial, pérdida de oportunidades comerciales y desconfianza del cliente ante la informalidad del trabajador.

> 📌 Nota metodológica: la muestra de entrevistas (3+3) es una **muestra exploratoria**, no representativa estadísticamente. Es válida para confirmar que el problema existe y entender sus causas, pero no permite todavía cuantificar su magnitud (por ejemplo, "% de citas olvidadas" a nivel de ciudad). Esa cuantificación, si se requiere, deberá señalarse explícitamente como pendiente de validar con una muestra mayor.

### Usuarios o beneficiarios

- **Cliente:** persona natural en Santa Marta que necesita contratar un servicio técnico a domicilio (reparación, instalación, mantenimiento, etc.) y que actualmente depende de mecanismos informales para encontrar, evaluar y coordinar con un trabajador independiente.
- **Prestador (trabajador independiente):** persona que ofrece servicios técnicos a domicilio de forma independiente y que actualmente gestiona sus solicitudes, agenda y desplazamientos de forma manual y fragmentada.

(El rol de **Administrador**, identificado en el `README.md` de diagramas de casos de uso, es un actor del sistema para moderación y gestión de la plataforma, pero no es un beneficiario directo del problema social planteado — es un actor operativo de la solución.)

### Justificación técnica y social del proyecto

* **Justificación social:** el problema afecta directamente los ingresos y la productividad de un grupo poblacional numeroso y mayoritariamente informal (según EMICRON, Santa Marta concentra la mayor proporción de trabajadores por cuenta propia del país). Mejorar la gestión de oportunidades comerciales de este grupo tiene un impacto potencial en su estabilidad de ingresos. Del lado del cliente, resolver el problema también responde a una necesidad de confianza y transparencia identificada en las entrevistas (ej. dejar entrar a un desconocido a la vivienda, evitar cobros inesperados).
* **Justificación técnica:** ⚠️ **Pendiente de desarrollar formalmente.** Los archivos `spec-01` a `spec-07` ya documentan un análisis técnico avanzado (casos de uso, historias de usuario, requerimientos funcionales y criterios de éxito) que evidencia viabilidad técnica del enfoque de plataforma digital. Sin embargo, la plantilla oficial pide esta justificación en la Sección 2, mientras que el detalle técnico corresponde formalmente a la Sección 4 (Proceso de diseño). Se recomienda escribir aquí un resumen breve una vez cerremos la Sección 4, para no duplicar contenido de forma inconsistente.

---

## 3. RESTRICCIONES Y CONDICIONANTES DEL DISEÑO

⚠️ **Pendiente.** Ya existe evidencia parcial en los specs (ej. `spec-01` trata explícitamente privacidad de ubicación/dirección exacta — restricción normativa/ética; `spec-06` trata formalización sin declarar estatus legal — restricción ética/legal; `spec-07` condiciona el piloto de pagos a aprobación explícita — restricción normativa/económica). Se trabajará formalmente en la siguiente etapa, seleccionando y justificando cada restricción aplicable.

## 4. PROCESO DE DISEÑO DE INGENIERÍA

⚠️ **Pendiente.** Los archivos `spec-01` a `spec-07` contienen ya el detalle de requerimientos funcionales (punto 1 de esta sección) para cada caso de uso. Falta documentar formalmente: formulación y comparación de alternativas de arquitectura/tecnología (puntos 2-3) y la justificación de la alternativa seleccionada (punto 4), que según tus instrucciones de trabajo debe decidirse **después** de terminar el análisis del problema, no antes.

## 5. DESCRIPCIÓN DE LA SOLUCIÓN FINAL

⚠️ **Pendiente.** Depende de que la Sección 4 esté cerrada (selección de alternativa justificada) antes de describir el diseño final, para mantener coherencia metodológica (la solución debe ser consecuencia del análisis, no al revés).

## 6. RESULTADOS Y DESEMPEÑO DEL DISEÑO

⚠️ **Pendiente.** Depende de la definición de indicadores medibles (ver Sección 7 de las instrucciones del proyecto) y de la etapa de validación.

## 7. TRABAJO EN EQUIPO Y GESTIÓN DEL PROYECTO

⚠️ **Pendiente.** Requiere: roles asignados por integrante, herramientas de comunicación usadas, metodología ágil (si aplica) y gestión del repositorio.

## 8. CONSIDERACIONES ÉTICAS, AMBIENTALES Y PROFESIONALES

⚠️ **Pendiente.** Ya hay insumos relevantes en los specs (ej. `spec-01` — privacidad y consentimiento; `spec-05` — moderación y auditoría; `spec-06` — no afirmar estatus legal automáticamente) que deberán sintetizarse aquí cuando se trabaje esta sección.

---
