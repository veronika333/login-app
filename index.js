const express = require('express');
const app = express();
const PORT = 8888;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const findOrCreate = require('mongoose-findorcreate');
const session = require('express-session');
const passport = require('passport');
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({ secret: 'cats '}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/veronika-learning-mongodb');
const db = mongoose.connection;
db.on('error', (err) => { console.log(`An error has occured while connecting to DB: ${err}`);});
db.on('open', () => { console.log(`Connected to database. `); });

const Schema = mongoose.Schema;
const userSchema = new Schema({
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    phone: String
});
userSchema.plugin(findOrCreate);

const User = mongoose.model('User', userSchema); 

// only logged in user should be able to reach this endpoint
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/api/views/pages/home.html');
});

// Login
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/api/views/pages/login.html');
});

app.post('/login/send', (req, res) => {
    // add logic to authentificate user
});


app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/api/views/pages/register.html');
});

app.post('/register/send', (req, res) => {
//find user if alrady exists in database
User.findOrCreate({ username: req.body.username }, function(err, record, created){
    if (err) {console.log(`An error has occured ${err}`);}
if (created){
    //update with all the information besides username
    record.firstname = req.body.firstName;
    record.lastname = req.body.lastName;
    record.password = req.body.password;
    record.phone = req.body.phone;

    //save the record
    record.save()
.then((data) => {
    console.log(`Saved new user to database: ${data}`);
    res.redirect('/login');
})
.catch((err) => {
console.log(`An error has occured when registering user: ${err}`);
res.redirect('/register');
});
    
} else {
    console.log(`A recored with the username ${req.body.username} found.`);
    res.send('Username has been registered to another account');
}
});


/*
    let newUser = new User();
    console.log(req.body.firstName);
    newUser.firstname = req.body.firstName;
    newUser.lastname = req.body.lastName;
    newUser.username = req.body.username;
    newUser.password = req.body.password;
    newUser.phone = req.body.phone;
newUser.save()
.then((data) => {
    console.log(`Saved new user to database: ${data}`);
    res.redirect('/login');
})
.catch((err) => {
console.log(`An error has occured when registering user: ${err}`);
res.redirect('/register');
});
*/
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});