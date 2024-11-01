//Archivo principal que define la configuración y comportamineto del servidor

//Configura el servidor
const express = require ("express"); //framework para crear las API
const cors = require ("cors");
const app = express();
const fs = require("fs");
const path = require("path");
const usuarioRoutes = require("./src/routes/usuarioRoutes")

const PORT = process.env.PORT || 3000;

//Habilitar Cors para las rutas
app.use(cors());

//Middlewares el npm de express que realizamos
app.use(express.json()); //Habilitar parsing de JSON en las solicitudes

//Gestión de rutas (aquí se agregan las que se vayan creando)
app.use("/api/usuarios", usuarioRoutes);


//Servidor
app.listen(PORT, () => {
console.log (`Servidor corriendo en http://localhost:${PORT}`)
})