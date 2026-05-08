const { Router } = require("express")
const authController = require("../controllers/auth.controller")

const authRoutes = Router()

authRoutes.post("/register", authController.registerUserController)

authRoutes.post("/login", authController.loginUserController)

module.exports = authRoutes