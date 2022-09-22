const mongoose = require("mongoose")


class DB {

    constructor() {
        this.connect();
    }

    connect() {
        mongoose.connect('mongodb://localhost:27017/mychat', {
            UseNewUrlParser: true,
            UseUnifiedTopology: true
        }).catch(e => console.log(e));
    }

    User = mongoose.model('user', {
        username: String,
        password: String
    })

    Message = mongoose.model('message', {
        user_id: String,
        name: String,
        message: String,
        date: Date,

    });

}



module.exports = new DB();