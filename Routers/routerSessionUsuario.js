"use strict"

const config = require("../config");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const mysqlSession = require("express-mysql-session");


function usuarioActual (request, response, next) {
    if (request.session.nombreUsuario !== undefined) {
        response.locals.nombreUsuario = request.session.nombreUsuario;
        next();
    } else {
        response.status(200);
        response.render("login", { errorMsg: "Identifíquese para continuar." });
    }
}

module.exports = {
    usuarioActual
}