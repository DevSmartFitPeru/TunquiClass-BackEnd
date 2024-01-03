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

        if(obj_datos.bit_tabla){
            if(!obj_datos.str_descripcion || !obj_datos.str_codigo_tabla){
                return {
                    statusCode : 500,
                    body : JSON.stringify({
                        message:"Datos Invalidos!",
                        type : "error"
                    })
                }
            }
        }else{
            if(!obj_datos.str_descripcion || !obj_datos.str_codigo){
                return {
                    statusCode : 500,
                    body : JSON.stringify({
                        message:"Datos Invalidos!",
                        type : "error"
                    })
                }
            }
        }
        
        var str_codigo_valid = obj_datos.bit_tabla ? `str_codigo_tabla = '${obj_datos.str_codigo_tabla}' and bit_tabla = true` : `str_codigo = '${obj_datos.str_codigo}'`;
        //VALDIAR SI EXISTE EL CODIGO
        const queryValid = `SELECT * FROM maestros_generales WHERE ${str_codigo_valid} and int_id != ${obj_datos.int_id} and bit_borrado = false`;
        console.log('queryValid', queryValid)

        var resultValid = await db.query(queryValid);

        if(resultValid.length > 0){
            return {
                statusCode : 500,
                body : JSON.stringify({
                    message:"Ya existe el codigo "+str_codigo_valid,
                    type : "error"
                })
            }
        }

        obj_datos.dt_fecha_edicion = new Date().toISOString();
        obj_datos.str_usuario_creador = obj_header.str_usuario;

        var str_codigo_update = obj_datos.bit_tabla ? `str_codigo_tabla = '${obj_datos.str_codigo_tabla}'` : `str_codigo = '${obj_datos.str_codigo}'`;
        const query = `UPDATE maestros_generales SET ${str_codigo_update}, str_descripcion = '${obj_datos.str_descripcion}', str_comentario = '${obj_datos.str_comentario}',
        str_dato_add_1 = '${obj_datos.str_dato_add_1}', str_dato_add_2 = '${obj_datos.str_dato_add_2}',str_dato_add_3 = '${obj_datos.str_dato_add_3}',
        str_relacion_1 = '${obj_datos.str_relacion_1}', str_relacion_2 = '${obj_datos.str_relacion_2}',str_relacion_3 = '${obj_datos.str_relacion_3}' 
        WHERE int_id = ${obj_datos.int_id}`;
        console.log('query', query)
        var result = await db.query(query);
        

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
  