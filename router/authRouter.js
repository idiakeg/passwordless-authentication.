const express = require("express");
const router = express.Router();

const { login, authenticate } = require("../controllers/auth_controller");

router.post("/login", login);
router.post("/authenticate", authenticate);

module.exports = router;
