const express = require("express");
const {
  createMessage,
  getConversationByUserId,
  getLastMessages
} = require("../controllers/message.controller");

const router = express.Router();

router.get("/", getLastMessages);
router.get("/:userID", getConversationByUserId);
router.post("/", createMessage);

module.exports = router;
