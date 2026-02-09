const pool=require('../config/db');

const query='INSERT INTO receipts(order_id, receipt_URL)VALUES($1,$2) RETURNING *';

//function that will create receipt in the database
const saveReceipt=async(order_id,receipt_url)=>{
    const result=await pool.query(query,[order_id,receipt_url]);
    return result.rows[0];
};

//get all the receipts from the database
const getReceipts=async()=>{
    const result=await pool.query('SELECT * FROM receipts ORDER BY generated_at DESC');
    return result.rows;
};

module.exports={saveReceipt,getReceipts}