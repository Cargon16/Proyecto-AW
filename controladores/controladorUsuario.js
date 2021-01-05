"use strict"

const config = require("../config");
const mysql = require("mysql");
const pool = mysql.createPool(config.mysqlConfig);
const express = require('express');
const fs = require("fs");


const UserDAO = require("../usuarios/DAOusuarios");
const daoUsuario = new UserDAO(pool);

function root(request, response) {
    response.status(200);
    response.redirect("/login");
}

function login(request, response) {
    response.status(200);
    if (request.session.nombreUsuario != null) {
        response.redirect("/paginaPrincipal");
    } else {
        response.render("login", {
            msg: ""
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
    daoUsuario.getUser(request.body.ident, function (info, success) {
        if (success) {
            daoUsuario.getUserQuestionNumber(request.body.ident, function (info, numero) {
                daoUsuario.getUserAnswerNumber(request.body.ident, function (info, respuestas) {
                    daoUsuario.getUsuariosMedallas(request.body.ident, function (info, medallas) {
                        response.status(200);
                        response.render("paginaPerfilUsuario", {
                            "usuario": success,
                            "numeroPreguntas": numero.cuenta,
                            "numeroRespuestas": respuestas.cuenta,
                            "correo": request.session.correo,
                            "usuarioActual": request.session.nombreUsuario,
                            "imagen": request.session.imagen,
                            "todoMedallas": medallas
                        });
                    });
                });
            });
        } else {
            response.status(404);
            response.render("error404", {
                "usuarioActual": request.session.nombreUsuario,
                "imagen": request.session.imagen,
            });
        }
    });
}

function logout(request, response) {
    response.status(200);
    request.session.destroy();
    response.redirect("/login");
}

function paginaPrincipal(request, response, next) {
    response.status(200);
    if (request.session.nombreUsuario == null) {
        response.redirect("/login");
    } else {
        daoUsuario.getUserImage(request.session.correo, function (err, existe) {
            if (err) {
                next(err);
            }
            else {
                request.session.imagen = existe.FotoPerfil;
                response.render("paginaPrincipal", {
                    "usuarioActual": request.session.nombreUsuario,
                    "correo": request.session.correo,
                    "imagen": existe.FotoPerfil
                });
            }
        });
    }
}

function procesarLogin(request, response, next) {
    daoUsuario.isUserCorrect(request.body.correo, request.body.password, function (err, existe) {
        if (err) {
            next(err);
            console.log("procesarLogin_post" + err);
        } else {
            response.status(200);
            if (existe) {
                daoUsuario.getUserName(request.body.correo, function (err, nombre) {
                    if (err) {
                        next(err);
                        console.log("login post\n" + err);
                    } else {
                        request.session.nombreUsuario = nombre;
                        request.session.correo = request.body.correo;
                        response.redirect("/login");
                    }
                });
            } else {
                response.render("login", {
                    msg: "Dirección de correo y/o password no válidos"
                });
            }
        }
    })
}

function usuarioRegistrado(request, response, next) {
    var usuario = null;
    let msg = null;


    var ranNum = Math.floor(Math.random() * 2);
    let name;
    if (request.file != null) {
        let arr = request.file.path.split("\\");
        name = arr[arr.length - 1];

    } else {
        let files = fs.readdirSync("./public/imagenPre");
        fs.copyFile('./public/imagenPre/' + files[ranNum], './public/imagen/' + files[ranNum], (err) => {
            if (err) throw err;
            else
                fs.rename('./public/imagen/' + files[ranNum], './public/imagen/' + request.body.emailUsuario + '.png', function (err) {
                    if (err) console.log('ERROR: ' + err);
                });
        });

        name = request.body.emailUsuario + '.png';
    }

    usuario = {
        "email": request.body.emailUsuario,
        "password": request.body.password,
        "nombreMostrar": request.body.nombreMostrar,
        "fotoPerfil": name
    };

    if (usuario == null) {
        response.render("registro", {
            "msg": msg
        });
    } else {
        daoUsuario.insertarUsuario(usuario, function (err, insertado) {
            if (err) {
                console.log(err + " post_usuarioRegistrado");
                response.render("registro", {
                    "msg": err
                })
            } else {
                response.status(200);
                if (insertado) {
                    response.redirect("/login");
                } else {
                    response.render("registro", {
                        "msg": "Error al crear usuario"
                    })
                }
            }
        })
    }
}

function usuarios(request, response, next) {
    daoUsuario.getUsuarios(function (err, usuarios) {
        if (err) {
            next(err);
            console.log("getUsuarios_post" + err);
        } else {

            response.render("usuarios", {
                "Usuarios": usuarios,
                "usuarioActual": request.session.nombreUsuario,
                "correo": request.session.correo,
                "imagen": request.session.imagen
            });
        }
    })
}

function busquedaUsuario(request, response, next) {
    daoUsuario.getUsuarioFiltrado(request.body.nameUsuario, function (err, usuarios) {
        if (err) {
            next(err);
            console.log("busquedausuario_post" + err);
        } else {

            response.render("usuarios", {
                "Usuarios": usuarios,
                "usuarioActual": request.session.nombreUsuario,
                "correo": request.session.correo,
                "imagen": request.session.imagen
            });
        }
    })

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
    usuarios,
    busquedaUsuario
}