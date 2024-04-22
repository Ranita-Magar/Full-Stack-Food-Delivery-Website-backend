import mongoose from "mongoose";

//create schema describing FoodModel properties

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

//creating model using schema

//const foodModel = mongoose.model("food", foodSchema) //while saving file each time model will be created again and again so to resolve
const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);
//food is model name

export default foodModel;
