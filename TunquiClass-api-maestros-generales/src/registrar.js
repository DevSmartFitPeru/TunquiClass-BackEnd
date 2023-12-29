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
        var obj_header = event.headers;
        if(!obj_datos.str_descripcion){
            return {
                statusCode : 500,
                body : JSON.stringify({
                    message:"Datos Invalidos!",
                    type : "error"
                })
            }
        }
        //VALDIAR SI EXISTE EL CODIGO
        const queryValid = `SELECT * FROM v_tablas WHERE str_codigo_tabla = '${obj_datos.str_codigo_tabla}'`;
        console.log('queryValid', queryValid)

        var resultValid = await db.query(queryValid);

        if(resultValid.length > 0){
            return {
                statusCode : 500,
                body : JSON.stringify({
                    message:"Ya existe el codigo "+obj_datos.str_codigo_tabla,
                    type : "error"
                })
            }
        }

        obj_datos.bit_borrado = false;
        obj_datos.dt_fecha_registrar = new Date();
        obj_datos.str_usuario_creador = obj_header.str_usuario;

        const keys_principal = Object.keys(obj_datos);
        const textoItems = keys_principal.map((key, index) => `$${index + 1}`).join(', ');
        const keys = Object.keys(obj_datos).join(', ');
        const values = keys_principal.map(key => obj_datos[key]);
        const query = `INSERT INTO maestros_generales (${keys}) VALUES (${textoItems}) RETURNING int_id`;
        console.log('query', query)

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
                message:"Error al registrar la información "+error,
                type : "error"
            })
        }
    }
};
  