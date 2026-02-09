//for database connections let use class Pool
const {Pool}=require('pg');

const pool=new Pool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    port:process.env.DB_PORT,

});
//below checks on the database connection
pool.on('connect',()=>{
    console.log("Database connected successfully.");
});

pool.on('error',(err)=>{
    console.error('no database connection established',err);
})
module.exports=pool;