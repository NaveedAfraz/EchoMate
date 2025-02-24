const { clerkClient } = require("@clerk/express");
const pool = require("../../db");
const { useAuth } = require("@clerk/express");
const getSearchResults = async (req, res) => {
  try {
    const { searchTerm } = req.params;
    if (!searchTerm) {
      return res.status(400).json({ message: "Search term is required" });
    }

    const users = await clerkClient.users.getUserList();
    // console.log(users, "users");
    const q = "SELECT * FROM request WHERE senderID = ?";
    const values = [req.auth?.userId];
    const [result] = await pool.query(q, values);
    //console.log(result, "result.rows");

    if (!users) {
      console.log("Users not found");
    }
    const filteredUsers = users.data.filter((user) => {
      return user.firstName.includes(searchTerm);
    });
    const formattedUsers = filteredUsers.map((user) => ({
      id: user.id,
      UserName: `${user.firstName} ${user.lastName ? user.lastName : ""}`,
      image: user.imageUrl,
      requested: result.some((request) => request.receiverID === user.id),
    }));
    console.log(formattedUsers, "formattedUsers");
    return res.status(200).json({ data: formattedUsers });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const sendRequest = async (req, res) => {
  let connection;
  try {
    const senderID = req.auth?.userId;
    const { receiverID } = req.body;

    if (!senderID || !receiverID) {
      console.log("senderID", senderID);
      console.log("receiverID", receiverID);
      return res
        .status(400)
        .json({ message: "Sender ID and Receiver ID are required" });
    }

    const senderDetails = await clerkClient.users.getUser(senderID);
    if (!senderDetails) {
      return res.status(404).json({ message: "Sender not found" });
    }

    let username = senderDetails.firstName || "";
    if (senderDetails.lastName) {
      username += ` ${senderDetails.lastName}`;
    }

    // Get a connection from the pool
    connection = await pool.getConnection();

    // Check if a request already exists
    const [existingRequest] = await connection.execute(
      "SELECT * FROM request WHERE senderID = ? AND receiverID = ?",
      [senderID, receiverID]
    );

    if (existingRequest.length > 0) {
      return res.status(409).json({ message: "Request already exists" });
    }

    // Start a transaction
    await connection.beginTransaction();

    // Insert into notifications and get the inserted ID
    const [notificationResult] = await connection.query(
      "INSERT INTO notifications (`read`) VALUES (?)",
      [false]
    );
    const notificationId = notificationResult.insertId;

    // Insert into request using the notificationId
    const [requestResult] = await connection.execute(
      "INSERT INTO request (senderID, receiverID, UserName, image, createdAt, requestStatus, notificationId) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        senderID,
        receiverID,
        username,
        senderDetails.imageUrl,
        new Date(),
        "pending",
        notificationId,
      ]
    );

    // Commit the transaction
    await connection.commit();

    res.status(201).json({
      message: "Friend request sent successfully",
      data: requestResult,
    });
  } catch (error) {
    console.log(error);

    if (connection) {
      // Rollback the transaction in case of error
      await connection.rollback();
    }

    res.status(500).json({
      message: "Failed to send friend request",
      error: error.message,
    });
  } finally {
    if (connection) {
      // Release the connection back to the pool
      connection.release();
    }
  }
};

const getReqAccepted = async (req, res) => {
  try {
    const senderID = req.auth?.userId;
    // console.log(senderID);

    if (!senderID) {
      console.log("Sender ID is missing");
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const q = "SELECT * FROM request WHERE senderID = ?";
    const [rows] = await pool.execute(q, [senderID]);
    // console.log(rows);

    const receiverID = rows.map((row) => row.receiverID);
    console.log(receiverID);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No accepted friend requests found" });
    }

    const q1 = "SELECT * FROM request WHERE senderID = ?";
    const values = [req.auth?.userId];
    const [result] = await pool.query(q1, values);

    const users = await clerkClient.users.getUserList({ ids: receiverID });
    const formattedUsers = users.data
      .filter((user) => user.id != senderID)
      .map((user) => ({
        id: user.id,
        UserName: `${user.firstName} ${user.lastName ? user.lastName : ""}`,
        image: user.imageUrl,
        requested: result.some((request) => request.receiverID === user.id),
      }));
    return res.status(200).json({ data: formattedUsers });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = { getSearchResults, sendRequest, getReqAccepted };
