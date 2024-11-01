<FUNCIONAMIENTO DE LA API>
Esta API permite ejecutar operaciones CRUD (Crear, Leer, Actualizar y Eliminar), sobre una lista de usuarios bancarios que están almacenados en un archivo JSON. 
Las pruebas y validaciones se pueden ejecutar a través del <POSTMAN


ENDPOINTS
1. Obtner todos los usuarios
    <GET: Se obtiene la lista completa de los usuarios almacenados en el archivo JSON
    Ejemplo de solicitud: GET http://localhost:3000/api/usuarios

    => Respuesta
    [
        {
            "id": 1,
            "nombre": "Catalina García",
            "correo": "catagar@gmail.com",
            "cuentaIban": "CR4950000213454451",
            "montoDisponible": "$100",
        },
        {
            "id": 2,
            "nombre": "Mirtha Vanessa",
            "correo": "mirtha@gmail.com",
            "cuentaIban": "CR4950000213454451",
            "montoDisponible": "$100000"
        },
    ]

2. Obtner todos los usuarios por id
    <GET/id: Se obtiene un único usuario de la lista por el id 
    Ejemplo de solicitud: GET http://localhost:3000/api/usuarios/1 
    (al final se coloca el id correspondiente al usuario)

    => Respuesta
    [
        {
            "id": 1,
            "nombre": "Catalina García",
            "correo": "catagar@gmail.com",
            "cuentaIban": "CR4950000213454451",
            "montoDisponible": "$100",
        },
    ]

3. Agregar un nuevo usuario
    <POST: Se agrega un nuevo usuario a la lista del archivo JSON
    Ejemplo de solicitud: POST http://localhost:3000/api/usuarios

    => Cuerpo de la solicitud
    {
        "nombre": "Catalina García",
        "correo": "catagar@gmail.com",
        "cuentaIban": "CR4950000213454451",
        "montoDisponible": "$100
    }

    => Respuesta
    {
        "id": 2,
        "nombre": "Ricardo Carmona",
        "correo": "rica@gmail.com",
        "cuentaIban": "C657568679100000",
        "montoDisponible": "$5000",
    }

4. Actualizar usuario que ya existe
    <PUT: Actualiza datos de un usuario específico
    Ejemplo de solicitud: PUT http://localhost:3000/api/usuarios/1 
    (al final se coloca el id correspondiente al usuario)

    => Cuerpo de la solicitud
    {
        "nombre": "Catalina García",
        "correo": "catagar@gmail.com",
        "cuentaIban": "CR4950000213454451",
        "montoDisponible": "$100
    }

    => Respuesta
    {
        "message": "Producto actualizado con éxito",
        "producto": {
            "id": 1,
            "nombre": "Auriculares Bluetooth X-Pro",
            "correo": "Auriculares inalámbricos con sonido envolvente.",
            "cuentaIban": "CR4950000213454451",
            "montoDisponible": "$30" <cantidadDisponible actualizada>
        }
    }

5. Actualizar usuario que ya existe
    <PATCH: Actualiza un campo específicado que se le indique, sin modificar el resto de datos del usuario
    Ejemplo de solicitud: PATCH http://localhost:3000/api/usuarios/1 
    (al final se coloca el id correspondiente al usuario)

    => Cuerpo de la solicitud
    {
        "nombre": "Evans Pérez",
    }

    => Respuesta
    {
        "message": "Producto actualizado con éxito",
        "producto": {
            "id": 1,
            "nombre": "Evans Pérez", <nombre actualizado>
            "correo": "catagar@gmail.com",
            "cuentaIban": "CR4950000213454451",
            "montoDisponible": "$100"
        }
    }

6. Eliminar un usuario
    <DELETE: Elimina un usuario de la lista
    Ejemplo de solicitud: PUT http://localhost:3000/api/usuarios/2 
    (al final se coloca el id correspondiente al usuario)

    => Respuesta
    {
    "message": "Usuario eliminado correctamente."
    }



/////////////////////////////// VALIDACIONES PARA MANEJAR ERRORES ///////////////////////////////

1. Falta de datos requeridos (POST o PUT)

    => Si al ejecutar la solicitud falta algún campo requerido (nombre, correo, cuentaIban o montoDisponible)
    Se usa el código de estado: <400> BAD REQUEST

    Estructura:
        if (!nombre || !correo || !cuentaIban || !montoDisponible) {
            return res.status(400).json({ message: "Existe un error de sintáxis o falta algún atributo: 'nombre', 'correo', 'cuentaIban' o 'montoDisponible'." });
        }

    => Respuesta
    {
        "message": "Existe un error de sintáxis o falta algún atributo: 'nombre', 'correo', 'cuentaIban' o 'montoDisponible."
    }

2. Usuarios no encontrados  (PUT o DELETE)
    => Si el id del usuario no existe 
    Se usa el código de estado: <404> NOT FOUND

    Estructura:
        if (usuarioIndex === -1) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

    => Respuesta 
    {
        "message": "Usuario no encontrado."
    }

3. Error interno del servidor
    => Esto es en caso de algún error inesperado en el servidor
    Se usa el código de estado: <500> INTERNAL SERVER ERROR

    Estructura:
    catch (error) {
      res.status(500).json({ message: "Error interno del servidor", error });
    }

    => Respuesta 
    {
        "message": "Error interno del servidor."
        "error": "Detalles del error"
    }

4. Falta de carácteres en el número de cuenta IBAN (POST o PUT)
    => Si el id del usuario no existe 
        Se usa el código de estado: <404> NOT FOUND

    Estructura:
        else if (cuentaValida.length !== 22 ) {
          res.status(400).json({message: "La cuenta IBAN debe contener al menos 22 carácteres."})
      }

    => Respuesta  
    {
        "message": "La cuenta IBAN debe contener al menos 22 carácteres."
    }