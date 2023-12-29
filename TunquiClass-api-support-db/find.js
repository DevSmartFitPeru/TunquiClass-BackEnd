const pgp = require('pg-promise')();
// Configura el cliente PostgreSQL
const dbConfig = {
    user: process.env.PGUSER,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT, // Puerto por defecto de PostgreSQL,
    ssl: {
        rejectUnauthorized: false
    }
};

module.exports.handler = async (event) => {
  try {
    const datos = JSON.parse(event.body);
    
    if(datos || datos.length > 0){

      const db = pgp(dbConfig);

      //var campos = datos.campos;
      var nombre_tabla = datos.nombre_tabla;
      var condicion = datos.condicion;

      if(!condicion){
        var query = `SELECT * FROM ${nombre_tabla}`;
      }else{
        var query = `SELECT * FROM ${nombre_tabla} WHERE ${condicion}`;
      }
      
      var result = await db.query(query);

      return {
          statusCode: 200,
          body: JSON.stringify(result),
      };         

    }else{
      return {
        statusCode : 500,
        body : JSON.stringify({
            message:"Campos vacios",
            type : "error"
        })
      };
    }
    
  } catch (error) {
    console.log('error', error)
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          message: "Error en el sistema",
          type : "error"
        }
      ),
    };
  }
  
};