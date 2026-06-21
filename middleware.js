const Campground = require('./models/campground');
const Review = require('./models/review');
const ExpressError = require('./utils/ExpressError')
const {campgroundSchema,reviewSchema} = require('./schemacheck');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
            req.session.returnTo = req.originalUrl//these are express method
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login')
    }
    next()
}




//this middleware is use because due to new udates and security reasons of passport is delete the req.session.returnTo automatically after a successful login

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}


module.exports.isUser = async (req,res,next)=>{
    const {id}= req.params;
    const campground = await Campground.findById(id);
    if(!campground.user.equals(req.user._id) ) 
        {
            req.flash('error',"You are Autorized Person")
            return res.redirect(`/campgrounds/${id}`);
        }
        next();
}


module.exports.validateCampground = (req,res,next)=>{
    
    const {error} = campgroundSchema.validate(req.body);
    if(error)
    {
        const msg = error.details.map(el=> el.message).join(',')
        throw new ExpressError(msg, 400)// here in this function i didn't call next why?, because of the word throw that will atuo matically send the error that express will catch and send or forward it to error handler.   
    }
    else{
        next();
    }
}


module.exports.isReviewUser= async(req,res,next)=>{  
   const {id,rid} = req.params;
    const review = await Review.findById(rid)
    if(!review.user.equals(req.user._id)){
        req.flash('error',"You are not Authorized person")
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body)
    if(error)
    {
        const msg = error.details.map(el=> el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else{
        next();
    }
}