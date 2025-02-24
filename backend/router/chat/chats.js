const express = require("express");
const router = express.Router();

const {
  getSearchResults,
  sendRequest,
  getReqAccepted,
} = require("../../controller/chats/chats");

router.get("/fetchUsers/:searchTerm", getSearchResults);
router.get("/fetchRequestedUsers", getReqAccepted);
router.post("/sendRequest/:senderID", sendRequest);
module.exports = router;
