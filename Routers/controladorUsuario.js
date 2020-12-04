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

function perfil(request, response) {
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

function logout(request, response){
    response.status(200);
    response.session.destroy();
    response.redirect("/login");
}

function procesarLogin(request, response){
    daoUsuario.isUserCorrect(request.locals.emailUsuario, request.locals.password, function(err, existe){
        if(err){
            response.status(500);
            console.log("procesarLogin_post" + err);
            next(err);
        }else{
            response.status(200);
            if(existe){
                request.session.usuarioActual = request.locals.emailUsuario;
            }else{
                response.render("preocesarLogin",{
                    errorMsg: "Direccion de correo y/o password no validos"
                })
            }
        }
    })
}

function usuarioRegistrado(request, response){
    var usuario;
        if(request.body.emailUsuario == "" || request.body.password == "" || request.body.passwordConfirm == "" || request.body.nombreMostrar == ""){
            usuario = null;

        }else{
            var imagen = null;
            //aqui iria lo de la imagen
            /**
             * if (request.file) {
                imageName = request.file.filename;
                 }
             */

             usuario = {
                 "email" : request.body.emailUsuario,
                 "password" : request.body.password,
                 "nombreMostrar" : request.body.nombreMostrar,
                 "fotoPerfil" : imagen
             };

        }
    if(usuario == null){
        response.render("registro", {
            msg: "Revisa los campos obligatorios(*)"
        });
    }else{
        daoUsuario.insertarUsuario(usuario, function(err, insertado){
            if(err){
                response.status(500);
                console.log(err + "post_usuarioRegistrado");
                next(err);
            }else{
                response.status(200);
                if(insertado){
                    response.render("registro",{
                        msg: "Usuario creado."
                    })
                }else{
                    response.render("registro",{
                        msg: "Error al crear usuario"
                    })
                }
            }
        })
    }
}

module.exports={
    root,
    login,
    registro,
    perfil,
    logout,
    procesarLogin,
    usuarioRegistrado
}