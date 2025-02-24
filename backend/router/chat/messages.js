const express = require("express");
const router = express.Router();
const { StartNewConversation, CheckConversation } = require("../../controller/chats/messages");

router.post("/start-new-conversation", StartNewConversation);
router.post("/check-conversation", CheckConversation);

module.exports = router;
