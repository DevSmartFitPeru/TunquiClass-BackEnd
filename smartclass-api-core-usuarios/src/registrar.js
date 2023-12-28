const AWS = require('aws-sdk');
module.exports.handler = async (event) => {
  console.log('event', event)
    var obj_datos = JSON.parse(event.body);

    AWS.config.update({ region: 'us-east-2' });
    const cognito = new AWS.CognitoIdentityServiceProvider();

    // Parámetros para la creación del usuario
    const params = {
        UserPoolId: 'us-east-2_vK11hbMwc',
        Username: obj_datos.nro_documento,
        MessageAction: 'SUPPRESS', // Opciones: 'SUPPRESS' o 'RESEND'
        UserAttributes: [
            {
                Name: 'name',
                Value: obj_datos.nombre,
            },
            {
              Name: "email",
              Value : obj_datos.email
            }
            // Puedes agregar más atributos según tus necesidades
        ],
    };

    console.log('params',params )
    try {
        // Crea el usuario en Cognito
        const createUserResponse = await cognito.adminCreateUser(params).promise();

        // Devuelve la respuesta de la creación del usuario
        return {
            statusCode: 200,
            body: JSON.stringify(createUserResponse),
        };
    } catch (error) {
        console.error('Error al crear el usuario:', error);

        // Devuelve un error en caso de fallo en la creación del usuario
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error al crear el usuario' }),
        };
    }
};
