const auth = require('../auth')
const bcrypt = require('bcryptjs')
const { DatabaseManager } = require('../db/index.js');

getLoggedIn = async (req, res) => {
    try {
        let userId = auth.verifyUser(req);
        if (!userId) {
            return res.status(200).json({
                loggedIn: false,
                user: null,
                errorMessage: "?"
            })
        }

        //const loggedInUser = await User.findOne({ _id: userId });
        const loggedInUser = await DatabaseManager.getUserById(userId);
        console.log("loggedInUser: " + loggedInUser);

        return res.status(200).json({
            loggedIn: true,
            user: {
                userName: loggedInUser.userName,
                email: loggedInUser.email,
                avatar: loggedInUser.avatar
            }
        })
    } catch (err) {
        console.log("err: " + err);
        res.json(false);
    }
}

loginUser = async (req, res) => {
    console.log("loginUser");
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }

        //const existingUser = await User.findOne({ email: email });
        const existingUser = await DatabaseManager.getUserByEmail(email);
        console.log("existingUser: " + existingUser);
        if (!existingUser) {
            return res
                .status(401)
                .json({
                    errorMessage: "Wrong email or password provided."
                })
        }

        console.log("provided password: " + password);
        const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
        if (!passwordCorrect) {
            console.log("Incorrect password");
            return res
                .status(401)
                .json({
                    errorMessage: "Wrong email or password provided."
                })
        }

        // LOGIN THE USER
        const token = auth.signToken(existingUser._id || existingUser.id);
        console.log(token);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: true
        }).status(200).json({
            success: true,
            user: {
                userName: existingUser.userName,
                email: existingUser.email,
                avatar: existingUser.avatar
            }
        })

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

logoutUser = async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        sameSite: "none"
    }).send();
}

registerUser = async (req, res) => {
    console.log("REGISTERING USER IN BACKEND");
    try {
        const { userName, email, password, passwordVerify, avatar } = req.body;
        console.log("create user: " + userName + " " + email + " " + password + " " + passwordVerify);
        if (!userName || !email || !password || !passwordVerify) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        if (userName.trim().length === 0) {
            return res
                .status(400)
                .json({ errorMessage: "User name cannot be empty." });
        }
        console.log("all fields provided");
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }
        console.log("password long enough");
        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter the same password twice."
                })
        }
        console.log("password and password verify match");
        //const existingUser = await User.findOne({ email: email });
        const existingUser = await DatabaseManager.getUserByEmail(email);
        console.log("existingUser: " + existingUser);
        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this email address already exists."
                })
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);
        console.log("passwordHash: " + passwordHash);

        const savedUser = await DatabaseManager.createUser({
            userName,
            email,
            passwordHash,
            avatar: avatar || ''
        });
        const userId = savedUser._id || savedUser.id;
        console.log("new user saved: " + userId);

        // we want to redirect to login screen rather than logging them in
        return res.status(200).json({
            success: true,
            message: "Account created successfully. Please login."
        })
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

updateUser = async (req, res) => {
    try {
        let userId = auth.verifyUser(req);
        if (!userId) {
            return res.status(401).json({ errorMessage: "Unauthorized" });
        }

        const { userName, password, passwordVerify, avatar } = req.body;

        // Validate userName
        if (!userName || userName.trim().length === 0) {
            return res.status(400).json({ errorMessage: "User name cannot be empty." });
        }

        let passwordHash = null;
        if (password || passwordVerify) {
            if (password.length < 8) {
                return res
                    .status(400)
                    .json({
                        errorMessage: "Please enter a password of at least 8 characters."
                    });
            }
            console.log("password long enough");
            if (password !== passwordVerify) {
                return res
                    .status(400)
                    .json({
                        errorMessage: "Please enter the same password twice."
                    })
            }
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            passwordHash = await bcrypt.hash(password, salt);
        }

        const updateData = { userName };
        if (passwordHash) { //user is updating the password
            updateData.passwordHash = passwordHash;
        }

        if (avatar !== undefined) { //user is updating the avatar
            updateData.avatar = avatar;
        }

        const updatedUser = await DatabaseManager.updateUser(userId, updateData);

        return res.status(200).json({
            success: true,
            user: {
                userName: updatedUser.userName,
                email: updatedUser.email,
                avatar: updatedUser.avatar
            },
            message: "Account updated successfully."

        });
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

module.exports = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    updateUser
}