"use strict"

const config = require("../config");
const mysql = require("mysql");
const pool = mysql.createPool(config.mysqlConfig);
const express = require('express');
const usuariosDAO = require("../usuarios/DAOusuarios");
const daoUsuarios = new usuariosDAO(pool);
const preguntasDAO = require("../preguntas/DAOpreguntas");
const DAOpreguntas = require("../preguntas/DAOpreguntas");
const daoPreguntas = new preguntasDAO(pool);

function preguntas(request, response) {
    daoPreguntas.getPreguntas(function (err, preguntas) {
        if (err) {
            response.status(404);
        } else {
            response.status(200);
            response.render("paginaTodasPreguntas", {
                "preguntas": preguntas,
                "imagen": request.session.imagen,
                "usuario": request.session.nombreUsuario,
                "correo": request.session.correo
            });
        }
    });
}

function creaPregunta(request, response) {
    response.status(200);
    response.render("paginaFormularPregunta", {
        msg: null,
        "usuario": request.session.nombreUsuario,
        "correo": request.session.correo,
        "imagen": request.session.imagen
    });
}


function procesarCrearPregunta(request, response) {

    var pregunta = null;
    let msg = null;


    if (request.body.titulo == "" || request.body.cuerpo == "" || request.body.etiquetas == "") {
        msg = "Revisa los campos vacios.";
    } else {

        let etiquetasDivididas = request.body.etiquetas.split("@");
        etiquetasDivididas = etiquetasDivididas.slice(1, etiquetasDivididas.length);
        if (etiquetasDivididas.length > 5) {
            msg = "Solo puedes introducir hasta 5 etiquetas."
        } else {
            pregunta = {
                "titulo": request.body.titulo,
                "cuerpo": request.body.cuerpo,
                "etiquetas": etiquetasDivididas,
                "usuario": request.session.correo
            };

        }
    }
    if (pregunta == null) {
        response.render("paginaFormularPregunta", {
            "msg": msg,
            "imagen": request.session.imagen,
            "correo": request.session.correo,
            "usuario": request.session.nombreUsuario
        });
    } else {
        daoPreguntas.insertarPregunta(pregunta, function (err, insertado) {
            if (err) {
                response.status(500);
                console.log(err + " post_preguntaInsertada");
                response.render("paginaFormularPregunta", {
                    "msg": "Error al crear pregunta",
                    "imagen": request.session.imagen,
                    "correo": request.session.correo,
                    "usuario": request.session.nombreUsuario
                })
            } else {
                response.status(200);
                if (insertado) {
                    response.render("paginaFormularPregunta", {
                        "msg": "Pregunta creada con exito.",
                        "imagen": request.session.imagen,
                        "correo": request.session.correo,
                        "usuario": request.session.nombreUsuario
                    })
                } else {
                    response.render("paginaFormularPregunta", {
                        "msg": "Error al crear pregunta",
                        "imagen": request.session.imagen,
                        "correo": request.session.correo,
                        "usuario": request.session.nombreUsuario
                    })
                }
            }
        })
    }

}

function preguntasSinResponder(request, response) {
    daoPreguntas.getPreguntasSinResponder(function (err, preguntas) {
        if (err) {
            response.status(404);
        } else {
            response.status(200);
            response.render("paginaPreguntasSinResponder", {
                "preguntas": preguntas,
                "imagen": request.session.imagen,
                "usuario": request.session.nombreUsuario,
                "correo": request.session.correo
            });
        }
    });
}

function getPregunta(request, response) {
    daoPreguntas.setVisitas(request.params.id, function (err, devuelve) {
        daoPreguntas.getPregunta(request.params.id, function (err, pregunta) {
            daoPreguntas.getRespuestasPregunta(request.params.id, function (err, respuestas) {
                if (err) {
                    response.status(404);
                } else {
                    response.status(200);
                    response.render("pregunta", {
                        "pregunta": pregunta,
                        "respuestas": respuestas,
                        "imagen": request.session.imagen,
                        "usuario": request.session.nombreUsuario,
                        "correo": request.session.correo
                    });
                }
            });
        });
    });
}

function procesarCrearRespuesta(request, response) {

    var respuesta = null;
    let msg = null;

    if (!request.body.turespuesta.trim()) {
        msg = "Revisa los campos vacios.";
    } else {
        respuesta = {
            "cuerpo": request.body.turespuesta,
            "usuario": request.session.correo,
            "pregunta": request.body.idPregunta
        };

    }
    daoPreguntas.getPreguntas(function (err, preguntas) {
        if (respuesta == null) {
            response.render("paginaTodasPreguntas", {
                "msg": msg,
                "imagen": request.session.imagen,
                "correo": request.session.correo,
                "usuario": request.session.nombreUsuario,
                "preguntas": preguntas
            });
        } else {
            daoPreguntas.insertarRespuesta(respuesta, function (err, insertado) {

                if (err) {
                    response.status(500);
                    console.log(err + " post_preguntaInsertada");
                    response.render("paginaTodasPreguntas", {
                        "msg": "Error al crear pregunta",
                        "imagen": request.session.imagen,
                        "correo": request.session.correo,
                        "usuario": request.session.nombreUsuario,
                        "preguntas": preguntas
                    })
                } else {
                    response.status(200);
                    if (insertado) {
                        response.render("paginaTodasPreguntas", {
                            "msg": "Pregunta creada con exito.",
                            "imagen": request.session.imagen,
                            "correo": request.session.correo,
                            "usuario": request.session.nombreUsuario,
                            "preguntas": preguntas
                        })
                    } else {
                        response.render("paginaTodasPreguntas", {
                            "msg": "Error al crear pregunta",
                            "imagen": request.session.imagen,
                            "correo": request.session.correo,
                            "usuario": request.session.nombreUsuario,
                            "preguntas": preguntas
                        })
                    }
                }

            });
        }
    });
}

module.exports = {
    preguntas,
    creaPregunta,
    procesarCrearPregunta,
    preguntasSinResponder,
    getPregunta,
    procesarCrearRespuesta
}