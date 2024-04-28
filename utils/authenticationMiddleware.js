const asyncErrorHandler = require("./asyncErrorHandler");
const jwt = require("jsonwebtoken");
const tokenModel = require("../models/token_model");

const authenticationMiddleware = asyncErrorHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const jwtToken = authHeader?.split(" ")[1];

    if (!jwtToken) {
        return res
            .status(401)
            .json({ status: "error", msg: "You are not logged in." });
    }

    // decode the token
    const payload = jwt.verify(jwtToken, process.env.SECRET_STRING);
    const dbApiToken = await tokenModel
        .findById(payload.token_id)
        .populate("user");

    if (!dbApiToken.isValid)
        return res
            .status(401)
            .json({ status: "error", msg: "API token is not valid." });

    if (dbApiToken.expiresIn < new Date())
        return res
            .status(401)
            .json({ status: "error", msg: "API token has expired." });

    req.user = dbApiToken.user;

    next();
});

module.exports = authenticationMiddleware;
