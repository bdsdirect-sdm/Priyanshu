import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';
import { Local } from '../environment/env';

const secretKey:any = Local.SECRET_KEY

export const loginTemplate = (userFirstname:string, userLastname:string, friendEmail:string, message:string, userId:string) => {
    const encrypteddata = jwt.sign(`${friendEmail}_${userId}`, secretKey);
    const Link = `${Local.BASE_URL}/${Local.LOGIN_URL}/${encrypteddata}`
    return `<b>${userFirstname} ${userLastname}</b> sent you a request to connect with him at WavyBlogs by clicking on below link </br> Message by <b>${userFirstname} ${userLastname}</b> for you: ${message} <br><br> <a href="${Link}" target='_blank' > ${Link} </a>`;
}