const userModel = require("../models/user_model");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

// ------> create user
const createUser = asyncErrorHandler(async (req, res, next) => {
    const { name, email, username, image, bio } = req.body;
    const user = await userModel.create({ name, email, username, image, bio });

    res.status(200).json({ status: "success", user });
});

// ------> get all users
const getAllUsers = asyncErrorHandler(async (req, res) => {
    const user = await userModel.find({});
    res.status(200).json({ status: "success", user });
});

// ------> get single user
const getSingleUser = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const user = await userModel.find({ _id: id });
    if (user.length === 0) {
        return res.status(404).json({
            status: "error",
            msg: "No such user exists.",
        });
    }
    res.status(200).json({ status: "success", user });
});

// ------> update a user
const updateUser = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { username, bio, image } = req.body;

    const user = await userModel.findByIdAndUpdate(
        { _id: id },
        { username, image, bio },
        { new: true }
    );
    res.status(200).json({ status: "success", user });
});

// ------> delete user
const deleteUser = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    await userModel.findByIdAndDelete({ _id: id });
    res.status(200).json({
        status: "success",
        msg: "user successfully deleted.",
    });
});

module.exports = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
};
