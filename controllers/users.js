const User = require('../models/user');


module.exports.renderRegister = (req,res)=>{
    res.render('users/register')
}

module.exports.createUser = async(req,res,next)=>{
    try{

    
    const {username,email,password}=req.body.user
    const user = new User({username,email})
    const registerUser = await User.register(user,password); // here you dont need to write user.save() bcz User.register save the user
    req.login(registerUser,(err)=>{//this fucntion is to make user login at the same time of registration other wise you need to login even after regisetration
        if(err)
        {
            return next(err)
        }
        req.flash('success',"Welcome To Campground!")
        res.redirect('/campgrounds')
    })
    }catch(e){
        if(e.code === 11000 && e.keyValue && e.keyValue.email)
        {
            
            req.flash('error',`email already exist -${e.keyValue.email}`)
            res.redirect('/register')
        }
        else{

            req.flash('error',`${e.message}`) 
            res.redirect('/register')
        }

    }
}

module.exports.renderLogin = (req,res)=>{
    res.render('users/login')
}

module.exports.loginUser = (req,res)=>{
    req.flash('success','Welcome Back!')
    const redirectUrl = res.locals.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirectUrl)
}


module.exports.logoutUser =(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            next(err)
        }
        res.redirect('/campgrounds')
    })

}