"use strict";

class DAOusuarios{
    constructor(pool){
        this.pool=pool;
    }


    insertarUsuario(usuario, callback){

        this.pool.getConnection(function(error,connection){

            if(error){
                callback(new Error("Error de conexion a la base de datos."), null);
            }else{
                const sql = "INSERT INTO usuarios (ID_usuario, Correo, Contraseña, Nombre, Reputacion, FechaAlta, FotoPerfil) VALUES (?,?,?,?,?,?,?);";
                let userData = [usuario.email, usuario.password, usuario.password, usuario.nombre, usuario.reputacion, usuario.fechaAlta, usuiario.fotoPerfil];
                connection.query(sql, userData, function(){
                    connection.release();
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"),null);
                    }else{
                        callback(null,true);
                    }
                });
            }
        })
    }
}

module.exports = DAOusuarios;