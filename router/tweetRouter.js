const express = require("express");
const router = express.Router();
const {
  createTweet,
  getAllTweet,
  getSingleTweet,
  deleteTweet,
} = require("../controllers/tweet_controller");

router.post("/", createTweet);
router.get("/", getAllTweet);
router.get("/:id", getSingleTweet);
router.delete("/:id", deleteTweet);

module.exports = router;
