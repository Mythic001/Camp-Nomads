
const Campground = require('../models/campground');
const Review = require('../models/review')


module.exports.createNewReview = async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.user = req.user._id;
    campground.reviews.push(review);// here we are pushing review in campground because reviews field is array in campground schema
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)

}


module.exports.deleteReview = async(req,res)=>{
    const {id,rid} = req.params;
 
    await Campground.findByIdAndUpdate(id,{$pull:{reviews: rid}})//here pull is mongoose method to remove or pop something from array.
    await Review.findByIdAndDelete(rid);
    res.redirect(`/campgrounds/${id}`);
}