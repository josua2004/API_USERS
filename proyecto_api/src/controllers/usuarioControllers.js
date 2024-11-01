//Importación del fs
const fs = require('fs').promises;
const path = require('path');

//Importación del archivo json
const archivoJson = path.join(__dirname, 'usuarios.json');

///////////////////////////////  LEER EL ARCHIVO JSON  ///////////////////////////////

const leerJson = async () => {
  try {
      const data = await fs.readFile(archivoJson, 'utf8');   
      //'JSON.parse(data)' convierte el texto que se leyó del archivo en un objeto JavaScript
      return JSON.parse(data);
  } catch (err) {
      console.error("Error al leer el archivo JSON", err);
      //'throw err' propaga el error para que pueda ser capturado por un manejador de errores externo (postman)
      throw err;
  }
};

/////////////////////////////  ESCRIBIR EL ARCHIVO JSON  /////////////////////////////

const escribirJson = async (usuarios) => {
  try {
      //'JSON.stringify(usuarios, null, 2)' convierte el objeto 'usuarios' en formato JSON 
      //null: no se aplica ningún reemplazo en las propiedades del objeto usuarios. 
      //Es decir, todas las propiedades del objeto se incluirán en la conversión a JSON sin modificaciones.
      //2 para agregar espacios en blanco al JSON resultante
      await fs.writeFile(archivoJson, JSON.stringify(usuarios, null, 2), 'utf8');

      const now = new Date().toLocaleString(); //Registrar la hora en que se ejecuta la solicitud
      
      console.log(`El archivo JSON ha sido modificado con éxito. ${now}`);
  } catch (err) {
      console.error("Error al escribir en el archivo JSON", err);
      throw err;
  }
};


//////////////////////////////////////// GET ////////////////////////////////////////
  const getUsuarios = async (req, res) => {
    try {
      const usuarios = await leerJson(); //Traer los usuarios desde el JSON
      res.json(usuarios); //Envía la respuesta en formato JSON
    } catch (error) {
      //Si ocurre un error, envía una respuesta con el estado 500 y un mensaje de error
      res.status(500).json({ message: "Error al obtener los usuarios", error });
    }
  };

//////////////////////////////////// GET by ID //////////////////////////////////////
const getUsuarioById = async (req, res) => {
  try {
      const id = parseInt(req.params.id);
      const usuarios = await leerJson(); //Traer los usuarios desde el JSON
      const usuario= usuarios.find(item => item.id === id);
      res.json(usuario); //Envía la respuesta en formato JSON con el usuario
  } catch (error) {
      //Si ocurre un error, envía una respuesta con el estado 500 y un mensaje de error
      res.status(500).json({ message: 'Error al obtener el usuario', error });
  }
};

///////////////////////////////////////// POST /////////////////////////////////////////
  const postUsuario = async (req, res) => {
    try {
      const { nombre, correo, cuentaIban, montoDisponible} = req.body;
      const cuentaValida= cuentaIban.split(''); //convertir string a lista

      if (cuentaValida.length === 22 && nombre && correo && montoDisponible){

        const usuarios = await leerJson(); //Traer los usuarios desde el JSON

        //Agregar el nuevo producto 
        const nuevoUsuario = { 
          id: usuarios[usuarios.length -1].id + 1,
          nombre,
          correo,
          cuentaIban,
          montoDisponible
        };
        //Enviar el nuevo producto a la lista de usuarios
        usuarios.push(nuevoUsuario);
        //Y lo envío al JSON:
        await escribirJson (usuarios); 
        res.status(201).json(nuevoUsuario);

      //Validar que la cuenta IBAN contenga 22 carácteres:  
      }else if (cuentaValida.length !== 22 ) {
          res.status(400).json({message: "La cuenta IBAN debe contener al menos 22 carácteres."})
      }else{
        return res.status(400).json({ message: "Existe un error de sintáxis o falta algún atributo: 'nombre', 'correo', 'cuentaIban' o 'montoDisponible'." });
      }
    //Capturar errores
    } catch (error) {
      res.status(500).json({ message: "Error al agregar usuario", error });
    }
  };
  

  ///////////////////////////////////////// PUT ////////////////////////////////////////
const updateUsuario = async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, correo, cuentaIban, montoDisponible } = req.body;
      const usuarios = await leerJson(); //Traer los usuarios desde el JSON
      const usuarioIndex = usuarios.findIndex(usuario => usuario.id === parseInt(id));
      const cuentaValida= cuentaIban.split(''); //convertir string a lista

      //Validar errores de sintáxis o falta de dato
      if (!nombre || !correo || !cuentaIban || !montoDisponible || cuentaValida. length !== 22) {
        if (cuentaValida. length !== 22) {
          res.status(400).json({message: "La cuenta IBAN debe contener al menos 22 carácteres."})
        }else{
          return res.status(400).json({ message: "Existe un error de sintáxis o falta algún atributo: 'nombre', 'correo', 'cuentaIban' o 'montoDisponible'." });
        }
      }
      if (nombre) {
        usuarios[usuarioIndex].nombre = nombre;
      }
      if (correo) {
        usuarios[usuarioIndex].correo = correo;
      }
      if (cuentaIban) {
        usuarios[usuarioIndex].cuentaIban = cuentaIban;
      }
      if (montoDisponible) {
        usuarios[usuarioIndex].montoDisponible = montoDisponible;
      }
  
      await escribirJson (usuarios); //Envío el usuario actualizado al Json
      res.status(200).json({ message: "Usuario actualizado con éxito", usuario: usuarios[usuarioIndex] });
    
      //Capturar errores
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor", error });
    }
  };
  

  ///////////////////////////////////////// PACTH /////////////////////////////////////////
  const patchUsuario = async (req, res) =>{
    try {
        const id = parseInt(req.params.id);
        const usuarios = await leerJson(); //Traer los usuarios desde el JSON
        const usuario= usuarios.find(item => item.id === id);
        const index= usuarios.indexOf(usuario)

        //Object.assign(target, source(s))
        Object.assign(usuario, req.body); 
        usuarios[index]=usuario; 
        await escribirJson (usuarios); //Envío el usuario actualizado al Json}
        res.status(200).json({ message: "Usuario actualizado con éxito", usuario: usuarios[index] });
    } catch (error) {
        res.status(500).json({mensaje:'error interno en el servidor'})
    }
}

///////////////////////////////////////// DELETE /////////////////////////////////////////
const deleteUsuario = async (req, res) => {
    try {
      const { id } = req.params;
      const usuarios = await leerJson(); //Traer los usuarios desde el JSON
      const usuarioIndex = usuarios.findIndex(usuario => usuario.id === parseInt(id));
  
      //Validar que el usuario esté disponible
      if (usuarioIndex === -1) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      //Eliminar de la lista de usuarios
      usuarios.splice(usuarioIndex, 1);

      //Eliminar del archivo usuarios.json
      await escribirJson (usuarios); 

      res.status(200).json({ message: "Usuario eliminado correctamente." });

    //Capturar errores
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor", error });
    }
  };


  module.exports = {
    getUsuarios,
    postUsuario, 
    updateUsuario,
    deleteUsuario, 
    patchUsuario, 
    getUsuarioById
  };