const mongoose = require('mongoose');

async function connect(){
    try {
        // await mongoose.connect('mongodb://127.0.0.1:27017/WebAnVat');
        await mongoose.connect('mongodb+srv://badaosv95:16082001@webanvat.pkt1urz.mongodb.net/WebAnVat');
        console.log("da ket noi");

    } catch (error) {
        console.log(error);
        
    }
}
module.exports = {connect};