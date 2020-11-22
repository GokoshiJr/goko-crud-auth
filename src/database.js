const mysql = require('mysql');
const { promisify } = require("util");
const { database } = require("./keys");
/*
  Para generar la conexion con mysql
  cratePool (para produccion) usa hilos para hacer tareas en secuencia 
*/
const pool = mysql.createPool(database);
pool.getConnection((err, conexi) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Se perdio la conexión con la bd");
    }
    if (err.code === "ERR_CON_COUNT_ERROR") {
      console.error("La bd tiene alguna conexión")
    }
    if (err.code === "DATABASE_CONNECTION_WAS_REFUSE") {
      console.error("Conexión rechazada")
    }
  }
  if (conexi) {
    conexi.release();
    console.log("La bd está conectada");
  }
  return
}); // lo llamamos aqui para no iniciarla cuando hagamos querys
/*
  Por defecto pool solo utiliza callbacks
  Importamos promisify para usar promesas/async/await
  Solo le pasamos los querys (las peticiones a las bd)
*/
pool.query = promisify(pool.query)
module.exports = pool;