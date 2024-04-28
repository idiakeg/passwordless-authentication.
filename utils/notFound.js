const CustomErrorHandler = require("./customErrorHandler");

const notFound = (req, res, next) => {
    const error = new CustomErrorHandler(
        `Cannot find url: ${req.originalUrl} on the server`,
        404
    );

    // pass this error on to the global error handler
    next(error);
};

module.exports = notFound;
