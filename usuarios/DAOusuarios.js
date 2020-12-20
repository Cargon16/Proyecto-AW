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
                let userData = [usuario.email, usuario.password, usuario.nombreMostrar, 1, today, usuario.fotoPerfil];
                connection.query(sql, userData, function (err, result) {
                    connection.release();
                    if (err) {
                        callback(new Error("Ese correo ya está en uso"), null);
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
                connection.query("UPDATE usuarios SET Reputacion = GREATEST(1, Reputacion + ?) WHERE Correo = ?",
                    [pregunta.v, pregunta.usuarioActual],
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
                    [pregunta.usuarioLoggueado, pregunta.id],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (rows.length == 0) {
                                let consulta = "INSERT INTO votospreguntas (ID_Usuario, ID_Pregunta) VALUES (?,?);";
                                let valores = [pregunta.usuarioLoggueado, pregunta.id];
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


    hasUserVoteThatAnswer(respuesta, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT *  FROM votosrespuesta WHERE ID_Usuario = ? AND ID_Respuesta = ?",
                    [respuesta.usuarioLoggueado, respuesta.ID_respuesta],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (rows.length == 0) {
                                let consulta = "INSERT INTO votosrespuesta (ID_Usuario, ID_Respuesta) VALUES (?,?);";
                                let valores = [respuesta.usuarioLoggueado, respuesta.ID_respuesta];
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

    getUsuarios(callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                //connection.query("SELECT * FROM usuarios;",
                connection.query("SELECT (SELECT tag.tag  FROM tag LEFT JOIN preguntas ON tag.ID_Pregunta=preguntas.ID_Pregunta\
                    WHERE preguntas.ID_Usuario=u1.Correo GROUP BY tag ORDER BY tag DESC LIMIT 1) AS tag, u1.Correo, u1.Nombre, u1.Reputacion, u1.FotoPerfil\
                    FROM usuarios u1;",
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
        }

        );
    }

    getUsuariosMedallas(id_Usuario, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT medallas.Metal, medallas.Nombre FROM medallas WHERE id_usuario = ?",
                    [id_Usuario],
                    function (err, rows) {

                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            let medallas = tratarMedallas(rows);
                            callback(null, medallas);
                        }
                    });
            }
        }

        );
    }

    getUsuarioFiltrado(nombreUsuario, callback) {

        let nombre = "%" + nombreUsuario + "%";
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                //connection.query("SELECT * FROM usuarios;",
                connection.query("SELECT (SELECT tag.tag  FROM tag LEFT JOIN preguntas ON tag.ID_Pregunta=preguntas.ID_Pregunta\
                        WHERE preguntas.ID_Usuario=u1.Correo GROUP BY tag ORDER BY tag DESC LIMIT 1) AS tag, u1.Correo, u1.Nombre, u1.Reputacion, u1.FotoPerfil\
                        FROM usuarios u1 WHERE u1.Nombre LIKE ?;", [nombre],
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
        }
        );
    }
    hasVoteQuestion(pregunta,callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT *  FROM votospreguntas WHERE ID_Usuario = ? AND ID_Pregunta = ?",
                    [pregunta.usuarioLoggueado, pregunta.id],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (rows.length == 0) {
                                callback(null, false);
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
function tratarMedallas(filas) {
    let todoMedallas = {};
    let medallas = [];
    let contBronce = 0, contPlata = 0, contOro = 0;
    for (let f = 0; f < filas.length; f++) {
        let medalla = {};

        if (medallas.some(n => n.Nombre === filas[f].Nombre)) { //si esa medalla ya se ha insertado 
            let t = medallas.filter(n => n.Nombre === filas[f].Nombre);   //se busca en el array
            t[0].num++;
        } else {  //si no está en el array, se crea un objeto nuevo y se inserta
            medalla.Nombre = filas[f].Nombre;
            medalla.Metal = filas[f].Metal;
            medalla.num = 1;
            medallas.push(medalla);
        }
        switch (filas[f].Metal) {
            case "bronce": contBronce++; break;
            case "plata": contPlata++; break;
            case "oro": contOro++; break;
        }
    }
    todoMedallas = { "contBronce": contBronce, "contPlata": contPlata, "contOro": contOro, "medallas": medallas };
    return todoMedallas;
}
module.exports = DAOusuarios;