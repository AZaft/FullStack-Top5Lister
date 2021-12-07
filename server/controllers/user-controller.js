const auth = require('../auth')
const User = require('../models/user-model')
const bcrypt = require('bcryptjs')

getLoggedIn = async (req, res) => {
    
    auth.verify(req, res, async function () {
        try{
            const loggedInUser = await User.findOne({ _id: req.userId });
            return res.status(200).json({
                loggedIn: true,
                user: {
                    firstName: loggedInUser.firstName,
                    lastName: loggedInUser.lastName,
                    userName: loggedInUser.userName,
                    email: loggedInUser.email
                }
            }).send();
        }catch(err){
            
        }
    })
}

logoutUser = async (req, res) => {
    try{
        res.clearCookie("token").status(200).json({ success: true })
    } catch(err){
        
    }
}

registerUser = async (req, res) => {
    try {
        const { firstName, lastName, userName, email, password, passwordVerify } = req.body;
        if (!firstName || !lastName || !userName|| !email || !password || !passwordVerify) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }
        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter the same password twice."
                })
        }
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this email address already exists."
                })
        }

        const existingUserName = await User.findOne({ userName: userName });

        if (existingUserName) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this user name already exists."
                })
        }

        const saltRounds = 10;
        const passwordSalt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, passwordSalt);

        const newUser = new User({
            firstName, lastName, userName, email, passwordHash
        });
        const savedUser = await newUser.save();

        // LOGIN THE USER
        const token = auth.signToken(savedUser);

        await res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                userName: savedUser.userName,
                email: savedUser.email
            }
        }).send();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

loginUser = async (req, res) => {
    try {
        const {user, password} = req.body;
        if (!user || !password ) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        
        const existingUser = await User.findOne({ userName: user });

        if (!existingUser) {
            return res
                .status(400)
                .json({
                    errorMessage: "User with that username does not exist."
                });
        }else{
            const passwordMatch = await bcrypt.compare(password, existingUser.passwordHash);
            if(passwordMatch){
                const token = auth.signToken(existingUser);
                await res.cookie("token", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none"
                }).status(200).json({
                    success: true,
                    user: {
                        firstName: existingUser.firstName,
                        lastName: existingUser.lastName,
                        userName: existingUser.userName,
                        email: existingUser.email
                    }
                }).send();
            } else{
                return res
                .status(400)
                .json({
                    errorMessage: "Password is incorrect."
                });
            }
        }

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}



module.exports = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser
}