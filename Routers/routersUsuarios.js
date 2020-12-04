"use strict"

const routerUsuarios = require("./controladorUsuario");
const routerSessionUsuario = require("./routerSessionUsuario");

const express = require("express");
var router = express.Router();
const path = require("path");

/*GET*/
router.get("/", routerUsuarios.root);
router.get("/login", routerUsuarios.login);
router.get("/registro", routerUsuarios.registro);
router.get("/perfil", routerSessionUsuario.usuarioActual, routerUsuarios.perfil);
router.get("/logout", routerSessionUsuario.usuarioActual, routerUsuarios.logout);

/*POST*/
router.post("/procesarLogin", routerUsuarios.procesarLogin);
router.post("/registro", routerUsuarios.usuarioRegistrado);


module.exports = router;


