const mongoose = require('mongoose');


function ConnectToDb() {

    mongoose.connect(process.env.MONGODB_URL).then(() => {
        console.log('Connected to DB');
    })
    .catch((err) => {
        console.error('There was some error connecting to DB', err);
    })
}
module.exports = ConnectToDb;