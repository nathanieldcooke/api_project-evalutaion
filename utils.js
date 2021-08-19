const { validationResult } = require('express-validator');


const asyncHandler = (handler) => (res, req, next) => handler(res, req, next).catch(next)

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

module.exports = { asyncHandler, handleValidationErrors };