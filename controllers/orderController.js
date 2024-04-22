import orderModel from "../models/orderModel";
import userModel from "../models/useModel";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


// placing user order from frontend
const  placeOrder = async(req,res) => {

    const frontend_url = "http://localhost:5173"

   try {
    const newOrder = new orderModel({
        userId: req.body.userId,
        items:req.body.items,
        amount: req.body.amount,
        address:req.body.address
    })

     await newOrder.save(); // it will save order in our db
     await userModel.findByIdAndUpdate(req.body.userId, {cartData:{}}); // to clear users cart after user place orders

     // whatever items we get from user we are using that items toc create line_items; which is neccessary for stripe payment 
      const line_items = req.body.items.map((item) => ({
         price_data:{
            currency:"usd",
            product_data:{
                name:item.name
            },
            unit_amount: item.price*100 //converting to dollars
         },
         quantity: item.quantity
      }))

      // to push delivery charges
      line_items.push({
        price_data:{
            currency:"usd",
            product_data:{
                name:"Delivery Charges"
            },
            unit_amount:2*100  // 2 is delivery charge in our frontend so
        },
        quantity: 1
      })

      // to create session
      const session = await stripe.checkout.sessions.create({
        line_items: line_items,
        mode: 'payment',
        success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
      })

      res.json({success:true, session_url:session.url})
   
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
   }

}
const verifyOrder =  async (req, res) => {
   const {orderId, success} = req.body;
   try {
     if (success=="true") {
      await orderModel.findByIdAndUpdate(orderId, {payment:true});
      res.json({success:true, message:"Paid"});
       }
     else{
      await orderModel.findByIdAndDelete(orderId);
      res.json({success:false, message:"Not Paid"});
      }

   } catch (error) {
    console.log(error);
    res.json({success:false, message:"Error"});
   }
}

// user orders for frontend
const userOrders = async (req,res) => {

  try {
    // find all orders of that user using userId
    const orders = await orderModel.find({userId:req.body.userId });
    res.json({success:true, data:orders});

  } catch (error) {
    console.log(error);
    res.json({success:false, message:"Error"})
  }
  
}
  
// listing orders for admin page
const listOrders= async(req, res) => {
 try {
   const orders = await orderModel.find({});
   res.json({success:true, data:orders});
 } catch (error) {
   console.log(error);
   res.json({success:false, message:"Error"});
 }
}


export {placeOrder, verifyOrder, userOrders, listOrders };