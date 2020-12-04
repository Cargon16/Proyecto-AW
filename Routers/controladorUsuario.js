"use strict"

const config = require("../config");
const mysql = require("mysql");
const pool = mysql.createPool(config.mysqlConfig);
const express = require('express');



const UserDAO = require("../usuarios/DAOusuarios");
const daoUsuario = new UserDAO(pool);

function root(request, response) {
    response.status(200);
    response.redirect("/login")
}

function login(request, response) {
    response.status(200);
    if (request.session.currentUser != null) {
        response.redirect("/paginaPrincipal");
    } else {
        response.render("login", {
            errorMsg: null
        });
    }
}

function registro(request, response) {
    response.status(200);
    response.render("registro", {
        msg: null
    });
}

function profile(request, response) {
    daoUsuario.getUser(response.locals.emailUsuario, function(info, success) {
        if (success) {
            response.status(200);

            response.render("perfil", {
                usuarioActual: info
            });
        } else {
            response.status(404);
            console.log("No existe ese usuario");
            next(new Error("No encontrado"));
        }
    });
}
