const express = require("express");
const router = express.Router();

const {
  getSearchResults,
  sendRequest,
  getReqAccepted,
  getUser,
  sendLastSeen,
  getLastSeen,
} = require("../../controller/chats/chats");

router.get("/fetchUsers/:searchTerm", getSearchResults);
router.get("/fetchRequestedUsers", getReqAccepted);
router.post("/sendRequest/:senderID", sendRequest);
router.get("/getUser/:clerkId", getUser);
router.post("/sendlastSeen", sendLastSeen);
router.get("/last-seen/:userId", getLastSeen);
module.exports = router;
