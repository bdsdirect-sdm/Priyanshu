import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';
import { Local } from '../environment/env';

const secretKey:any = Local.SECRET_KEY

export const signupTemplate = (userFirstname:string, userLastname:string, friendEmail:string, friendFirstname:string, friendLastname:string, userUUID:string, message:string) => {
    const encrypteddata = jwt.sign(`${friendEmail}_${friendFirstname}_${friendLastname}_${userUUID}`, secretKey);
    const Link = `${Local.BASE_URL}/${encrypteddata}`;
    return `<b>${userFirstname} ${userLastname}</b> invite you. Connect with him at WavyBlogs by clicking on below link </br>Message by <b>${userFirstname} ${userLastname}</b> for you: ${message} <br><br> <a href='${Link}' target='_blank' > ${Link} </a>`;
}