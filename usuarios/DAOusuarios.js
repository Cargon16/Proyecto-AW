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


            }




        })

    }

}