const pool=require('../config/db');

//function that receives order data and maps them to database
//i have used destructuring of objects that is coming from the req.body
const createOrder=async(order)=>{
    const {
        customer_name,
        customer_email,
        items,
        subtotal,
        discount,
        total_amount,
        payment_method,
    }=order;
    //sql query to insert the fields into the database
    const query=`INSERT INTO orders(customer_name,customer_email,items,subtotal,discount,total_amount,payment_method)
       VALUES($1,$2,$3,$4,$5,$6,$7)
        RETURNING *

    `;

//function to send our values to the backend using the above query
    const result=await pool.query(query,[
       customer_name,customer_email,JSON.stringify(items),subtotal,discount,total_amount,payment_method
    ]);
    return result.rows[0];

//function that will get orders from the database to help in receipt generation

};
const getOrders=async()=>{
    const result=await pool.query('SELECT * FROM orders ORDER BY order_datetime DESC');
    return result.rows;
};



module.exports={createOrder,getOrders};