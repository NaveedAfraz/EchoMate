const express = require("express");
const router = express.Router();
const {
  StartNewConversation,
  CheckConversation,
  GetMessages,
  StartGroupConversation,
} = require("../../controller/chats/messages");

router.post("/start-new-conversation", StartNewConversation);
router.post("/check-conversation", CheckConversation);
router.get("/get-messages/:conversationId", GetMessages);
router.post("/start-group-conversation", StartGroupConversation);
module.exports = router;
