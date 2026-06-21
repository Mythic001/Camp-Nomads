const express = require('express')
const router = express.Router({mergeParams:true});



const campground = require('../controllers/campgrounds') 




const catchAsync = require('../utils/catchAsync');




const {isLoggedIn,isUser,validateCampground} = require('../middleware')

//the below function is the middleware that will check or validate the campground schema 





router.get('/',catchAsync(campground.index));



router.get('/new',isLoggedIn, campground.renderNewForm);

router.post('/',isLoggedIn,validateCampground, catchAsync(campground.createNewCampground))



router.get('/:id',catchAsync(campground.renderCampground))

router.get('/:id/edit',isLoggedIn,isUser,catchAsync(campground.renderEditFrom))

router.put('/:id',isLoggedIn,isUser,validateCampground,catchAsync(campground.updateCampground))
//for the delete,put,patch and all the routes other than put and post need form to operate
router.delete('/:id/delete',isLoggedIn,isUser,catchAsync(campground.deleteCampground))



module.exports = router