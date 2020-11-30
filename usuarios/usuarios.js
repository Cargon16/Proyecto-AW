"use strict";

const bodyParser = require("body-parser");
const mysql = require("mysql");
const DAOusuarios = require("./DAOusuarios.js");
const config = require("../config.js");
const express = require("express");
const pool = mysql.createPool(config.mysql);

const daoUsuario = new DAOusuarios(pool);



const usuarios = express.Router();


usuarios.post("/signup", function(request, response){

    request.checkBody("correo", "El email del usuario esta vacio.").isEmail();
    request.checkBody("password", "La contraseña esta vacia.").notEmpty();
    request.checkBody("confirmPassword", "La confirmacion de cotraseña esta vacia").notEmpty();
    request.checkBody("nombre", "El nombre del usuario esta vacio.").notEmpty();
    request.checkBody("perfil", "El email del usuario esta vacio.").notEmpty();

})

