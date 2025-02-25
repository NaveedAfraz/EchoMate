const express = require("express");
const router = express.Router();
const {
  StartNewConversation,
  CheckConversation,
  GetMessages,
} = require("../../controller/chats/messages");

router.post("/start-new-conversation", StartNewConversation);
router.post("/check-conversation", CheckConversation);
router.get("/get-messages/:conversationId", GetMessages);
module.exports = router;
