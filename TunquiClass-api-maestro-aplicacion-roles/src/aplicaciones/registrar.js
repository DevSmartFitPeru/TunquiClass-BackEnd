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
        var obj_datos = JSON.parse(event.body);
        
        if(!obj_datos){
            return {
                statusCode : 500,
                body : JSON.stringify({
                    message:"Datos Invalidos!",
                    type : "error"
                })
            }
        }

        obj_datos.bit_borrado = false;
        obj_datos.dt_fecha_registrar = new Date();

        const keys_principal = Object.keys(obj_datos);
        const textoItems = keys_principal.map((key, index) => `$${index + 1}`).join(', ');
        const keys = Object.keys(obj_datos).join(', ');
        const values = keys_principal.map(key => obj_datos[key]);
        const query = `INSERT INTO aplicaciones (${keys}) VALUES (${textoItems}) RETURNING int_id`;

        var result = await db.one(query, values);

        return {
            statusCode: 200,
            body: JSON.stringify(result)
        };
        
    } catch (error) {
        console.log('error', error)
        return {
            statusCode : 500,
            body : JSON.stringify({
                message:"Error al registrar la aplicacion "+error,
                type : "error"
            })
        }
    }
};
  