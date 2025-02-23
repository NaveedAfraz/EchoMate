const express = require("express");
const router = express.Router();
const { clerkClient } = require("@clerk/express");

router.get("/:searchTerm", async (req, res) => {
  try {
    const {searchTerm } = req.params;
    console.log(searchTerm);
    if (!searchTerm) {
      return res.status(400).json({ message: "Search term is required" });
    }

    const users = await clerkClient.users.getUserList();
    //console.log(users);

    if (!users) {
      console.log("Users not found");
    }
    const filteredUsers = users.data.filter((user) => {
      return user.firstName.includes(searchTerm);
    });
    const formattedUsers = filteredUsers.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      image: user.profileImageUrl,
    }));
    return res.status(200).json(formattedUsers);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;
