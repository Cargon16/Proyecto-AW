"use strict";

class DAOpreguntas {
    constructor(pool) {
        this.pool = pool;
    }


    getPreguntas(callback) {

        this.pool.getConnection(function (error, connection) {
            if (error) {
                callback(new Error("Error de conexion a la base de datos."), null);
            }
            else {
                connection.query("SELECT preguntas.ID_Pregunta, preguntas.Titulo, preguntas.Cuerpo, preguntas.Equiquetas, preguntas.Fecha, preguntas.Reputacion, preguntas.ID_Usuario, \
                usuarios.Nombre, usuarios.FotoPerfil FROM preguntas, usuarios WHERE usuarios.Correo = preguntas.ID_Usuario ORDER BY preguntas.Fecha DESC",
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            callback(null, rows);
                        }
                    });
            }
        });
    }

    insertarPregunta(pregunta, callback){
        this.pool.getConnection(function (error, connection) {
            if (error) {
                callback(new Error("Error de conexion a la base de datos."), null);
            } else {
                var today = new Date();
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = today.getFullYear();

                
                //PARSEAR EQUIQUETAS

                let etiquetas= '[';

                for (let i = 0; i < pregunta.etiquetas.length; i++) {
                    if(i<pregunta.etiquetas.length-1){
                        etiquetas += '{' + '"titulo":'+ '"'+pregunta.etiquetas[i] + '"},';
                    }else etiquetas += '{' + '"titulo":'+ '"'+pregunta.etiquetas[i] + '"}';
                   
                }
                etiquetas+=']';
                
                today = yyyy + '/' + mm + '/' + dd;
                const sql = "INSERT INTO preguntas (Titulo, Cuerpo, Equiquetas, ID_Usuario, Fecha, Reputacion) VALUES (?,?,?,?,?,?);";
                let userData = [pregunta.titulo, pregunta.cuerpo, etiquetas, pregunta.usuario, today, 0];
                connection.query(sql, userData, function (err, result) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"), null);
                    } else {
                        callback(null, true);
                    }
                });
            }
        })
    }
}

module.exports = DAOpreguntas;