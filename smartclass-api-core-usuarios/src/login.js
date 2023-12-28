const jwt = require('jsonwebtoken');
const axios = require('axios');

const AWS = require('aws-sdk');
AWS.config.region = 'us-east-2';
const lambda = new AWS.Lambda();
console.log('lambda', lambda)

module.exports.handler = async (event) => {
    try {
        var obj_datos = JSON.parse(event.body);
        var obj_header = event.headers;
        console.log('obj_header', obj_header)
        if(!obj_datos){
            return {
                statusCode : 500,
                body : JSON.stringify("Datos invalidos")
            }
        }

        //VALIDAR TOKEN
        // const params = {
            
        //     FunctionName: 'smartclass-api-core-usuarios-dev-validar-token', // Reemplaza con el nombre de tu otra función
        //     InvocationType: 'RequestResponse', // Puedes usar 'Event' si no esperas una respuesta
        //     Payload: JSON.stringify({ token: obj_header.token }) // Datos que quieres enviar a la otra función
        // };
        // console.log('params', params)
        
        // try {
        //     const response = await lambda.invoke(params).promise();
        //     console.log('response lambda', response)
        // } catch (error) {
        //     console.log('error lambda invike', error)
            
        // }

        console.log('obj_datos', obj_datos)
        console.log('nro_documento', obj_datos.nro_documento)
        const apiUrl = `http://172.31.14.145:3002/api/public/v1/all/${obj_datos.nro_documento}`;

        try {
            const response = await axios.get(apiUrl);
            var obj_response_format = JSON.stringify(response.data);
            var obj_response = JSON.parse(obj_response_format);

        } catch (error) {
            console.log('error as', error)
            return {
                statusCode: 500,
                body: JSON.stringify({ error }),
            };
        }
        const secretKey = 'secret';

        // Información del usuario (puedes obtener esta información de tu base de datos o cualquier otra fuente)
        const userInfo = {
            userId: obj_datos.nro_documento,
            username: obj_datos.nro_documento,
            roles: ['client'],
        };

        // Configuración del token
        const tokenOptions = {
            
            expiresIn: 300, // El token expira en 5min hora (puedes ajustar esto según tus necesidades)
        };
        console.log('tokenOptions', tokenOptions)
        // Genera el token
        const token = jwt.sign(userInfo, secretKey, tokenOptions);

        // Devuelve el token en la respuesta
        if(obj_response.type !== "error"){
            obj_response.token = token;
        }
        
        return {
            statusCode: 200,
            body: JSON.stringify(obj_response),
        };
    } catch (error) {
        console.log('error', error)
        return {
            statusCode: 500,
            body: JSON.stringify({ error }),
        };
    }
  
};
