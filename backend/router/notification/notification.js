const express = require("express");
const router = express.Router();
const {
  fetchNodifications,
  handleRequest,
} = require("../../controller/notification/notification");

router.get("/:id", fetchNodifications);
router.post("/handleRequest/:id", handleRequest);

module.exports = router;
