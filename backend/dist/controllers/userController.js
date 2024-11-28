"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAddress = exports.addPatient = exports.getPatientList = exports.getDocList = exports.getUser = exports.loginUser = exports.verifyUser = exports.registerUser = void 0;
const env_1 = require("../environment/env");
const Address_1 = __importDefault(require("../models/Address"));
const Patient_1 = __importDefault(require("../models/Patient"));
const mailer_1 = __importDefault(require("../utils/mailer"));
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sequelize_1 = require("sequelize");
const bcrypt_1 = __importDefault(require("bcrypt"));
const Security_Key = env_1.Local.SECRET_KEY;
const otpGenerator = () => {
    return String(Math.round(Math.random() * 10000000000)).slice(0, 6);
};
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstname, lastname, doctype, email, password } = req.body;
        const isExist = yield User_1.default.findOne({ where: { email: email } });
        if (isExist) {
            res.status(401).json({ "message": "User already Exist" });
        }
        else {
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const user = yield User_1.default.create({ firstname, lastname, doctype, email, password: hashedPassword });
            if (user) {
                const OTP = otpGenerator();
                (0, mailer_1.default)(user.email, OTP);
                res.status(201).json({ "OTP": OTP, "message": "Data Saved Successfully" });
            }
            else {
                res.status(403).json({ "message": "Something Went Wrong" });
            }
        }
    }
    catch (err) {
        res.status(500).json({ "message": err });
    }
});
exports.registerUser = registerUser;
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield User_1.default.findOne({ where: { email } });
        if (user) {
            user.is_verified = true;
            user.save();
            res.status(200).json({ "message": "User Verfied Successfully" });
        }
        else {
            res.status(403).json({ "message": "Something Went Wrong" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": err });
    }
});
exports.verifyUser = verifyUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ where: { email } });
        if (user) {
            const isMatch = yield bcrypt_1.default.compare(password, user.password);
            if (isMatch) {
                if (user.is_verified) {
                    const token = jsonwebtoken_1.default.sign({ uuid: user.uuid }, Security_Key);
                    res.status(200).json({ "token": token, "user": user, "message": "Login Successfull" });
                }
                else {
                    const OTP = otpGenerator();
                    (0, mailer_1.default)(user.email, OTP);
                    res.status(200).json({ "user": user, "OTP": OTP, "message": "OTP sent Successfully" });
                }
            }
            else {
                res.status(403).json({ "message": "Invalid Password" });
            }
        }
        else {
            res.status(403).json({ "message": "User doesn't Exist" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": err });
    }
});
exports.loginUser = loginUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uuid } = req.user;
        const user = yield User_1.default.findOne({ where: { uuid: uuid }, include: Address_1.default });
        if (user) {
            const referCount = yield Patient_1.default.count({ where: { referedto: uuid } });
            const referCompleted = yield Patient_1.default.count({ where: { referedto: uuid, referalstatus: 1 } });
            let docCount;
            if (user.doctype == 1) {
                docCount = yield User_1.default.count({ where: { is_verified: 1 } });
            }
            else {
                docCount = yield User_1.default.count({ where: { is_verified: 1, doctype: 1 } });
            }
            res.status(200).json({ "user": user, "message": "User Found", "docCount": docCount, "referCount": referCount, "referCompleted": referCompleted });
        }
        else {
            res.status(404).json({ "message": "User Not Found" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": `Error--->${err}` });
    }
});
exports.getUser = getUser;
const getDocList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("11111111111111");
        const { uuid } = req.user;
        const user = yield User_1.default.findOne({ where: { uuid: uuid } });
        let docList;
        if ((user === null || user === void 0 ? void 0 : user.doctype) == 1) {
            docList = yield User_1.default.findAll({ where: { uuid: { [sequelize_1.Op.ne]: uuid } }, include: Address_1.default });
        }
        else {
            docList = yield User_1.default.findAll({ where: { doctype: 1, uuid: { [sequelize_1.Op.ne]: uuid } }, include: Address_1.default });
        }
        if (docList) {
            res.status(200).json({ "docList": docList, "message": "Docs List Found" });
        }
        else {
            res.status(404).json({ "message": "MD List Not Found" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": `${err}` });
    }
});
exports.getDocList = getDocList;
const getPatientList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uuid } = req.user;
        const user = yield User_1.default.findOne({ where: { uuid: uuid } });
        if (user) {
            let patientList = yield Patient_1.default.findAll({ where: { [sequelize_1.Op.or]: [{ referedby: uuid }, { referedto: uuid }] } });
            if (patientList) {
                // var newPatientList:any = {};
                const plist = [];
                // Fetch related data in parallel for each patient
                for (const patient of patientList) {
                    // Fetch referedby and referedto and address in parallel
                    const [referedtoUser, referedbyUser, address] = yield Promise.all([
                        User_1.default.findOne({ where: { uuid: patient.referedto } }),
                        User_1.default.findOne({ where: { uuid: patient.referedby } }),
                        Address_1.default.findOne({ where: { uuid: patient.address } }),
                    ]);
                    // Prepare the patient data to be added to the response
                    const newPatientList = {
                        uuid: patient.uuid,
                        firstname: patient.firstname,
                        lastname: patient.lastname,
                        disease: patient.disease,
                        referalstatus: patient.referalstatus,
                        referback: patient.referback,
                        createdAt: patient.createdAt,
                        updatedAt: patient.updatedAt,
                        referedto: referedtoUser,
                        referedby: referedbyUser,
                        address: address,
                    };
                    plist.push(newPatientList);
                }
                console.log("Data----->", plist);
                // console.log("P-------->", patientList[0]);
                res.status(200).json({ "patientList": plist, "message": "Patient List Found" });
            }
            else {
                res.status(404).json({ "message": "Patient List Not Found" });
            }
        }
        else {
            res.status(404).json({ "message": "User Not Found" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": `${err}` });
    }
});
exports.getPatientList = getPatientList;
const addPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uuid } = req.user;
        const user = yield User_1.default.findOne({ where: { uuid: uuid } });
        if (user) {
            const { firstname, lastname, disease, address, referedto, referback } = req.body;
            const patient = yield Patient_1.default.create({ firstname, lastname, disease, address, referedto, referback, referedby: uuid });
            if (patient) {
                res.status(200).json({ "message": "Patient added Successfully" });
            }
        }
        else {
            res.status(401).json({ "message": "you're not Authorised" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": `${err}` });
    }
});
exports.addPatient = addPatient;
const addAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uuid } = req.user;
        const user = yield User_1.default.findOne({ where: { uuid: uuid } });
        if (user) {
            const { street, district, city, state, pincode, phone } = req.body;
            const address = yield Address_1.default.create({ street, district, city, state, pincode, phone, user: uuid });
            if (address) {
                res.status(200).json({ "message": "Address added Successfully" });
            }
            else {
                res.status(400).json({ "message": "Error in Saving Address" });
            }
        }
        else {
            res.status(401).json({ "message": "you're not Authorised" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": `${err}` });
    }
});
exports.addAddress = addAddress;
