const https = require('https');

exports.handler = (event, context, callback) => {
    // TODO implement
    const payload = JSON.parse(decodeURIComponent(event.payload));
    console.log(payload);

    var response = {
        text: payload.actions[0].value+" is Nice Choice",
    };
    
    callback(null, response);
};