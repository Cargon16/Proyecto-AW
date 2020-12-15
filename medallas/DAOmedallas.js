"use strict";

class DAOmedallas {
    constructor(pool) {
        this.pool = pool;
    }
    setMedallaPreguntaVotos(pregunta, callback) {
        this.pool.getConnection(function (error, connection) {
            if (error) {
                callback(new Error("Error de conexion a la base de datos."), null);
            }
            else {
                let nombre, metal;
                connection.query("SELECT preguntas.Votos FROM preguntas WHERE preguntas.ID_Pregunta = ?",
                    [pregunta.id],
                    function (err, res) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            switch (res[0].Votos) {
                                case 1: nombre = "Estudiante"; metal = "bronce"; break;
                                case 2: nombre = "Pregunta interesante"; metal = "bronce"; break;
                                case 4: nombre = "Buena pregunta"; metal = "plata"; break;
                                case 6: nombre = "Excelente pregunta"; metal = "oro"; break;
                                default: nombre = "";
                            }
                            if (nombre != "") {
                                var today = new Date();
                                var dd = String(today.getDate()).padStart(2, '0');
                                var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                                var yyyy = today.getFullYear();

                                today = yyyy + '/' + mm + '/' + dd;
                                connection.query("INSERT INTO medallas (Metal, Nombre, id_usuario, Fecha) VALUES (?,?,?,?);",
                                    [metal, nombre, pregunta.usuarioActual, today],
                                    function (err, rows) {
                                        if (err) {
                                            callback(new Error("Error de acceso a la base de datos"));
                                        }
                                        else {
                                            callback(null, true);
                                        }
                                    });
                            }
                            else callback(null, true);
                        }
                    });
            }
        });
    }
    setMedallaPreguntaVisitas(pregunta, callback) {
        this.pool.getConnection(function (error, connection) {
            if (error) {
                callback(new Error("Error de conexion a la base de datos."), null);
            }
            else {
                let nombre, metal;
                switch (pregunta.Visitas) {
                    case 2: nombre = "Pregunta popular"; metal = "bronce"; break;
                    case 4: nombre = "Pregunta destacada"; metal = "plata"; break;
                    case 6: nombre = "Pregunta famosa"; metal = "oro"; break;
                    default: nombre = "";
                }
                if (nombre != "") {
                    var today = new Date();
                    var dd = String(today.getDate()).padStart(2, '0');
                    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                    var yyyy = today.getFullYear();

                    today = yyyy + '/' + mm + '/' + dd;
                    connection.query("INSERT INTO medallas (Metal, Nombre, id_usuario, Fecha) VALUES (?,?,?,?);",
                        [metal, nombre, pregunta.ID_Usuario, today],
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
                else callback(null, true);
            }
        });
    }
    setMedallaRespuestaVotos(respuesta, callback) {
        this.pool.getConnection(function (error, connection) {
            if (error) {
                callback(new Error("Error de conexion a la base de datos."), null);
            }
            else {
                let nombre, metal;
                connection.query("SELECT respuestas.Votos FROM respuestas WHERE respuestas.ID_Respuesta = ?",
                    [respuesta.ID_respuesta],
                    function (err, res) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            switch (res[0].Votos) {
                                case 2: nombre = "Respuesta interesante"; metal = "bronce"; break;
                                case 4: nombre = "Buena respuesta"; metal = "plata"; break;
                                case 6: nombre = "Excelente respuesta"; metal = "oro"; break;
                                default: nombre = "";
                            }
                            if (nombre != "") {
                                var today = new Date();
                                var dd = String(today.getDate()).padStart(2, '0');
                                var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                                var yyyy = today.getFullYear();

                                today = yyyy + '/' + mm + '/' + dd;
                                connection.query("INSERT INTO medallas (Metal, Nombre, id_usuario, Fecha) VALUES (?,?,?,?);",
                                    [metal, nombre, respuesta.usuarioActual, today],
                                    function (err, rows) {
                                        if (err) {
                                            callback(new Error("Error de acceso a la base de datos"));
                                        }
                                        else {
                                            callback(null, true);
                                        }
                                    });
                            }
                            else callback(null, true);
                        }
                    });
            }
        });
    }
}
module.exports = DAOmedallas;