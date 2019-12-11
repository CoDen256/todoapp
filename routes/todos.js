const {Router} = require('express')
const Task = require('../models/Task')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const router = Router()
const passport = require('passport')

const intializePassport = require('../passport-config')
const types = ["To do", "In progress", "Testing", "Done"]
intializePassport(
    passport, 
    async e => User.findOne({email: e}),
    async id => User.findById(id)
)

function checkAuthenticated(req, res, next){
    if (req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next){
    if (req.isAuthenticated()){
        return res.redirect('/')
    }
    next()
}

function getNum(type){
    var i = 0
    for (; i < types.length; i++){
        if (types[i] === type){
            return i
        }
    }
}

function getType(value){
    return types[value]
}

router.get('/', checkAuthenticated, async (req, res) => {
    const tasks = await Task.find({user: req.user})
    res.render('index', {
        title: 'Tasks',
        isIndex: true,
        user: req.user,
        tasks: tasks
    })
})

router.get('/create', checkAuthenticated, (req, res) => {
    res.render('create', {
        title: 'Create task',
        user: req.user,
        isCreate: true,
        error: req.query.e,
        types: types
    })
})


router.post('/create', async (req, res) => {
    if (!req.body.title){
        res.redirect("/create?e=1")
        return
    }
    const task = new Task({
        title: req.body.title,
        user: req.user,
        type: getNum(req.body.taskType),
    })
    await task.save()
    res.redirect('/')
})


router.post('/delete', async (req, res) => {
    const task = await Task.findById(req.body.id)

    task.deleteOne()
    res.redirect('/')
})


router.post('/higher', async (req, res) => {
    const task = await Task.findById(req.body.id)

    task.type += 1

    console.log("In higher: " + task.type + " " + task.title + " " + task._id)

    await task.save()
    res.redirect('/')
})

router.post('/lower', async (req, res) => {
    const task = await Task.findById(req.body.id)

    task.type -= 1

    console.log("In lower: " + task.type + " " + task.title + " "+ task._id)
    await task.save()
    res.redirect('/')
})

router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login', {
        title: 'Login'
    })
})

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
        successRedirect : '/',
        failureRedirect: '/login',
        failureFlash: true
}))

router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register', {
        title: "Registration",
        error: req.query.e
    })
     
})

router.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const u = await User.findOne({email:req.body.email})
        if (u != null) {
            res.redirect('/register?e=1')
            return
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        await user.save()

        res.redirect('/login')
    } catch (error) {
        res.redirect('/register')
    }
})

router.post('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})
module.exports = router