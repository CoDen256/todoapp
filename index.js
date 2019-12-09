const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const PORT = process.env.PORT || 3000

const flash =  require('express-flash')
const session =  require('express-session')
const passport = require('passport')

const exhbs = require("express-handlebars")
const todoRoutes = require('./routes/todos')

const app = express();
const hbs = exhbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})


app.engine('hbs', hbs.engine)

app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, 'public')))

app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );
  
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
  
// Connect flash
app.use(flash());

app.use(todoRoutes)
function start() {
    try {
        mongoose.connect('mongodb+srv://denblack:12345@cluster0-kiidu.mongodb.net/todos', {
            useNewUrlParser: true,
            useFindAndModify: false
        })
    }catch (e){
        console.log(e)
    }
};

app.listen(PORT, () =>{
    console.log("Server has been started....")
});


start()