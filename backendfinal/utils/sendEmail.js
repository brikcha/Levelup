const nodemailer = require('nodemailer');

 const sendEmail = async (email, subject, text) => {
     try {
      const transporter = nodemailer.createTransport({
        host: process.env.HOST,
        service: process.env.SERVICE,
       port: 587,
        secure: true,
        auth: {
         user: process.env.USER,
          pass: process.env.PASS,
         },
    });
  
       console.log("Transporter created");
  
       const info = await transporter.sendMail({
        from: process.env.USER,
         to: email,
        subject: subject,
        text: text,
      });
  
       console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
     } catch (error) {
      console.log("Email not sent");
      console.log(error);
    }
   };
module.exports=sendEmail

 
  