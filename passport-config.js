const LocalStrategy = require('passport-local').Strategy
const bcrypt = require("bcrypt")


function initialize(passport, getUserByEmail, getUserById){

    const auth = async (email, password, done) => {
        const user = await getUserByEmail(email)

        if (user == null){
            return done( null, false, {message: "No user with that email"})
        }

        
        try {
            console.log(user.password)
            console.log(password)
            if (await bcrypt.compare(password, user.password)){
                return done(null, user)
            } else {
                console.log("incorrect")
                return done(null, false, {message: "Password incorrect"})
            }
        } catch (e) {
            return done(e)
        }

    }
    passport.use(new LocalStrategy({usernameField:'email'}, auth))

    passport.serializeUser((user, done) => {
        return done(null, user._id)
    })
    passport.deserializeUser(async (id, done) => {
        const user = await getUserById(id)
        return done(null, user)
    })
}
module.exports = initialize