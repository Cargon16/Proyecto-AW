'use strict'

const questionRouter = require("../controladores/controladorPreguntas");
const userSessionRouter = require("./routerSessionUsuario");

const express = require("express");
var router = express.Router();
const path = require("path");
const multer = require("multer")

/*GET*/
router.get("/", userSessionRouter.usuarioActual, questionRouter.preguntas);
router.get("/crearPregunta", userSessionRouter.usuarioActual, questionRouter.creaPregunta);

/*
router.get("/pregunta/:id", userSessionRouter.usuarioActual, questionRouter.preguntaById);
router.get("/respondePregunta/:id", userSessionRouter.usuarioActual, questionRouter.contestarPregunta);*/

/*POST*/
router.post("/formularPregunta", questionRouter.procesarCrearPregunta);
/*
router.post("/procesarRespuesta", userSessionRouter.usuarioActual, questionRouter.procesarRespuesta);*/

module.exports = router;