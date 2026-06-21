const express = require('express')

const router = express.Router({mergeParams:true});

const review = require('../controllers/reviews')


const catchAsync = require('../utils/catchAsync');


const {isLoggedIn,validateReview,isReviewUser} = require('../middleware')

// the below function is the middleware that will check or validate the review schema





router.post('/',isLoggedIn, validateReview, catchAsync(review.createNewReview))

router.delete('/:rid',isLoggedIn,isReviewUser,catchAsync(review.deleteReview))


module.exports = router