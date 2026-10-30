# Feature Specification: SPEC-01 — Autenticación, registro y control de acceso

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC001–UC007


## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registro por rol [UC001, UC002, UC007] (Priority: P1)

Como persona nueva, quiero registrarme como Cliente o Prestador aceptando los términos y el tratamiento de datos, para obtener una cuenta con el rol correcto.

**Why this priority**: Es la puerta de entrada a la plataforma; sin registro no existe ningún otro flujo posible para Cliente ni Prestador.

**Independent Test**: Crear una cuenta de cada rol con datos válidos y comprobar que el rol y el consentimiento quedan almacenados correctamente.

**Acceptance Scenarios**:

1. **Scenario**: Registro exitoso como Cliente [UC001]
   - **Given** una persona sin cuenta completa el formulario de registro con datos válidos y selecciona el rol Cliente
   - **When** envía el formulario
   - **Then** el sistema crea la cuenta con rol Cliente y la deja lista para autenticación

2. **Scenario**: Registro exitoso como Prestador [UC002]
   - **Given** una persona sin cuenta completa el formulario de registro con datos válidos y selecciona el rol Prestador
   - **When** envía el formulario
   - **Then** el sistema crea la cuenta con rol Prestador y la deja lista para autenticación

1. **Scenario**: Aceptación obligatoria de términos y tratamiento de datos [UC007]
   - **Given** una persona completa el formulario de registro, ya sea como Cliente o Prestador
   - **When** no marca la aceptación de términos y tratamiento de datos
   - **Then** el sistema no permite finalizar el registro y señala el campo pendiente

4. **Scenario**: Correo ya registrado
   - **Given** una persona intenta registrarse con un correo que ya tiene una cuenta asociada (en cualquier rol)
   - **When** envía el formulario
   - **Then** el sistema rechaza el registro sin revelar con qué rol está asociado el correo existente



---

### User Story 2 - Autenticación y acceso seguro [UC003, UC004, UC005, UC006] (Priority: P1)

Como usuario registrado, quiero iniciar, cerrar y recuperar mi sesión, y acceder únicamente a las capacidades autorizadas para mi rol.

**Why this priority**: Sin autenticación no hay forma de que un usuario registrado use ninguna otra funcionalidad de la plataforma.

**Independent Test**: Probar credenciales válidas e inválidas, cierre de sesión, recuperación de acceso y restricción por rol, sin exponer datos de la cuenta.

**Acceptance Scenarios**:

1. **Scenario**: Inicio de sesión exitoso [UC003]
   - **Given** un usuario registrado ingresa correo y contraseña correctos
   - **When** envía el formulario de inicio de sesión
   - **Then** el sistema crea una sesión válida y lo dirige a la vista correspondiente a su rol

2. **Scenario**: Credenciales inválidas [UC003]
   - **Given** un usuario ingresa un correo registrado con una contraseña incorrecta
   - **When** intenta iniciar sesión
   - **Then** el sistema rechaza el intento sin indicar si el correo existe o si fue la contraseña la que falló

3. **Scenario**: Cierre de sesión [UC004]
   - **Given** un usuario tiene una sesión activa
   - **When** solicita cerrar sesión
   - **Then** el sistema invalida la sesión y exige nueva autenticación para volver a acceder

4. **Scenario**: Recuperación de acceso [UC005]
   - **Given** un usuario registrado olvidó su contraseña
   - **When** solicita recuperación indicando su correo
   - **Then** el sistema envía un mecanismo de verificación sin confirmar ni negar si el correo está registrado

1. **Scenario**: Acceso restringido según rol [UC006]
   - **Given** un Cliente autenticado intenta acceder a una capacidad exclusiva de Prestador (o viceversa)
   - **When** realiza la solicitud
   - **Then** el sistema deniega el acceso

---

### Edge Cases

- Un usuario pierde la conexión justo después de enviar el formulario de registro: el sistema no debe dejar una cuenta a medio crear, o se completa el registro o no queda ningún rastro persistido.
- Un token de recuperación de acceso se usa dos veces o después de expirado: el sistema debe rechazarlo y exigir una nueva solicitud.
- Un usuario intenta mantener sesiones activas en múltiples dispositivos: el sistema deberá aplicar la política definida para sesiones simultáneas e invalidar las sesiones anteriores
- Un usuario intenta registrarse con un correo electrónico que ya está asociado a una cuenta con un rol diferente: el sistema deberá detectar que el correo ya está registrado, impedir la creación de una segunda cuenta y solicitar al usuario iniciar sesión con la cuenta existente.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE permitir registrar una cuenta como Cliente o Prestador. *(UC001, UC002)*
- **FR-002**: El sistema DEBE exigir la aceptación de términos y tratamiento de datos antes de finalizar el registro, para ambos roles. *(UC007)*
- **FR-003**: El sistema DEBE rechazar el registro con un correo ya asociado a una cuenta existente, sin revelar el rol de esa cuenta. *(UC001, UC002)*
- **FR-004**: El sistema DEBE autenticar credenciales válidas y rechazar las inválidas sin revelar cuál de los dos datos (correo o contraseña) fue incorrecto. *(UC003)*
- **FR-005**: El sistema DEBE permitir cerrar sesión de forma verificable. *(UC004)*
- **FR-006**: El sistema DEBE permitir recuperar el acceso mediante un mecanismo que no confirme ni niegue la existencia de una cuenta asociada al correo indicado. *(UC005)*
- **FR-007**: El sistema DEBE aplicar las capacidades permitidas exclusivamente según el rol autenticado, denegando cualquier acción fuera de ese alcance. *(UC006)*

### Key Entities *(include if feature involves data)*

- **Usuario**: identidad, credenciales, rol (Cliente/Prestador) y estado de cuenta.
- **Consentimiento**: versión de términos aceptada, fecha y usuario asociado.
- **Sesión**: estado de autenticación, inicio, expiración y cierre.
- **Token de recuperación**: código o enlace de un solo uso, con expiración, asociado a una solicitud de recuperación.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Una persona puede completar un registro válido (Cliente o Prestador) en menos de 3 minutos.
- **SC-002**: El 100% de los intentos de inicio de sesión con credenciales inválidas es rechazado sin crear sesión.
- **SC-003**: Ningún usuario autenticado puede ejecutar una capacidad exclusiva de un rol distinto al suyo, en el 100% de los casos de prueba.
- **SC-004**: El 100% de las solicitudes de recuperación de acceso, existan o no en la base de datos, reciben la misma respuesta observable por parte del sistema.



# Feature Specification: SPEC-02 — Gestión de perfil y privacidad

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC008–UC013
	

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Administración de datos personales [UC008, UC011] (Priority: P1)

Como usuario, quiero consultar y editar mis datos básicos para mantener mi información vigente.

**Why this priority**: Es la base de cualquier otra funcionalidad de perfil; sin poder consultar y editar sus datos, el usuario no puede mantener su cuenta actualizada.

**Independent Test**: Modificar un dato permitido y verificar que queda disponible en una consulta posterior autorizada.

**Acceptance Scenarios**:

1. **Scenario**: Consulta de datos almacenados [UC011]
   - **Given** un usuario autenticado accede a su perfil
   - **When** consulta sus datos almacenados
   - **Then** el sistema muestra únicamente los datos asociados a su propia cuenta

2. **Scenario**: Edición exitosa de datos básicos [UC008]
   - **Given** un usuario autenticado modifica un dato editable (ej. nombre, teléfono) con un valor válido
   - **When** guarda el cambio
   - **Then** el sistema persiste el nuevo valor y lo refleja en consultas posteriores

3. **Scenario**: Edición con dato inválido [UC008]
   - **Given** un usuario ingresa un dato con formato inválido (ej. correo mal formado)
   - **When** intenta guardar el cambio
   - **Then** el sistema rechaza la actualización y conserva el valor previamente guardado


---

### User Story 2 - Privacidad y visibilidad de ubicación [UC009, UC010, UC013] (Priority: P1)

Como usuario, quiero controlar la visibilidad de mis datos de ubicación y de mi perfil en general, para proteger mi información frente a terceros.

**Why this priority**: La separación entre zona aproximada y dirección exacta es una restricción de privacidad crítica que atraviesa otros módulos, por lo cual debe quedar garantizada desde el perfil.

**Independent Test**: Cambiar la preferencia de visibilidad y comprobar que la separación entre zona aproximada y dirección exacta se respeta en lo que queda expuesto.

**Acceptance Scenarios**:

1. **Scenario**: Configurar zona aproximada [UC009]
   - **Given** un usuario edita su perfil
   - **When** define o actualiza su zona aproximada
   - **Then** el sistema la persiste como el dato de ubicación expuesto por defecto

2. **Scenario**: Cambiar visibilidad de datos personales [UC010]
   - **Given** un usuario tiene una preferencia de visibilidad configurable
   - **When** la modifica
   - **Then** el sistema aplica la nueva preferencia sin superar las reglas de privacidad base del producto

1. **Scenario**: Separación entre zona aproximada y dirección exacta [UC013]
   - **Given** un usuario tiene registrada tanto su zona aproximada como su dirección exacta
   - **When** un tercero sin autorización explícita consulta su perfil
   - **Then** el sistema expone únicamente la zona aproximada, nunca la dirección exacta


---

### User Story 3 - Eliminación de cuenta [UC012] (Priority: P2)

Como usuario, quiero solicitar la eliminación de mi cuenta para dejar de tener presencia en la plataforma cuando ya no la necesite.

**Why this priority**: Es una funcionalidad independiente y menos frecuente que la edición de perfil; no bloquea el uso normal de la plataforma, pero es un derecho del usuario que debe estar disponible.

**Independent Test**: Solicitar la eliminación de una cuenta de prueba y verificar que queda registrada con el estado correcto hasta su confirmación.

**Acceptance Scenarios**:

1. **Scenario**: Solicitud de eliminación registrada [UC012]
   - **Given** un usuario autenticado solicita eliminar su cuenta
   - **When** confirma la solicitud
   - **Then** el sistema la registra con fecha, usuario y estado, sin ejecutar la eliminación de forma inmediata

2. **Scenario**: Eliminación no ejecutada sin confirmación [UC012]
   - **Given** existe una solicitud de eliminación pendiente
   - **When** no se completa el paso de confirmación requerido
   - **Then** el sistema no elimina la cuenta ni los datos asociados


---

### Edge Cases

- Un usuario solicita eliminar su cuenta mientras tiene un servicio en  ejecución: El sistema debe bloquear la solicitud de eliminación hasta que los servicios en ejecución hayan finalizado.
- Una solicitud de eliminación de cuenta permanece pendiente durante más de 24 horas: el sistema deberá marcar automáticamente la solicitud como expirada, mantener la cuenta activa y requerir que el usuario genere una nueva solicitud si desea eliminarla.
- Un usuario edita su zona aproximada mientras tiene una dirección exacta ya registrada para un servicio activo: el cambio de zona no debe alterar la dirección exacta ya comprometida con ese servicio.
- Dos actualizaciones de perfil llegan casi al mismo tiempo desde dos sesiones distintas del mismo usuario: el sistema no debe perder ninguno de los cambios válidos ni dejar el perfil en un estado parcialmente corrupto.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE permitir consultar los datos almacenados del usuario autenticado, limitados a su propia cuenta. *(UC011)*
- **FR-002**: El sistema DEBE validar y persistir los cambios en datos básicos editables, rechazando valores con formato inválido sin alterar el valor previo. *(UC008)*
- **FR-003**: El sistema DEBE permitir configurar y actualizar la zona aproximada del usuario. *(UC009)*
- **FR-004**: El sistema DEBE aplicar las preferencias de visibilidad configuradas por el usuario sin superar las reglas de privacidad base definidas por el producto. *(UC010)*
- **FR-005**: El sistema DEBE separar de forma estricta la zona aproximada de la dirección exacta, exponiendo esta última únicamente cuando la regla de negocio correspondiente lo autorice explícitamente. *(UC013)*
- **FR-006**: El sistema DEBE registrar toda solicitud de eliminación de cuenta con usuario, fecha y estado. *(UC012)*
- **FR-007**: El sistema NO DEBE ejecutar la eliminación de una cuenta sin la confirmación explícita requerida. *(UC012)*

### Key Entities *(include if feature involves data)*

- **Perfil de usuario**: datos básicos editables y preferencias de visibilidad.
- **Ubicación**: zona aproximada (expuesta por defecto) y dirección exacta (expuesta solo bajo reglas específicas), con reglas de exposición distintas.
- **Solicitud de eliminación**: usuario, fecha, estado (pendiente/confirmada/rechazada) y confirmación asociada.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: La dirección exacta no se muestra en el 100% de los casos donde solo corresponde exponer la zona aproximada.
- **SC-002**: Un dato con formato inválido nunca modifica el valor previamente guardado, en el 100% de los intentos de edición.
- **SC-003**: Toda solicitud de eliminación queda registrada y ninguna se ejecuta sin la confirmación requerida.
- **SC-004**: El 100% de las consultas de datos almacenados devuelve exclusivamente información de la cuenta del solicitante.


# Feature Specification: SPEC-03 — Descubrimiento de prestadores

**Creado**: 2026-09-16 
**Casos de uso cubiertos**: UC014, UC015 

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Buscar y explorar prestadores [UC014, UC015] (Priority: P1)

Como cliente, quiero buscar prestadores por categoría y zona, y consultar el perfil público de cualquiera de ellos ya sea desde los resultados de la búsqueda o de forma directa, para decidir a quién contactar sin necesitar ni exponer ubicaciones exactas.

**Why this priority**: Es el punto de entrada al valor central de CONectaSM para el Cliente, sin descubrimiento no existe forma de llegar a publicar una solicitud dirigida ni de comparar prestadores antes de contratar.

**Independent Test**: Con una cuenta de Cliente, buscar por categoría y zona, abrir el perfil de un resultado de esa búsqueda, y además consultar un perfil por acceso directo (sin pasar por la búsqueda); verificar que ambos caminos muestran el mismo perfil público y que en ningún momento se revela información privada o ubicación exacta.

**Acceptance Scenarios**:

1. **Scenario**: Búsqueda con resultados [UC014]
    
    - **Given** un Cliente autenticado indica una categoría de servicio y una zona de Santa Marta
    - **When** ejecuta la búsqueda
    - **Then** el sistema devuelve la lista de prestadores que ofrecen esa categoría en esa zona, mostrando únicamente su zona de cobertura declarada, no su dirección exacta
    
2. **Scenario**: Búsqueda sin resultados [UC014]
    
    - **Given** un Cliente busca una combinación de categoría y zona sin prestadores disponibles
    - **When** ejecuta la búsqueda
    - **Then** el sistema indica que no hay resultados para esos criterios, sin producir un error, y permite ajustar la búsqueda
3. **Scenario**: Consultar perfil desde un resultado de búsqueda [UC015]
    
    - **Given** un Cliente tiene una lista de resultados de UC014
    - **When** selecciona uno de los prestadores listados
    - **Then** el sistema muestra el perfil público de ese prestador (categorías que ofrece, reputación agregada, disponibilidad declarada) sin salir del contexto de la búsqueda
4. **Scenario**: Consultar perfil por acceso directo [UC015]
    
    - **Given** un Cliente cuenta con la referencia a un prestador sin haber pasado por una búsqueda (por ejemplo, un enlace compartido o una solicitud previa)
    - **When** consulta su perfil directamente
    - **Then** el sistema muestra el mismo perfil público que vería desde el flujo de búsqueda
5. **Scenario**: Perfil sin información pública disponible[UC015]
    
    - **Given** un prestador no ha completado o no tiene visible su perfil
    - **When** un Cliente intenta consultarlo, por cualquiera de los dos caminos
    - **Then** el sistema indica que el detalle no está disponible, sin distinguir si la causa es un perfil incompleto, oculto o inexistente
6. **Scenario**: Actor no autorizado[UC015]
    
    - **Given** un actor sin rol Cliente (por ejemplo un Prestador, un Administrador o un visitante sin sesión) intenta buscar prestadores o consultar un perfil
    - **When** realiza la solicitud
    - **Then** el sistema deniega el acceso a la funcionalidad

---

### Edge Cases

- Un cliente consulta el perfil de un prestador que no tiene información pública disponible: el sistema debe indicar que el detalle no está disponible, sin revelar datos privados ni el motivo exacto de la falta de información.
- Un cliente busca prestadores usando una categoría o zona que no existe en el catálogo vigente:  El sistema debe sugerir alternativas que se asemejan a lo consultado.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-014**: El sistema DEBE permitir que un Cliente busque prestadores filtrando por categoría de servicio y zona, devolviendo únicamente prestadores cuya zona de cobertura declarada coincida, sin revelar direcciones exactas ni concederla a otros roles. _(UC014)_
- **FR-015**: El sistema DEBE permitir que un Cliente consulte el perfil público de un prestador, tanto desde un resultado de búsqueda (extensión de UC014) como por acceso directo, mostrando en ambos casos la misma información pública y sin exponer datos privados del prestador ni concederla a otros roles. _(UC015)_

### Key Entities _(include if feature involves data)_

- **Prestador (vista pública)**: categorías que ofrece, zona de cobertura declarada, reputación/calificación agregada y disponibilidad declarada; excluye datos privados o de contacto directo.
- **Criterio de búsqueda**: categoría de servicio y zona indicados por el Cliente.
- **Resultado de búsqueda**: conjunto de prestadores coincidentes, incluyendo el caso de resultado vacío.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: El 100% de las búsquedas ejecutadas por un Cliente devuelve únicamente prestadores que coinciden con la categoría y zona indicadas, sin exponer ubicación exacta.
- **SC-002**: El 100% de las consultas de perfil, sin importar si se originan desde una búsqueda o de forma directa, muestra la misma información pública y ninguna información privada.
- **SC-003**: El 100% de los intentos de búsqueda o consulta de perfil por un actor sin rol Cliente es denegado.
- **SC-004**: Ante un perfil sin información pública disponible, el sistema informa la falta de detalle en el 100% de los casos sin revelar la causa específica.
- **SC-005**: [NEEDS CLARIFICATION: definir] catálogo válido de categorías y zonas, y la política de coincidencia (exacta, parcial, por cercanía) antes de implementar.
# Feature Specification: SPEC-04 — Gestión de solicitudes de servicio

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC016, UC017, UC018, UC019, UC020, UC021, UC022, UC023 

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Publicar una solicitud de servicio [UC016, UC017, UC018, UC019] (Priority: P1)

Como cliente, quiero crear una solicitud de servicio definiendo obligatoriamente su zona aproximada y su urgencia, pudiendo adjuntar fotos y decidiendo si la publico de inmediato o la conservo como borrador, para conseguir prestadores sin necesidad de revelar mi dirección exacta.

**Why this priority**: Es la acción central del Cliente en CONectaSM: sin la posibilidad de publicar una solicitud completa no existe demanda visible que los prestadores puedan atender, y de ella dependen todas las historias posteriores de esta especificación.

**Independent Test**: Con una cuenta de Cliente, completar zona y urgencia y publicar sin adjuntar fotos, repetir adjuntando una foto, repetir eligiendo conservar como borrador en lugar de publicar. Verificar que cada camino produce el estado correcto, ya sea publicada o borrador, sin duplicar el registro y sin permitir una publicación incompleta.

**Acceptance Scenarios**:

1. **Scenario**: Publicación completa con datos obligatorios [UC017]
    
    - **Given** un Cliente indica categoría, descripción, zona aproximada y nivel de urgencia de su solicitud
    - **When** confirma la publicación
    - **Then** el sistema crea la solicitud en estado «publicada», visible para prestadores de esa categoría y zona, mostrando la zona aproximada pero no la dirección exacta del Cliente
2. **Scenario**: Intento de publicar sin zona o sin urgencia [UC017]
    
    - **Given** un Cliente intenta publicar una solicitud sin haber definido la zona aproximada o el nivel de urgencia
    - **When** confirma la publicación
    - **Then** el sistema rechaza la operación, señala el campo faltante y no crea ningún registro
3. **Scenario**: Adjuntar fotos de forma opcional [UC016]
    
    - **Given** un Cliente está redactando su solicitud antes de confirmarla
    - **When** adjunta una o más fotos del problema o del lugar
    - **Then** el sistema las asocia a la solicitud y las incluye al publicarla; si el Cliente no adjunta ninguna foto, la publicación se completa igualmente sin ellas
4. **Scenario**: Conservar como borrador en lugar de publicar [UC019]
    
    - **Given** un Cliente completó parcial o totalmente los datos de su solicitud
    - **When** elige conservar como borrador en lugar de confirmar la publicación
    - **Then** el sistema guarda la solicitud en estado «borrador», no visible para prestadores, y permite retomarla más adelante para completarla o publicarla
5. **Scenario**: Pérdida de conexión durante la publicación
    
    - **Given** un Cliente confirma la publicación de su solicitud y la conexión se interrumpe antes de recibir respuesta
    - **When** la conexión se restablece
    - **Then** el sistema conserva el último estado confirmado (borrador o publicada), sin duplicar la solicitud
6. **Scenario**: Actor no autorizado
    
    - **Given** un actor sin rol Cliente intenta publicar o guardar como borrador una solicitud
    - **When** realiza la solicitud
    - **Then** el sistema deniega el acceso a la funcionalidad

### User Story 2 - Gestionar una solicitud abierta [UC020, UC021] (Priority: P1)

Como cliente, quiero editar o cancelar una solicitud que sigue abierta, para corregir su información o desistir del servicio antes de que se concrete con un prestador.

**Why this priority**: Las solicitudes reales cambian: el Cliente necesita poder corregir datos o retirar su solicitud sin depender de contactar manualmente a cada prestador interesado.

**Independent Test**: Con una solicitud propia en estado abierto, editar uno de sus campos y verificar el cambio; sobre otra solicitud propia, cancelarla y verificar que deja de estar disponible para prestadores; repetir ambas operaciones sobre una solicitud ya cerrada o contratada y verificar el rechazo.

**Acceptance Scenarios**:

1. **Scenario**: Editar una solicitud abierta [UC020]
    
    - **Given** un Cliente tiene una solicitud propia en estado «publicada» o «borrador»
    - **When** modifica uno de sus datos (categoría, descripción, zona, urgencia o fotos) y confirma
    - **Then** el sistema guarda el cambio y muestra el estado actualizado de la solicitud
2. **Scenario**: Intento de editar una solicitud que ya no está abierta [UC020]
    
    - **Given** una solicitud propia ya fue cancelada o pasó a un estado en el que ya no admite cambios (por ejemplo, contratada)
    - **When** el Cliente intenta editarla
    - **Then** el sistema rechaza la edición y comunica que la solicitud ya no admite cambios
3. **Scenario**: Cancelar una solicitud abierta [UC021]
    
    - **Given** un Cliente tiene una solicitud propia abierta
    - **When** confirma su cancelación
    - **Then** el sistema marca la solicitud como «cancelada», deja de mostrarla a los prestadores y conserva su historial
4. **Scenario**: Intento de cancelar una solicitud que ya no está abierta [UC021]
    
    - **Given** una solicitud propia ya fue cancelada previamente o ya no está en estado abierto
    - **When** el Cliente intenta cancelarla de nuevo
    - **Then** el sistema rechaza la operación sin cambiar el estado actual
5. **Scenario**: Actor no autorizado o solicitud ajena [UC20], [UC021]
    
    - **Given** un actor sin rol Cliente, o un Cliente que intenta editar o cancelar una solicitud que no le pertenece
    - **When** realiza la solicitud
    - **Then** el sistema deniega la operación sin modificar ningún registro

### User Story 3 - Consultar mis solicitudes [UC022, UC023] (Priority: P1)

Como cliente, quiero ver la lista de mis solicitudes y el detalle y estado de cada una, para dar seguimiento a mis oportunidades de servicio sin depender de recordar cada caso manualmente.

**Why this priority**: Sin visibilidad sobre sus propias solicitudes, el Cliente no puede saber qué está pendiente, publicado, cancelado o en borrador, reintroduciendo la fragmentación que el proyecto busca resolver.

**Independent Test**: Con al menos dos solicitudes propias en distintos estados, listar las solicitudes del Cliente y verificar que aparecen todas y solo las suyas; abrir el detalle de una de ellas y verificar que refleja su estado y datos actuales sin exponer información de otros clientes.

**Acceptance Scenarios**:

1. **Scenario**: Consultar la lista de solicitudes propias [UC022]
    
    - **Given** un Cliente tiene una o más solicitudes creadas (publicadas, en borrador o cerradas)
    - **When** consulta su lista de solicitudes
    - **Then** el sistema muestra únicamente las solicitudes de ese Cliente, indicando el estado de cada una
2. **Scenario**: Lista vacía
    
    - **Given** un Cliente aún no ha creado ninguna solicitud
    - **When** consulta su lista de solicitudes
    - **Then** el sistema muestra la lista vacía sin producir un error
3. **Scenario**: Consultar detalle y estado de una solicitud propia [UC023]
    
    - **Given** un Cliente selecciona una de sus solicitudes
    - **When** consulta su detalle
    - **Then** el sistema muestra los datos completos de la solicitud (categoría, descripción, zona aproximada, urgencia, fotos y estado actual)
4. **Scenario**: Intento de consultar una solicitud inexistente o ajena
    
    - **Given** un Cliente intenta consultar el detalle de una solicitud que no existe o que pertenece a otro Cliente
    - **When** realiza la consulta
    - **Then** el sistema rechaza la operación sin revelar si la solicitud existe bajo otro dueño
5. **Scenario**: Actor no autorizado
    
    - **Given** un actor sin rol Cliente intenta consultar la lista o el detalle de solicitudes
    - **When** realiza la solicitud
    - **Then** el sistema deniega el acceso

---

### Edge Cases

- Un cliente pierde la conexión durante la publicación o edición de una solicitud: el sistema debe conservar el último estado confirmado y no duplicar la solicitud.
- Un cliente intenta editar o cancelar un servicio que ya fue contratada por un prestador: el sistema debe bloquear la edición o cancelación inmediatamente y notificar que es imposible modificar un servicio ya acordado.
## Requirements _(mandatory)_

### Functional Requirements

- **FR-017**: El sistema DEBE exigir zona aproximada y nivel de urgencia como datos obligatorios en toda publicación de solicitud, incluidos siempre dentro del flujo de publicación. _(UC017, incluido en UC018)_
- **FR-018**: El sistema DEBE permitir que un Cliente publique una solicitud completa (categoría, descripción, zona aproximada, urgencia y fotos opcionales), dejándola visible para prestadores de esa categoría y zona sin revelar la dirección exacta, y DEBE rechazar la publicación si falta algún dato obligatorio. _(UC018)_
- **FR-016**: El sistema DEBE permitir, de forma opcional, adjuntar una o más fotos a la solicitud antes o durante su publicación, sin que su ausencia impida publicar. _(UC016, extiende a UC018)_
- **FR-019**: El sistema DEBE permitir, como alternativa a publicar, conservar la solicitud como borrador no visible para prestadores, retomable posteriormente. _(UC019, extiende a UC018)_
- **FR-020**: El sistema DEBE permitir que un Cliente edite los datos de una solicitud propia mientras esté en estado abierto (publicada o borrador), y DEBE rechazar la edición si la solicitud ya no admite cambios o no le pertenece. _(UC020)_
- **FR-021**: El sistema DEBE permitir que un Cliente cancele una solicitud propia mientras esté abierta, dejándola fuera de la visibilidad de los prestadores, y DEBE rechazar la cancelación si la solicitud ya no está abierta o no le pertenece. _(UC021)_
- **FR-022**: El sistema DEBE permitir que un Cliente consulte la lista completa de sus propias solicitudes, con su estado actual, sin mostrar solicitudes de otros clientes. _(UC022)_
- **FR-023**: El sistema DEBE permitir que un Cliente consulte el detalle y el estado de una solicitud propia, y DEBE rechazar la consulta si la solicitud no existe o pertenece a otro Cliente, sin revelar cuál de las dos causas aplica. _(UC023)_

### Key Entities _(include if feature involves data)_

- **Solicitud de servicio**: categoría, descripción, zona aproximada, nivel de urgencia, fotos adjuntas (0 o más), estado (borrador, publicada, cancelada y otros por definir) y Cliente propietario.
- **Actor asignado y autorización**: identidad del Cliente que crea o posee la solicitud; solo su propietario puede editarla, cancelarla o consultar su detalle.
- **Historial de estado**: transición y momento de cada cambio de estado del servicio.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: El 100% de las solicitudes publicadas incluye zona aproximada y urgencia; ninguna se publica sin estos datos.
- **SC-002**: El 100% de las solicitudes guardadas como borrador permanece no visible para prestadores hasta que el Cliente decide publicarlas.
- **SC-003**: El 100% de los intentos de editar o cancelar una solicitud ajena, inexistente o que ya no está abierta es rechazado sin modificar ningún registro.
- **SC-004**: El 100% de las consultas de lista o detalle de solicitudes devuelve únicamente información del Cliente autenticado que la solicita.
- **SC-005**: Ante una pérdida de conexión durante publicación o edición, el 100% de los casos de prueba conserva un único registro consistente, sin duplicados.
# Feature Specification: SPEC-05 — Creación y gestión del perfil profesional

**Creado**: 2026-09-16 
**Casos de uso cubiertos**: UC024, UC025, UC026, UC027, UC028, UC029, UC030, UC031, UC032, UC033 

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Crear el perfil profesional [UC024, UC026, UC027, UC028] (Priority: P1)

Como prestador, quiero crear mi perfil profesional definiendo obligatoriamente mis categorías de servicio y mis zonas de atención, y registrando mi experiencia si lo deseo, para que los clientes puedan encontrarme y confiar en la información que ven.

**Why this priority**: Sin un perfil creado, el Prestador no existe para el descubrimiento del Cliente  ni puede recibir oportunidades, es el requisito previo a cualquier otra capacidad de esta especificación.

**Independent Test**: Con una cuenta de Prestador sin perfil, completar el formulario de creación sin categorías o sin zonas y verificar el rechazo, repetir completando ambos datos obligatorios sin experiencia y verificar que el perfil se crea,  repetir agregando experiencia profesional y verificar que también queda registrada.

**Acceptance Scenarios**:

1. **Scenario**: Creación completa con datos obligatorios [UC026 , UC027]
    
    - **Given** un Prestador sin perfil indica sus datos básicos, al menos una categoría de servicio y al menos una zona de atención
    - **When** confirma la creación
    - **Then** el sistema crea el perfil profesional con esas categorías y zonas asociadas
2. **Scenario**: Intento de crear el perfil sin categorías o sin zonas
    
    - **Given** un Prestador intenta crear su perfil sin haber elegido ninguna categoría de servicio o ninguna zona de atención
    - **When** confirma la creación
    - **Then** el sistema rechaza la creación y señala el dato obligatorio faltante, sin dejar un perfil a medio crear
3. **Scenario**: Registrar experiencia profesional de forma opcional [UC028]
    
    - **Given** un Prestador está creando su perfil
    - **When** agrega su experiencia profesional antes de confirmar
    - **Then** el sistema la asocia al perfil; si no la agrega, la creación se completa igualmente sin experiencia registrada
4. **Scenario**: Actualizar categorías o experiencia después de creado el perfil [UC026, UC028]
    
    - **Given** un Prestador ya tiene un perfil creado
    - **When** actualiza sus categorías de servicio o agrega nueva experiencia profesional de forma independiente, sin pasar por el flujo de creación
    - **Then** el sistema guarda el cambio sobre el perfil existente sin crear un perfil nuevo
5. **Scenario**: Actor no autorizado
    
    - **Given** un actor sin rol Prestador intenta crear o completar un perfil profesional
    - **When** realiza la solicitud
    - **Then** el sistema deniega la operación

### User Story 2 - Editar los datos generales del perfil [UC025] (Priority: P1)

Como prestador, quiero editar los datos generales de mi perfil ya creado, para mantenerlo actualizado a medida que cambian mi información o mi forma de trabajar.

**Why this priority**: Un perfil desactualizado reduce la confianza del Cliente y puede mostrar información incorrecta durante el descubrimiento.

**Independent Test**: Con un perfil ya creado, modificar uno de sus datos generales y verificar que el cambio se refleja; intentar editar un perfil inexistente o ajeno y verificar el rechazo.

**Acceptance Scenarios**:

1. **Scenario**: Edición exitosa
    
    - **Given** un Prestador tiene un perfil ya creado
    - **When** modifica uno de sus datos generales y confirma
    - **Then** el sistema guarda el cambio y muestra el estado actualizado del perfil
2. **Scenario**: Edición de un perfil inexistente
    
    - **Given** un Prestador aún no tiene perfil creado
    - **When** intenta editarlo
    - **Then** el sistema rechaza la operación e indica que primero debe crear su perfil
3. **Scenario**: Actor no autorizado
    
    - **Given** un actor sin rol Prestador, o un Prestador que intenta editar un perfil que no es el suyo
    - **When** realiza la solicitud
    - **Then** el sistema deniega la operación sin modificar ningún registro

### User Story 3 - Gestionar el portafolio de servicios [UC029, UC030] (Priority: P1)

Como prestador, quiero agregar o eliminar servicios de mi portafolio, para mostrar a los clientes ejemplos concretos de trabajos que ofrezco.

**Why this priority**: El portafolio es evidencia tangible de la calidad del trabajo del Prestador y complementa la información declarada del perfil.

**Independent Test**: Con un perfil ya creado, agregar un servicio al portafolio y verificar que aparece disponible, eliminarlo y verificar que deja de mostrarse.

**Acceptance Scenarios**:

1. **Scenario**: Agregar un servicio al portafolio [UC029]
    
    - **Given** un Prestador con perfil creado agrega un servicio con su descripción y evidencia (por ejemplo, fotos)
    - **When** confirma la operación
    - **Then** el sistema guarda el servicio en el portafolio del Prestador
2. **Scenario**: Eliminar un servicio del portafolio [UC030]
    
    - **Given** un Prestador tiene un servicio propio en su portafolio
    - **When** solicita eliminarlo
    - **Then** el sistema lo retira del portafolio visible, conservando el resto de los servicios sin cambios
3. **Scenario**: Actor no autorizado o servicio ajeno
    
    - **Given** un actor sin rol Prestador, o un Prestador que intenta agregar o eliminar un servicio de un portafolio que no es el suyo
    - **When** realiza la solicitud
    - **Then** el sistema deniega la operación sin modificar el portafolio

### User Story 4 - Configurar disponibilidad y gestionar la agenda [UC031, UC032] (Priority: P1)

Como prestador, quiero configurar mi disponibilidad horaria y gestionar mi agenda, para organizar mis compromisos y que el sistema pueda evaluar correctamente qué oportunidades son compatibles conmigo.

**Why this priority**: La disponibilidad es uno de los tres criterios que SPEC-06 usa para determinar compatibilidad de oportunidades; sin ella, el tablero de oportunidades no puede filtrar correctamente.

**Independent Test**: Con un perfil ya creado, configurar la disponibilidad horaria y verificar que queda guardada; registrar un compromiso en la agenda y verificar que aparece reflejado sin duplicar información.

**Acceptance Scenarios**:

1. **Scenario**: Configurar disponibilidad horaria [UC031]
    
    - **Given** un Prestador con perfil creado
    - **When** define sus horarios disponibles
    - **Then** el sistema guarda la disponibilidad y la deja lista para ser usada en la evaluación de compatibilidad
2. **Scenario**: Gestionar la agenda [UC032]
    
    - **Given** un Prestador con disponibilidad configurada
    - **When** agrega, modifica o consulta un compromiso en su agenda
    - **Then** el sistema refleja el cambio sin afectar los demás compromisos existentes
3. **Scenario**: Actor no autorizado
    
    - **Given** un actor sin rol Prestador intenta configurar disponibilidad o gestionar una agenda ajena
    - **When** realiza la solicitud
    - **Then** el sistema deniega la operación

### User Story 5 - Consultar la vista previa del perfil [UC033] (Priority: P1)

Como prestador, quiero consultar cómo ven mi perfil los clientes antes de que quede expuesto públicamente, para revisar que la información mostrada sea la correcta.

**Why this priority**: Permite al Prestador validar que su información pública (SPEC-03) es la que realmente desea mostrar, sin necesidad de exponer datos incompletos o erróneos.

**Independent Test**: Con un perfil ya creado, consultar su vista previa y verificar que coincide exactamente con lo que un Cliente vería al consultar ese mismo perfil (UC015 de SPEC-03).

**Acceptance Scenarios**:

1. **Scenario**: Vista previa disponible
    
    - **Given** un Prestador tiene un perfil creado
    - **When** consulta su vista previa
    - **Then** el sistema muestra el perfil exactamente como lo vería un Cliente, incluyendo únicamente la información configurada para exposición pública
2. **Scenario**: Actor no autorizado
    
    - **Given** un actor sin rol Prestador, o un Prestador que intenta ver la vista previa de otro perfil
    - **When** realiza la solicitud
    - **Then** el sistema deniega el acceso

---

### Edge Cases

- Un prestador intenta crear su perfil sin haber elegido categorías de servicio o zonas de atención: el sistema debe rechazar la creación y señalar el dato obligatorio faltante, sin dejar un perfil a medio crear.
- Un prestador edita categorías, zonas de atención o agenda y la operación se interrumpe a mitad de camino (por ejemplo, por pérdida de conexión): el sistema debe evitar guardar un estado parcial y conservar los últimos datos confirmados.
- Un prestador configura una disponibilidad horaria que entra en conflicto con un compromiso ya registrado en su agenda: el sistema debe rechazar el cambio y advertir el conflicto.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-024**: El sistema DEBE permitir que un Prestador cree su perfil profesional únicamente cuando incluya al menos una categoría de servicio y al menos una zona de atención, y DEBE rechazar la creación si falta alguno de estos datos obligatorios. _(UC024, incluye a UC026 y UC027)_
- **FR-026**: El sistema DEBE permitir que un Prestador escoja o actualice sus categorías de servicio, tanto durante la creación del perfil como de forma independiente después de creado. _(UC026)_
- **FR-027**: El sistema DEBE permitir que un Prestador configure sus zonas de atención como parte obligatoria de la creación del perfil. _(UC027, incluido en UC024)_
- **FR-028**: El sistema DEBE permitir, de forma opcional, registrar experiencia profesional en el perfil, tanto durante su creación como de forma independiente después de creado, sin que su ausencia impida crear el perfil. _(UC028, extiende a UC024)_
- **FR-025**: El sistema DEBE permitir que un Prestador edite los datos generales de un perfil ya creado, y DEBE rechazar la edición si el perfil no existe o no le pertenece. _(UC025)_
- **FR-029**: El sistema DEBE permitir que un Prestador agregue un servicio, con su descripción y evidencia, al portafolio de su propio perfil. _(UC029)_
- **FR-030**: El sistema DEBE permitir que un Prestador elimine un servicio de su propio portafolio sin afectar los demás servicios registrados. _(UC030)_
- **FR-031**: El sistema DEBE permitir que un Prestador configure su disponibilidad horaria, dejándola disponible para el cálculo de compatibilidad de oportunidades. _(UC031)_
- **FR-032**: El sistema DEBE permitir que un Prestador gestione los compromisos de su propia agenda sin afectar los de otros prestadores. _(UC032)_
- **FR-033**: El sistema DEBE permitir que un Prestador consulte la vista previa de su propio perfil, mostrando exactamente la misma información pública que vería un Cliente. _(UC033)_

### Key Entities _(include if feature involves data)_

- **Perfil profesional**: datos generales del Prestador, categorías de servicio, zonas de atención, experiencia profesional (opcional) y estado de exposición pública.
- **Categoría de servicio:** corresponde a la especialidad o tipo de trabajo que identifica al prestador.
* **Servicio:** corresponde a una actividad específica que el trabajador ofrece dentro de una categoría de servicio.
- **Portafolio de servicios**: lista de servicios del Prestador, cada uno con descripción y evidencia asociada.
- **Disponibilidad y agenda**: horarios disponibles declarados por el Prestador y compromisos registrados sobre esos horarios.
- **Vista pública del perfil**: subconjunto del perfil profesional visible para los clientes, que solo incluye lo configurado explícitamente para exposición.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: El 100% de los perfiles creados incluye al menos una categoría de servicio y una zona de atención; ninguno se crea sin estos datos.
- **SC-002**: El 100% de las ediciones de categorías, zonas, experiencia, portafolio, disponibilidad o agenda solo afecta al perfil del Prestador autenticado que la solicita.
- **SC-003**: La vista previa del perfil coincide, en el 100% de los casos de prueba, con la información pública que un Cliente ve al consultar ese mismo perfil.
- **SC-004**: Ante datos obligatorios faltantes, registro inexistente o rol incorrecto, ninguna operación de esta especificación modifica datos y la interfaz informa la causa.

# Feature Specification: SPEC-06 — Compatibilidad y oportunidades de servicio

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC034, UC035, UC036, UC037, UC038 
## User Scenarios & Testing _(mandatory)_

### User Story 1 - Ver y filtrar el tablero de oportunidades compatibles [UC034, UC035, UC036, UC038] (Priority: P1)

Como prestador, quiero ver un tablero con las solicitudes de servicio compatibles con mi perfil, poder filtrarlas, y ser notificado cuando aparezca una nueva oportunidad compatible, para no tener que revisar manualmente cada solicitud publicada en la plataforma.

**Why this priority**: Es el mecanismo central por el cual un Prestador se entera de la demanda real disponible; sin compatibilidad calculada correctamente, el tablero mostraría oportunidades irrelevantes o dejaría fuera solicitudes que el Prestador sí podría atender.

**Independent Test**: Con un perfil de Prestador con categorías, zonas y disponibilidad configuradas, y con solicitudes publicadas en distintas categorías y zonas, consultar el tablero y verificar que solo aparecen las solicitudes compatibles; aplicar un filtro y verificar que el resultado se acota; publicar una nueva solicitud compatible y verificar que se genera la notificación correspondiente.

**Acceptance Scenarios**:

1. **Scenario**: Ver el tablero con oportunidades compatibles [UC034]
    
    - **Given** un Prestador tiene su perfil configurado con categorías, zonas de atención y disponibilidad
    - **When** consulta su tablero de oportunidades
    - **Then** el sistema calcula la compatibilidad usando categoría, zona y disponibilidad, y muestra únicamente las solicitudes abiertas que coinciden con ese perfil
2. **Scenario**: Tablero sin oportunidades compatibles
    
    - **Given** un Prestador no tiene ninguna solicitud abierta que coincida con su categoría, zona o disponibilidad
    - **When** consulta su tablero
    - **Then** el sistema muestra el tablero vacío, sin producir un error
3. **Scenario**: Filtrar el tablero [UC036]
    
    - **Given** un Prestador tiene su tablero de oportunidades cargado
    - **When** aplica un filtro adicional (por ejemplo, por categoría o por urgencia)
    - **Then** el sistema muestra únicamente las oportunidades del tablero que además cumplen ese filtro, sin alterar el cálculo de compatibilidad original
4. **Scenario**: Filtro sin coincidencias
    
    - **Given** un Prestador aplica un filtro que ninguna oportunidad de su tablero cumple
    - **When** confirma el filtro
    - **Then** el sistema muestra el resultado vacío, sin producir un error ni descartar el filtro aplicado
5. **Scenario**: Notificar una nueva oportunidad compatible [UC038]
    
    - **Given** un Cliente publica una nueva solicitud que resulta compatible con el perfil de un Prestador
    - **When** el sistema determina esa compatibilidad
    - **Then** el sistema notifica al Prestador sobre la nueva oportunidad, sin necesidad de que este haya vuelto a consultar el tablero manualmente
6. **Scenario**: Solicitud sin datos suficientes para evaluar compatibilidad
    
    - **Given** una solicitud publicada no cuenta con categoría, zona o disponibilidad suficientes para ser evaluada
    - **When** el sistema calcula compatibilidad contra los perfiles de los prestadores
    - **Then** el sistema marca esa solicitud como no evaluable y no la muestra como compatible en ningún tablero
7. **Scenario**: Actor no autorizado
    
    - **Given** un actor sin rol Prestador intenta consultar, filtrar o recibir notificaciones de un tablero de oportunidades
    - **When** realiza la solicitud
    - **Then** el sistema deniega el acceso

### User Story 2 - Consultar el detalle de una oportunidad [UC037] (Priority: P1)

Como prestador, quiero consultar el detalle completo de una oportunidad de mi tablero, para decidir con información suficiente si voy a proponerle un servicio al cliente.

**Why this priority**: El tablero resume varias oportunidades a la vez; el Prestador necesita el detalle completo de una en particular antes de invertir tiempo en cotizarla.

**Independent Test**: Con una oportunidad compatible visible en el tablero de un Prestador, consultar su detalle y verificar que muestra la información completa de la solicitud sin exponer datos privados del Cliente que la publicó.

**Acceptance Scenarios**:

1. **Scenario**: Detalle disponible
    
    - **Given** un Prestador tiene una oportunidad compatible en su tablero
    - **When** consulta su detalle
    - **Then** el sistema muestra la información completa de la solicitud (categoría, descripción, zona aproximada, urgencia y fotos si existen), sin revelar la dirección exacta ni datos privados del Cliente
2. **Scenario**: Intento de consultar una oportunidad no compatible o inexistente
    
    - **Given** un Prestador intenta consultar el detalle de una solicitud que no es compatible con su perfil o que ya no existe
    - **When** realiza la consulta
    - **Then** el sistema rechaza la operación sin revelar información de esa solicitud
3. **Scenario**: Actor no autorizado
    
    - **Given** un actor sin rol Prestador intenta consultar el detalle de una oportunidad
    - **When** realiza la solicitud
    - **Then** el sistema deniega el acceso

---

### Edge Cases

- Una solicitud de servicio no tiene datos suficientes de categoría, zona o disponibilidad para evaluar su compatibilidad: el sistema debe marcarla como no evaluable, sin mostrarla como compatible en ningún tablero.
- Un prestador aplica un filtro sobre el tablero que ninguna oportunidad cumple: el sistema debe mostrar el resultado vacío sin descartar el filtro ni producir un error.
- Se genera una nueva oportunidad compatible mientras el prestador no tiene sesión activa: El sistema debe mantener la notificación pendiente hasta la próxima conexión del prestador.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-035**: El sistema DEBE permitir que un Prestador consulte un tablero que muestre únicamente las solicitudes abiertas compatibles con su perfil (categoría, zona y disponibilidad), incluyendo el caso de tablero vacío. _(UC035, incluye a UC034)_
- **FR-034**: El sistema DEBE calcular la compatibilidad de cada solicitud contra cada perfil usando categoría, zona y disponibilidad, y DEBE marcar como no evaluable toda solicitud que no tenga datos suficientes para ese cálculo. _(UC034, incluido en UC035)_
- **FR-036**: El sistema DEBE permitir que un Prestador filtre su tablero de oportunidades por criterios adicionales, sin alterar el cálculo de compatibilidad subyacente. _(UC036, extiende a UC035)_
- **FR-037**: El sistema DEBE permitir que un Prestador consulte el detalle completo de una oportunidad compatible de su tablero, sin exponer datos privados del Cliente que la publicó, y DEBE rechazar la consulta si la oportunidad no es compatible con su perfil o no existe. _(UC037)_
- **FR-038**: El sistema DEBE notificar a un Prestador cuando el cálculo de compatibilidad detecte una nueva oportunidad para su perfil, sin requerir que el Prestador esté consultando el tablero en ese momento. _(UC038, extiende a UC034)_

### Key Entities _(include if feature involves data)_

- **Oportunidad de servicio**: solicitud publicada por un Cliente  vista desde la perspectiva de un Prestador compatible, incluye estado de compatibilidad (compatible, no evaluable) y los datos necesarios para decidir si cotizarla.
- **Criterio de compatibilidad**: categoría, zona y disponibilidad usados para emparejar solicitudes con perfiles de prestador (ver SPEC-05).
- **Filtro de tablero**: criterios adicionales que un Prestador aplica sobre su propio tablero, sin modificar el cálculo de compatibilidad.
- **Notificación de oportunidad**: aviso generado cuando una nueva solicitud resulta compatible con el perfil de un Prestador.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: El 100% de las oportunidades mostradas en un tablero corresponde a solicitudes cuya categoría, zona y disponibilidad coinciden con el perfil del Prestador que consulta.
- **SC-002**: El 100% de las solicitudes sin datos suficientes para evaluar compatibilidad se marca como no evaluable y no aparece como compatible en ningún tablero.
- **SC-003**: El 100% de las consultas de detalle de oportunidad no expone datos privados del Cliente que publicó la solicitud.
- **SC-004**: El 100% de las nuevas solicitudes compatibles genera una notificación hacia el Prestador correspondiente.
- **SC-005**: Ante datos faltantes, oportunidad inexistente o rol incorrecto, ninguna operación de esta especificación modifica datos y la interfaz informa la causa.








# Feature Specification: SPEC-07 — Creación y gestión de propuestas

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC039, UC040, UC041, UC042, UC043, UC044 

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Crear una propuesta para una solicitud [UC039, UC040, UC041, UC044] (Priority: P1)

Como prestador, quiero crear una propuesta para una solicitud publicada indicando obligatoriamente mi disponibilidad, y agregar un mensaje si lo considero útil, para que el cliente reciba una propuesta completa y sea notificado de inmediato.

**Why this priority**: Es la acción con la que un Prestador convierte una oportunidad compatible (SPEC-06) en una posibilidad real de contratación; sin ella no hay nada que el Cliente pueda comparar ni aceptar.

**Independent Test**: Con una solicitud abierta compatible con un Prestador, crear una propuesta indicando disponibilidad sin mensaje y verificar que se crea y notifica igual; repetir agregando un mensaje y verificar que también queda incluido; intentar crear la propuesta sin disponibilidad y verificar el rechazo.

**Acceptance Scenarios**:

1. **Scenario**: Creación completa con disponibilidad obligatoria [UC040]
    
    - **Given** un Prestador tiene una solicitud abierta y compatible con su perfil
    - **When** crea una propuesta indicando su disponibilidad para atenderla
    - **Then** el sistema guarda la propuesta vinculada a esa solicitud, en estado activo
2. **Scenario**: Intento de crear una propuesta sin disponibilidad
    
    - **Given** un Prestador intenta crear una propuesta sin indicar su disponibilidad
    - **When** confirma la operación
    - **Then** el sistema rechaza la creación y señala el dato obligatorio faltante
3. **Scenario**: Agregar un mensaje de forma opcional [UC041]
    
    - **Given** un Prestador está creando su propuesta
    - **When** agrega un mensaje adicional para el Cliente
    - **Then** el sistema lo asocia a la propuesta; si no agrega ningún mensaje, la propuesta se crea igualmente sin él
4. **Scenario**: Notificar al cliente sobre la nueva propuesta [UC044 ]
    
    - **Given** un Prestador crea una propuesta para la solicitud de un Cliente
    - **When** la propuesta queda registrada
    - **Then** el sistema notifica automáticamente al Cliente sobre la propuesta recibida, sin que ningún actor deba disparar esa notificación por separado
5. **Scenario**: Propuesta sobre una solicitud que ya no está abierta
    
    - **Given** una solicitud ya fue cancelada o ya tiene un servicio contratado
    - **When** un Prestador intenta crear una propuesta para ella
    - **Then** el sistema rechaza la creación e indica que la solicitud ya no admite nuevas propuestas
6. **Scenario**: Actor no autorizado
    
    - **Given** un actor sin rol Prestador intenta crear una propuesta
    - **When** realiza la solicitud
    - **Then** el sistema deniega la operación

### User Story 2 - Editar una propuesta activa [UC042] (Priority: P1)

Como prestador, quiero editar una propuesta que sigue activa, para corregir o ajustar su contenido antes de que el cliente decida.

**Why this priority**: Las condiciones de una propuesta pueden cambiar (disponibilidad, mensaje) mientras el Cliente aún no ha decidido, y el Prestador necesita poder reflejarlo sin crear una propuesta duplicada.

**Independent Test**: Con una propuesta propia en estado activo, editar uno de sus datos y verificar el cambio; intentar editar una propuesta ya retirada o una que ya fue aceptada/rechazada y verificar el rechazo.

**Acceptance Scenarios**:

1. **Scenario**: Edición exitosa
    
    - **Given** un Prestador tiene una propuesta propia en estado activo
    - **When** modifica su disponibilidad o su mensaje y confirma
    - **Then** el sistema guarda el cambio y muestra el estado actualizado de la propuesta
2. **Scenario**: Intento de editar una propuesta que ya no está activa
    
    - **Given** una propuesta propia ya fue retirada, aceptada o cerrada
    - **When** el Prestador intenta editarla
    - **Then** el sistema rechaza la edición e indica que la propuesta ya no admite cambios
3. **Scenario**: Actor no autorizado o propuesta ajena
    
    - **Given** un actor sin rol Prestador, o un Prestador que intenta editar una propuesta que no es suya
    - **When** realiza la solicitud
    - **Then** el sistema deniega la operación sin modificar ningún registro

### User Story 3 - Retirar una propuesta [UC043] (Priority: P1)

Como prestador, quiero retirar una propuesta que ya no puedo o no quiero cumplir, para que el cliente no la considere entre sus opciones.

**Why this priority**: Sin poder retirarla, el Cliente podría aceptar una propuesta que el Prestador ya no está en condiciones de atender.

**Independent Test**: Con una propuesta propia activa, retirarla y verificar que deja de estar disponible para el Cliente; intentar retirarla nuevamente y verificar el rechazo.

**Acceptance Scenarios**:

1. **Scenario**: Retiro exitoso
    
    - **Given** un Prestador tiene una propuesta propia activa
    - **When** confirma su retiro
    - **Then** el sistema marca la propuesta como retirada y deja de mostrarla como opción para el Cliente
2. **Scenario**: Intento de retirar una propuesta ya inactiva
    
    - **Given** una propuesta propia ya fue retirada, aceptada o cerrada previamente
    - **When** el Prestador intenta retirarla de nuevo
    - **Then** el sistema rechaza la operación sin cambiar el estado actual
3. **Scenario**: Actor no autorizado o propuesta ajena
    
    - **Given** un actor sin rol Prestador, o un Prestador que intenta retirar una propuesta que no es suya
    - **When** realiza la solicitud
    - **Then** el sistema deniega la operación

---

### Edge Cases

- Un prestador intenta editar una propuesta, o el sistema intenta notificarla como nueva, después de que ya fue retirada: el sistema debe rechazar la edición y no debe generar una notificación de propuesta nueva sobre una propuesta inactiva.
- Un prestador crea una propuesta sin agregar mensaje: el sistema debe completar la creación igualmente, mostrando la propuesta sin mensaje adicional.
- Un prestador intenta crear una propuesta para una solicitud que ya no está abierta: el sistema debe rechazar la creación e indicar que la solicitud ya no admite nuevas propuestas.
- Se pierde la conexión mientras un prestador edita o retira una propuesta: El sistema conserva el último estado confirmado sin duplicar la propuesta ni dejarla en un estado ambiguo.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-039**: El sistema DEBE permitir que un Prestador cree una propuesta vinculada a una solicitud abierta y compatible con su perfil, únicamente si incluye su disponibilidad, y DEBE rechazar la creación si la solicitud ya no está abierta. _(UC039, incluye a UC040)_
- **FR-040**: El sistema DEBE exigir la disponibilidad del Prestador como dato obligatorio de toda propuesta creada. _(UC040, incluido en UC039)_
- **FR-041**: El sistema DEBE permitir, de forma opcional, agregar un mensaje a la propuesta al momento de crearla, sin que su ausencia impida crearla. _(UC041, extiende a UC039)_
- **FR-044**: El sistema DEBE notificar automáticamente al Cliente propietario de la solicitud cuando se cree una nueva propuesta para ella, sin que ningún actor deba solicitar esa notificación por separado. _(UC044, extiende a UC039)_
- **FR-042**: El sistema DEBE permitir que un Prestador edite una propuesta propia mientras esté activa, y DEBE rechazar la edición si la propuesta ya no está activa o no le pertenece. _(UC042)_
- **FR-043**: El sistema DEBE permitir que un Prestador retire una propuesta propia mientras esté activa, y DEBE rechazar el retiro si la propuesta ya no está activa o no le pertenece. _(UC043)_

### Key Entities _(include if feature involves data)_

- **Propuesta**: solicitud a la que responde, Prestador que la crea, disponibilidad indicada, mensaje opcional y estado (activa, editada, retirada, aceptada, cerrada).
- **Actor asignado y autorización**: solo el Prestador propietario de una propuesta puede editarla o retirarla.
- **Notificación de propuesta recibida**: aviso generado hacia el Cliente al crearse una propuesta.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: El 100% de las propuestas creadas incluye disponibilidad del Prestador; ninguna se crea sin este dato.
- **SC-002**: El 100% de las propuestas creadas para una solicitud que ya no está abierta es rechazada.
- **SC-003**: El 100% de las propuestas nuevas genera una notificación hacia el Cliente correspondiente.
- **SC-004**: El 100% de los intentos de editar o retirar una propuesta ajena o ya inactiva es rechazado sin modificar ningún registro.
# Feature Specification: SPEC-08 — Contratación y ciclo de vida del servicio

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC045, UC046, UC047, UC048, UC049, UC050, UC051, UC052, UC053, UC054, UC055, UC056

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Consultar y aceptar propuestas recibidas [UC045, UC046, UC047, UC048, UC049] (Priority: P1)

Como cliente, quiero consultar las propuestas que recibí para mi solicitud y aceptar la que prefiera, para que se registre el servicio contratado, se cierren automáticamente las demás propuestas y quede habilitada la comunicación con el prestador elegido.

**Why this priority**: Es el punto donde una oportunidad  y una propuesta se convierten en un compromiso real entre Cliente y Prestador; sin esta aceptación no existe contratación.

**Independent Test**: Con una solicitud propia que tiene varias propuestas activas, aceptar una de ellas y verificar que el servicio queda registrado, las demás propuestas quedan cerradas y los datos de comunicación quedan habilitados; intentar aceptar dos propuestas para la misma solicitud y verificar que la segunda es rechazada.

**Acceptance Scenarios**:

1. **Scenario**: Consultar propuestas recibidas [UC045]
    
    - **Given** un Cliente tiene una solicitud publicada con una o más propuestas activas
    - **When** consulta las propuestas recibidas para esa solicitud
    - **Then** el sistema muestra todas las propuestas activas, con la disponibilidad y el mensaje de cada Prestador
2. **Scenario**: Aceptar una propuesta [UC046]
    
    - **Given** un Cliente tiene varias propuestas activas para su solicitud
    - **When** acepta una de ellas
    - **Then** el sistema registra el servicio contratado con el Prestador seleccionado y habilita los datos de comunicación entre ambos, en una sola operación consistente
3. **Scenario**: Cerrar automáticamente las propuestas no seleccionadas [UC047]
    
    - **Given** un Cliente acepta una propuesta entre varias recibidas para la misma solicitud
    - **When** la aceptación se confirma
    - **Then** el sistema cierra automáticamente el resto de las propuestas de esa solicitud, sin que el Cliente deba rechazarlas una por una
4. **Scenario**: Intento de aceptar una segunda propuesta para la misma solicitud
    
    - **Given** un Cliente ya aceptó una propuesta para su solicitud
    - **When** intenta aceptar otra propuesta de la misma solicitud
    - **Then** el sistema rechaza la operación, indicando que la solicitud ya tiene un servicio contratado
5. **Scenario**: Actor no autorizado o propuesta ajena
    
    - **Given** un actor sin rol Cliente, o un Cliente que intenta consultar o aceptar propuestas de una solicitud que no le pertenece
    - **When** realiza la solicitud
    - **Then** el sistema deniega la operación

### User Story 2 - Consultar el detalle del servicio contratado [UC050] (Priority: P1)

Como cliente o prestador, quiero consultar el detalle del servicio que contraté o que me contrataron, para conocer en todo momento sus condiciones y su estado actual.

**Why this priority**: Ambas partes necesitan una referencia única y confiable del compromiso, en lugar de depender de lo acordado informalmente en mensajes.

**Independent Test**: Con un servicio contratado entre un Cliente y un Prestador, ambos consultan su detalle y verifican que ven la misma información; un tercero intenta consultarlo y es rechazado.

**Acceptance Scenarios**:

1. **Scenario**: Consulta exitosa por cualquiera de las dos partes
    
    - **Given** existe un servicio contratado entre un Cliente y un Prestador
    - **When** cualquiera de los dos consulta su detalle
    - **Then** el sistema muestra la solicitud original, la propuesta aceptada y el estado actual del servicio
2. **Scenario**: Consulta por un actor ajeno al servicio
    
    - **Given** un actor que no es ni el Cliente ni el Prestador de ese servicio intenta consultar su detalle
    - **When** realiza la solicitud
    - **Then** el sistema deniega el acceso

### User Story 3 - Gestionar el ciclo de vida del servicio contratado [UC051, UC052, UC053, UC054] (Priority: P1)

Como prestador, quiero marcar el servicio en ejecución y como terminado, y como cliente quiero confirmar su finalización o, si es necesario, cancelar el servicio contratado, para que el estado del servicio refleje siempre la realidad de lo que está ocurriendo.

**Why this priority**: Sin estados claros, ninguna de las partes puede saber si el servicio ya empezó, si ya terminó o si sigue pendiente, reintroduciendo la fragmentación que el proyecto busca resolver.

**Independent Test**: Con un servicio recién contratado, marcarlo en ejecución, luego como terminado, y confirmar su finalización como Cliente, verificando en cada paso el estado resultante; en un servicio distinto, cancelarlo antes de finalizar y verificar que ya no admite otras transiciones.

**Acceptance Scenarios**:

1. **Scenario**: Marcar el servicio en ejecución [UC051]
    
    - **Given** un Prestador tiene un servicio contratado pendiente de iniciar
    - **When** lo marca como en ejecución
    - **Then** el sistema actualiza el estado del servicio y lo refleja para ambas partes
2. **Scenario**: Marcar el servicio como terminado [UC052]
    
    - **Given** un Prestador tiene un servicio en ejecución
    - **When** lo marca como terminado
    - **Then** el sistema actualiza el estado del servicio, dejándolo pendiente de confirmación por el Cliente
3. **Scenario**: Confirmar la finalización [UC053]
    
    - **Given** un Cliente tiene un servicio marcado como terminado por el Prestador
    - **When** confirma su finalización
    - **Then** el sistema cierra el servicio como finalizado de forma definitiva
4. **Scenario**: Cancelar un servicio contratado [UC054]
    
    - **Given** un Cliente o un Prestador tiene un servicio contratado que aún no ha sido confirmado como finalizado
    - **When** solicita su cancelación
    - **Then** el sistema marca el servicio como cancelado y lo deja fuera de cualquier transición posterior
5. **Scenario**: Intento de cancelar un servicio ya finalizado
    
    - **Given** un servicio ya fue confirmado como finalizado
    - **When** el Cliente o el Prestador intenta cancelarlo
    - **Then** el sistema rechaza la cancelación y conserva el estado finalizado
6. **Scenario**: Transiciones simultáneas sobre el mismo servicio
    
    - **Given** ambas partes intentan cambiar el estado del mismo servicio al mismo tiempo (por ejemplo, terminar y cancelar)
    - **When** ambas solicitudes llegan casi al mismo momento
    - **Then** el sistema aplica una sola transición válida, conserva un historial ordenado y rechaza la otra sin dejar el servicio en un estado ambiguo
7. **Scenario**: Actor no autorizado
    
    - **Given** un actor ajeno al servicio, o con un rol que no corresponde a la transición solicitada, intenta cambiar su estado
    - **When** realiza la solicitud
    - **Then** el sistema deniega la operación

### User Story 4 - Consultar el historial de estados del servicio [UC055] (Priority: P1)

Como cliente o prestador, quiero consultar el historial completo de estados de mi servicio contratado, para verificar cómo evolucionó desde su contratación hasta su cierre.

**Why this priority**: Da trazabilidad a ambas partes ante cualquier desacuerdo sobre cuándo ocurrió cada transición.

**Independent Test**: Con un servicio que pasó por varias transiciones de estado, consultar su historial y verificar que aparecen todas en orden; un actor ajeno al servicio intenta consultarlo y es rechazado.

**Acceptance Scenarios**:

1. **Scenario**: Historial disponible
    
    - **Given** un servicio contratado registró una o más transiciones de estado
    - **When** el Cliente o el Prestador de ese servicio consulta su historial
    - **Then** el sistema muestra cada transición en el orden en que ocurrió
2. **Scenario**: Actor no autorizado
    
    - **Given** un actor ajeno al servicio intenta consultar su historial
    - **When** realiza la solicitud
    - **Then** el sistema deniega el acceso

### User Story 5 - Usar el canal de comunicación autorizado [UC056] (Priority: P1)

Como cliente o prestador, quiero usar el canal de comunicación autorizado una vez contratado el servicio, para coordinar los detalles necesarios sin exponer mis datos de contacto personales.

**Why this priority**: Permite coordinar el servicio sin depender de canales informales ni de revelar información de contacto directo entre las partes.

**Independent Test**: Con un servicio recién contratado (datos de comunicación habilitados por UC049), enviar un mensaje por el canal autorizado y verificar que llega a la otra parte; intentar usarlo antes de que la propuesta haya sido aceptada y verificar el rechazo.

**Acceptance Scenarios**:

1. **Scenario**: Uso del canal tras la habilitación [UC056]
    
    - **Given** un servicio contratado ya tiene sus datos de comunicación habilitados
    - **When** el Cliente o el Prestador envían un mensaje por el canal autorizado
    - **Then** el sistema lo entrega a la otra parte sin exponer datos de contacto personales de ninguna de las dos
2. **Scenario**: Intento de uso antes de la habilitación
    
    - **Given** una propuesta aún no ha sido aceptada
    - **When** el Cliente o el Prestador intentan usar el canal de comunicación autorizado
    - **Then** el sistema bloquea el uso hasta que la aceptación de la propuesta habilite los datos de comunicación
3. **Scenario**: Actor ajeno al servicio
    
    - **Given** un actor que no es parte de ese servicio contratado intenta usar su canal de comunicación
    - **When** realiza la solicitud
    - **Then** el sistema deniega el acceso

---

### Edge Cases

- Dos transiciones de estado del mismo servicio se intentan de forma simultánea: el sistema debe resolverlas conservando un único historial ordenado, sin aplicar ninguna transición no autorizada.
- Un cliente o un prestador intenta cancelar un servicio que ya fue confirmado como finalizado: el sistema debe rechazar la cancelación y conservar el estado finalizado.
- Se intenta usar el canal de comunicación autorizado antes de que la propuesta haya sido aceptada: el sistema debe bloquear su uso hasta que los datos de comunicación queden habilitados.
- Un prestador marca un servicio como terminado sin haberlo marcado antes en ejecución: El sistema exige pasar primero por "en ejecución" o permite marcarlo terminado directamente.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-045**: El sistema DEBE permitir que un Cliente consulte todas las propuestas activas recibidas para una solicitud propia. _(UC045)_
- **FR-046**: El sistema DEBE permitir que un Cliente acepte una propuesta activa de su solicitud, y DEBE rechazar una segunda aceptación si la solicitud ya tiene un servicio contratado. _(UC046, incluye a UC047, UC048 y UC049)_
- **FR-047**: El sistema DEBE cerrar automáticamente, como parte de la aceptación, todas las demás propuestas activas de la misma solicitud. _(UC047, incluido en UC046)_
- **FR-048**: El sistema DEBE registrar, como parte de la aceptación, un servicio contratado vinculado a la solicitud, la propuesta aceptada, el Cliente y el Prestador. _(UC048, incluido en UC046)_
- **FR-049**: El sistema DEBE habilitar, como parte de la aceptación, los datos de comunicación necesarios entre el Cliente y el Prestador de ese servicio. _(UC049, incluido en UC046)_
- **FR-050**: El sistema DEBE permitir que el Cliente o el Prestador de un servicio contratado consulten su detalle completo, y DEBE denegar el acceso a cualquier otro actor. _(UC050)_
- **FR-051**: El sistema DEBE permitir que el Prestador de un servicio contratado lo marque como en ejecución. _(UC051)_
- **FR-052**: El sistema DEBE permitir que el Prestador de un servicio en ejecución lo marque como terminado. _(UC052)_
- **FR-053**: El sistema DEBE permitir que el Cliente de un servicio marcado como terminado confirme su finalización, cerrándolo de forma definitiva. _(UC053)_
- **FR-054**: El sistema DEBE permitir que el Cliente o el Prestador de un servicio contratado lo cancelen mientras no haya sido confirmado como finalizado, y DEBE rechazar la cancelación si ya fue finalizado. _(UC054)_
- **FR-055**: El sistema DEBE permitir que el Cliente o el Prestador de un servicio consulten su historial completo de transiciones de estado, en orden. _(UC055)_
- **FR-056**: El sistema DEBE permitir el uso del canal de comunicación autorizado únicamente después de que los datos de comunicación del servicio hayan sido habilitados, sin exponer datos de contacto personales de ninguna de las partes. _(UC056, extiende a UC049)_

### Key Entities _(include if feature involves data)_

- **Servicio contratado**: solicitud de origen, propuesta aceptada, Cliente, Prestador, estado (contratado, en ejecución, terminado, finalizado, cancelado) e historial ordenado de esas transiciones.
- **Datos de comunicación habilitados**: información mínima necesaria para que Cliente y Prestador se comuniquen a través del canal autorizado, sin exponer datos de contacto personales.
- **Actor asignado y autorización**: solo el Cliente y el Prestador de un servicio contratado pueden consultarlo, cambiarlo de estado o usar su canal de comunicación.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: El 100% de las aceptaciones de propuesta produce, en una sola operación, el cierre de las demás propuestas, el registro del servicio y la habilitación de comunicación.
- **SC-002**: El 100% de los intentos de aceptar una segunda propuesta para una solicitud ya contratada es rechazado.
- **SC-003**: El 100% de las transiciones de estado del servicio queda registrada en un historial ordenado, incluso ante intentos simultáneos.
- **SC-004**: El 100% de los intentos de cancelar un servicio ya finalizado es rechazado sin cambiar su estado.
- **SC-005**: El 100% de los usos del canal de comunicación autorizado ocurre solo después de que los datos de comunicación fueron habilitados, y ninguno expone datos de contacto personales.
# Feature Specification: SPEC-09 — Notificaciones de propuestas y servicios

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC057, UC058

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Notificar la aceptación de una propuesta [UC057] (Priority: P1)

Como prestador, quiero ser notificado automáticamente cuando un cliente acepta mi propuesta, para saber sin demora que debo iniciar el servicio contratado.

**Why this priority**: Sin esta notificación, el Prestador dependería de consultar manualmente el estado de cada propuesta enviada para saber si fue aceptada.

**Independent Test**: Con una propuesta activa de un Prestador, hacer que un Cliente la acepte (UC046) y verificar que el Prestador recibe la notificación correspondiente; simular una falla en el canal de entrega y verificar que el evento de aceptación sigue siendo consultable sin duplicar el aviso al recuperarse.

**Acceptance Scenarios**:

1. **Scenario**: Notificación disparada por la aceptación [UC057]
    
    - **Given** un Cliente acepta la propuesta de un Prestador
    - **When** la aceptación se confirma
    - **Then** el sistema notifica automáticamente al Prestador seleccionado, sin que ningún actor deba solicitar esa notificación por separado
2. **Scenario**: Falla en el canal de notificación
    
    - **Given** el canal de entrega de notificaciones falla en el momento de la aceptación
    - **When** el canal se recupera
    - **Then** el evento de aceptación permanece consultable por el Prestador (por ejemplo, en el detalle del servicio) y el sistema no duplica el aviso al reintentar la entrega
3. **Scenario**: Intento de generar la notificación sin una aceptación real
    
    - **Given** no ha ocurrido ninguna aceptación de propuesta
    - **When** se intenta generar o forzar una notificación de aceptación
    - **Then** el sistema no permite crear una notificación de aceptación sin una aceptación real asociada

### User Story 2 - Notificar cambios de estado del servicio [UC058] (Priority: P1)

Como cliente o prestador, quiero ser notificado automáticamente cuando la otra parte cambie el estado del servicio contratado, para conocer su avance sin tener que consultarlo manualmente cada vez.

**Why this priority**: El ciclo de vida del servicio (SPEC-08) involucra a ambas partes; sin notificaciones, cada cambio de estado quedaría oculto para quien no lo ejecutó hasta que decida consultarlo.

**Independent Test**: Con un servicio contratado entre un Cliente y un Prestador, hacer que el Prestador lo marque en ejecución y verificar que el Cliente es notificado; repetir para terminado, confirmación de finalización y cancelación, verificando en cada caso que se notifica a la contraparte de quien ejecutó la acción.

**Acceptance Scenarios**:

1. **Scenario**: Notificación por una transición ejecutada por el Prestador [UC058]
    
    - **Given** un Prestador marca su servicio contratado como en ejecución o como terminado
    - **When** la transición se confirma
    - **Then** el sistema notifica automáticamente al Cliente de ese servicio sobre el nuevo estado
2. **Scenario**: Notificación por una transición ejecutada por el Cliente [UC058]
    
    - **Given** un Cliente confirma la finalización de su servicio
    - **When** la confirmación se registra
    - **Then** el sistema notifica automáticamente al Prestador sobre el cierre del servicio
3. **Scenario**: Notificación por cancelación [UC058 ]
    
    - **Given** un Cliente o un Prestador cancela un servicio contratado
    - **When** la cancelación se confirma
    - **Then** el sistema notifica automáticamente a la otra parte sobre la cancelación
4. **Scenario**: Falla en el canal de notificación
    
    - **Given** el canal de entrega falla al momento de un cambio de estado
    - **When** el canal se recupera
    - **Then** el evento de cambio de estado permanece consultable (por ejemplo, en el historial de estados) y el sistema no duplica el aviso

---

### Edge Cases

- El canal de notificación falla en el momento de una aceptación o de un cambio de estado: el sistema debe mantener el evento consultable en su origen y no debe duplicar el aviso al reintentar la entrega.
- Se intenta generar una notificación de aceptación o de cambio de estado sin que haya ocurrido el evento que la origina: el sistema debe impedirlo, dado que estas notificaciones son siempre una extensión de un evento real, nunca una acción independiente.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-057**: El sistema DEBE notificar automáticamente al Prestador cuya propuesta fue aceptada, disparado exclusivamente por la aceptación de esa propuesta, sin que ningún actor lo ejecute como acción independiente. _(UC057, extiende a UC046)_
- **FR-058**: El sistema DEBE notificar automáticamente a la contraparte del servicio (Cliente o Prestador) cuando este cambie de estado por marcar en ejecución, marcar como terminado, confirmar finalización o cancelar, disparado exclusivamente por esas transiciones. _(UC058, extiende a UC051, UC052, UC053 y UC054)_

### Key Entities _(include if feature involves data)_

- **Notificación de aceptación**: aviso generado hacia el Prestador cuando su propuesta es aceptada; incluye referencia al servicio contratado resultante.
- **Notificación de cambio de estado**: aviso generado hacia la contraparte de quien ejecuta una transición del servicio; incluye el nuevo estado y referencia al servicio.
- **Canal de entrega**: mecanismo por el cual el actor "Proveedor de notificaciones" hace llegar estos avisos.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: El 100% de las aceptaciones de propuesta genera una notificación hacia el Prestador correspondiente.
- **SC-002**: El 100% de las transiciones de estado del servicio (en ejecución, terminado, finalización confirmada, cancelado) genera una notificación hacia la contraparte de quien la ejecutó.
- **SC-003**: Ante una falla del canal de entrega, el 100% de los eventos de aceptación o cambio de estado permanece consultable en su origen sin generar avisos duplicados al recuperarse.
- **SC-004**: El 100% de los intentos de generar una notificación sin un evento real asociado es rechazado.


# Feature Specification: SPEC-10 — Calificaciones, reseñas y verificación

**Creado**: 2026-09-16 
**Casos de uso cubiertos**: UC059, UC060, UC061, UC062, UC063, UC064 

## User Scenarios & Testing _(mandatory)_


### User Story 1 - Calificar servicio finalizado [UC059, UC061 ] (Priority: P1)

Como Cliente, quiero calificar un servicio ya finalizado para dejar constancia de mi experiencia y que la reputación del Prestador se actualice.

**Why this priority**: Es la base del sistema de confianza de la plataforma; sin calificaciones no existe reputación ni verificación posterior.

**Independent Test**: Con un servicio en estado "finalizado" asociado a un Cliente, calificarlo y verificar que la calificación queda registrada y la reputación agregada del Prestador se recalcula.

**Acceptance Scenarios**:

1. **Scenario**: Calificación exitosa de un servicio finalizado [UC059]
    
    - **Given** un Cliente tiene un servicio propio en estado "finalizado" sin calificación previa
    - **When** asigna una calificación (ej. de 1 a 5)
    - **Then** el sistema registra la calificación asociada a ese servicio y al Prestador correspondiente
2. **Scenario**: Recálculo automático de reputación agregada [UC061]
    
    - **Given** se acaba de registrar una nueva calificación válida para un Prestador
    - **When** la calificación se confirma
    - **Then** el sistema recalcula automáticamente la reputación agregada del Prestador incluyendo el nuevo valor
3. **Scenario**: Intento de calificar un servicio no finalizado
    
    - **Given** un Cliente intenta calificar un servicio que aún no está en estado "finalizado"
    - **When** envía la calificación
    - **Then** el sistema rechaza la operación y no altera la reputación del Prestador
4. **Scenario**: Intento de calificación duplicada
    
    - **Given** un servicio ya fue calificado previamente por el Cliente
    - **When** intenta calificarlo de nuevo
    - **Then** el sistema rechaza la segunda calificación y conserva únicamente la primera

**

---

### User Story 2 - Agregar reseña textual [UC060] (Priority: P2)

Como Cliente, quiero agregar un comentario escrito a mi calificación para explicar mi experiencia con más detalle.

**Why this priority**: Es una extensión opcional de la calificación (UC059); aporta valor pero la plataforma es funcional sin ella.

**Independent Test**: Sobre una calificación ya existente del propio Cliente, agregar texto y verificar que queda asociado a esa calificación.

**Acceptance Scenarios**:

1. **Scenario**: Reseña agregada exitosamente [UC060]
    
    - **Given** un Cliente ya calificó un servicio finalizado (UC059)
    - **When** agrega un comentario textual a esa calificación
    - **Then** el sistema guarda la reseña asociada a la calificación y la muestra junto al Prestador calificado
2. **Scenario**: Intento de reseña sin calificación previa
    
    - **Given** un servicio no ha sido calificado todavía
    - **When** el Cliente intenta agregar una reseña textual directamente
    - **Then** el sistema rechaza la operación, ya que la reseña depende de una calificación existente



---

### User Story 3 - Mostrar nivel de verificación [UC062] (Priority: P1)

Como Usuario (Cliente o Prestador), quiero ver el nivel de verificación de un Prestador para decidir con más confianza si contratarlo.

**Why this priority**: Es información de confianza consultada directamente por el Cliente antes de contratar; impacta la decisión comercial.

**Independent Test**: Consultar el perfil de un Prestador con un nivel de verificación conocido y comprobar que se muestra correctamente.

**Acceptance Scenarios**:

1. **Scenario**: Nivel de verificación visible [UC062]
    - **Given** un Prestador tiene un nivel de verificación asignado
    - **When** un Usuario consulta su perfil
    - **Then** el sistema muestra el nivel de verificación vigente de ese Prestador


---

### User Story 4 - Solicitar verificación documental ampliada [UC063] (Priority: P1)

Como Prestador, quiero solicitar una verificación documental ampliada para aumentar mi nivel de confianza frente a los Clientes.

**Why this priority**: Es la vía formal para que un Prestador mejore su nivel de verificación (UC062); sin esta solicitud, el nivel de verificación no puede evolucionar.

**Independent Test**: Con una cuenta de Prestador, iniciar una solicitud de verificación ampliada y comprobar que queda registrada en estado pendiente.

**Acceptance Scenarios**:

1. **Scenario**: Solicitud registrada exitosamente [UC063]
    
    - **Given** un Prestador autenticado no tiene una solicitud de verificación ampliada en curso
    - **When** envía su solicitud con los documentos requeridos
    - **Then** el sistema la registra en estado pendiente de revisión
2. **Scenario**: Solicitud duplicada mientras hay una pendiente
    
    - **Given** un Prestador ya tiene una solicitud de verificación ampliada pendiente
    - **When** intenta enviar una nueva solicitud
    - **Then** el sistema la rechaza e indica que ya existe una en curso



---

### User Story 5 - Reportar reseña problemática [UC064] (Priority: P2)

Como Usuario, quiero reportar una reseña que considero falsa, ofensiva o injusta para que sea revisada por un Administrador.

**Why this priority**: Protege la integridad del sistema de reputación, pero depende de que ya existan reseñas publicadas (UC060).

**Independent Test**: Sobre una reseña existente, generar un reporte y comprobar que queda registrado y disponible para moderación (SPEC-12).

**Acceptance Scenarios**:

1. **Scenario**: Reporte de reseña registrado [UC064]
    - **Given** existe una reseña textual publicada
    - **When** un Usuario la reporta indicando un motivo
    - **Then** el sistema registra el reporte y lo pone a disposición de la cola de moderación

---

### Edge Cases

- Un Cliente intenta calificar un servicio que fue cancelado en lugar de finalizado: la calificación debe rechazarse igual que un servicio no finalizado.
- Se reporta una reseña que ya fue eliminada previamente por moderación: el sistema debe evitar reportes duplicados sobre contenido inexistente.
- Un Prestador alcanza el nivel máximo de verificación y vuelve a solicitar verificación ampliada: El sistema debe notar el tope de nivel máximo de verificación y rechazar la solicitud.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-059**: El sistema DEBE permitir que un Cliente califique un servicio propio únicamente cuando esté en estado "finalizado", y como máximo una vez por servicio. [UC059]
- **FR-060**: El sistema DEBE permitir agregar una reseña textual únicamente sobre una calificación ya existente del mismo Cliente. [UC060]
- **FR-061**: El sistema DEBE recalcular automáticamente la reputación agregada del Prestador cada vez que se registra una nueva calificación válida. [UC061]
- **FR-062**: El sistema DEBE mostrar el nivel de verificación vigente de un Prestador a cualquier Usuario que consulte su perfil. [UC062]
- **FR-063**: El sistema DEBE permitir que un Prestador solicite verificación documental ampliada, sin admitir una segunda solicitud mientras haya una pendiente. [UC063]
- **FR-064**: El sistema DEBE permitir que un Usuario reporte una reseña existente, registrando el reporte para su revisión posterior. [UC064]

### Key Entities _(include if feature involves data)_

- **Calificación**: valor numérico, servicio asociado, Cliente autor, fecha.
- **Reseña**: texto asociado a una calificación existente.
- **Reputación agregada**: valor calculado por Prestador, derivado del conjunto de sus calificaciones.
- **Nivel de verificación**: estado asignado a un Prestador (básico/ampliado, según resultado de revisión documental).
- **Solicitud de verificación ampliada**: Prestador, documentos adjuntos, estado (pendiente/aprobada/rechazada).
- **Reporte de reseña**: reseña reportada, motivo, usuario reportante, estado.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: El 100% de los servicios no finalizados o ya calificados rechaza intentos adicionales de calificación.
- **SC-002**: El 100% de las calificaciones nuevas produce un recálculo verificable de la reputación agregada del Prestador correspondiente.
- **SC-003**: Ningún nivel de verificación se presenta junto a lenguaje que sugiera una certificación legal.
- **SC-004**: El 100% de los reportes de reseña queda disponible en la cola de moderación (SPEC-12) inmediatamente después de registrarse.

# Feature Specification: SPEC-11 — Reportes y evidencias

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC065, UC066, UC067

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Reportar usuario [UC065] (Priority: P1)

Como Usuario, quiero reportar a otro usuario (Cliente o Prestador) por un comportamiento indebido, para que sea revisado por un Administrador.

**Why this priority**: Es uno de los mecanismos base de confianza de la plataforma; sin poder reportar usuarios, no hay forma de escalar un mal comportamiento.

**Independent Test**: Generar un reporte contra una cuenta existente y comprobar que queda registrado y disponible en la cola de moderación.

**Acceptance Scenarios**:

1. **Scenario**: Reporte de usuario registrado [UC065]
    
    - **Given** un Usuario identifica a otra cuenta con un comportamiento indebido
    - **When** la reporta indicando un motivo
    - **Then** el sistema registra el reporte asociado a la cuenta reportada y lo pone a disposición de la cola de moderación
2. **Scenario**: Reporte sin motivo indicado
    
    - **Given** un Usuario intenta reportar a otra cuenta sin seleccionar un motivo
    - **When** envía el reporte
    - **Then** el sistema rechaza la operación y solicita indicar un motivo


---

### User Story 2 - Reportar servicio [UC066] (Priority: P1)

Como Usuario, quiero reportar un servicio específico (contratado o en curso) que considero problemático, para que sea revisado por un Administrador.

**Why this priority**: Permite escalar problemas concretos de una transacción, distintos de un problema general de comportamiento de una cuenta.

**Independent Test**: Generar un reporte sobre un servicio existente y comprobar que queda registrado y disponible en la cola de moderación.

**Acceptance Scenarios**:

1. **Scenario**: Reporte de servicio registrado [UC066]
    - **Given** un Usuario participó en un servicio que considera problemático
    - **When** lo reporta indicando un motivo
    - **Then** el sistema registra el reporte asociado a ese servicio y lo pone a disposición de la cola de moderación

**

---

### User Story 3 - Adjuntar evidencia a un reporte [UC067] (Priority: P2)

Como Usuario, quiero adjuntar evidencia (capturas, fotos, documentos) a un reporte ya creado, para respaldar mi reclamo.

**Why this priority**: Es una extensión opcional que mejora la calidad de la revisión administrativa, pero el reporte ya es válido y procesable sin ella.

**Independent Test**: Sobre un reporte existente (de usuario, de servicio o de reseña), adjuntar un archivo y comprobar que queda asociado a ese reporte.

**Acceptance Scenarios**:

1. **Scenario**: Evidencia adjuntada exitosamente [UC067]
    
    - **Given** existe un reporte previamente creado (UC064, UC065 o UC066) y el usuario reportante lo puede editar
    - **When** adjunta un archivo de evidencia
    - **Then** el sistema lo asocia al reporte y lo deja disponible para el Administrador que lo revise
2. **Scenario**: Intento de adjuntar evidencia sin un reporte previo
    
    - **Given** no existe un reporte creado
    - **When** se intenta adjuntar un archivo de evidencia de forma aislada
    - **Then** el sistema rechaza la operación, ya que la evidencia depende de un reporte existente
3. **Scenario**: Archivo no compatible o demasiado grande
    
    - **Given** un usuario intenta adjuntar un archivo que excede el formato o tamaño permitido
    - **When** lo sube
    - **Then** el sistema rechaza el archivo sin afectar el reporte ya guardado


---

### Edge Cases

- Un mismo Usuario reporta al mismo objetivo (cuenta o servicio) más de una vez por el mismo motivo: El sistema debe consolidarlo como un solo reporte con evidencias acumuladas.
- Formatos y tamaño máximo de archivo de evidencia: El sistema debe definir límites concretos antes de implementar.
- Un reporte es resuelto por el Administrador mientras el reportante intenta adjuntar evidencia adicional: El sistema debe rechazar dicha evidencia adicional debido a que el reporte ya cerró.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-065**: El sistema DEBE permitir que un Usuario reporte a otra cuenta indicando un motivo obligatorio, dejando el reporte disponible para moderación. [UC065]
- **FR-066**: El sistema DEBE permitir que un Usuario reporte un servicio específico indicando un motivo obligatorio, dejando el reporte disponible para moderación. [UC066]
- **FR-067**: El sistema DEBE permitir adjuntar evidencia únicamente a un reporte ya existente, sin importar si el reporte es de usuario, de servicio o de reseña (SPEC-10, UC064). [UC067]

### Key Entities _(include if feature involves data)_

- **Reporte de usuario**: cuenta reportada, motivo, usuario reportante, estado.
- **Reporte de servicio**: servicio reportado, motivo, usuario reportante, estado.
- **Evidencia**: archivo adjunto, reporte asociado (de cualquiera de los tres tipos), fecha de carga.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: El 100% de los reportes de usuario y de servicio queda disponible en la cola de moderación (SPEC-12) inmediatamente después de registrarse.
- **SC-002**: Ningún reporte se crea sin un motivo indicado.
- **SC-003**: El 100% de las evidencias adjuntadas queda asociada a un reporte válido y preexistente; ninguna evidencia queda huérfana.


# Feature Specification: SPEC-12 — Administración, moderación y gestión de riesgos

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC068, UC069, UC070, UC071, UC072, UC073, UC074, UC075, UC076 

## User Scenarios & Testing _(mandatory)_


### User Story 1 - Administrar categorías de servicios [UC068] (Priority: P1)

Como Administrador, quiero crear, editar y desactivar categorías de servicio, para mantener el catálogo de la plataforma organizado y vigente.

**Why this priority**: El catálogo de categorías es usado por Prestadores (perfil) y Clientes (solicitudes) desde el primer día; sin él no hay forma de clasificar servicios.

**Independent Test**: Crear, editar y desactivar una categoría de prueba, y verificar que el catálogo refleja el cambio.

**Acceptance Scenarios**:

1. **Scenario**: Creación de categoría [UC068]
    
    - **Given** un Administrador autenticado define una nueva categoría con nombre único
    - **When** la guarda
    - **Then** el sistema la agrega al catálogo activo, disponible para Prestadores y Clientes
2. **Scenario**: Desactivación de categoría con solicitudes en borrador
    
    - **Given** una categoría está siendo usada por un borrador de solicitud de un Cliente
    - **When** el Administrador la desactiva
    - **Then** el sistema aplica la desactivación al catálogo, pero el borrador existente puede publicarse solo si seleccionar otra categoría.



---

### User Story 2 - Administrar zonas [UC069] (Priority: P1)

Como Administrador, quiero crear, editar y desactivar zonas geográficas, para mantener actualizada la cobertura de la plataforma en la ciudad.

**Why this priority**: Las zonas son usadas para el matching entre Prestadores y Clientes, su correcta administración es tan crítica como la de categorías.

**Independent Test**: Crear, editar y desactivar una zona de prueba, y verificar que el catálogo de zonas refleja el cambio.

**Acceptance Scenarios**:

1. **Scenario**: Creación de zona [UC069]
    
    - **Given** un Administrador define una nueva zona con nombre único
    - **When** la guarda
    - **Then** el sistema la agrega al catálogo activo de zonas
2. **Scenario**: Desactivación de zona en uso por un Prestador activo
    
    - **Given** un Prestador tiene configurada una zona como parte de su cobertura de atención
    - **When** el Administrador desactiva esa zona
    - **Then** el sistema aplica la desactivación al catálogo, pero el Prestador conserva temporalmente esa cobertura.

**Checkpoint**: El catálogo de zonas puede mantenerse actualizado por el Administrador sin intervención técnica.

---

### User Story 3 - Gestionar reportes: cola, revisión y resolución [UC070, UC071, UC072] (Priority: P1)

Como Administrador, quiero consultar la cola de reportes pendientes, revisar el detalle de cada uno y resolverlos, para mantener la confianza y seguridad de la plataforma.

**Why this priority**: Es el flujo central de moderación; sin él, los reportes generados en `SPEC-10` y `SPEC-11` (UC064, UC065, UC066) nunca llegan a una resolución.

**Independent Test**: Con reportes de prueba en distintos estados, verificar que el Administrador puede listarlos, abrir el detalle de uno y cambiar su estado a resuelto.

**Acceptance Scenarios**:

1. **Scenario**: Consulta de la cola de reportes [UC070]
    
    - **Given** existen reportes pendientes de usuario, de servicio o de reseña (`spec-10`, `spec-11`)
    - **When** un Administrador consulta la cola
    - **Then** el sistema muestra todos los reportes pendientes, sin importar su tipo de origen
2. **Scenario**: Revisión de detalle de un reporte [UC071]
    
    - **Given** un Administrador selecciona un reporte de la cola
    - **When** abre su detalle
    - **Then** el sistema muestra el motivo, el objetivo reportado y toda evidencia adjunta (`SPEC-11`, UC067)
3. **Scenario**: Resolución de un reporte [UC072]
    
    - **Given** un Administrador está revisando el detalle de un reporte
    - **When** cambia su estado a resuelto o descartado, con una justificación
    - **Then** el sistema actualiza el estado del reporte y lo retira de la cola de pendientes
4. **Scenario**: Intento de resolver un reporte sin haberlo revisado
    
    - **Given** un reporte está en la cola sin haber sido abierto en detalle
    - **When** se intenta cambiar directamente su estado a resuelto
    - **Then** el sistema exige que el reporte haya sido abierto en detalle antes de permitir su resolución



---

### User Story 4 - Bloquear preventivamente una cuenta [UC073] (Priority: P1)

Como Administrador, quiero bloquear preventivamente una cuenta bajo investigación, para prevenir daño mientras se resuelve un reporte grave.

**Why this priority**: Es una medida de contención necesaria antes de que un reporte grave (UC072) esté completamente resuelto.

**Independent Test**: Bloquear una cuenta de prueba y verificar que pierde acceso a las capacidades de su rol mientras el bloqueo esté activo.

**Acceptance Scenarios**:

1. **Scenario**: Bloqueo preventivo aplicado [UC073]
    - **Given** un Administrador está revisando un reporte grave sobre una cuenta
    - **When** aplica un bloqueo preventivo
    - **Then** el sistema restringe el acceso de esa cuenta a las capacidades de su rol, dejando trazabilidad del bloqueo (quién, cuándo, motivo)

---

### User Story 5 - Moderar perfil o contenido [UC074] (Priority: P1)

Como Administrador, quiero ocultar o corregir contenido de un perfil que incumple las normas de la plataforma, sin necesidad de bloquear la cuenta completa.

**Why this priority**: Permite una intervención proporcional (corregir contenido puntual) frente al bloqueo total de una cuenta (UC073).

**Independent Test**: Sobre un perfil de prueba con contenido inapropiado, moderarlo y verificar que el contenido deja de mostrarse públicamente mientras la cuenta permanece activa.

**Acceptance Scenarios**:

1. **Scenario**: Contenido moderado [UC074]
    - **Given** un Administrador identifica contenido de un perfil que incumple las normas
    - **When** lo modera (oculta o solicita corrección)
    - **Then** el sistema deja de exponer ese contenido públicamente, sin afectar el resto del perfil ni el acceso de la cuenta

---

### User Story 6 - Buscar usuarios y perfiles [UC075] (Priority: P2)

Como Administrador, quiero buscar cuentas o perfiles por nombre, correo o identificador, para ubicar rápidamente el objetivo de una investigación o soporte.

**Why this priority**: Es una herramienta de apoyo transversal a las demás historias de este SPEC, no un flujo de valor final por sí mismo.

**Independent Test**: Buscar una cuenta de prueba por distintos criterios y verificar que aparece en los resultados.

**Acceptance Scenarios**:

1. **Scenario**: Búsqueda exitosa [UC075]
    - **Given** existe una cuenta con datos conocidos
    - **When** un Administrador busca usando alguno de esos datos
    - **Then** el sistema muestra la cuenta correspondiente entre los resultados


---

### User Story 7 - Gestionar servicios de alto riesgo [UC076] (Priority: P1)

Como Administrador, quiero identificar y gestionar servicios clasificados como de alto riesgo, para aplicar controles adicionales antes o durante su ejecución.

**Why this priority**: Ciertos oficios o situaciones (ej. trabajos eléctricos de alto voltaje, servicios en menores de edad presentes en el hogar) pueden requerir supervisión adicional del Administrador.

**Independent Test**: Marcar un servicio de prueba como de alto riesgo y verificar que queda identificado y disponible para seguimiento administrativo.

**Acceptance Scenarios**:

1. **Scenario**: Servicio marcado como alto riesgo [UC076]
    - **Given** un servicio cumple un criterio de alto riesgo definido por el producto
    - **When** un Administrador lo marca como tal
    - **Then** el sistema lo identifica para seguimiento diferenciado



---

### Edge Cases

- Una categoría o zona se desactiva mientras está en uso por un borrador o por la cobertura activa de un Prestador: El sistema debe poder publicar el borrador solo si seleccionar otra categoría y zona.
- Dos Administradores intentan resolver el mismo reporte al mismo tiempo: el sistema debe evitar resultados contradictorios (ej. uno resuelve, otro descarta, simultáneamente).
- Una cuenta bloqueada preventivamente  es también objeto de una nueva búsqueda: debe seguir siendo localizable para que el Administrador revierta el bloqueo si corresponde.


## Requirements _(mandatory)_

### Functional Requirements

- **FR-068**: El sistema DEBE permitir que un Administrador cree, edite y desactive categorías de servicio del catálogo. [UC068]
- **FR-069**: El sistema DEBE permitir que un Administrador cree, edite y desactive zonas geográficas del catálogo. [UC069]
- **FR-070**: El sistema DEBE permitir que un Administrador consulte la cola de reportes pendientes, sin importar su origen (usuario, servicio o reseña). [UC070]
- **FR-071**: El sistema DEBE permitir que un Administrador revise el detalle completo de un reporte, incluyendo su evidencia asociada, antes de poder resolverlo. [UC071]
- **FR-072**: El sistema DEBE permitir que un Administrador cambie el estado de un reporte a resuelto o descartado, con una justificación registrada, únicamente después de haberlo revisado en detalle. [UC072]
- **FR-073**: El sistema DEBE permitir que un Administrador bloquee preventivamente una cuenta, dejando trazabilidad de quién lo hizo, cuándo y por qué. [UC073]
- **FR-074**: El sistema DEBE permitir que un Administrador modere contenido puntual de un perfil sin bloquear la cuenta completa. [UC074]
- **FR-075**: El sistema DEBE permitir que un Administrador busque cuentas o perfiles por distintos criterios (nombre, correo, identificador). [UC075]
- **FR-076**: El sistema DEBE permitir que un Administrador marque un servicio como de alto riesgo según los criterios definidos por el producto. [UC076]

### Key Entities _(include if feature involves data)_

- **Categoría de servicio**: nombre, estado (activa/inactiva).
- **Zona**: nombre, cobertura geográfica, estado (activa/inactiva).
- **Reporte**: tipo de origen, objetivo, estado (pendiente/en revisión/resuelto/descartado), justificación de resolución.
- **Bloqueo preventivo**: cuenta afectada, administrador que lo aplicó, fecha, motivo.
- **Acción de moderación**: contenido afectado, tipo de acción (ocultar/corregir), administrador responsable.
- **Marca de alto riesgo**: servicio asociado, criterio aplicado, administrador que la asignó.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: El 100% de los reportes creados en `SPEC-10` y `SPEC-11` es visible en la cola de este SPEC.
- **SC-002**: Ningún reporte cambia de estado a resuelto/descartado sin haber pasado primero por su revisión de detalle.
- **SC-003**: El 100% de los bloqueos preventivos queda con administrador, fecha y motivo registrados.
- **SC-004**: Ninguna acción de moderación de contenido (UC074) provoca por sí sola un bloqueo de cuenta (UC073); son acciones independientes.

# Feature Specification: SPEC-13 — Ruta de formalización

**Creado**: 2026-09-16 
**Casos de uso cubiertos**: UC077, UC078, UC079, UC080 

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Consultar ruta de formalización [UC077] (Priority: P1)

Como Prestador, quiero consultar una ruta orientativa de formalización para entender qué pasos puedo seguir, sin que esto implique una obligación legal impuesta por la plataforma.

**Why this priority**: Es la entrada principal al módulo; sin ella no existe ningún otro flujo de formalización.

**Independent Test**: Con una cuenta de Prestador, acceder al módulo y verificar que se presenta la ruta orientativa con sus pasos y recursos.

**Acceptance Scenarios**:

1. **Scenario**: Ruta disponible [UC077]
    - **Given** un Prestador autenticado accede al módulo de formalización
    - **When** consulta la ruta
    - **Then** el sistema presenta los pasos orientativos y los recursos asociados, identificándolos como informativos y no obligatorios


---

### User Story 2 - Abrir enlaces oficiales de formalización [UC078] (Priority: P2)

Como Prestador, quiero abrir enlaces oficiales desde la ruta de formalización para continuar trámites o consultar fuentes institucionales externas.

**Why this priority**: Es una extensión opcional de la consulta de la ruta (UC077); la ruta ya aporta valor informativo sin que el Prestador llegue a abrir ningún enlace.

**Independent Test**: Con la ruta ya cargada y un enlace configurado, abrirlo y verificar que dirige al destino institucional correspondiente, identificado como externo.

**Acceptance Scenarios**:

1. **Scenario**: Apertura de enlace oficial [UC078]
    
    - **Given** un paso de la ruta tiene un enlace institucional configurado
    - **When** el Prestador lo abre
    - **Then** el sistema dirige al recurso oficial definido, marcándolo claramente como un destino externo
2. **Scenario**: Enlace oficial roto o no disponible
    
    - **Given** un enlace configurado ya no responde o fue dado de baja por la entidad externa
    - **When** el Prestador intenta abrirlo
    - **Then** el sistema lo muestra como no disponible, sin afirmar en ningún momento que el trámite asociado fue completado


---

### User Story 3 - Mostrar progreso sin declarar estatus legal [UC079] (Priority: P1)

Como Prestador, quiero ver un progreso orientativo de mi ruta de formalización sin que la plataforma afirme o certifique automáticamente mi estatus legal.

**Why this priority**: Es una restricción crítica explícita: el progreso mostrado nunca puede interpretarse como una certificación, sin importar qué tan avanzado esté.

**Independent Test**: Con distintos niveles de avance simulados, consultar el progreso y verificar que el sistema nunca lo presenta como una declaración de estatus legal.

**Acceptance Scenarios**:

1. **Scenario**: Progreso orientativo mostrado [UC079]
    
    - **Given** un Prestador tiene algún avance registrado en su ruta
    - **When** consulta su progreso
    - **Then** el sistema muestra el avance junto con una indicación explícita de que es orientativo y no constituye una declaración legal
2. **Scenario**: Progreso al 100%
    
    - **Given** un Prestador completó todos los pasos orientativos de la ruta
    - **When** consulta su progreso
    - **Then** el sistema sigue mostrando la misma advertencia de que esto no equivale a una certificación o estatus legal verificado


---

### User Story 4 - Vincular ruta institucional futura  [UC080] (Priority: P3)

Como Prestador, quiero que en el futuro la ruta de formalización pueda vincularse con rutas institucionales oficiales, para ampliar el acompañamiento más allá de lo que ofrece la plataforma por sí sola.

**Why this priority**: Está marcado explícitamente como `<<Future>>` en el diagrama; no es parte del alcance comprometido del MVP, igual que las capacidades descritas en `spec-07`.

**Independent Test**: Solo en un entorno de prueba con la capacidad habilitada, vincular una ruta institucional simulada y verificar que no altera el comportamiento cuando la capacidad está deshabilitada.

**Acceptance Scenarios**:

1. **Scenario**: Capacidad deshabilitada (comportamiento por defecto)
    
    - **Given** la capacidad de vinculación institucional futura no está habilitada
    - **When** un Prestador consulta su ruta de formalización
    - **Then** el sistema funciona con normalidad (Historias 1 a 3) sin ofrecer ni sugerir esta vinculación
2. **Scenario**: Capacidad habilitada (futuro)
    
    - **Given** la capacidad está explícitamente habilitada y existe una ruta institucional configurada
    - **When** el Prestador accede al vínculo
    - **Then** el sistema enlaza la fuente externa sin declarar automáticamente cumplimiento legal


---

### Edge Cases

- Un enlace institucional expira o cambia de dirección: debe poder deshabilitarse o actualizarse sin convertirse en contenido "verificado" por defecto.
- El Prestador alcanza el máximo progreso posible: la advertencia de "no constituye estatus legal" debe seguir mostrándose igual que con cualquier otro nivel de avance.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-077**: El sistema DEBE proporcionar a los Prestadores una ruta orientativa de formalización, identificada explícitamente como informativa. [UC077]
- **FR-078**: El sistema DEBE permitir abrir enlaces oficiales de formalización configurados, identificándolos claramente como destinos externos. [UC078]
- **FR-079**: El sistema DEBE presentar el progreso de formalización como orientativo y NO DEBE declarar, certificar ni inferir automáticamente un estatus legal a partir de dicho progreso, sin importar su nivel de avance. [UC079]
- **FR-080**: El sistema PUEDE admitir en el futuro una vinculación con rutas institucionales externas, la cual DEBE permanecer deshabilitada sin afectar el funcionamiento de UC077–UC079 mientras no sea aprobada explícitamente. [UC080]

### Key Entities _(include if feature involves data)_

- **Ruta de formalización**: estructura orientativa de pasos y recursos para el Prestador.
- **Enlace institucional**: referencia a un recurso oficial externo, con estado (disponible/no disponible).
- **Progreso de formalización**: valor orientativo asociado a un Prestador.
- **Vinculación institucional futura**: configuración deshabilitada por defecto que conecta la ruta con una fuente institucional externa.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: El 100% de las vistas de progreso de formalización muestra explícitamente que el avance es orientativo y no una declaración de estatus legal.
- **SC-002**: El 100% de los enlaces identificados como oficiales dirige al destino institucional configurado y se distingue como externo.
- **SC-003**: La desactivación de la capacidad de vinculación institucional futura (UC080) no impide completar ningún flujo de UC077–UC079.

# Feature Specification: SPEC-14 — Preferencias, historial e indicadores

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC081, UC082, UC083, UC084, UC085 

## User Scenarios & Testing _(mandatory)_



### User Story 1 - Configurar preferencias de notificación [UC081] (Priority: P1)

Como Usuario, quiero configurar mis preferencias de notificación para decidir qué avisos recibir y por qué canales.

**Why this priority**: Controla la experiencia de avisos usada transversalmente por otros módulos (oportunidades, propuestas, cambios de estado); es una configuración base.

**Independent Test**: Cambiar una preferencia y disparar un evento afectado, verificando que el sistema respeta la configuración.

**Acceptance Scenarios**:

1. **Scenario**: Preferencia aplicada [UC081]
    
    - **Given** un Usuario tiene una preferencia de notificación configurable
    - **When** la modifica
    - **Then** los eventos posteriores respetan esa configuración, dentro de los tipos de notificación marcados como configurables
2. **Scenario**: Intento de desactivar una notificación obligatoria
    
    - **Given** un tipo de notificación está marcado como no configurable (ej. avisos de seguridad de la cuenta)
    - **When** el Usuario intenta desactivarlo
    - **Then** el sistema no permite la desactivación y explica que ese tipo de aviso es obligatorio

---

### User Story 2 - Consultar historial de trabajos [UC082] (Priority: P1)

Como Usuario, quiero consultar mi historial de trabajos para revisar los servicios en los que participé.

**Why this priority**: Aporta trazabilidad directa al problema original del proyecto: la falta de historial de trabajos realizados identificada en las entrevistas (ej. Richard Núñez, Jorge Ortiz).

**Independent Test**: Con una cuenta que participó en varios servicios, consultar el historial y verificar que solo aparecen los servicios vinculados a esa cuenta.

**Acceptance Scenarios**:

1. **Scenario**: Historial propio [UC082]
    
    - **Given** un Usuario participó en uno o más servicios (como Cliente o como Prestador)
    - **When** consulta su historial
    - **Then** el sistema muestra únicamente los servicios asociados a su propia cuenta
2. **Scenario**: Usuario sin servicios previos
    
    - **Given** un Usuario no ha participado en ningún servicio todavía
    - **When** consulta su historial
    - **Then** el sistema muestra un historial vacío, sin error



---

### User Story 3 - Descargar historial [UC083 ] (Priority: P2)

Como Usuario, quiero descargar mi historial para conservarlo o usarlo fuera de la plataforma.

**Why this priority**: Es una extensión opcional sobre un historial que ya es consultable en pantalla (UC082); no es indispensable para el valor central del historial.

**Independent Test**: Solicitar la descarga del historial de una cuenta con varios registros y verificar que el archivo entregado coincide exactamente con lo consultable en pantalla.

**Acceptance Scenarios**:

1. **Scenario**: Descarga exitosa [UC083]
    
    - **Given** un Usuario tiene elementos en su historial
    - **When** solicita descargarlo
    - **Then** el sistema entrega un archivo descargable que contiene únicamente los registros autorizados de esa cuenta
2. **Scenario**: Descarga interrumpida
    
    - **Given** una descarga de historial se interrumpe a mitad de proceso (ej. pérdida de conexión)
    - **When** el Usuario reintenta
    - **Then** el sistema genera una descarga íntegra nuevamente, sin haber alterado el historial original ni expuesto registros de otro usuario


---

### User Story 4 - Consultar indicadores básicos del prestador [UC084] (Priority: P1)

Como Prestador, quiero consultar indicadores básicos de mi actividad para entender mi desempeño y la rentabilidad de mi trabajo en la plataforma.

**Why this priority**: Responde directamente a una necesidad expresada en las entrevistas (Richard Núñez: "sería útil tener una bitácora... para saber si el trabajo me está resultando rentable").

**Independent Test**: Con datos de actividad conocidos para una cuenta de Prestador, consultar sus indicadores y verificar que el cálculo es reproducible.

**Acceptance Scenarios**:

1. **Scenario**: Indicadores calculados [UC084]
    
    - **Given** un Prestador tiene actividad registrada (servicios finalizados, calificaciones)
    - **When** consulta sus indicadores
    - **Then** el sistema muestra las métricas básicas definidas por el producto, calculadas únicamente sobre su propia actividad
2. **Scenario**: Actividad con servicios cancelados o en moderación
    
    - **Given** parte de la actividad del Prestador incluye servicios cancelados o actualmente en revisión por un reporte
    - **When** se calculan los indicadores
    - **Then** los servicios se incluyen.


---

### User Story 5 - Consultar actividad reciente [UC085] (Priority: P2)

Como Usuario, quiero consultar mi actividad reciente para recordar eventos relevantes de mi cuenta sin tener que revisar todo el historial completo.

**Why this priority**: Es un complemento de conveniencia sobre el historial (UC082) y las notificaciones (UC081), no un flujo crítico por sí solo.

**Independent Test**: Generar varios eventos visibles para una cuenta y verificar que aparecen en orden y solo para esa cuenta.

**Acceptance Scenarios**:

1. **Scenario**: Actividad reciente propia [UC085]
    - **Given** un Usuario tiene eventos recientes visibles (ej. nueva propuesta recibida, cambio de estado de un servicio)
    - **When** abre su actividad reciente
    - **Then** el sistema muestra esos eventos en orden cronológico, limitados a su propia cuenta


---

### Edge Cases


- La descarga del historial es solicitada por una cuenta con un volumen muy grande de registros: El sistema debe realizar paginación.
- Un indicador depende de datos de servicios cancelados o moderados: la fórmula debe definir explícitamente su inclusión o exclusión antes de implementarse.
- Dos eventos ocurren en el mismo instante para la actividad reciente: debe existir un criterio de desempate para el orden mostrado.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-081**: El sistema DEBE permitir que los Usuarios configuren sus preferencias de notificación para los tipos y canales marcados como configurables, sin permitir desactivar los obligatorios. [UC081]
- **FR-082**: El sistema DEBE permitir que los Usuarios consulten únicamente el historial de servicios en los que estén autorizados como participantes. [UC082]
- **FR-083**: El sistema DEBE permitir que los Usuarios descarguen su historial autorizado, garantizando que el contenido descargado coincida con el historial consultable. [UC083]
- **FR-084**: El sistema DEBE permitir que los Prestadores consulten indicadores básicos definidos por el producto, calculados exclusivamente sobre su propia actividad. [UC084]
- **FR-085**: El sistema DEBE permitir que los Usuarios consulten su actividad reciente autorizada, en orden cronológico. [UC085]

### Key Entities _(include if feature involves data)_

- **Preferencia de notificación**: tipo de aviso, canal, configurable u obligatorio, usuario asociado.
- **Historial de trabajos**: colección de servicios vinculados a un usuario (como Cliente o Prestador).
- **Descarga de historial**: archivo generado a partir del historial, fecha de generación.
- **Indicador básico**: métrica aprobada de actividad del Prestador, con fórmula y periodo de cálculo.
- **Actividad reciente**: eventos visibles vinculados a la cuenta del usuario, con marca de tiempo.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: El 100% de las consultas y descargas de historial está limitado a servicios autorizados para el usuario solicitante.
- **SC-002**: Los indicadores básicos producen resultados reproducibles para el 100% de los conjuntos de datos de prueba definidos, una vez resuelta la política de inclusión/exclusión de la Historia 4.
- **SC-003**: Los eventos de notificación configurables respetan las preferencias activas del usuario en el 100% de los casos de prueba.
- **SC-004**: El contenido de toda descarga de historial coincide exactamente con el historial consultable en pantalla para la misma cuenta, en el 100% de los casos.
