const { Schema, model } = require("mongoose");
const CustomErrorHandler = require("../utils/customErrorHandler");

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, "Please provide an email"],
            unique: true,
        },
        name: {
            type: String,
        },
        username: {
            type: String,
            unique: true,
        },
        image: String,
        bio: { type: String },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// make sure email is unique before creating user
userSchema.pre("save", async function (next) {
    // if the email was not modified-edited or updated in some way, pass control to the next middleware
    if (!this.isModified("email")) return next(); // "this" represents the current schema, i.e, userSchema

    // if the email was modified, check if a user with that email already exists
    const user = await userModel.findOne({ email: this.email });

    if (user) return next(new CustomErrorHandler("Email already exists.", 409));

    // if the user provides a unique email, pass control to the next middleware
    next();
});

const userModel = model("twitter_user", userSchema);

module.exports = userModel;
