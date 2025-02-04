import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Response } from "express";
import { Local } from "../environment/env";
import Preference from "../models/Preference";
import Wave from "../models/Wave";
import sendInvitation from "../utils/mailer";
import Request from "../models/Request";
import { loginTemplate } from "../mailTemplate/loginTemplate";
import { signupTemplate } from "../mailTemplate/signuptemplate";
import Friend from "../models/Friend";
import { Op, UUID } from "sequelize";
import Comment from "../models/Comment";
import Admin from "../models/Admin";

const SECRET_KEY: any = Local.SECRET_KEY

// post request
export const userList = async (req: any, res: Response): Promise<any> => {
    try {
        const { uuid } = req.user;
        const user = await User.findOne({ where: { uuid } });
        const friends = await Friend.findAll(
            {
                where: {
                    [Op.or]: [
                        { user_1_Id: uuid },
                        { user_2_Id: uuid }
                    ]
                },
                include: [
                    {
                        model: User,
                        as: 'friend_1',
                    },
                    {
                        model: User,
                        as: 'friend_2',
                    }
                ]
            }
        );

        return res.status(200).json({ "friends": friends, "user": user });
    }
    catch (err) {
        res.status(500).json({ 'message': 'Something went wrong' });
    }
}

// post request
export const userLogin = async (req: any, res: Response) => {
    try {
        const { email, password } = req.body.formData;
        const { data } = req.body;
        console.log(data);
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            res.status(401).json({ 'message': 'Invalid credentials' });
        }
        else {
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                res.status(401).json({ 'message': 'Invalid credentials' });
            }
            else {
                // const token = jwt.sign({uuid: user.uuid}, SECRET_KEY, {expiresIn: '1h'});
                if (data) {
                    const invite: any = jwt.verify(data, SECRET_KEY, (err: any, info: any) => {
                        if (err) {
                            return 0;
                        }
                        return info;
                    });
                    if (invite) {
                        const friendinfo = invite.split('_');
                        console.log("friendinfo----->", friendinfo);
                        const friend = await Friend.create({
                            user_1_Id: user.uuid,
                            user_2_Id: friendinfo[1],
                        });
                        console.log("Friend", friend);
                        if (friend) {
                            const request = await Request.findOne({ where: { url: data } });
                            console.log("request----->", request)
                            if (request) {
                                await request.update({
                                    request_status: 1
                                });
                            }
                        }
                    }
                }
                const token = jwt.sign({ uuid: user.uuid }, SECRET_KEY);
                res.status(200).json({ 'message': 'Login successful', "token": token, "user": user });
            }
        }
    }
    catch (err) {
        res.status(500).json({ 'message': 'Something went wrong' })
    }
}

// post request
export const Register = async (req: any, res: any) => {
    try {
        const { firstname, lastname, email, password, phone } = req.body.formData;
        const { data } = req.body;
        console.log("data--->", data);

        const isExist = await User.findOne({ where: { email: email } });
        if (isExist) {
            return res.status(400).json({ 'message': 'User already exist' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            phone
        });

        if (data) {
            const invite: any = jwt.verify(data, SECRET_KEY, (err: any, info: any) => {
                if (err) {
                    return 0;
                }
                return info;
            });

            if (invite) {
                const friendinfo = invite.split('_');
                console.log("friendinfo----->", friendinfo);
                const friend = await Friend.create({
                    user_1_Id: user.uuid,
                    user_2_Id: friendinfo[3]
                })
                console.log("friend----->", friend);
                if (friend) {
                    const request = await Request.findOne({ where: { url: data } });
                    console.log("huhu===>", request)
                    if (request) {
                        await request.update({
                            request_status: 1,
                            email: email,
                            sent_to_mail: email
                        })
                    }
                }
            }
        }

        return res.status(200).json({ 'message': 'User created successfully' });
    }
    catch (err) {
        return res.status(500).json({ 'message': 'Something went wrong, Please try after sometime' })
    }
}

///////////////
export const registerAdmin = async (req: any, res: any) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        // Check if the admin already exists by email
        const isExist = await Admin.findOne({ where: { email } });
        if (isExist) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        // Hash the password before saving it
        const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

        // Create a new admin with the hashed password
        const admin = await Admin.create({
            firstname,
            lastname,
            email,
            password: hashedPassword, // Store the hashed password
        });

        return res.status(201).json({
            message: "Admin created successfully",
            admin: {
                uuid: admin.uuid,
                firstname: admin.firstname,
                lastname: admin.lastname,
                email: admin.email,
                status: admin.status,
            },
        });
    } catch (error) {
        console.error("Error creating admin:", error);
        return res.status(500).json({ message: "Something went wrong, please try again later." });
    }
};
///////////
export const adminLogin = async (req: any, res: any) => {
    try {
        const { email, password } = req.body;

        // Find the admin by email
        const admin = await Admin.findOne({ where: { email } });

        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if the provided password matches the hashed password stored in the database
        const isValidPassword = await bcrypt.compare(password, admin.password);

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ uuid: admin.uuid }, SECRET_KEY, { expiresIn: '1h' });

        // Return the successful login response
        return res.status(200).json({
            message: 'Admin login successful',
            token: token,
            admin: {
                uuid: admin.uuid,
                firstname: admin.firstname,
                lastname: admin.lastname,
                email: admin.email,
                status: admin.status,
            },
        });
    } catch (error) {
        console.error('Error logging in admin:', error);
        return res.status(500).json({ message: 'Something went wrong, please try again later.' });
    }
};
// post request
export const updateUser = async (req: any, res: any) => {
    try {
        const { uuid } = req.user;
        const { firstname, lastname, email, social_security, phone, address, address_one,
            address_two, city, state, zip_code, dob, gender, martial_status, social, kids } = req.body;

        const user = await User.findByPk(uuid);

        const updatedUser = await user?.update({
            firstname, lastname, email, social_security, phone, address, address_one,
            address_two, city, state, zip_code, dob, gender, martial_status, social, kids
        });
        res.status(200).json({ "message": "User updated successfully" });
    }
    catch (err) {
        res.status(500).json({ 'message': 'Something went wrong' });
    }
}









// post request
// pending
export const updateProfilePhoto = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user;


    }
    catch (err) {
        res.status(500).json({ 'message': 'Something went wrong' });
    }
}

////profile

// export const updateProfile = async (req: any, res: any) => {
//     try {
//         console.log("vyuvvvvvvvvvuvl");
//         // Destructure the profile fields from the request body
//         const { uuid } = req.user;  // Assuming `uuid` is coming from the authenticated user (e.g., via JWT)
//         const {
//             firstname,
//             lastname,
//             email,
//             phone,
//             socialSecurity,
//             address_one,
//             address_two,
//             city,
//             state,
//             zip_code,
//         } = req.body;

//         // Find the existing user profile using `uuid`
//         const user = await User.findOne({ where: { uuid } });

//         if (user) {
//             // If the user exists, update the user profile
//             await user.update({
//                 firstname,
//                 lastname,
//                 email,
//                 phone,
//                 socialSecurity,
//                 address_one,
//                 address_two,
//                 city,
//                 state,
//                 zip_code,
//             });

//             return res.status(200).json({ message: 'Profile updated successfully' });
//         } else {
//             await User.create({
//                 uuid,
//                 firstname,
//                 lastname,
//                 email,
//                 phone,
//                 socialSecurity,
//                 address_one,
//                 address_two,
//                 city,
//                 state,
//                 zip_code,
//             });

//             return res.status(200).json({ message: 'Profile created successfully' });
//         }
//     } catch (err: any) {
//         console.error(err);
//         return res.status(500).json({ message: `Something went wrong: ${err.message}` });
//     }
// };

/////////////////
export const updateProfile = async (req: any, res: any) => {
    try {
        // Ensure that `req.user` is populated correctly via the authentication middleware (JWT)
        const { uuid } = req.user;
        console.log("User UUID from token: ", uuid);
        console.log("User object from req.user:", req.user);  // Log the entire user object

        if (!uuid) {
            return res.status(400).json({ message: 'User UUID not found in request' });
        }

        // Destructure the profile fields from the request body
        const {
            firstname,
            lastname,
            email,
            phone,
            social_security,
            address_one,
            address_two,
            city,
            state,
            zip_code,
        } = req.body;

        // Validate if required fields are present (this can be done via Joi, Yup or manually)
        if (!firstname || !lastname || !email || !phone || !address_one || !city || !state || !zip_code) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        // Log the data you're about to search for
        console.log("Looking for user with UUID: ", uuid);

        // Find the existing user profile using `uuid`
        const user = await User.findOne({ where: { uuid } });

        if (!user) {
            console.log("User not found for UUID:", uuid);  // Log UUID to see if it matches a record in your DB
            return res.status(404).json({ message: 'User not found' });
        }

        // If the user exists, update the user profile
        await user.update({
            firstname,
            lastname,
            email,
            phone,
            social_security,
            address_one,
            address_two,
            city,
            state,
            zip_code,
        });

        return res.status(200).json({ message: 'Profile updated successfully' });
    } catch (err: any) {
        console.error("Error occurred while updating profile:", err);
        return res.status(500).json({ message: `Something went wrong: ${err.message}` });
    }
};




// post request
export const addorUpdatePreference = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user;
        const { language, breakfast, lunch, dinner, wake_time, bed_time, weight_in, height_in, blood_glucose_in,
            blood_pressure_in, cholesterol_in, distance_in, system_email, member_services_email, sms,
            phone_call, post } = req.body;

        const preference = await Preference.findOne({ where: { userId: uuid } });

        if (preference) {
            await preference.update({
                language, breakfast, lunch, dinner, wake_time, bed_time, weight_in, height_in, blood_glucose_in,
                blood_pressure_in, cholesterol_in, distance_in, system_email, member_services_email, sms,
                phone_call, post, userId: uuid
            })
        }
        else {
            await Preference.create({
                language, breakfast, lunch, dinner, wake_time, bed_time, weight_in, height_in, blood_glucose_in,
                blood_pressure_in, cholesterol_in, distance_in, system_email, member_services_email, sms,
                phone_call, post, userId: uuid
            })
        }
        res.status(200).json({ "message": "Preference updated Successfully" });
    }
    catch (err) {
        res.status(500).json({ 'message': `Something went wrong ${err}` })
    }
}

// post request
export const updateUserPassword = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user;
        const { prevPass, newPass } = req.body.data;
        const user: any = await User.findByPk(uuid);
        const isMatched = await bcrypt.compare(prevPass, user.password);
        if (isMatched) {
            const hashedPassword = await bcrypt.hash(newPass, 10);
            await user.update({ password: hashedPassword });
            res.status(200).json({ "message": "Password updated Successfully" });
        } else {
            res.status(401).json({ "message": "Current Password isn't matched" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": `Something went wrong ${err}` });
    }
}

// post request
export const inviteFriend = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user;
        const friends = req.body;
        const user: any = await User.findByPk(uuid);
        console.log("====>", friends);
        await friends.map(async (friend: any) => {

            let existedUser = await User.findOne({ where: { email: friend.email } });
            console.log(friend);
            const firstname = friend.name.split(' ')[0];
            const lastname = friend.name.split(' ')[1];
            if (existedUser) {
                const alreadyfriend = await Friend.findOne({
                    where: {
                        [Op.or]: [
                            {
                                [Op.and]: [
                                    { user_1_Id: uuid },
                                    { user_2_Id: existedUser.uuid }
                                ]
                            },
                            {
                                [Op.and]: [
                                    { user_1_Id: existedUser.uuid },
                                    { user_2_Id: uuid }
                                ]
                            }
                        ]
                    }
                });
                if (alreadyfriend) {
                    return res.status(400).json({ "message": ` ${existedUser.firstname} ${existedUser.lastname} is already your friend` });
                }
                var template: string = loginTemplate(user.firstname, user.lastname, existedUser.email, friend.message, uuid);
                const temp = template.split(' ');
                const link = temp[temp.length - 2];
                const b = link.split('/');
                const data = b[b.length - 1];

                let request = await Request.create({
                    firstname,
                    lastname,
                    email: friend.email,
                    message: friend.message,
                    url: data,
                    sent_by: uuid,
                    sent_to: existedUser.uuid
                });
            } else {
                var template: string = signupTemplate(user.firstname, user.lastname, friend.email, firstname, lastname, user.uuid, friend.message);
                const temp = template.split(' ');
                const link = temp[temp.length - 2];
                const b = link.split('/');
                const data = b[b.length - 1];


                let request = await Request.create({
                    firstname,
                    lastname,
                    email: friend.email,
                    message: friend.message,
                    url: data,
                    sent_by: uuid,
                    sent_to_mail: friend.email
                });
            }
            sendInvitation(friend.email, template);
        });

        res.status(200).json({ "message": "Invitation sent Successfully" });
    }
    catch (err) {
        res.status(500).json({ "message": "Something went wrong" });
    }
}

// get request
export const getUserPreference = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user;
        const preference = await Preference.findOne({ where: { userId: uuid } });
        if (preference) {
            res.status(200).json({ "preference": preference });
        } else {
            res.status(200).json({ "message": "No preference found" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": "Something went wrong" });
    }
}

// post request
export const createWave = async (req: any, res: any) => {
    try {
        const { uuid } = req.user;
        console.log("------>", uuid)
        const { text } = req.body;
        const photo = req.file.path;
        console.log("======>", photo);
        const wave = await Wave.create({
            userId: uuid,
            text: text,
            photo: photo
        });
        if (wave) {
            return res.status(200).json({ "message": "Wave Created Successfully" });
        } else {
            return res.status(500).json({ "message": "Something went wrong" });
        }
    }
    catch (err) {
        return res.status(500).json({ "message": `Something went wrong ${err}` });
    }
}

// get request
export const getMyWaves = async (req: any, res: any) => {
    try {
        const { uuid } = req.user;
        const waves = await Wave.findAll({ where: { userId: uuid } });
        if (waves) {
            return res.status(200).json(waves);
        }
    }
    catch (err) {
        return res.status(500).json({ "message": `Something went wrong ${err}` });
    }
}

// get request
export const getLatestWaves = async (req: any, res: Response): Promise<any> => {
    try {
        const { uuid } = req.user;
        const waves = await Wave.findAll({
            where: {
                userId: {
                    [Op.ne]: uuid
                }
            },
            order: [['createdAt', 'DESC']],
            limit: 6,
            include: [
                {
                    model: User,
                    as: 'user_wave'
                },
                // {
                //     model: Comment,
                //     as: 'wave_comment',
                //     include:[
                //         {
                //             model: User,
                //             as: 'user_comment'
                //         }
                //     ]
                // }
            ]
        });
        if (waves) {
            return res.status(200).json({ "message": "Waves are fetched", "waves": waves });
        }
    }
    catch (err) {
        return res.status(500).json({ "message": `Something went wrong ${err}` });
    }
}

// get request
export const getComments = async (req: any, res: Response): Promise<any> => {
    try {
        const { uuid } = req.user;
        const { waveId } = req.body;
        const comments = await Comment.findAll({
            where: {
                waveId: {
                    [Op.eq]: waveId
                }
            },
            include: [
                {
                    model: User,
                    as: 'user_comment'
                }
            ]
        });
        return res.json({ "comments": comments });
    }
    catch (err) {

    }
}
///////////////
// export const getComments = async (req: any, res: Response): Promise<any> => {
//     try {
//         // Ensure waveId is passed as a query parameter for GET request
//         const { waveId } = req.query;
//         console.log("efgwf", req.query)
//         // Validation: Check if waveId is present
//         if (!waveId) {
//             return res.status(400).json({ message: "Wave ID is required" });
//         }

//         // Fetch comments for the given waveId
//         const comments = await Comment.findAll({
//             where: {
//                 waveId: {
//                     [Op.eq]: waveId // Use Sequelize's Op.eq operator to match waveId
//                 }
//             },
//             include: [
//                 {
//                     model: User,
//                     as: 'user_comment'
//                 }
//             ]
//         });

//         // If no comments found, return a message
//         if (comments.length === 0) {
//             return res.status(404).json({ message: "No comments found for the given Wave ID" });
//         }

//         // Return comments as JSON response
//         return res.json({ comments });
//     }
//     catch (err: any) {
//         // Handle any server-side errors
//         console.error("Error fetching comments:", err);
//         return res.status(500).json({ message: "Server error, please try again later" });
//     }
// }
// get request
export const getRequests = async (req: any, res: any) => {
    try {
        const { uuid } = req.user;
        const requests = await Request.findAll({ where: { sent_by: uuid } });
        return res.status(200).json({ message: "Requests are fetched", requests });
    }
    catch (err) {
        return res.status(500).json({ "message": `Something went wrong ${err}` });
    }
}

// post request
export const addComment = async (req: any, res: Response): Promise<any> => {
    try {
        const { uuid } = req.user;
        const { comment, waveId } = req.body.data;
        const newcomment = await Comment.create({
            comment,
            waveId,
            userId: uuid
        });
        if (newcomment) {
            res.status(200).json({ "message": "Comment added successfully" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": `Something went wrong ${err}` });
    }
}

//post request
export const updateComment = async (req: any, res: Response): Promise<any> => {
    try {
        const { uuid } = req.user;
        const { comment, commentId } = req.body;
        const updatedComment = await Comment.update({ comment }, { where: { uuid: commentId } });
        if (updatedComment) {
            res.status(200).json({ "message": "Comment updated successfully" });
        }
    }
    catch (err) {
        return res.status(500).json({ "message": `Something went wrong ${err}` });
    }
}

export const deleteComment = async (req: any, res: Response): Promise<any> => {
    try {
        const { uuid } = req.user;
        const { commentId } = req.params;
        await Comment.update({ status: false }, { where: { uuid: commentId } });

        return res.status(200).json({ "message": "Comment deleted successfully" });
    }
    catch (err) {

    }
}
//////////////////
// getcounts
export const getCounts = async (req: any, res: Response): Promise<any> => {
    try {
        const totalUsers = await User.count();
        const activeUsers = await User.count({ where: { status: true } });
        const inactiveUsers = await User.count({ where: { status: false } });
        const totalWaves = await Wave.count();

        res.status(200).json({ "message": "Values Fetched", totalUsers, activeUsers, inactiveUsers, totalWaves });
    }
    catch (err) {
        return res.status(500).json({ message: `Internal Server Error ${err}` });
    }
}


////
export const adminLogout = async (req: any, res: Response): Promise<any> => {
    try {
        const { uuid } = req.user;
        const admin = await Admin.findOne({ where: { uuid } });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        await admin.update({ is_login: false });
        return res.status(200).json({ "message": "Admin logged out successfully" });
    }
    catch (err) {
        return res.status(500).json({ message: `Internal Server Error ${err}` });
    }
}

///

export const editWavestatus = async (req: any, res: Response): Promise<any> => {
    try {
        const { UUID } = req.body;
        const wave: any = await Wave.findOne({ where: { UUID } });
        if (wave) {
            await wave.update({ status: wave.status ? false : true });
        };
        return res.status(200).json({ "message": "Status Updated" });
    }
    catch (err) {
        return res.status(500).json({ message: `Internal Server Error ${err}` });
    }
}
///
export const editUserstatus = async (req: any, res: Response): Promise<any> => {
    try {
        const { UUID } = req.body;
        const user: any = await User.findOne({ where: { UUID } });
        if (user) {
            await user.update({ status: user.status ? false : true });
        };
        return res.status(200).json({ "message": "Status Updated" });
    }
    catch (err) {
        return res.status(500).json({ message: `Internal Server Error ${err}` });
    }
}
////
export const getAllUsers = async (req: any, res: Response): Promise<any> => {
    try {
        const { search, userType } = req.query;
        var users;
        if (userType != 1) {

            users = await User.findAll({
                where: {
                    [Op.and]: [
                        {
                            [Op.or]: [
                                { firstname: { [Op.like]: `%${search}%` } },
                                { lastname: { [Op.like]: `%${search}%` } },
                                { email: { [Op.like]: `%${search}%` } },
                            ]
                        },
                        { status: userType == 2 ? true : false }
                    ]
                }
            });
        } else {
            users = await User.findAll({
                where: {
                    [Op.or]: [
                        { firstname: { [Op.like]: `%${search}%` } },
                        { lastname: { [Op.like]: `%${search}%` } },
                        { email: { [Op.like]: `%${search}%` } },
                    ]
                }
            });
        }
        return res.status(200).json(users);
    }
    catch (err) {
        return res.status(500).json({ message: `Internal Server Error ${err}` });
    }
}
//
export const getAllwaves = async (req: any, res: Response): Promise<any> => {
    try {
        const { search } = req.query;
        const waves = await Wave.findAll({
            include: [
                {
                    model: User,
                    as: 'user_wave',
                    where: {
                        [Op.or]: [
                            { firstname: { [Op.like]: `%${search}%` } },
                            { lastname: { [Op.like]: `%${search}%` } }
                        ]
                    }
                }
            ]
        });
        return res.status(200).json(waves);
    }
    catch (err) {
        return res.status(500).json({ message: `Internal Server Error ${err}` });
    }
}
////
export const updateBasicUser = async (req: any, res: Response) => {
    try {
        const { firstname, lastname, email, phone, address_one,
            address_two, city, state, zip_code } = req.body;
        const user = await User.findOne({ where: { email: email } });

        const updatedBasicUser = await user?.update({
            firstname,
            lastname,
            email,
            phone: phone ? phone : null,
            address_one,
            address_two: address_two ? address_two : null,
            city,
            state,
            zip_code
        });
        res.status(200).json({ "message": "Basic details updated successfully" });
    }
    catch (err) {
        res.status(500).json({ 'message': 'Something went wrong' });
    }
}
///

export const updatePersonalUser = async (req: any, res: Response) => {
    try {
        const { dob, gender, martial_status, social, kids, social_security } = req.body.data;
        const userUUID = req.body.userUUID;
        const user = await User.findByPk(userUUID);

        const updatedPersonalUser = await user?.update({
            dob,
            gender,
            martial_status: martial_status ? martial_status : null,
            social: social ? social : null,
            kids: kids ? kids : null,
            social_security: social_security ? social_security : null
        });
        res.status(200).json({ "message": "Personal details updated successfully" });
    }
    catch (err) {
        res.status(500).json({ 'message': 'Something went wrong' });
    }
}
///
export const deleteWave = async (req: any, res: Response) => {
    try {
        const { UUID } = req.params;
        const wave = await Wave.findByPk(UUID);
        await wave?.destroy();
        res.status(200).json({ "message": "Wave deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ 'message': 'Something went wrong' });
    }
}
////
export const deleteUser = async (req: any, res: Response) => {
    try {
        const { UUID } = req.params;
        const user = await User.findByPk(UUID);
        await user?.destroy();
        res.status(200).json({ "message": "User deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ 'message': 'Something went wrong' });
    }
}
