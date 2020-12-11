"use strict"

const routerUsuarios = require("../controladores/controladorUsuario");
const routerSessionUsuario = require("./routerSessionUsuario");

const express = require("express");
var router = express.Router();
const path = require("path");
const multer = require("multer");

const multerFactory = multer({ dest: path.join("public","imagen") });

/*GET*/
router.get("/", routerUsuarios.root);
router.get("/login", routerUsuarios.login);
router.get("/registro", routerUsuarios.registro);
router.get("/logout", routerSessionUsuario.usuarioActual, routerUsuarios.logout);
router.get("/paginaPrincipal", routerSessionUsuario.usuarioActual, routerUsuarios.paginaPrincipal);
/*POST*/
router.post("/procesarLogin", routerUsuarios.procesarLogin);
router.post("/registro", multerFactory.single("perfil"), routerUsuarios.usuarioRegistrado);
router.post("/perfil", routerSessionUsuario.usuarioActual, routerUsuarios.perfil);
module.exports = router;


