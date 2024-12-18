import { Local } from "../environment/env";
import Address from "../models/Address";
import Patient from "../models/Patient";
import sendOTP from "../utils/mailer";
import User from "../models/User";
import { Response } from 'express';
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import bcrypt from 'bcrypt';
import Staff from "../models/Staff";
import Appointment from "../models/Appointment";
import Room from "../models/Room";
import { io } from "../socket/socket";
import Notification from "../models/Notifications";

const Security_Key: any = Local.SECRET_KEY;

const otpGenerator = () => {
    return String(Math.round(Math.random() * 10000000000)).slice(0, 6);
}

export const registerUser = async (req: any, res: Response) => {
    try {
        const { firstname, lastname, doctype, email, password } = req.body;
        const isExist = await User.findOne({ where: { email: email } });
        if (isExist) {
            res.status(401).json({ "message": "User already Exist" });
        }
        else {

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({ firstname, lastname, doctype, email, password: hashedPassword });
            if (user) {
                const OTP = otpGenerator();
                sendOTP(user.email, OTP);
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
}

export const verifyUser = async (req: any, res: Response) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (user) {
            user.is_verified = true;
            user.save();
            res.status(200).json({ "message": "User Verfied Successfully" });
        }
        else {
            res.status(403).json({ "message": "Something Went Wrong" })
        }
    }
    catch (err) {
        res.status(500).json({ "message": err })
    }
}

export const loginUser = async (req: any, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                if (user.is_verified) {
                    const token = jwt.sign({ uuid: user.uuid }, Security_Key);
                    res.status(200).json({ "token": token, "user": user, "message": "Login Successfull" });
                }
                else {
                    const OTP = otpGenerator();
                    sendOTP(user.email, OTP);
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
}

export const getUser = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user;
        const user = await User.findOne({ where: { uuid: uuid }, include: Address });
        if (user) {
            const referCount = await Patient.count({ where: { referedto: uuid } });
            const referCompleted = await Patient.count({ where: { referedto: uuid, referalstatus: 1 } });
            let docCount;

            if (user.doctype == 1) {
                docCount = await User.count({ where: { is_verified: 1 } });
            }
            else {
                docCount = await User.count({ where: { is_verified: 1, doctype: 1 } });
            }
            res.status(200).json({ "user": user, "message": "User Found", "docCount": docCount, "referCount": referCount, "referCompleted": referCompleted });
        }
        else {
            res.status(404).json({ "message": "User Not Found" })
        }
    }
    catch (err) {
        res.status(500).json({ "message": `Error--->${err}` })
    }
}

export const getDoctorList = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user;


        const user = await User.findOne({ where: { uuid: uuid }, include: Address });

        if (user) {
            const referCount = await Patient.count({ where: { referedto: uuid } });

            const referCompleted = await Patient.count({ where: { referedto: uuid, referalstatus: 1 } });

            const docCount = await User.count({
                where: {
                    is_verified: 1,
                    doctype: [1, 2],
                }
            });

            const doctorList = await User.findAll({
                where: {
                    doctype: [1, 2],
                    is_verified: 1,
                },
                include: Address,
            });


            res.status(200).json({
                user,
                message: "User Found",
                docCount,
                referCount,
                referCompleted,
                doctorList,
            });
        } else {
            res.status(404).json({ message: "User Not Found" });
        }
    } catch (err) {
        console.error("Error fetching doctor list:", err);
        res.status(500).json({ message: `Error: ${err}` });
    }
};
export const getDocList = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user;
        const user = await User.findOne({ where: { uuid: uuid } })
        let docList;
        if (user?.doctype == 1) {
            docList = await User.findAll({ where: { uuid: { [Op.ne]: uuid } }, include: Address });
        }
        else {
            docList = await User.findAll({ where: { doctype: 1, uuid: { [Op.ne]: uuid } }, include: Address });
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

}

export const getPatientList = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user;
        const user = await User.findOne({ where: { uuid: uuid } });
        if (user) {
            let patientList: any = await Patient.findAll({ where: { [Op.or]: [{ referedby: uuid }, { referedto: uuid }] } });
            if (patientList) {
                const plist: any[] = [];

                for (const patient of patientList) {
                    const [referedtoUser, referedbyUser, address] = await Promise.all([
                        User.findOne({ where: { uuid: patient.referedto } }),
                        User.findOne({ where: { uuid: patient.referedby } }),
                        Address.findOne({ where: { uuid: patient.address } }),
                    ]);

                    const newPatientList: any = {
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

                res.status(200).json({ "patientList": plist, "user": user, "message": "Patient List Found" });
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
}
// export const getPatientList = async (req: any, res: Response) => {
//     try {
//         const { uuid } = req.user;
//         const { firstname, lastname, disease, referalstatus } = req.query; // Accept search parameters

//         const user = await User.findOne({ where: { uuid: uuid } });
//         if (user) {
//             // Create dynamic filter object
//             let searchFilter: any = {
//                 [Op.or]: [{ referedby: uuid }, { referedto: uuid }]
//             }; 0

//             if (firstname) {
//                 searchFilter.firstname = { [Op.iLike]: `%${firstname}%` }; // Case-insensitive search for first name
//             }

//             if (lastname) {
//                 searchFilter.lastname = { [Op.iLike]: `%${lastname}%` }; // Case-insensitive search for last name
//             }

//             if (disease) {
//                 searchFilter.disease = { [Op.iLike]: `%${disease}%` }; // Case-insensitive search for disease
//             }

//             if (referalstatus) {
//                 searchFilter.referalstatus = referalstatus; // Exact match for referral status
//             }

//             let patientList: any = await Patient.findAll({ where: searchFilter });

//             if (patientList.length > 0) {
//                 const plist: any[] = [];

//                 for (const patient of patientList) {
//                     const [referedtoUser, referedbyUser, address] = await Promise.all([
//                         User.findOne({ where: { uuid: patient.referedto } }),
//                         User.findOne({ where: { uuid: patient.referedby } }),
//                         Address.findOne({ where: { uuid: patient.address } }),
//                     ]);

//                     const newPatientList: any = {
//                         uuid: patient.uuid,
//                         firstname: patient.firstname,
//                         lastname: patient.lastname,
//                         disease: patient.disease,
//                         referalstatus: patient.referalstatus,
//                         referback: patient.referback,
//                         createdAt: patient.createdAt,
//                         updatedAt: patient.updatedAt,
//                         referedto: referedtoUser,
//                         referedby: referedbyUser,
//                         address: address,
//                     };

//                     plist.push(newPatientList);
//                 }

//                 
//                 res.status(200).json({ "patientList": plist, "message": "Patient List Found" });
//             } else {
//                 res.status(404).json({ "message": "No Patients Found Matching Criteria" });
//             }
//         } else {
//             res.status(404).json({ "message": "User Not Found" });
//         }
//     }
//     catch (err) {
//         res.status(500).json({ "message": `${err}` });
//     }
// }
export const getPatient = async (req: any, res: Response) => {
    try {
        const { patientId } = req.params;
        // console.log("qwerfewr", patientId)
        const { uuid } = req.user;
        const user = await User.findByPk(uuid);
        if (user) {

            const patient = await Patient.findByPk(patientId);
            const refertoUser = await User.findByPk(patient?.referedto);
            const referbyUser = await User.findByPk(patient?.referedby);
            const address = await Address.findByPk(patient?.address);

            if (patient) {
                res.status(200).json({ "patient": patient, "message": "Patient Found Successfully", "referto": refertoUser, "referby": referbyUser, "address": address });
            }
            else {
                res.status(404).json({ "message": "Patient not Found" });
            }
        }
        else {
            res.status(400).json({ "message": "You're not authorized " })
        }
    }
    catch (err) {
        res.status(500).json({ "message": `${err}` });
    }
}

export const updatePatient = async (req: any, res: Response) => {
    try {
        const { patientId } = req.params;
        const { uuid } = req.user;
        const user = await User.findByPk(uuid);
        if (user) {
            const patient = await Patient.findByPk(patientId);
            if (patient) {

                const updatedPatient = await patient.update(req.body);
                if (updatedPatient) {
                    res.status(200).json({ "message": "Patient Updated Successfully" });
                }
                else {
                    res.status(400).json({ "message": "Patient not Updated" });
                }
            }
            else {
                res.status(404).json({ "message": "Patient not Found" });
            }
        }
        else {
            res.status(400).json({ "message": "You're not authorized " });
        }
    }
    catch (err) {
        res.status(500).json({ "message": err });
    }
}


export const addPatient = async (req: any, res: any) => {
    try {
        const { uuid } = req.user;

        // Find the user who is adding the patient
        const user = await User.findOne({ where: { uuid: uuid } });

        if (user) {
            // Extract the fields from the request body
            const {
                firstname,
                lastname,
                disease,
                address,
                referedto,
                referback,
                dob,
                email,
                phoneNumber,
                gender,
                diseaseName,
                timing,
                notes,
                laterality
            } = req.body;

            // Create the patient with the provided data
            const patient = await Patient.create({
                firstname,
                lastname,
                disease,
                address,
                referedto,
                referback,
                dob,
                email,
                phoneNumber,
                gender,
                diseaseName,
                timing,
                notes,
                laterality,
                referedby: uuid  // Set the referring user to the logged-in user
            });

            if (patient) {
                // Send a success response
                res.status(200).json({ "message": "Patient added successfully", 'patient': patient });
            }
        } else {
            // If the user is not authorized
            res.status(401).json({ "message": "You're not authorized" });
        }
    } catch (err: any) {
        // Catch any errors and send an error response
        res.status(500).json({ "message": `Error: ${err.message}` });
    }
};

export const addAddress = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user;
        const user = await User.findOne({ where: { uuid: uuid } });
        if (user) {
            const { street, district, city, state, pincode, phone } = req.body;

            const address = await Address.create({ street, district, city, state, pincode, phone, user: uuid });
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
}
export const getAddress = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user;
        const user = await User.findOne({ where: { uuid: uuid } });

        if (user) {

            const addresses = await Address.findAll({ where: { user: uuid } });

            if (addresses.length > 0) {
                res.status(200).json({ "message": "Addresses fetched successfully", addresses });
            } else {
                res.status(404).json({ "message": "No addresses found for this user" });
            }
        } else {
            res.status(401).json({ "message": "You're not authorized" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": `${err}` });
    }
}
export const updateprofile = async (req: any, res: any) => {
    try {
        const { uuid } = req.user;
        const { firstname, lastname, phone, email } = req.body;

        const user = await User.findOne({ where: { uuid: uuid } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.firstname = firstname || user.firstname;
        user.lastname = lastname || user.lastname;
        user.phone = phone || user.phone;
        user.email = email || user.email;

        await user.save();

        return res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error updating profile" });
    }
};
export const deleteAddress = async (req: any, res: any) => {
    try {
        const { uuid } = req.user;

        const { addressUuid } = req.params;

        const user = await User.findOne({ where: { uuid } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const address = await Address.findOne({ where: { uuid: addressUuid, userId: user.id } });
        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }

        await address.destroy();

        return res.status(200).json({ message: 'Address deleted successfully' });
    } catch (err: any) {
        console.error("Error deleting address:", err);
        return res.status(500).json({ message: `Error deleting address: ${err.message}` });
    }
};
export const changePassword = async (req: any, res: any) => {
    try {
        const { uuid } = req.user;
        const { currentPassword, newPassword } = req.body;


        const user = await User.findOne({ where: { uuid } });

        if (!user) {
            return res.status(404).json({ "message": "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(403).json({ "message": "Current password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();
        return res.status(200).json({ "message": "Password updated successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ "message": "Error updating password" });
    }
};
export const addStaff = async (req: any, res: any) => {
    try {
        const { staffName, email, contact, gender } = req.body;
        const { uuid } = req.user;

        if (!staffName || !email || !contact || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingStaff = await Staff.findOne({ where: { email } });
        if (existingStaff) {
            return res.status(409).json({ message: "Staff with this email already exists" });
        }

        const staff = await Staff.create({
            staffName,
            email,
            contact,
            gender,
            createdBy: uuid,
        });

        return res.status(201).json({ success: true, message: "Staff added successfully", staff });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const getStaff = async (req: any, res: any) => {
    try {

        const staffList = await Staff.findAll();

        if (staffList.length === 0) {
            return res.status(404).json({ message: "No staff members found" });
        }

        return res.status(200).json({
            success: true,
            staff: staffList,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const addAppointment = async (req: any, res: any) => {
    try {
        const { patientId, appointmentDate, type } = req.body;
        const { uuid } = req.user;  // Optional: associate with the user who created the appointment

        // Validate input
        if (!patientId || !appointmentDate || !type) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the patient exists
        const patient = await Patient.findOne({ where: { uuid: patientId } });
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        // Create appointment
        const appointment = await Appointment.create({
            patientId,
            appointmentDate,
            type,
            createdBy: uuid,  // Optional: associate with the user who created the appointment
        });

        return res.status(201).json({ success: true, message: "Appointment created successfully", appointment });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const getAppointment = async (req: any, res: Response) => {
    try {
        const appointmentId = req.params.appointmentId;
        const appointment = await Appointment.findByPk(appointmentId, {
            include: [
                {
                    model: Patient,
                    as: "pid",
                }
            ]
        });
        if (appointment) {
            res.status(200).json({ 'appointment': appointment, "message": "Appointment Found" });
        } else {
            res.status(404).json({ "message": "Appointment not Found" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": err });
    }
}
export const getAppointments = async (req: any, res: any) => {
    try {
        const { patientId } = req.query;
        const { uuid } = req.user;

        let appointments;
        if (patientId) {
            const patient = await Patient.findOne({ where: { uuid: patientId } });
            if (!patient) {
                return res.status(404).json({ message: "Patient not found" });
            }

            appointments = await Appointment.findAll({ where: { patientId } });
        } else {
            appointments = await Appointment.findAll({
                include: [
                    {
                        model: Patient,
                        as: 'pid'
                    },
                    {
                        model: User,
                        as: 'uid'
                    }
                ]
            });
        }

        return res.status(200).json({
            success: true,
            message: "Appointments retrieved successfully",
            appointments
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getRooms = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user;
        const user = await User.findByPk(uuid);
        if (user) {
            const rooms = await Room.findAll({
                where: {
                    [Op.or]: [
                        { user_id_1: { [Op.like]: `%${user.uuid}%` } },
                        { user_id_2: { [Op.like]: `%${user.uuid}%` } }]
                },
                include: [
                    {
                        model: User,
                        as: 'doc1'
                    },
                    {
                        model: User,
                        as: 'doc2'
                    },
                    {
                        model: Patient,
                        as: 'patient'
                    }
                ]
            });
            res.status(200).json({ "room": rooms, "user": user });
        } else {
            res.status(404).json({ "message": "You're not authorized" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": err });
    }
}
export const getNotifications = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user;
        const notifications = await Notification.findAll({ where: { notifyto: uuid }, order: [['createdAt', 'DESC']] });
        if (notifications) {
            res.status(200).json({ "notifications": notifications, "message": "Notifications Found" });
        } else {
            res.status(404).json({ "message": "Notifications Not Found" });
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ "message": `Something went wrong ${err}` });
    }
}
export const updateNotificationStatus = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user;
        const notifications = await Notification.findAll({ where: { notifyto: uuid } });

        if (notifications) {
            for (let i = 0; i < notifications.length; i++) {
                const notification = notifications[i];
                await notification.update({ is_seen: 1 });
            }

            io.to(`room-${uuid}`).emit('getUnreadCount', 0);
        }
    }
    catch (err) {
        console.log(err);
    }
}