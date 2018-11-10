const dotenv = require('dotenv').config()

let logLevel = process.env.LOG_LEVEL || 0;

module.exports.logger = (...output) => {
    if(logLevel >= 1){
        // console.log(output);
        let newOutput = '';
        for(var i = 0; i < output.length;i++){
            newOutput += `${output[i]} `;
        }
        console.log(newOutput);
    }
}
