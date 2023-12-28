const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

module.exports.handler = async (event) => {
    var obj_datos = JSON.parse(event.body);
    console.log('obj_datos', obj_datos)

    if(!obj_datos){
        return {
            statusCode : 500,
            body : JSON.stringify({
                message:"Datos Invalidos!",
                type : "error"
            })
        }
    }

    const authParams = {
        AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
        ClientId: process.env.COGNITOCLIENTID,
        UserPoolId: process.env.USERPOOLID,
        AuthParameters: {
          USERNAME: obj_datos.username,
          PASSWORD: obj_datos.password
        }
    };

    
    try {
        const authResult = await cognito.adminInitiateAuth(authParams).promise();
        console.log('authResult', authResult)
        return {
            statusCode : 200,
            body : JSON.stringify({
                message:authResult,
                type : "success"
            })
        }
    } catch (error) {
        console.log('error', error)
        return {
            statusCode : 500,
            body : JSON.stringify({
                message: error,
                type : "error"
            })
        }
    }
};
  