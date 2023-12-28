const jwt = require('jsonwebtoken');

module.exports.handler = async (event) => {
    console.log('event', event)
    
    try {
        var obj_header = event.headers;

        if(!obj_header.token){
            return {
                statusCode: 403,
                body: JSON.stringify({message : "TOKEN INVALIDO"}),
            };
        }

        const decoded = jwt.verify(obj_header.token,'secret');

        const expiracionEnSegundos = decoded.exp;
        console.log('expiracionEnSegundos', expiracionEnSegundos)

        var responseTime = (Date.now() > expiracionEnSegundos) ? true: false;

        return {
            statusCode: 200,
            body: JSON.stringify({result : responseTime, roles : decoded.roles}),
        };

    } catch (error) {
        console.log('error', error)
        return {
            statusCode: 500,
            body: JSON.stringify({ error }),
        };
    }
  
};
