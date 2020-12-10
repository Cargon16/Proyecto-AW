"use strict"

const config = require("../config");
const mysql = require("mysql");
const pool = mysql.createPool(config.mysqlConfig);
const express = require('express');
const usuariosDAO = require("../usuarios/DAOusuarios");
const daoUsuarios = new usuariosDAO(pool);
const preguntasDAO = require("../preguntas/DAOpreguntas");
const daoPreguntas = new preguntasDAO(pool);

function preguntas(request, response) {
    daoPreguntas.getPreguntas(function(err, preguntas) {
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

function creaPregunta(request, response){
    response.status(200);
    response.render("paginaFormularPregunta", {
        msg: null,
        "usuario": request.session.nombreUsuario,
        "correo": request.session.correo,
        "imagen": request.session.imagen
    });
}


function procesarCrearPregunta(request, response){

    var pregunta = null;
    let msg = null;
    

    if(request.body.titulo == "" || request.body.cuerpo == "" || request.body.etiquetas == ""){
        msg = "Revisa los campos vacios.";
    }else{
        console.log(request);
       
        if(etiquetasDivididas.length > 5){
            msg = "Solo puedes introducir hasta 5 etiquetas."
        }else{
            pregunta ={
                "titulo": request.body.titulo,
                "cuerpo": request.body.cuerpo,
                "etiquetas": request.body.etiquetas,
                "usuario": request.session.correo
            };
        }
    }
    if(usuario==null){
        response.render("paginaFormularPregunta", {
            "msg": msg
        });
    }else{
        daoPreguntas.insertarPregunta(pregunta, function(err, insertado){
            if(err){
                response.status(500);
                console.log(err + " post_preguntaInsertada");
                response.render("paginaFormularPregunta", {
                    "msg":"Error al crear pregunta"
                })
            }else{
                response.status(200);
                if(insertado){
                    response.render("paginaTodasPreguntas",{
                        "msg":"Pregunta creada.",
                    })
                }else{
                    response.render("paginaFormularPregunta",{
                        "msg":"Error al crear pregunta"
                    })
                }
            }
        })
    }

}

module.exports = {
    preguntas,
    creaPregunta,
    procesarCrearPregunta,
}