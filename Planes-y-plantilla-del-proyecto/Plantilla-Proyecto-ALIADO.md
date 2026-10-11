# ALIADO: Plataforma para la gestión y contratación confiable de servicios técnicos a domicilio en Santa Marta.

---

## INFORMACIÓN GENERAL

* **Programa:** Ingeniería de Sistemas (Universidad del Magdalena)
* **Curso:** Experiencia final de diseño en ingeniería
* **Código del curso:** 9011655
* **Créditos:** 4
* **Periodo académico:** 2026-2
* **Semestre:** Décimo

---

## 1. IDENTIFICACIÓN DEL PROYECTO

* **Título del proyecto:** ALIADO - Plataforma para la gestión y contratación confiable de servicios técnicos a domicilio en Santa Marta.


* **Tipo de proyecto:**
  - [x] Productivo
  - [ ] Investigación aplicada
  - [ ] Innovación / transferencia tecnológica
  - [ ] Intervención agroambiental

* **Contexto real del problema:** Trabajadores técnicos independientes y clientes
  de Santa Marta que coordinan servicios a domicilio mediante voz a voz, llamadas, WhatsApp, redes sociales y agendas o notas personales. Los oficios considerados
  incluyen reparación de aires acondicionados, electricidad, plomería, pintura, mantenimiento, reparación de electrodomésticos e instalación de equipos.

* **Duración del proyecto:**  Periodo académico 2026-2.

* **Trabajo:**
  - [ ] Individual
  - [x] En equipo (Número de integrantes: 
    * *Integrantes:* 
	    * Juan Sebastian Martinez Uribe   - 2022214031
	    * Abraham Ceballos Rodriguez     - 2022214004
	    * Daniel de Jesús Florez Martinez - 2022214050
	    * Seuma Numtshen Rayo Sauna   - 2022214033
	    * Jenifer Tatiana Roa Correa          - 2022214006

---

## 2. DESCRIPCIÓN DEL PROBLEMA DE INGENIERÍA

### Situación problemática identificada

En Santa Marta, el 98,8% de los micronegocios está conformado por trabajadores por cuenta propia, la proporción más alta entre las 24 ciudades principales del país y el 66,2% corresponde a actividades de servicios, también la participación más alta entre esas ciudades (DANE, EMICRON 2024). 

![Distribucion-micronegocios](assets/grafica_distribucion_micronegocios.jpg)

A nivel nacional, la mayoría de estos micronegocios opera de forma unipersonal e informal: en 2025, el 92,0% de los propietarios eran trabajadores por cuenta propia y el 85,7% correspondía a negocios de una sola persona, el 68,4% no contaba con Registro Único Tributario (RUT) y el 87,0% carecía de matrícula mercantil (DANE, EMICRON 24 Ciudades 2025).

![micronegocios-unipersonal](assets/grafica_trabajadores_propios_2025.jpg)

En cuanto a adopción digital, el 82,6% de los micronegocios urbanos no utilizaba ningún dispositivo electrónico (computador, tableta o portátil), aunque el 83,9% sí usaba algún tipo de teléfono celular (DANE, EMICRON 24 Ciudades 2025). Estos datos confirman que el segmento de trabajadores técnicos independientes en Santa Marta es numeroso y opera predominantemente bajo condiciones de informalidad empresarial y con dependencia del teléfono celular como principal herramienta disponible.

![distribucion-aparatos-electronicosl](assets/grafica_dispositivos_electronicos_2025.png.jpg)

![distribucion-uso-celular-inteligentel](assets/grafica_dispositivos_uso_celular.jpg)

Esta informalidad se traduce, en la práctica, en que estos trabajadores dependen de mecanismos manuales para conseguir y gestionar clientes: voz a voz, llamadas telefónicas, WhatsApp, publicaciones en redes sociales y recorridos directos por sectores de la ciudad. Un trabajador puede recibir simultáneamente solicitudes por distintos canales, para cada una debe identificar la necesidad del cliente, solicitar su ubicación, conocer su disponibilidad, acordar un horario, estimar el costo, desplazarse y, posteriormente, recordar o registrar la información del servicio, sin ningún sistema de apoyo.

Esta dificultad, planteada inicialmente a partir de la evidencia de contexto estadístico, fue confirmada mediante entrevistas realizadas durante la fase de empatía del proyecto, Las entrevistas completas se encuentran en: [entrevistas-realizadas](FASE-1-Empatizar/03-Entrevistas/entrevistas-realizadas/Entrevista-01-Cliente).

A partir de ellas se identificaron dificultades recurrentes, que se agrupan en cuatro categorías:

* **Gestión fragmentada de solicitudes:** se reportó la recepción simultánea de solicitudes por distintos canales (redes sociales, WhatsApp, llamadas telefónicas), lo que provoca que algunas queden acumuladas sin respuesta.
* **Ausencia de registro estructurado de la información:** se identificó la práctica de anotar direcciones y datos de servicio en medios no estructurados, como papeles sueltos, lo que ha ocasionado la pérdida de citas por extravío o error en esa información.
* **Pérdida de oportunidades comerciales:** se reportaron casos en los que la necesidad del cliente fue resuelta por otro prestador mientras el trabajador original no podía revisar su teléfono, así como ausencia de cualquier bitácora de trabajos realizados que permitiera evaluar la rentabilidad de la actividad.
* **Dificultades de coordinación desde la perspectiva del cliente:** se reportó falta de aviso ante retrasos, incertidumbre sobre el precio final del servicio y ausencia de mecanismos de confianza que permitan autorizar el ingreso de un trabajador desconocido a la vivienda.

Estos hallazgos permiten confirmar que las dificultades existen y comprender sus causas. Son coherentes con el contexto estadístico del apartado anterior, que muestra el predominio del trabajo por cuenta propia y del celular como principal herramienta digital.

### Usuarios o beneficiarios

- **Cliente:** persona natural en Santa Marta que necesita contratar un servicio técnico a domicilio y que actualmente depende de mecanismos informales para encontrar, evaluar y coordinar con un trabajador independiente.

- **Prestador (trabajador independiente):** persona que ofrece servicios técnicos a domicilio de forma independiente y que actualmente gestiona sus solicitudes, agenda y desplazamientos de forma manual y fragmentada.

### Justificación técnica y social del proyecto

* **Justificación social:** el problema afecta directamente los ingresos y la productividad de un grupo poblacional numeroso que opera, en su mayoría, bajo condiciones de informalidad empresarial (según EMICRON, Santa Marta concentra la mayor proporción de trabajadores por cuenta propia del país). Una parte relevante de esta población se encuentra, además, en condición de vulnerabilidad económica: depende de ingresos variables y poco predecibles, no cuenta con acceso a mecanismos formales de seguridad social ni a herramientas de gestión especializadas, y compite en desventaja frente a oferentes con mayor acceso a canales digitales de visibilidad. Las dificultades para gestionar oportunidades comerciales de manera organizada limitan su capacidad de competir en igualdad de condiciones, lo que puede traducirse en menor volumen de trabajo y mayor inestabilidad de ingresos. Mejorar la gestión de oportunidades comerciales de este grupo tiene, por tanto, un impacto potencial en su estabilidad de ingresos y en su inclusión dentro de un mercado de servicios cada vez más mediado por canales digitales.

* **Justificación técnica**: la evidencia recolectada muestra que el problema central no es la ausencia de oferta o demanda de servicios técnicos, sino la falta de organización de la información y de los canales mediante los cuales esa oferta y esa demanda se coordinan. Tanto la evidencia de contexto como las entrevistas evidencian la necesidad de: un canal centralizado de comunicación entre clientes y prestadores, un mecanismo de publicación y consulta de solicitudes u oportunidades de trabajo, una forma de registrar y consultar el historial de servicios realizados, y mecanismos que permitan construir confianza entre personas que no se conocen previamente. Estas son, en esencia, capacidades generales que una plataforma de software puede ofrecer: centralizar la comunicación en un único canal, estructurar y conservar la información de solicitudes, contactos e historial en lugar de dejarla en medios manuales o dispersos, y facilitar mecanismos de búsqueda y visibilidad que acerquen a quien ofrece un servicio con quien lo necesita. Por estas razones, el desarrollo de una solución de software resulta pertinente frente a la problemática identificada, en la medida en que puede reducir la dependencia de procesos manuales y canales fragmentados.

---

## 3. RESTRICCIONES Y CONDICIONANTES DEL DISEÑO

### 3.1 Restricciones técnicas

**Qué restringe al proyecto**

1. **Conectividad móvil irregular.** Se identificó, a partir de las entrevistas, que una herramienta útil debe funcionar incluso en zonas de Santa Marta donde la señal de internet móvil es muy precaria. 

2. **Predominio del celular sobre el computador.** Según EMICRON, en 2024 el 89,1% de los micronegocios del país no usaba computador, tableta ni portátil, mientras que el 70,9% usaba algún tipo de teléfono celular, en 2025, para las 24 ciudades, las cifras fueron 82,6% sin dispositivos electrónicos y 83,9% con celular. Asimismo, se identificó en las entrevistas el uso de teléfonos celulares convencionales, con funciones limitadas a llamadas y mensajería básica, como el dispositivo principal de trabajo de parte de algunos prestadores.


### 3.2 Restricciones sociales y culturales

**Qué restringe al proyecto**

1. **Baja alfabetización digital de parte de los Prestadores.** Se identificó baja familiaridad con las redes sociales, páginas web y herramientas tecnológicas modernas por parte de algunos prestadores entrevistados. Así como, la solicitud explícita de una herramienta sumamente sencilla, con botones grandes, que no exija una experiencia mayor en el uso tecnológico.

2. **Hábitos de comunicación.** Los hábitos de comunicación identificados en las entrevistas están centrados principalmente en WhatsApp y  llamadas telefónicas.

3. **Confianza entre desconocidos.** Los clientes entrevistados manifestaron su preferencia hacia reseñas reales, trabajos anteriores visibles, recomendaciones, acreditación verificable y respaldo ante daños o accidentes. En particular, se identificó preocupación por parte de adultos que viven solos, ante el ingreso de personas desconocidas en su vivienda.

### 3.3 Restricciones normativas y legales

**Qué restringe al proyecto**

1. **Ley 1581 de 2012 (Ley de Protección de Datos Personales de Colombia).** La plataforma trata datos personales (nombre, teléfono, correo, ubicación, e historial de servicios). La ley exige, entre otros aspectos, contar con la autorización del titular y reconocerle derechos como, conocer, actualizar, rectificar y solicitar la supresión de sus datos.

### 3.4 Restricciones de salud y seguridad

**Qué restringe al proyecto**

1. **Seguridad de la información y ciberseguridad.** La plataforma concentra datos de contacto, ubicación y reputación de personas que no se conocen entre sí. Una filtración de la dirección exacta expondría a los usuarios a riesgos físicos, no solo informáticos.

2. **Seguridad física y personal de los usuarios.** Servicios que se ejecutan en el domicilio del cliente generan la necesidad de mecanismos de confianza antes de permitir el ingreso de un prestador, así como de respaldo ante accidentes o daños durante el trabajo. Del lado del Prestador, los oficios implican riesgos propios de cada actividad.

### 3.5 Restricciones éticas

**Qué restringe al proyecto**

1. **Transparencia en las reglas que ordenan y valoran.** El sistema muestra prestadores según categoría y zona y calcula una reputación agregada. Las personas deben poder entender por qué ven a un prestador y cómo se forma su reputación. 

2. **Equidad y sesgos.**  Los Prestadores nuevos, sin reseñas, podrían quedar en desventaja frente a los consolidados, las calificaciones podrían usarse como represalia.

3. **Manejo responsable de la información.** Los datos de contacto y la ubicación exacta de las personas no deben circular más allá de lo necesario para prestar el servicio.

4. **No inducir a error.** Un indicador de progreso, una insignia o un nivel de verificación no deben leerse como una certificación.

5. **Rendición de cuentas en la moderación.** Bloquear cuentas, ocultar contenido o resolver reportes afecta los ingresos de personas que dependen de su reputación.
## 4. PROCESO DE DISEÑO DE INGENIERÍA

1. **Definición de requerimientos del diseño:** 
	
**Requerimientos funcionales (RF):** documentados en el repositorio, organizados por caso de uso.

| Caso de uso | Alcance                                                   | N.º de RF |
| ----------- | --------------------------------------------------------- | --------- |
| UC-01       | Registro, autenticación, roles, privacidad de ubicación   | 15        |
| UC-02       | Publicación de solicitudes, descubrimiento de prestadores | 15        |
| UC-03       | Perfil profesional, tablero de oportunidades              | 16        |
| UC-04       | Propuestas, contratación, ciclo de vida del servicio      | 20        |
| UC-05       | Calificaciones, reportes, moderación, administración      | 19        |
| UC-06       | Formalización progresiva, notificaciones, historial       | 12        |
| UC-07       | Capacidades Could/Future (fuera del MVP)                  | 10        |

**Total: 107 requerimientos funcionales**, cada uno con Historia de Usuario, Escenarios de Aceptación, Casos Límite y Criterios de Éxito medibles.

**Requerimientos no funcionales y de sistema (RNF):** 

| ID      | Categoría                                  | Requisito no funcional / de sistema                                                                                                                                                                      |
| ------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RNF-001 | Disponibilidad / conectividad              | El sistema DEBE seguir siendo operable en condiciones de conectividad móvil intermitente o de baja velocidad.                                                                                            |
| RNF-002 | Usabilidad                                 | La interfaz DEBE ser operable por usuarios con baja alfabetización digital, con navegación simple, elementos táctiles grandes y mínima carga cognitiva por pantalla.                                     |
| RNF-003 | Rendimiento                                | El tablero de oportunidades  y la lista de solicitudes abiertas DEBEN cargar en un tiempo que permita revisión ágil durante pausas cortas de trabajo del Prestador.                                      |
| RNF-004 | Seguridad y privacidad                     | El sistema DEBE cifrar en tránsito y en reposo los datos sensibles de ubicación exacta y datos de contacto, y DEBE aplicar control de acceso basado en roles de forma consistente en toda la plataforma. |
| RNF-005 | Trazabilidad / auditoría                   | Toda acción administrativa sobre cuentas, reportes o contenido DEBE quedar registrada de forma inmutable y consultable.                                                                                  |
| RNF-006 | Integridad transaccional                   | Las operaciones de cambio de estado del ciclo de vida del servicio DEBEN ser atómicas y no permitir estados inconsistentes ante fallos o reintentos.                                                     |
| RNF-007 | Notificaciones en tiempo casi real         | Las notificaciones de nueva oportunidad, propuesta recibida o cambio de estado DEBEN entregarse en un tiempo cercano al evento que las origina, dentro de las preferencias configuradas por el usuario.  |
| RNF-008 | Escalabilidad                              | La arquitectura DEBE soportar el crecimiento del número de Prestadores, Clientes y solicitudes concurrentes propio de una ciudad como Santa Marta sin degradar el cumplimiento de RNF-003.               |
| RNF-009 | Compatibilidad de plataforma               | El sistema DEBE ser accesible al menos desde teléfonos inteligentes de gama media/baja, dado que la mayoría de los micronegocios de la ciudad opera con teléfono celular y no con computador.            |
| RNF-010 | Cumplimiento normativo de datos personales | El tratamiento de datos personales DEBE ajustarse a la Ley 1581 de 2012 (protección de datos personales en Colombia).                                                                                    |

---

2.  **Formulación de alternativas de solución:** 

Con base en los requerimientos anteriores, se formulan tres alternativas de arquitectura y plataforma:

**Alternativa A — Aplicación web responsiva (PWA)**
Backend en Java con Spring Boot y PostgreSQL como base de datos relacional. Frontend en React, implementado como Progressive Web App instalable desde el navegador, con geolocalización vía API del navegador y notificaciones push web. Un único código base de cliente para Cliente, Prestador y Administrador, diferenciado por rol.

**Alternativa B — Aplicación móvil nativa (Android) con backend independiente**
Aplicaciones nativas Android separadas para Cliente y Prestador, comunicándose con un backend Java/Spring Boot + PostgreSQL vía API REST. Notificaciones push nativas mediante Firebase Cloud Messaging. El rol Administrador se gestiona desde un panel aparte.

**Alternativa C — Aplicación móvil multiplataforma (React Native) + panel web de administración**
App móvil única para Cliente y Prestador construida en React Native, consumiendo el mismo backend Java/Spring Boot + PostgreSQL. El rol Administrador se atiende mediante un panel web separado en React, ya que sus tareas son de escritorio/administrativas y no requieren app móvil.

---

3.  **Análisis y comparación de alternativas:** 

(Escala: 1 = deficiente, 5 = óptimo para el criterio)

| Criterio                                           | Peso | Se relaciona con | A: Web (PWA) | B: App nativa Android | C: Híbrida + panel web |
| -------------------------------------------------- | ---- | ---------------- | ------------ | --------------------- | ---------------------- |
| Disponibilidad con conectividad débil              | 25%  | RNF-001          | 3            | 5                     | 4                      |
| Usabilidad para baja alfabetización digital        | 20%  | RNF-002          | 3            | 5                     | 4                      |
| Compatibilidad con gama media/baja de celulares    | 15%  | RNF-009          | 4            | 3                     | 4                      |
| Alineación con las capacidades técnicas del equipo | 15%  | NA               | 5            | 4                     | 4                      |
| Costo/tiempo de desarrollo dentro del semestre     | 15%  | NA               | 5            | 3                     | 3                      |
| Necesidad real de un panel administrativo separado | 10%  | RNF-005          | 2            | 2                     | 5                      |

**Cálculo del puntaje ponderado:**

- **A (Web PWA):** 3,65
- **B (App nativa Android):**  3,95
- **C (Híbrida + panel web):**  3,95

---
4.  **Selección de la alternativa óptima:** 

**Alternativa seleccionada:** C - Aplicación móvil multiplataforma (React Native) + panel web de administración.

**Justificación:**

1. Obtiene el mismo puntaje ponderado que la Alternativa B, pero sin el sobrecosto de mantener apps nativas separadas por sistema operativo, lo cual es más viable dentro del tiempo de un semestre.
2. Resuelve mejor que A y B la necesidad identificada en UC-05 (moderación, reportes, auditoría), que por su naturaleza de trabajo de escritorio encaja mejor en un panel web que en una app móvil.
3. Mantiene el Backend en Java/Spring Boot + PostgreSQL en las tres alternativas, por lo que la selección no compromete la instrumentación de RNF-004 (seguridad), RNF-005 (trazabilidad) ni RNF-006 (integridad transaccional), que dependen del Backend y no del cliente elegido.
4. Se descarta la Alternativa A porque su desempeño en RNF-001 y RNF-002 es notoriamente inferior, y estos dos RNF están directamente respaldados por evidencia de entrevistas, no son suposiciones.
---
5.  **Desarrollo del diseño final:** 

**Conceptualización general del sistema:**

- **Backend:** Java + Spring Boot, expuesto como API REST, organizado por dominio alineado a los 7 casos de uso.

- **Base de datos:** PostgreSQL, con separación explícita entre datos de ubicación aproximada y dirección exacta, y con registro de auditoría inmutable para acciones administrativas.

- **Cliente móvil (React Native):** app única para los roles Cliente y Prestador, con navegación diferenciada por rol  y diseño orientado a usabilidad para baja alfabetización digital.

- **Panel web de administración (React):** interfaz separada exclusiva para el rol Administrador, cubriendo cola de reportes, moderación, auditoría, gestión de categorías/zonas.

- **Notificaciones:** servicio de notificaciones desacoplado del resto del Backend, con preferencias configurables por usuario.

- **Capacidades Could/Future :** quedan modeladas como módulos independientes y desactivables: chat interno, mapa visual, insignias, referidos, soporte WhatsApp, piloto de pagos. De forma que su ausencia no bloquea ningún flujo del MVP.
   
## 5. DESCRIPCIÓN DE LA SOLUCIÓN FINAL

## 6. RESULTADOS Y DESEMPEÑO DEL DISEÑO

## 7. TRABAJO EN EQUIPO Y GESTIÓN DEL PROYECTO
## 8. CONSIDERACIONES ÉTICAS, AMBIENTALES Y PROFESIONALES


---
