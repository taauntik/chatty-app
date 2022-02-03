const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chat.controllers");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.route("/").post(protect, accessChat).get(protect, fetchChats);
router.post("/group", protect, createGroupChat);
router.put("/rename", protect, renameGroup);
router.put("/group-add", protect, addToGroup);
router.put("/group-remove", protect, removeFromGroup);

module.exports = router;
