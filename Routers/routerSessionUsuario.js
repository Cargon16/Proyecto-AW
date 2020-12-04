"use strict"

const config = require("../config");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const mysqlSession = require("express-mysql-session");


function usuarioActual (request, response, next) {
    if (request.session.usuarioActual !== undefined) {
        response.locals.usuarioActual = request.session.usuarioActual;
        next();
    } else {
        response.status(200);
        response.render("login", { errorMsg: "Identifíquese para continuar." });
    }
}

module.exports = {
    usuarioActual
}