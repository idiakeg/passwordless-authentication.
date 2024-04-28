const { Schema, model } = require("mongoose");

const tweetSchema = new Schema(
    {
        content: {
            type: String,
            required: [true, "Please provide an email"],
        },
        image: String,
        impressions: { type: Number, default: 0 },
        tweet_creator: {
            type: Schema.Types.ObjectId,
            ref: "twitter_user",
        },
    },
    { timestamps: true }
);

const tweetModel = model("tweets", tweetSchema);

module.exports = tweetModel;
