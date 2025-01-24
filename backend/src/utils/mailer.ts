import nodemailer from 'nodemailer'
import { Local } from '../environment/env';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'gmail',
    port: 587,
    secure: false, // or 'STARTTLS'
    auth: {
        user: Local.MAIL_USER,
        pass: Local.MAIL_PASS
        }
});

function sendInvitation(email:string, template:string){
    const mailOptions = {
        from: Local.MAIL_USER,
        to: email,
        subject: "Verify Account",
        html: template
    }

    transporter.sendMail(mailOptions, (error, info)=>{
        if (error) {
            return console.log("Error: ", error);
            }
        console.log('Email sent: ' + info.response);
        return info.response;
    });
}

export default sendInvitation;