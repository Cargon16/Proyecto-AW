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
                connection.query("SELECT * FROM preguntas",
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
}

module.exports = DAOpreguntas;