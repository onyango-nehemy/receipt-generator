const {createOrder, getOrders}=require('../models/orderModel');


//controller function to add order when a http request is made
exports.addOrder=async(req,res)=>{
    try{
        const order=await createOrder(req.body);//pass the whole object into the createOrder function
        res.status(201).json(order);
    }catch(error){
        res.status(500).json({error:error.message});
    }
}; 

//get all orders
exports.getAllOrders=async(req,res)=>{
    try{
        const orders=await getOrders();
        res.json(orders);
    }catch(error){
        res.status(500).json({error:error.message});
    }

};