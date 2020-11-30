const mysql = require("mysql");
const config = require("./config.js");
const express = require("express");
const app = express;
const medallas =  require("./preguntas/preguntas.js");
const preguntas = require("./preguntas/preguntas.js");
const usuarios = require("./usuarios/usuarios.js");

const pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});


