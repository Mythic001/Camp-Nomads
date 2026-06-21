const Campground = require('../models/campground');


const maptilerClient = require('@maptiler/client');
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY



module.exports.index= async (req,res)=>{
    let campgrounds = await Campground.find();// find(),findOneAndUpdate,findOneAndDelete() and etc are mongoose query methods
    res.render('campgrounds/index',{campgrounds});
}


module.exports.renderNewForm =(req,res)=>{   //need to put this route above search because the server will then start searching for the id that is equall to new
    res.render('campgrounds/new');
}

module.exports.createNewCampground =async (req,res,next)=>{
    const geodata = await maptilerClient.geocoding.forward(req.body.campground.title);
    const campground =  new Campground(req.body.campground);
    campground.geometry = geodata.features[0].geometry;
    campground.user = req.user._id;
    await campground.save()
    res.redirect('/campgrounds')
    
}

module.exports.renderCampground = async (req,res,)=>{
    

    
    const {id} = req.params;
    const campground = await Campground.findById(id).populate({
        path:'reviews',
        populate:{
            path: 'user'
        }}).populate('user');//here we populate to show the whole ducment of the reviews field not just the id associated with it.
    if(!campground)
    {
        req.flash('error',"The page you are looking is currently unavailable")
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground});
  
}

module.exports.renderEditFrom = async (req,res)=>{
   
    const {id} = req.params;
    const campground = await Campground.findById(id)
    
    if(!campground)
    {
        req.flash('error','The page you are looking for is unavailabe ')
        return res.redirect('/campgrounds')
    }
    
    res.render('campgrounds/edit',{campground});
}

module.exports.updateCampground = async (req,res)=>{
    const {id} = req.params;
    const geodata = await maptilerClient.geocoding.forward(req.body.campground.location)
    
    const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground});//here we need to use spread due to the structure fo edit form name(check edit.ejs--name of input tag)
    // await campground.save(); no need to save in updation
    res.redirect(`/campgrounds/${camp._id}`);
}


module.exports.deleteCampground = async (req,res)=>{
    
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}