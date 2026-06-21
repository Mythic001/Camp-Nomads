if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}


const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')

// const MongoDBStore = require("connect-mongo")(session) 

const dbUrl = process.env.DB_URL

mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
const User = require('./models/user')

const campgroundsRoutes =require('./routes/campgrounds')
const reviewsRoutes = require('./routes/reviews')
const usersRoutes = require('./routes/users') 


const ExpressError = require('./utils/ExpressError');




const app = express();



app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);
app.set('views', path.join(__dirname,'views' ));
app.use(express.static(path.join(__dirname,'public')))

app.set('view engine','ejs');

// const store = new MongoDBStore({
//     url: dbUrl,
//     secret: 'thebestsecret',
//     touchAfter: 24*60*60
// })

// store.on('error',function(e){
//     console.log('session store error',e);
    
// })

const sessionConfig = {
    // store,
    secret: 'thebestsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {

    }
}




app.use(session(sessionConfig))
app.use(flash())


app.use(passport.initialize())

app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req,res,next)=>{
    if(!['/login','/'].includes(req.originalUrl)){

        req.session.returnTo = req.originalUrl;
    }
    
    res.locals.currentUser = req.user;//here we get the login user with the help of passport.
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})// this flash middleware should be just after any routes


app.use('/',usersRoutes)//this route should be above all routers else your page not found error will run
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews/',reviewsRoutes)

app.get('/',(req,res)=>{
    res.render("home");
})
//below attached part is one way of inserting documet in collection of database
// app.get('/createcampground',async (req,res)=>{
//     const camp = new Campground({title: 'Rishikesh', description: "A very beautiful place to vist" });
//     await camp.save();
//     res.send(camp);
// })





app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found', 404))// this middlware will run if client enter route that is something bogus or something that do not match any route and will send the error message and code written here to the below error handler to give this error message and code instead of the error which is send by mongoose. 
})
//errorr handler
app.use((err,req,res,next)=>{
    
        const { statusCode=500,message} = err;
        if(!message)
        {
            message="something went Wrong"
        }
        console.log(err)
        res.status(statusCode).render('error',{err});
})

app.listen(3000,()=>{
    console.log('server is running')
})