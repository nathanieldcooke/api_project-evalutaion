const express = require('express');
const { check, validationResult } = require('express-validator')

const db = require("../db/models");

const { Tweet } = db;



const router = express.Router();

const asyncHandler = (handler) => (res, req, next) => handler(res, req, next).catch(next)  

const tweetNotFoundError = (id) => {
    err = new Error(`a tweet with the id of ${id}, could not be found`)
    err.title = 'Tweet not found'
    err.status = 404
    return err
}

const handleValidationErrors = (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = validationErrors.array().map((error) => error.msg);

        const err = Error("Bad request.");
        err.errors = errors;
        err.status = 400;
        err.title = "Bad request.";
        return next(err);
    }
    next();
};

const tweetValidator = [
    check('message')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a tweet')
        .isLength({max: 280})
        .withMessage('Length must be less than 280 characters.')
]

router.get("/", asyncHandler( async (req, res) => {
    // res.send("Welcome to the express-sequelize-starter!");
    const tweets = await Tweet.allTweets();
    res.json({ tweets });
}));

router.get("/:id(\\d+)", asyncHandler(async (req, res) => {
    const tweetId = req.params.id;
    // res.send("Welcome to the express-sequelize-starter!");
    const tweet = await Tweet.oneTweet(tweetId);
    if (tweet === null) throw tweetNotFoundError(tweetId);  
    res.json({ tweet });
}));

router.post("/", tweetValidator, handleValidationErrors, asyncHandler(async (req, res) => {
    const { message } = req.body;
    console.log('MSG:', message);

    await Tweet.addTweet(message);
    // res.send("Welcome to the express-sequelize-starter!");
    // const tweets = await Tweet.allTweets();
    res.redirect("/tweets")
}));

router.put("/:id(\\d+)", tweetValidator, handleValidationErrors, asyncHandler(async (req, res, next) => {
    const tweetId = req.params.id
    const message = req.body.message



    const tweet = await Tweet.updateTweet(tweetId, message)
    if (tweet === null) {
        err = tweetNotFoundError(tweetId);
        next(err);
    } 
    res.json({ tweet })

}))


router.delete("/:id(\\d+)", asyncHandler(async (req, res, next) => {
    const tweetId = req.params.id

    const tweet = await Tweet.deleteTweet(tweetId)
    if (tweet === null) {
        err = tweetNotFoundError(tweetId);
        next(err);
    }
    res.status(204).end()

}))


module.exports = router;