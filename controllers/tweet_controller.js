const tokenModel = require("../models/token_model");
const tweetModel = require("../models/tweet_model");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const jwt = require("jsonwebtoken");

// ------> create tweet
const createTweet = asyncErrorHandler(async (req, res, next) => {
    const { content, image } = req.body;
    const { _id } = req.user;

    let tweet_creator = _id.toString();

    console.log(tweet_creator);

    const tweet = await tweetModel.create({ content, image, tweet_creator });
    res.status(200).json({ status: "success", tweet });
});

// ------> get all tweets
const getAllTweet = asyncErrorHandler(async (req, res) => {
    const tweets = await tweetModel
        .find({})
        .populate({ path: "tweet_creator", select: ["email", "name"] });
    res.status(200).json({ status: "success", tweets });
});

// ------> get single tweet
const getSingleTweet = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const tweet = await tweetModel
        .find({ _id: id })
        .populate({ path: "tweet_creator", select: ["email", "name"] });
    if (tweet.length === 0) {
        return res.status(404).json({
            status: "error",
            msg: "No such tweet exist",
        });
    }
    res.status(200).json({ status: "success", tweet });
});

// ------> delete tweet
const deleteTweet = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    await tweetModel.findByIdAndDelete({ _id: id });
    res.status(200).json({
        status: "success",
        msg: "tweet successfully deleted.",
    });
});

module.exports = {
    createTweet,
    getAllTweet,
    getSingleTweet,
    deleteTweet,
};
