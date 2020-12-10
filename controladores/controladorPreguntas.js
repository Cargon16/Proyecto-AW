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

function crearPregunta(request, response){
    console.log("HOLAAAAAAAAAA");
    response.status(200);
    response.render("paginaFormularPregunta", {
        msg: null
    });
}


module.exports = {
    preguntas,
    crearPregunta
}