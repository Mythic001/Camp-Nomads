const express = require('express')
const router = express.Router();

const user = require('../controllers/users')


const passport = require('passport')



const {storeReturnTo} = require('../middleware')


router.get('/register',user.renderRegister)


router.post('/register', user.createUser)


router.get('/login', user.renderLogin )

router.post('/login',storeReturnTo,passport.authenticate('local',{ failureFlash: true , failureRedirect:'/login'}), user.loginUser )


router.get('/logout',user.logoutUser)

module.exports = router