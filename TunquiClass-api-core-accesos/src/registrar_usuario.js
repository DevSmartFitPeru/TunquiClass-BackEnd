const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

module.exports.handler = async (event) => {
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
    

    const params = {
        ClientId: process.env.COGNITOCLIENTID,
        Username: obj_datos.username,
        Password: obj_datos.password,
        UserAttributes: [
            {
                Name: 'email',
                Value: obj_datos.email,
            }
        ],
    };

    try {

        const result = await cognito.signUp(params).promise();
        console.log('result', result)

        return {
            statusCode : 200,
            body : JSON.stringify({
                message:result,
                type : "success"
            })
        }

    }catch (error) {

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
  