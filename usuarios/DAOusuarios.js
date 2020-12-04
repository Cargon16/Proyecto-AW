"use strict";

class DAOusuarios {
    constructor(pool) {
        this.pool = pool;
    }


    insertarUsuario(usuario, callback) {

        this.pool.getConnection(function (error, connection) {
            if (error) {
                callback(new Error("Error de conexion a la base de datos."), null);
            } else {
                var today = new Date();
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = today.getFullYear();

                today = yyyy + '/' + mm + '/' + dd;
                const sql = "INSERT INTO usuarios (Correo, Contraseña, Nombre, Reputacion, FechaAlta, FotoPerfil) VALUES (?,?,?,?,?,?);";
                let userData = [usuario.email, usuario.password, usuario.nombreMostrar, 0, today, usuario.fotoPerfil];
                connection.query(sql, userData, function (err, result) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"), null);
                    } else {
                        callback(null, true);
                        console.log(result.insertId);
                    }
                });
            }
        })
    }
}

module.exports = DAOusuarios;