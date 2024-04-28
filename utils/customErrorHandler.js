class CustomErrorHandler extends Error {
    constructor(message, errCode) {
        super(message);

        // this.message = message;
        this.statusCode = errCode;
    }
}

module.exports = CustomErrorHandler;
