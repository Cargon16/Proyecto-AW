"use strict"

const config = require("../config");
const mysql = require("mysql");
const pool = mysql.createPool(config.mysqlConfig);
const express = require('express');



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
                "usuario": request.session.nombreUsuario
            });
        }
    });
}

module.exports = {
    preguntas
}