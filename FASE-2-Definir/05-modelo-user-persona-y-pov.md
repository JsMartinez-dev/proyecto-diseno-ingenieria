# Modelo - User Persona y POV (Point of View)

> Este documento sintetiza los patrones comunes de las 6 entrevistas realizadas 
> (`05-entrevistas-realizadas/`) en dos arquetipos de usuario: **Trabajador independiente** 
> y **Cliente**. Cada arquetipo es una **síntesis compuesta** de los 3 entrevistados de su 
> segmento.
---

## 1. Ficha comparativa de User Personas

| Atributo                       | Trabajador independiente                                                            | Cliente                                                                   |
| ------------------------------ | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **Basado en**                  | Entrevista con trabajadores informales                                              | Entrevista con clientes                                                   |
| **Edad**                       | Rango 28–45 años                                                                    | Rango 31–61 años                                                          |
| **Oficio / Rol**               | Técnico a domicilio: aires acondicionados, electricidad o plomería                  | Contratante de servicios técnicos a domicilio                             |
| **Ubicación**                  | Santa Marta                                                                         | Distintos sectores de Santa Marta: El Rodadero, Centro Histórico, Taganga |
| **Canales que usa**            | WhatsApp, llamadas, Facebook, voz a voz                                             | WhatsApp, llamadas, recomendaciones de vecinos, volantes físicos          |
| **Relación con la tecnología** | Heterogénea: desde celular convencional básico, hasta uso activo de redes sociales. | Heterogénea: desde uso limitado de WhatsApp, hasta manejo fluido de apps. |
| **Frase representativa**       | *La confianza lo es todo para un trabajador independiente*                          | *Necesito saber que la persona que entra a mi casa es de confianza*       |

---

## 2. Persona 1 — Trabajador independiente

### Comportamiento observado

- Consigue clientes casi exclusivamente por recomendación o publicaciones informales en redes sociales.
- No tiene un sistema único de registro: usa agendas físicas, notas del celular o cuadernos de bolsillo, según el entrevistado.
- No puede atender el celular mientras trabaja porque tiene las manos ocupadas, mojadas o sucias.
- Prioriza atender primero al cliente que solicitó el servicio primero, o al caso más urgente.

### Puntos de dolor 
1. **Fragmentación de canales:** recibe solicitudes por varios canales a la vez  sin un lugar donde centralizarlas.
2. **Pérdida de información:** anota citas y direcciones en soportes sueltos o poco duraderos, y a veces las pierde o se dañan.
3. **Conflictos de agenda:** enfrenta cruces de horario entre clientes el mismo día, con riesgo de perder ingresos.
4. **Rentabilidad ciega:** no lleva registro de trabajos ni materiales, por lo que no sabe con certeza cuánto le queda de ganancia real.

### Objetivos y metas
- Centralizar en un solo lugar las solicitudes que le llegan por distintos canales.
- Tener una bitácora o historial de clientes y trabajos para conocer su rentabilidad real.
- Contar con una herramienta simple, que funcione con señal móvil precaria y no requiera curva de aprendizaje.
- Poder avisar o programar automáticamente cuando no puede llegar a una cita, para no perder la confianza del cliente.

---

## 3. Persona 2 — Cliente

### Comportamiento observado
- Contacta al trabajador por WhatsApp o llamada directa, según su edad y familiaridad con la tecnología.
- Acepta con frecuencia presupuestos abiertos que solo se cierran al momento de la inspección.
- En algunos casos, coordina que un tercero esté presente durante el servicio cuando ella no puede quedarse.

### Puntos de dolor 
1. **Incertidumbre en la coordinación:** sufre retrasos sin aviso previo, a veces perdiendo toda una mañana esperando
2. **Precio no definido:** no conoce el costo final del servicio hasta que el trabajador ya está en el lugar.
3. **Inseguridad:** le preocupa dejar entrar a una persona desconocida a su casa, sin forma de verificar antecedentes o calidad de su trabajo.
4. **Falta de respaldo:** no cuenta con ninguna garantía si el problema reaparece días después o si ocurre un daño durante el servicio.

### Objetivos y metas
- Recibir presupuestos claros y, en lo posible, cerrados antes de iniciar el trabajo.
- Contar con evidencia social para elegir con más confianza.
- Tener comunicación confiable sobre horarios, con aviso oportuno si hay un retraso.
- Contar con algún tipo de garantía o respaldo formal ante fallas posteriores o daños.

---

## 4. Declaraciones de Punto de Vista (POV)

### POV 1 — El Trabajador Técnico Independiente (foco operativo)

- **Usuario:** un trabajador técnico independiente en Santa Marta, con relación heterogénea con la tecnología y dinámicas de trabajo de alta exigencia física .
  
- **Necesita:** una forma simple y ágil, con la menor escritura manual posible, para organizar sus servicios diarios, optimizar sus desplazamientos, registrar lo cobrado, y contar con un espacio digital centralizado que le permita captar y conseguir nuevos clientes de forma recurrente.
  
- **Porque (insight):** su labor le exige tener las manos ocupadas, mojadas o sucias constantemente . Al no poder usar el celular en tiempo real, depende de agendas de papel o de su memoria, lo que genera citas olvidadas, desplazamientos ineficientes y pérdida de ingresos críticos para su sustento, limitando además su capacidad para autopromocionarse y buscar clientela fuera de su red de contactos informal del voz a voz.

### POV 2 — El Cliente de Servicios a Domicilio (foco de confianza)

- **Usuario:** un cliente residente en Santa Marta que contrata servicios técnicos a domicilio de manera ocasional .
  
- **Necesita:** predicción en los tiempos de llegada del técnico, presupuestos de referencia claros antes de la visita, una garantía mínima sobre el trabajo realizado, y un canal o espacio digital verificado donde pueda buscar y conseguir personas calificadas que realicen de forma segura estas actividades técnicas a domicilio.
  
- **Porque (insight):** permitir el ingreso de un técnico desconocido a su vivienda le genera inseguridad , la falta de aviso oportuno sobre retrasos le hace perder tiempo valioso esperando, y carece de un medio estructurado para consultar la reputación, fotos de trabajos anteriores y opiniones verificables del técnico antes de la contratación.
  

---

## 5. Preguntas detonantes "How Might We" (HMW)

**HMW 1 — Entrada de datos:**
> ¿Cómo podríamos facilitar que el trabajador registre y consulte sus citas del día mediante comandos simples (por ejemplo, voz), evitando que tenga que escribir con las manos ocupadas o sucias?

**HMW 2 — Logística y desplazamiento:**
> ¿Cómo podríamos ayudar a organizar la secuencia de visitas diarias según la ubicación de los clientes en Santa Marta, reduciendo desplazamientos innecesarios?

**HMW 3 — Comunicación y confianza:**
> ¿Cómo podríamos enviar avisos automáticos de llegada o retraso a los clientes, sin que el trabajador tenga que interrumpir su labor manual para escribirlos?

**HMW 4 — Seguridad y garantía:**
> ¿Cómo podríamos darle al cliente evidencia o historial del trabajador, como los trabajos previos o  referencias, sin exigirle al trabajador procesos de formalización que no aplican a su realidad actual?

---
