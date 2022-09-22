const express = require('express');
const path = require('path');
var app = express();
var bodyParser = require("body-parser")
const session = require("express-session");
const DB = require('./mongo.config');
// DB.connect();
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');


app.use(session({
    secret: 'thisismyrandomsecretkey',
    resave: false,
    saveUninitialized: true,

}));




// (new User({ username: 'admin', password: 'admin' })).save(function (err, admin) {
//     if (err) return handleError(err);
//     console.log("User has been created. User:" + admin.username + "password:" + admin.password)
// });

const http = require("http").Server(app);

const io = require("socket.io")(http);

io.on("connection", (socket) => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});

app.get("/", (req, res) => {
    if (req.session.userLoggedIn) {
        res.render("index.ejs")
    } else {
        res.redirect('/login');
    }
})

app.get("/login", (req, res) => {
    res.render("login.ejs")
})

// var messages = [
//     { id: "6307b397a5df5d899ec1b3c2", name: "Admin", message: "Holaaa mi nombre es Jaime" },
//     { id: "ass", name: "Jaime", message: "Holaaa mi nombre es Jaime" },
//     { id: "asc", name: "Jaime", message: "Holaaa mi nombre es Jaime" },
// ];
app.get("/messages", async (req, res) => {
    let messages = await DB.Message.find();
    // console.log(messages);
    res.send(messages)
});

app.post("/messages", async (req, res) => {
    // messages.push(req.body)
    try {
        let message = await new DB.Message({ ...req.body, date: new Date() }).save();
        io.emit('message', message)
        res.status(200).send();
    } catch (e) {
        console.log(e);
    }

});



app.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    console.log(DB)
    DB.User.findOne({ username, password }).exec(function (err, user) {
        console.log(`Errors: ${err}`);
        console.log(`Admin: ${user}`);

        if (!user) {
            res.status(404).send({ error: "Username or password incorrect. Please try again!", title: "Login" });
        } else {
            req.session.username = user.username;
            req.session.userLoggedIn = true;
            // res.redirect('/');
            res.status(200).send({ username: user.username, id: user._id })
        }

    });
});

app.get('/logout', function (req, res) {
    req.session.username = "";
    req.session.userLoggedIn = false;
    res.redirect("/login");
});



// app.listen(8080);

var server = http.listen(3000, () => {
    console.log("Server is listening in port: ", "http://localhost:" + server.address().port)
})

// console.log('Everything executed fine... Open http://localhost:8080/');