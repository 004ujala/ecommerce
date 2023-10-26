const jwt = require('jsonwebtoken');
const colors = require('colors');
const userModel = require('../models/userModel');


const requireSignIn = async (req, res, next) => {
    try {
        const decode = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);

        req.user = decode;
        next();
    } catch (error) {
        console.log(`required to be signIn`.bgYellow.white);
        res.send({ success: false, message: "require signIn" })
    }
}

const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById({ _id: req.user._id });
        if (user.role !== 1) {
            return res.status(401).send({
                success: false,
                message: "unAuthorized access"
            })
        } else {
            next();
        }
    } catch (error) {
        console.log(`some error occurred while checking for admin`.bgRed.white);
        res.status(401).send({
            success: false,
            message: "error in admin middleware"
        })
    }
}

module.exports = {
    requireSignIn,
    isAdmin
}