const express = require('express');
const { check, validationResult } = require('express-validator');
const { asyncHandler, handleValidationErrors } = require('../utils.js');
const bcrypt = require('bcryptjs')
const { User, Tweet } = require('../db/models')
const { getUserToken } = require('../auth.js')
const db = require("../db/models");


const router = express.Router();

router.use(requireAuth);

const validateUsername =
    check("username")
        .exists({ checkFalsy: true })
        .withMessage("Please provide a username");

const validateEmailAndPassword = [
    check("email")
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage("Please provide a valid email."),
    check("password")
        .exists({ checkFalsy: true })
        .withMessage("Please provide a password."),
];

router.get(
    "/:id/tweets",
    asyncHandler(async (req, res) => {
        const tweets = Tweet.findAll({
            where: {
                userId: req.params.id
            }
        });
        res.json({tweets})
    })
);

router.post(
    "/",
    validateUsername,
    validateEmailAndPassword,
    handleValidationErrors,
    asyncHandler(async (req, res) => {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, hashedPassword });

        const token = getUserToken(user);
        res.status(201).json({
            user: { id: user.id },
            token,
        });
    })
);

router.post(
    "/token",
    validateEmailAndPassword,
    asyncHandler(async (req, res, next) => {
        const { email, password } = req.body;
        console.log(email, password)
        const user = await User.findOne({
            where: {
                email,
            },
        });

        // console.log('USER: ', user)

        if (!user || !user.validatePassword(password)) {
            console.log("ERRRORRROROROROROORORO")
            const err = new Error("Login failed");
            err.status = 401;
            err.title = "Login failed";
            err.errors = ["The provided credentials were invalid."];
            return next(err);
        }
    
    const token = getUserToken(user);
    res.json({ token, user: { id: user.id } });
    })
);

module.exports = router;