'use strict'

const questionRouter = require("../controladores/controladorPreguntas");
const userSessionRouter = require("./routerSessionUsuario");


const express = require('express');
var router = express.Router();

/*GET*/
router.get("/", userSessionRouter.usuarioActual, questionRouter.preguntas);

router.get("/creaPregunta", userSessionRouter.usuarioActual, questionRouter.crearPregunta);

/*
router.get("/pregunta/:id", userSessionRouter.usuarioActual, questionRouter.preguntaById);

router.get("/respondePregunta/:id", userSessionRouter.usuarioActual, questionRouter.contestarPregunta);*/

/*POST*/

/*router.post("/procesarPreguntaCreada", userSessionRouter.usuarioActual, questionRouter.procesarCrearPregunta);

router.post("/procesarRespuesta", userSessionRouter.usuarioActual, questionRouter.procesarRespuesta);*/

module.exports = router;