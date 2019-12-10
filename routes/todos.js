const {Router} = require('express')
const Todo = require('../models/Todo')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const router = Router()
const passport = require('passport')

const intializePassport = require('../passport-config')
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

router.get('/', checkAuthenticated, async (req, res) => {
    const todos = await Todo.find({user: req.user})
    res.render('index', {
        title: 'Todo',
        isIndex: true,
        user: req.user,
        todos: todos
    })
})

router.get('/create', checkAuthenticated, (req, res) => {
    res.render('create', {
        title: 'Create todo',
        user: req.user,
        isCreate: true,
        error: req.query.e
    })
})


router.post('/create', async (req, res) => {
    if (!req.body.title){
        res.redirect("/create?e=1")
        return
    }
    const todo = new Todo({
        title: req.body.title,
        user: req.user,
    })
    await todo.save()
    res.redirect('/')
})

router.post('/complete', async (req, res) => {
    const todo = await Todo.findById(req.body.id)

    todo.completed = true

    todo.completed = !!req.body.completed

    await todo.save()

    res.redirect('/')
})

router.post('/delete', async (req, res) => {
    const todo = await Todo.findById(req.body.id)

    todo.deleteOne()
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