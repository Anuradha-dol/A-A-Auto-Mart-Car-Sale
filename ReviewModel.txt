const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    name:{
        type:String,//data type 
        required:true,//validate
    },
    gmail:{
        type:String,//data type
        required:true,//validate
    },
    description:{
        type:String,//data type 
        required:true,//validate
    },
    rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },

});

module.exports = mongoose.model(
    "ReviewModel",//file name
     reviewSchema//function name
)