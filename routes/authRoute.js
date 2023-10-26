const express = require('express');
const userModel = require('../models/userModel');
const { hashPassword, comparePassword } = require('../helpers/authHelper');
const jwt = require('jsonwebtoken');
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware');


const router = express.Router();

// routing for different task


// registering the user!!
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;
        if (!name) {
            return res.send({ message: "Name is Required" })
        }
        if (!email) {
            return res.send({ message: "Email is Required" })
        }
        if (!password) {
            return res.send({ message: "Password is Required" })
        }
        if (!phone) {
            return res.send({ message: "Phone is Required" })
        }
        if (!address) {
            return res.send({ message: "Address is Required" })
        }
        let existUser = await userModel.findOne({ email });
        if (existUser) {
            return res.status(200).send({
                success: false,
                message: "user exists!"
            })
        }
        const hashedPassword = await hashPassword(password);
        const user = new userModel({ name, email, phone, address, password: hashedPassword });
        await user.save();
        res.status(201).send({
            success: true,
            message: "user registered successfully"
        })


    } catch (error) {
        console.log(`error in registering`.bgRed.white);
        res.status(500).json({ success: false, message: "not registered" });
    }
})


// login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        // validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: 'invalid email or password'
            })
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'invalid email or password'
            })
        }
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(404).send({
                success: false,
                message: 'invalid email or password'
            })
        }
        // token
        const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.status(200).send({
            success: true,
            message: "login successfully",
            user,
            token
        })

    } catch (error) {
        console.log("error in login the user".bgRed.white);
        res.status(500).send({
            success: false,
            message: "error in login"
        })

    }
})

router.get('/test', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send("route is protected");
})

router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ success: true });
})

module.exports = router;