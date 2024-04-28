const CustomErrorHandler = require("../utils/customErrorHandler");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const userModel = require("../models/user_model");
const { v4: uuidv4 } = require("uuid");

// create user if it doesnot exist
const generateEmailToken = require("../utils/generateEmailToken");
const tokenModel = require("../models/token_model");
const {
    emailTokenExpiration,
    apiTokenExpiration,
} = require("../utils/emailTokenExpiration");
const generateAuthToken = require("../utils/generateAuthToken");

// generate the emailToken and send it to the user's email
//  ------> Login
const login = asyncErrorHandler(async (req, res, next) => {
    const { email } = req.body;

    if (!email)
        return next(new CustomErrorHandler("Please provide an email.", 400));

    const emailToken = generateEmailToken();

    const expiration = emailTokenExpiration();

    const shortUuid = uuidv4().substring(0, 11);

    const token_check = await tokenModel.findOne({ emailToken });
    // if the token created already exists in the database, halt authentication
    if (token_check) {
        return res.status(400).json({
            status: "error",
            msg: "Could not start the authentication process.",
        });
    }

    // search for user with the email provided, if user doesnot exist, create one.
    const user = await userModel
        .findOneAndUpdate(
            { email }, //search criteria
            { email, username: `user-${shortUuid}` }, // data to update or create
            { upsert: true, new: true } // Options: upsert - create if not found, new - return the new document
        )
        .select("email");

    // create the token
    const token = await tokenModel.create({
        token_type: "EMAIL",
        emailToken,
        expiresIn: expiration,
        user,
    });

    // send the email token to the user's email

    res.status(200).json({
        status: "success",
        token,
    });
});

// validate the emailToken
// generate a long lived email token
//  ------> Authenticate
const authenticate = asyncErrorHandler(async (req, res) => {
    const { email, emailToken } = req.body;

    const dbEmailToken = await tokenModel
        .findOne({ emailToken })
        .populate("user", "email"); //populate the user field with only the user email

    // VALIDATIONS:
    // Token exists and is valid
    if (!dbEmailToken || !dbEmailToken.isValid)
        return res
            .status(404)
            .json({ status: "error", msg: "Email token is invalid." });

    // Token belongs to the right user
    if (dbEmailToken?.user?.email !== email)
        return res.status(400).json({
            status: "error",
            msg: "this token does not belong to you.",
        });

    // Token has not expired
    if (dbEmailToken.expiresIn < new Date())
        return res.status(401).json({ status: "error", msg: "Token expired!" });

    // After the validations are passed, generate / create an API token.
    const apiExpiration = apiTokenExpiration();

    const apiToken = await tokenModel.create({
        token_type: "API",
        expiresIn: apiExpiration,
        user: dbEmailToken?.user?._id,
    });

    // After exchanging the email token for api token, invalidate the email token
    await tokenModel.findByIdAndUpdate(
        dbEmailToken._id,
        { isValid: false },
        { new: true }
    );

    //  we are going to generate a jwt token witht the id of the apitoken in its payload, this way when the user needs to do something that requires authenetication, they can send the generated token back to us and we then check the payload to see if the apitoken id present in it is in our database
    const authToken = generateAuthToken(apiToken._id.toString());

    res.status(200).json({ status: "success", authToken });
});

module.exports = { login, authenticate };
