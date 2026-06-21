const mongoose = require('mongoose');

const Review = require('./review');
const { required } = require('joi');
const schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new schema({
    title: {
        type: String
    },
    image:{
        type: String
    },
    price: {
        type: Number,
        min: [0, "The Price Should Positive  "]
    },
    description: {
        type: String
    },
    location:{
        type: String
    },
    reviews:[
        {
        type: schema.Types.ObjectId,
        ref: 'Review'
        }    
    ],
    user:{
        type: schema.Types.ObjectId,
        ref: 'User'
    },
    geometry:{
        type:{
            type: String,
            enum:['Point'],
            required: true
        },
        coordinates:{
          type:[Number],
            required: true
        }
    }
    

}, opts)


CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
});


//the below mongoose middleware will delete all the reviews associated with particular campground document. so if you delete one document of campground all the reviews will associated with it will get deleted also. 
CampgroundSchema.post('findOneAndDelete',async(doc)=>{
    if(doc){
        await Review.deleteMany({_id:{$in:doc.reviews}})
    }
})//this middleware will only trigger for some query methods(the query method is consider of index.js that is check the delete route of campground ) that you will find in mongooosejs site middleware section.


module.exports = mongoose.model('Campground', CampgroundSchema);