"use strict"

const config = require("../config");
const mysql = require("mysql");
const pool = mysql.createPool(config.mysqlConfig);
const express = require('express');
const usuariosDAO = require("../usuarios/DAOusuarios");
const daoUsuarios = new usuariosDAO(pool);
const preguntasDAO = require("../preguntas/DAOpreguntas");
const daoPreguntas = new preguntasDAO(pool);
const medallasDAO = require("../medallas/DAOmedallas");
const daoMedallas = new medallasDAO(pool);

function preguntas(request, response) {
    daoPreguntas.getPreguntas(function (err, preguntas) {
        if (err) {
            response.status(404);
        } else {
            response.status(200);
            response.render("paginaTodasPreguntas", {
                "preguntas": preguntas,
                "imagen": request.session.imagen,
                "usuarioActual": request.session.nombreUsuario,
                "correo": request.session.correo
            });
        }
    });
}

function creaPregunta(request, response) {
    response.status(200);
    response.render("paginaFormularPregunta", {
        msg: null,
        "usuarioActual": request.session.nombreUsuario,
        "correo": request.session.correo,
        "imagen": request.session.imagen
    });
}


function procesarCrearPregunta(request, response) {

    var pregunta = null;
    let msg = null;


    if (request.body.titulo == "" || request.body.cuerpo == "") {
        msg = "Revisa los campos vacios.";
    } else {
        if (request.body.etiquetas != "") {
            let etiquetasDivididas = request.body.etiquetas.split("@");
            etiquetasDivididas = etiquetasDivididas.slice(1, etiquetasDivididas.length);
            if (etiquetasDivididas.length > 5) {
                msg = "Solo puedes introducir hasta 5 etiquetas."
            }
            else {
                pregunta = {
                    "titulo": request.body.titulo,
                    "cuerpo": request.body.cuerpo,
                    "etiquetas": etiquetasDivididas,
                    "usuarioActual": request.session.correo
                };

            }
        }
        else {
            pregunta = {
                "titulo": request.body.titulo,
                "cuerpo": request.body.cuerpo,
                "etiquetas": [],
                "usuarioActual": request.session.correo
            };
        }
    }
    if (pregunta == null) {
        response.render("paginaFormularPregunta", {
            msg: msg,
            "usuarioActual": request.session.nombreUsuario,
            "correo": request.session.correo,
            "imagen": request.session.imagen
        });
    } else {
        daoPreguntas.insertarPregunta(pregunta, function (err, insertado) {
            if (err || !insertado) {
                response.status(500);
                console.log(err + " post_preguntaInsertada");
                response.redirect("/preguntas/crearPregunta")
            } else {
                response.status(200);
                response.redirect("/preguntas");
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
                "usuarioActual": request.session.nombreUsuario,
                "correo": request.session.correo
            });
        }
    });
}

function getPregunta(request, response) {
    daoPreguntas.setVisitas(request.params.id, function (err, devuelve) {
        daoPreguntas.getPregunta(request.params.id, function (err, pregunta) {
            daoMedallas.setMedallaPreguntaVisitas(pregunta, function (err, res) {
                daoPreguntas.getRespuestasPregunta(request.params.id, request.session.correo, function (err, respuestas) {
              
                    let p={
                        "usuarioLoggueado": request.session.correo,
                        "id": pregunta.ID_Pregunta
                    };
                    daoUsuarios.hasVoteQuestion(p, function(err, res){
                        if (err) {
                            response.status(404);
                        } else {
                            response.status(200);
                            let opt = "disabled";
                            if(!res) opt= "enabled";

                            response.render("pregunta", {
                                "pregunta": pregunta,
                                "respuestas": respuestas,
                                "imagen": request.session.imagen,
                                "usuarioActual": request.session.nombreUsuario,
                                "correo": request.session.correo,
                                "opt": opt
                            });
                        }
                    });


                });
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
            "usuarioActual": request.session.correo,
            "pregunta": request.body.idPregunta
        };

    }
    if (respuesta == null) {
        response.redirect("/preguntas/pregunta/"+ request.body.idPregunta);
    } else {
        daoPreguntas.insertarRespuesta(respuesta, function (err, insertado) {

            if (err || !insertado) {
                response.status(500);
                console.log(err + " post_preguntaInsertada");
                response.redirect("/preguntas/pregunta/" + respuesta.pregunta);
            } else {
                response.status(200);
                response.redirect("/preguntas");
            }

        });
    }
}

function procesarVoto(request, response) {
    let pregunta = {
        "id": request.body.id,
        "puntuacion": request.body.puntuacion,
        "usuarioActual": request.body.usuario,
        "usuarioLoggueado": request.session.correo,
        "v": request.body.v
    };



    daoUsuarios.hasUserVoteThatQuestion(pregunta, function (err, res) {
        if (!res) {
            daoPreguntas.setVotosPregunta(pregunta, function (err, devuelve) {
                daoMedallas.setMedallaPreguntaVotos(pregunta, function (err, ret) {
                    daoUsuarios.setUserReputation(pregunta, function (err, resultado) {

                        if (err) {
                            response.status(404);
                        } else {
                            response.redirect("/preguntas/pregunta/" + pregunta.id);
                        }
                    });
                });

            });
        }
        else {
            response.redirect("/preguntas/pregunta/" + pregunta.id);
        }
    });
}

function procesarVotoRespuesta(request, response) {
    let respuesta = {
        "id": request.body.id,
        "puntuacion": request.body.puntuacion,
        "usuarioActual": request.body.usuario,
        "usuarioLoggueado": request.session.correo,
        "v": request.body.v,
        "ID_respuesta": request.body.respuesta
    };

    daoUsuarios.hasUserVoteThatAnswer(respuesta, function (err, res) {
        if (!res) {
            daoPreguntas.setVotosRespuesta(respuesta, function (err, devuelve) {
                daoMedallas.setMedallaRespuestaVotos(respuesta, function (err, res) {
                    daoUsuarios.setUserReputation(respuesta, function (err, resultado) {

                        if (err) {
                            response.status(404);
                        } else {
                            response.redirect("/preguntas/pregunta/" + respuesta.id);
                        }
                    });
                });
            });
        }
        else {
            response.redirect("/preguntas/pregunta/" + respuesta.id);
        }
    });
}
function buscaPregunta(request, response) {
    daoPreguntas.getPreguntaFiltrada(request.body.Buscar, function (err, preguntas) {
        if (err) {
            response.status(500);
            console.log("busquedaPregunta_post" + err);
        } else {

            response.render("paginaPreguntasFiltradas", {
                "preguntas": preguntas,
                "usuarioActual": request.session.nombreUsuario,
                "correo": request.session.correo,
                "imagen": request.session.imagen,
                "busqueda": request.body.Buscar
            });
        }
    })
}

function preguntasEtiqueta(request, response) {
    daoPreguntas.getPreguntaPorEtiqueta(request.params.id, function (err, preguntas) {
        if (err) {
            response.status(500);
            console.log("busquedaPregunta_post" + err);
        } else {

            response.render("paginaPreguntaEtiqueta", {
                "preguntas": preguntas,
                "usuarioActual": request.session.nombreUsuario,
                "correo": request.session.correo,
                "imagen": request.session.imagen,
                "etiqueta": request.params.id
            });
        }
    })
}

module.exports = {
    preguntas,
    creaPregunta,
    procesarCrearPregunta,
    preguntasSinResponder,
    getPregunta,
    procesarCrearRespuesta,
    procesarVoto,
    procesarVotoRespuesta,
    buscaPregunta,
    preguntasEtiqueta
}