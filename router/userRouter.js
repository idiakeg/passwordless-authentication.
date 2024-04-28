const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
} = require("../controllers/user_controllers");

router.post("/", createUser);
router.patch("/:id", updateUser);
router.get("/", getAllUsers);
router.get("/:id", getSingleUser);
router.delete("/:id", deleteUser);

module.exports = router;
