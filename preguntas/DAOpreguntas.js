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

    insertarPregunta(pregunta, callback) {
        this.pool.getConnection(function (error, connection) {
            if (error) {
                callback(new Error("Error de conexion a la base de datos."), null);
            } else {
                var today = new Date();
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = today.getFullYear();


                //PARSEAR EQUIQUETAS

                let etiquetas = '[';

                for (let i = 0; i < pregunta.etiquetas.length; i++) {
                    if (i < pregunta.etiquetas.length - 1) {
                        etiquetas += '{' + '"titulo":' + '"' + pregunta.etiquetas[i] + '"},';
                    } else etiquetas += '{' + '"titulo":' + '"' + pregunta.etiquetas[i] + '"}';

                }
                etiquetas += ']';

                today = yyyy + '/' + mm + '/' + dd;
                const sql = "INSERT INTO preguntas (Titulo, Cuerpo, Equiquetas, ID_Usuario, Fecha, Reputacion, Votos, Visitas) VALUES (?,?,?,?,?,?,?,?);";
                let userData = [pregunta.titulo, pregunta.cuerpo, etiquetas, pregunta.usuario, today, 0, 0, 0];
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

    getPreguntasSinResponder(callback) {
        this.pool.getConnection(function (error, connection) {
            if (error) {
                callback(new Error("Error de conexion a la base de datos."), null);
            }
            else {
                connection.query("SELECT preguntas.ID_Pregunta, preguntas.Titulo, preguntas.Cuerpo, preguntas.Equiquetas, preguntas.Fecha, preguntas.Reputacion, preguntas.ID_Usuario, \
                usuarios.Nombre, usuarios.FotoPerfil FROM preguntas, usuarios WHERE usuarios.Correo = preguntas.ID_Usuario\
                AND (SELECT COUNT(*) FROM respuestas where respuestas.ID_Pregunta = preguntas.ID_Pregunta) = 0 ORDER BY preguntas.Fecha DESC",
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

    getPregunta(id_pregunta, callback) {
        this.pool.getConnection(function (error, connection) {
            if (error) {
                callback(new Error("Error de conexion a la base de datos."), null);
            }
            else {
                connection.query("SELECT preguntas.ID_Pregunta, preguntas.Titulo, preguntas.Votos, preguntas.Visitas, preguntas.Cuerpo, preguntas.Equiquetas, preguntas.Fecha, preguntas.Reputacion, preguntas.ID_Usuario, \
                usuarios.Nombre, usuarios.FotoPerfil FROM preguntas, usuarios WHERE usuarios.Correo = preguntas.ID_Usuario AND preguntas.ID_Pregunta = ?",
                    [id_pregunta],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            callback(null, rows[0]);
                        }
                    });
            }
        });
    }

    getRespuestasPregunta(id_pregunta, callback){
        this.pool.getConnection(function (error, connection) {
            if (error) {
                callback(new Error("Error de conexion a la base de datos."), null);
            }
            else {
                connection.query("SELECT respuestas.Cuerpo, respuestas.Fecha, respuestas.Reputacion, respuestas.Votos, respuestas.ID_Usuario, \
                usuarios.Nombre, usuarios.FotoPerfil FROM respuestas, usuarios WHERE usuarios.Correo = respuestas.ID_Usuario AND respuestas.ID_Pregunta = ?",
                    [id_pregunta],
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
    insertarRespuesta(respuesta, callback) {
        this.pool.getConnection(function (error, connection) {
            if (error) {
                callback(new Error("Error de conexion a la base de datos."), null);
            } else {
                var today = new Date();
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = today.getFullYear();

                today = yyyy + '/' + mm + '/' + dd;
                const sql = "INSERT INTO respuestas (Cuerpo, ID_Usuario, ID_Pregunta, Fecha, Reputacion, Votos) VALUES (?,?,?,?,?,?);";
                let userData = [respuesta.cuerpo, respuesta.usuario, respuesta.pregunta, today, 0, 0];
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

    setVisitas(pregunta, callback){
        this.pool.getConnection(function (error, connection) {
            if (error) {
                callback(new Error("Error de conexion a la base de datos."), null);
            } else {
                const sql = "UPDATE preguntas SET Visitas = Visitas + 1 WHERE preguntas.ID_Pregunta = ?";
                let userData = [pregunta];
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