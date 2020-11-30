const mysql = require("mysql");
const { promisify } = require("util");
const { database } = require("./keys");
/*
  Para generar la conexion con mysql
  cratePool (para produccion) usa hilos para hacer tareas en secuencia 
*/
const pool = mysql.createPool(database);
pool.getConnection((err, conexi) => {
  if (err) {
    console.log(global.linea);
    console.log(` Error to Connect MySql \n Code: ${err.code} \n Errno: ${err.errno} \n SqlMessage: ${err.sqlMessage} \n Sql State: ${err.sqlState}`);
    console.log(global.linea);
    console.log(" Please Check the Connection");
  }
  if (conexi) {
    conexi.release(); // lanza la conexion
    const db_info = {
      port: conexi.config.port,
      host: conexi.config.host,
      name: conexi.config.database,
    };
    console.log(
      ` Mysql Conection Succesfully \n DB Name: ${db_info.name} \n DB Host: ${db_info.host} \n DB Port: ${db_info.port}`
    );
    console.log(global.linea);
  }
  return;
}); // lo llamamos aqui para no iniciarla cuando hagamos querys
/*
  Por defecto pool solo utiliza callbacks
  Importamos promisify para usar promesas/async/await
  Solo le pasamos los querys (las peticiones a las bd)
*/
pool.query = promisify(pool.query);
module.exports = pool;
