import userModel from "../models/useModel.js";

// add items to the user cart
const addToCart = async (req, res) => {
  try {
    // let userData = await userModel.findOne({ _id: req.body.userId });
    let userData= await userModel.findById(req.body.userId)
    let cartData = await userData.cartData;

    if (!cartData[req.body.itemId])
     {
      cartData[req.body.itemId] = 1;
    }
    else{
        cartData[req.body.itemId] += 1;
    }
    
    await userModel.findByIdAndUpdate(req.body.userId, {cartData}); //update cart data in the dB
    res.json({success:true, message:"Added to cart"}); 

  } 
    catch (error) 
    {
    console.log("error");
    res.json({success:false, message:"Error"})
  }
};

// remove items from the user cart
const removeFromCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId); // to get users data
    let cartData = await userData.cartData;  // to extract cart data ; from userData we have stored cartData is this variable
  
    if (cartData[req.body.itemId > 0]) {
      // checks if this itemId that we want to remove , that item is avialable in cart or not
      
      cartData[req.body.itemId] -= 1;
    }

    // to update the new cartData

    await userModel.findByIdAndUpdate(req.body.userId, {cartData});
    res.json({success: true, message:"Removed From Cart"})

  } 
  catch (error) {
    console.log(error);
    res.json({success:false, message:"Error"})
  }
};


// fetch user cart data
const getCart = async (req, res) => {
  try {
 
    let userData = await userModel.findById(req.body.userId);   // find userData using userId
    
    let cartData = await  userData.cartData; // extracting cartData from userData ;users cartData will be saved in the variable
 
    res.json({success: true, cartData})


  } 
  catch (error) {
    console.log(error);
    res.json({success: false, message:"Error"})
  }
};

export { addToCart, removeFromCart, getCart };
