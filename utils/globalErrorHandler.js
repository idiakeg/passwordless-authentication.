const globalErrorHandler = (err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        status: "error",
        msg: err.message || "Internal server error.",
        error: err,
    });
};

module.exports = globalErrorHandler;
