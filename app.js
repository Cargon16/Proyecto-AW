const mysql = require("mysql");
const config = require("./config.js");
const pool = mysql.createPool(config.mysqlConfig);
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const mysqlSession = require("express-mysql-session");

const ficherosestaticos = path.join(__dirname, "public");

const app = express();
const mysqlStore = mysqlSession(session);
const sessionStore = new mysqlStore(config.mysqlConfig);


const middlewareSession = session({
    saveUninitialized: false,
    secret: "foobar34",
    resave: false,
    store: sessionStore
});

app.use(express.static(ficherosestaticos));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "vistas")); //directorio donde van a estas las vistas plantillas
app.use(middlewareSession);

app.use(function (request, response) {

    response.render("login", {errorMsg: null});

});

//  Función que arranca el servidor
app.listen(config.port, function (err) {
    if (err) {
        console.log("ERROR al iniciar el servidor");
    }
    else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
});