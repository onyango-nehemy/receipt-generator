const nodemailer=require('nodemailer');
const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASSWORD
    }

});

//checks id transporter is working
transporter.verify((error,success)=>{
    if(error){
        console.log('email error!!',error);
    }else{
        console.log('email set up successfully');
    }
});

module.exports=transporter;