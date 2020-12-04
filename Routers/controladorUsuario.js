"use strict"

const config = require("../config");
const mysql = require("mysql");
const pool = mysql.createPool(config.mysqlConfig);




const UserDAO = require("../usuarios/DAOusuarios");
const userD = new UserDAO(pool);