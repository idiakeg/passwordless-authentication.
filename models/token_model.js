const { Schema, model } = require("mongoose");

const tokenSchema = new Schema(
    {
        token_type: {
            type: String,
            enum: {
                values: ["EMAIL", "API"],
                message: "{VALUE} is not a valid token type",
                required: [true, "Please include a token type."],
            },
        },
        emailToken: {
            type: String,
            unique: true,
            sparse: true, // This allows multiple documents to have null or missing values
            validate: {
                validator: function (value) {
                    // Validate uniqueness only if the field is provided
                    if (this.token_type === "EMAIL") {
                        return value !== undefined; // Return true if the field is provided
                    }
                    return true; // Allow null or missing value if token_type is not EMAIL i.e API.
                },
                message: "emailToken must be unique if token_type is EMAIL.",
            },
        },
        isValid: {
            type: Boolean,
            default: true,
        },
        expiresIn: {
            type: Date,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "twitter_user",
        },
    },
    { timestamps: true }
);

const tokenModel = model("token", tokenSchema);

module.exports = tokenModel;
