const credentials = {
    apiKey: '69a22501843c2da97455515ae8c93124369e3c89ba66df5e824ad6ffb68334a7',         // use your sandbox app API key for development in the test environment
    username: 'sandbox',      // use 'sandbox' for development in the test environment
};


const Africastalking = require('africastalking')(credentials);

const sms = Africastalking.SMS

export default sms;