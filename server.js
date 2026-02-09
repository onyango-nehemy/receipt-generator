require('dotenv').config();
const app=require('./app');
const PORT=5000;
const pool=require('./config/db');//integrating database into our server

app.listen(PORT,()=>{
    console.log(`server running successfully on port ${PORT}`);
});