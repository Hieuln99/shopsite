const { request } = require('express')
const express = require('express')
const session = require('express-session')
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express()
const { MongoClient } = require('mongodb')
const { Log, Search, Insert, Compare } = require('./functions')

app.use(session({secret: '123e4yd@$%#', cookie: { maxAge: 600000 },saveUninitialized:false,resave:false}))
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'hbs')

app.use(express.static('css'))

app.get('/',RequireLog, (req, res) => {
    res.render('home')
})
app.get('/Login',(req,res)=>{
    res.render('Login')
})
app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/log', async (req, res) => {
    const nameIn = req.body.txtName
    const passIn = req.body.txtPass
    const user = await Compare(nameIn, passIn)
    var err = {}
    if (user == "-1") {
        err = "User Name or Password is incorrect !!!"
        res.render('Login', { error: err })
    }
    else {
        req.session["User"]={
            name : nameIn,
            pass : passIn
        }
        res.redirect('/');
    }
    
})

app.post('/register', async (req, res) => {
    const nameIn = req.body.txtName
    const passIn = req.body.txtPass

    var err = {}
    var status = false
    if(nameIn.length < 5 || nameIn==null){
        err = "User name must be more than 5 words!"
        status = true
    }
    if(passIn==null || passIn.trim().length==0 || isNaN(passIn) || passIn.length < 8 ){
        err = "Password must be number, and more than 8 words!"
        status = true
    }

    if(status){
        res.render('register',{notice:err})
    }
    if(!status){
        const checkuser =await Search(nameIn)
        var err = {}
        let endedpass = '';
    
        if (checkuser != null) {
            err = "This User-name has used, please choose an other!"
            res.render('register', { notice: err})
        }
        else {
            bcrypt.genSalt(saltRounds, (err, salt)=>{
                bcrypt.hash(passIn, salt,async function(err, hash) {
                    // Store hash in your password DB.
                    console.log(hash)
                    endedpass = hash
                    await Insert(nameIn,endedpass)
                });
               
            });
           //

           const user =  Search(nameIn)
           if (user != null) {
                err = "Sign up successful !!!"
                res.render('Login', { notice: err})
           }
           else {
               err = "Sign up failure !!!"
               res.render('register', { notice: err})
           }
        }
    }

})
function RequireLog (req,res,next){
    if(req.session["User"]){
    return next()
}
    else{
    res.redirect('/Login')
}
}

const PORT = process.env.PORT || 5000
app.listen(PORT)