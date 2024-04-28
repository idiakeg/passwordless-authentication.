const jwt = require("jsonwebtoken");

const generateAuthToken = (apiTokenId) => {
    payload = { token_id: apiTokenId };
    secret = process.env.SECRET_STRING;

    return jwt.sign(payload, secret, { noTimestamp: true }); //timestamps (iat and expires in) are removed because i already implemented a custom way of invalidating tokens.
};

module.exports = generateAuthToken;
