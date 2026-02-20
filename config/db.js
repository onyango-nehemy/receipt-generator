//for database connections let use class Pool
const {Pool}=require('pg');

const pool=new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
          rejectUnauthorized: false 
        },

});
//below checks on the database connection
pool.on('connect',()=>{
    console.log("Database connected successfully.");
});

pool.on('error',(err)=>{
    console.error('no database connection established',err);
})
module.exports=pool;