const pgp = require('pg-promise')();

const dbConfig = {
    user: process.env.PGUSER,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    ssl: {
        rejectUnauthorized: false
    }
};

module.exports.handler = async (event) => {
    console.log('event', event)
    try {
        const db = pgp(dbConfig);
        //var obj_datos = JSON.parse(event.body);
        var obj_header = event.headers;
        var obj_datos = event.pathParameters;
        console.log('obj_datos', obj_datos)
        if(!obj_datos.arr_ids){
            return {
                statusCode : 500,
                body : JSON.stringify({
                    message:"Datos Invalidos!",
                    type : "error"
                })
            }
        }
        //VALDIAR SI EXISTE EL CODIGO
        const queryValid = `UPDATE maestros_generales SET bit_borrado = TRUE, dt_fecha_eliminar ='${new Date().toISOString()}' , str_usuario_eliminar = '${obj_header.str_usuario}' WHERE int_id IN (${obj_datos.arr_ids})`;
        

        var result = await db.query(queryValid);


        return {
            statusCode: 200,
            body: JSON.stringify(result)
        };
        
    } catch (error) {
        console.log('error', error)
        return {
            statusCode : 500,
            body : JSON.stringify({
                message:"Error al registrar la información "+error,
                type : "error"
            })
        }
    }
};
  