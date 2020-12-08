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
    if (request.session.nombreUsuario != null) {
        response.redirect("/paginaPrincipal");
    } else {
        response.render("login", {
            "errorMsg": null
        });
    }
}

function registro(request, response) {
    response.status(200);
    response.render("registro", {
        msg: null
    });
}

function perfil(request, response) {
    daoUsuario.getUser(request.session.correo, function (info, success) {
        if (success) {
            daoUsuario.getUserQuestionNumber(request.session.correo, function (info, numero) {
                daoUsuario.getUserQuestionNumber(request.session.correo, function (info, respuestas) {
                    response.status(200);
                    response.render("paginaPerfilUsuario", {
                        "usuario": success,
                        "numeroPreguntas": numero.cuenta,
                        "numeroRespuestas": respuestas.cuenta,
                        "imagen": success.FotoPerfil
                    });
                });
            });
        } else {
            response.status(404);
            console.log("No existe ese usuario");
            next(new Error("No encontrado"));
        }
    });
}

function logout(request, response) {
    response.status(200);
    request.session.destroy();
    response.redirect("/login");
}

function paginaPrincipal(request, response) {
    response.status(200);
    if (request.session.nombreUsuario == null) {
        response.redirect("/login");
    } else {
        daoUsuario.getUserImage(request.session.correo, function (err, existe) {
            request.session.imagen = existe.FotoPerfil;
            response.render("paginaPrincipal", {
                "usuario": request.session.nombreUsuario,
                "imagen": existe.FotoPerfil
            });
        });
    }
}

function procesarLogin(request, response) {
    daoUsuario.isUserCorrect(request.body.correo, request.body.password, function (err, existe) {
        if (err) {
            response.status(500);
            console.log("procesarLogin_post" + err);
        } else {
            response.status(200);
            if (existe) {
                daoUsuario.getUserName(request.body.correo, function (err, nombre) {
                    if (err) {
                        console.log("login post\n" + err);
                    } else {
                        request.session.nombreUsuario = nombre;
                        request.session.correo = request.body.correo;
                        response.redirect("/login");
                    }
                });
            } else {
                response.render("login", {
                    errorMsg: "Direccion de correo y/o password no válidos"
                });
            }
        }
    })
}

function usuarioRegistrado(request, response) {
    var usuario = null;
    let msg = null;
    if (request.body.emailUsuario == "" || request.body.password == "" || request.body.passwordConfirm == "" || request.body.nombreMostrar == "") {
        msg= "Revisa los campos obligatorios(*)";
    }
    else{
        if (request.body.password.length < 8) {
            msg ="La contraseña debe tener al menos ocho caracteres.";
        }
        else{
            if (request.body.password != request.body.passwordConfirm) {
                msg= "Las contraseñas deben coincidir.";
            }
            else {
                let arr = request.file.path.split("\\");
                let name = arr[arr.length - 1];
                console.log(name);
                usuario = {
                    "email": request.body.emailUsuario,
                    "password": request.body.password,
                    "nombreMostrar": request.body.nombreMostrar,
                    "fotoPerfil": name
                };

            }
        }
    }
    if (usuario == null) {
        response.render("registro", {
            "msg": msg
        });
    } else {
        daoUsuario.insertarUsuario(usuario, function (err, insertado) {
            if (err) {
                response.status(500);
                console.log(err + "post_usuarioRegistrado");
                response.render("registro", {
                    "msg": "Error al crear usuario"
                })
            } else {
                response.status(200);
                if (insertado) {
                    response.render("login", {
                        "msg": "Usuario creado.",
                        "imagen": request.file.filename
                    })
                } else {
                    response.render("registro", {
                        "msg": "Error al crear usuario"
                    })
                }
            }
        })
    }
}


module.exports = {
    root,
    login,
    registro,
    perfil,
    logout,
    procesarLogin,
    usuarioRegistrado,
    paginaPrincipal,
}