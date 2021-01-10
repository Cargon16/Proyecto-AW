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
                connection.query("SELECT preguntas.ID_Pregunta, preguntas.Titulo, preguntas.Visitas, preguntas.Votos, preguntas.Cuerpo, preguntas.Fecha, preguntas.Reputacion, preguntas.ID_Usuario, \
                usuarios.Nombre, usuarios.FotoPerfil, tag.tag FROM preguntas LEFT JOIN tag ON preguntas.ID_Pregunta = tag.ID_Pregunta LEFT JOIN usuarios ON preguntas.ID_Usuario = usuarios.Correo ORDER BY preguntas.Fecha DESC",
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            let preguntas = tratarTareas(rows);
                            callback(null, preguntas);
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

                today = yyyy + '/' + mm + '/' + dd;

                const sql = "INSERT INTO preguntas (Titulo, Cuerpo, ID_Usuario, Fecha, Reputacion, Votos, Visitas) VALUES (?,?,?,?,?,?,?);";
                let userData = [pregunta.titulo, pregunta.cuerpo, pregunta.usuarioActual, today, 0, 0, 0];
                connection.query(sql, userData, function (err, result) {
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos 1"), null);
                    } else {
                        let tags = tratarTag(pregunta.etiquetas);

                        for (let i = 0; i < tags.length; ++i) {
                            const sql1 = "INSERT INTO tag (ID_Pregunta, tag) VALUES (?,?);";
                            let userData1 = [result.insertId, tags[i]];
                            connection.query(sql1, userData1, function (err, result) {
                                if (err) {
                                    callback(new Error("Error de acceso a la base de datos"), null);
                                }
                            });
                        }
                        connection.release();
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
                connection.query("SELECT preguntas.ID_Pregunta, preguntas.Titulo, preguntas.Visitas, preguntas.Votos, preguntas.Cuerpo, preguntas.Fecha, preguntas.Reputacion, preguntas.ID_Usuario, \
                usuarios.Nombre, usuarios.FotoPerfil, tag.tag FROM preguntas LEFT JOIN tag ON preguntas.ID_Pregunta = tag.ID_Pregunta LEFT JOIN usuarios ON preguntas.ID_Usuario = usuarios.Correo WHERE (SELECT COUNT(*) FROM respuestas where respuestas.ID_Pregunta = preguntas.ID_Pregunta) = 0 ORDER BY preguntas.Fecha DESC",
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            let preguntas = tratarTareas(rows);
                            callback(null, preguntas);
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
                connection.query("SELECT preguntas.ID_Pregunta, preguntas.Titulo, preguntas.Visitas, preguntas.Votos, preguntas.Cuerpo, preguntas.Fecha, preguntas.Reputacion, preguntas.ID_Usuario, \
                usuarios.Nombre, usuarios.FotoPerfil, GROUP_CONCAT(tag.tag) 'tags' FROM usuarios, preguntas, tag WHERE tag.ID_Pregunta = preguntas.ID_Pregunta AND usuarios.Correo = preguntas.ID_Usuario AND preguntas.ID_Pregunta = ?",
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

    getRespuestasPregunta(id_pregunta,usuarioLoggueado, callback) {
        this.pool.getConnection(function (error, connection) {
            if (error) {
                callback(new Error("Error de conexion a la base de datos."), null);
            }
            else {
                connection.query("SELECT respuestas.ID_Respuesta, respuestas.Cuerpo, respuestas.Fecha, respuestas.Reputacion, respuestas.Votos, respuestas.ID_Usuario, \
                usuarios.Nombre, usuarios.FotoPerfil, CASE WHEN (SELECT COUNT(ID_Usuario) FROM votosrespuesta WHERE votosrespuesta.ID_Respuesta = respuestas.ID_Respuesta AND votosrespuesta.ID_Usuario = ?) > 0 THEN 1 ELSE 0 END AS votado FROM respuestas, usuarios WHERE usuarios.Correo = respuestas.ID_Usuario AND respuestas.ID_Pregunta = ?",
                    [usuarioLoggueado, id_pregunta],
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
                let userData = [respuesta.cuerpo, respuesta.usuarioActual, respuesta.pregunta, today, 0, 0];
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

    setVisitas(pregunta, callback) {
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

    setVotosPregunta(info, callback) {
        this.pool.getConnection(function (error, connection) {
            if (error) {
                callback(new Error("Error de conexion a la base de datos."), null);
            } else {
                const sql = "UPDATE preguntas SET Votos = Votos + 1 WHERE preguntas.ID_Pregunta = ?";
                let userData = [info.id];
                connection.query(sql, userData, function (err, result) {
                    //connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"), null);
                    } else {
                        let consulta = "UPDATE preguntas SET Reputacion = Reputacion + ? WHERE preguntas.ID_Pregunta = ?";
                        let valores = [info.puntuacion, info.id];
                        connection.query(consulta, valores, function (err) {
                            connection.release();
                                if (err) {
                                    callback(new Error("Error de acceso a la base de datos 1"));
                                }
                                else
                                    callback(null);
                            });
                    }
                });
            }
        })
    }


    setVotosRespuesta(info, callback) {

        this.pool.getConnection(function (error, connection) {
            if (error) {
                callback(new Error("Error de conexion a la base de datos."), null);
            } else {
                const sql = "UPDATE respuestas SET Votos = Votos + 1 WHERE ID_Respuesta = ?";
                let userData = [info.ID_respuesta];
                connection.query(sql, userData, function (err, result) {
                    //connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"), null);
                    } else {
                        let consulta = "UPDATE respuestas SET Reputacion = Reputacion + ? WHERE ID_Respuesta = ?";
                        let valores = [info.puntuacion, info.ID_respuesta];
                        connection.query(consulta, valores, function (err) {
                            connection.release();
                                if (err) {
                                    callback(new Error("Error de acceso a la base de datos 1"));
                                }
                                else
                                    callback(null);
                            });
                    }
                });
            }
        })
    }
    getPreguntaFiltrada(filtro, callback) {
        this.pool.getConnection(function (error, connection) {
            if (error) {
                callback(new Error("Error de conexion a la base de datos."), null);
            } else {
                let filtrado = "%" + filtro + "%";
                connection.query("SELECT preguntas.ID_Pregunta, preguntas.Titulo, preguntas.Visitas, preguntas.Votos, preguntas.Cuerpo, preguntas.Fecha, preguntas.Reputacion, preguntas.ID_Usuario, \
                usuarios.Nombre, usuarios.FotoPerfil, tag.tag FROM preguntas LEFT JOIN tag ON preguntas.ID_Pregunta = tag.ID_Pregunta LEFT JOIN usuarios ON preguntas.ID_Usuario = usuarios.Correo WHERE preguntas.Titulo LIKE ? OR preguntas.Cuerpo LIKE ? ORDER BY preguntas.Fecha DESC",
                 [filtrado, filtrado],
                  function (err, result) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"), null);
                    } else {
                        let preguntas = tratarTareas(result);
                        callback(null, preguntas);
                    }
                });
            }
        })
    }

    getPreguntaPorEtiqueta(tag, callback){
        this.pool.getConnection(function (error, connection) {
            if (error) {
                callback(new Error("Error de conexion a la base de datos."), null);
            } else {
                connection.query("SELECT preguntas.ID_Pregunta, preguntas.Titulo, preguntas.Visitas, preguntas.Votos, preguntas.Cuerpo, preguntas.Fecha, preguntas.Reputacion, preguntas.ID_Usuario,\
                usuarios.Nombre, usuarios.FotoPerfil, tag.tag FROM preguntas LEFT JOIN tag ON preguntas.ID_Pregunta = tag.ID_Pregunta LEFT JOIN usuarios ON preguntas.ID_Usuario = usuarios.Correo WHERE ? = SOME(SELECT tag.tag FROM tag WHERE tag.ID_Pregunta = preguntas.ID_Pregunta) ORDER BY preguntas.Fecha DESC",
                 [tag],
                  function (err, result) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"), null);
                    } else {
                        let preguntas = tratarTareas(result);
                        callback(null, preguntas);
                    }
                });
            }
        })
    }
}
function tratarTareas(filas) {
    let tareas = [];

    for (let f = 0; f < filas.length; f++) {
        let tarea = {};

        if (tareas.some(n => n.ID_Pregunta === filas[f].ID_Pregunta)) { //si esa pregunta ya se ha insertado 
            let t = tareas.filter(n => n.ID_Pregunta === filas[f].ID_Pregunta);   //se busca en el array
            t[0].tags.push(filas[f].tag); //se añade la nueva etiqueta a su array de etiquetas
        } else {  //si no está en el array, se crea un objeto nuevo y se inserta
            tarea.ID_Pregunta = filas[f].ID_Pregunta;
            tarea.Titulo = filas[f].Titulo;
            tarea.Cuerpo = filas[f].Cuerpo;
            tarea.Fecha = filas[f].Fecha;
            tarea.Visitas = filas[f].Visitas;
            tarea.Votos = filas[f].Votos;
            tarea.Reputacion = filas[f].Reputacion;
            tarea.ID_Usuario = filas[f].ID_Usuario;
            tarea.Nombre = filas[f].Nombre;
            tarea.FotoPerfil = filas[f].FotoPerfil;
            tarea.tags = [];
            if (filas[f].tag !== null)
                tarea.tags.push(filas[f].tag);

            tareas.push(tarea);
        }
    }

    return tareas;
}

function tratarTag(lista){
    const newArr = []
    const myObj = {}
    
    lista.forEach(el => {
      // comprobamos si el valor existe en el objeto
      if (!(el in myObj)) {
        // si no existe creamos ese valor y lo añadimos al array final, y si sí existe no lo añadimos
        myObj[el] = true
        newArr.push(el)
      }
    })
    return newArr;
}

module.exports = DAOpreguntas;