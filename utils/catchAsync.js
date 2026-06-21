function catchAsync(fn){
    return (req,res,next)=>{
        fn(req,res,next).catch(next)
    }
}
// the above function is the wraper function which reduce the work of using try and catch in every async function and pass the error to the next hence send the control to next error handler middleware

module.exports = catchAsync;