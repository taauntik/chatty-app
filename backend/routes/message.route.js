const express = require("express");
const { sendMessage, getMessageByChatId } = require("../controllers/message.controllers");
const { protect } = require("../middleware/auth.middleware");
const { route } = require("./user.route");

const router = express.Router();

router.route("/").post(protect, sendMessage);
router.route('/:chatId').get(protect, getMessageByChatId)

module.exports = router;
