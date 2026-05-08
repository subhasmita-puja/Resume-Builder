const userModel = require("../models/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken") 

async function registerUserController(req, res) {

    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Please provide all fields"
        })
    }

    // check user already exists
    const isUserExist = await userModel.findOne({
        $or: [{ username }, { email }]
    })

    if (isUserExist) {
        return res.status(400).json({
            message: "Username or email already taken"
        })
    }
const hash = await bcrypt.hash(password, 10)

    // create user
    const user = await userModel.create({
        username,
        email,
        password: hash
    })
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" })
    res.cookie("token", token)
    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        },
   
    })
    
}


async function loginUserController(req, res) {

    const { email, password } = req.body    
    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }  
    const isPasswordMatch = await bcrypt.compare(password, user.password) 
    if (!isPasswordMatch) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" })
    res.cookie("token", token)
    res.status(200).json({
        message: "User logged in successfully",
    user: {
        id: user._id,
        username: user.username,
        email: user.email,
    },
    })

}

module.exports = {
    registerUserController,
    loginUserController
}