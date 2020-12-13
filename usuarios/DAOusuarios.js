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
                    }
                });
            }
        })
    }

    isUserCorrect(email, password, callback) {

        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT * FROM usuarios WHERE Correo = ? AND Contraseña = ?",
                    [email, password],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (rows.length === 0) {
                                callback(null, false); //no está el usuario con el password proporcionado
                            }
                            else {
                                callback(null, true);
                            }
                        }
                    });
            }
        }
        );
    }

    getUser(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT * FROM usuarios WHERE Correo = ?",
                    [email],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (rows.length === 0) {
                                callback(null, false); //no está el usuario
                            }
                            else {
                                callback(null, rows[0]);
                            }
                        }
                    });
            }
        }
        );
    }
    getUserName(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT Nombre FROM usuarios WHERE Correo = ?",
                    [email],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (rows.length === 0) {
                                callback(null, false); //no está el usuario
                            }
                            else {
                                callback(null, rows[0]);
                            }
                        }
                    });
            }
        }
        );
    }

    getUserImage(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT FotoPerfil FROM usuarios WHERE Correo = ?",
                    [email],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (rows.length === 0) {
                                callback(null, false); //no está el usuario
                            }
                            else {
                                callback(null, rows[0]);
                            }
                        }
                    });
            }
        }
        );
    }

    getUserQuestionNumber(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT COUNT(*) AS cuenta FROM preguntas WHERE ID_Usuario = ?",
                    [email],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (rows.length === 0) {
                                callback(null, false); //no está el usuario
                            }
                            else {
                                callback(null, rows[0]);
                            }
                        }
                    });
            }
        }
        );
    }
    getUserAnswerNumber(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT COUNT(*) AS cuenta FROM respuestas WHERE ID_Usuario = ?",
                    [email],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (rows.length === 0) {
                                callback(null, false); //no está el usuario
                            }
                            else {
                                callback(null, rows[0]);
                            }
                        }
                    });
            }
        }
        );
    }

    setUserReputation(pregunta, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("UPDATE usuarios SET Reputacion = Reputacion + ? WHERE Correo = ?",
                    [pregunta.v, pregunta.usuario],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            callback(null, true);
                        }
                    });
            }
        }
        );
    }
    hasUserVoteThatQuestion(pregunta, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT *  FROM votospreguntas WHERE ID_Usuario = ? AND ID_Pregunta = ?",
                    [pregunta.usuario, pregunta.id],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (rows.length == 0) {
                                let consulta = "INSERT INTO votospreguntas (ID_Usuario, ID_Pregunta) VALUES (?,?);";
                                let valores = [pregunta.usuario, pregunta.id];
                                connection.query(consulta, valores,
                                    function (err) {
                                        if (err) {
                                            callback(new Error("Error de acceso a la base de datos"));
                                        }
                                        else
                                            callback(null, false);
                                    });
                            }
                            else {
                                callback(null, true);
                            }

                        }
                    });
            }
        }
        );
    }
}

module.exports = DAOusuarios;