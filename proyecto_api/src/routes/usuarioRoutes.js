

const express = require('express');
const router = express.Router();
const usuarioControllers = require(`../controllers/usuarioControllers`);

//Rutas CRUD
router.get('/', usuarioControllers.getUsuarios);
router.post('/', usuarioControllers.postUsuario);
router.put('/:id', usuarioControllers.updateUsuario);
router.delete('/:id', usuarioControllers.deleteUsuario);
router.patch('/:id', usuarioControllers.patchUsuario);
router.get('/:id', usuarioControllers.getUsuarioById);

module.exports = router;