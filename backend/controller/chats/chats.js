const { clerkClient } = require("@clerk/express");
const pool = require("../../db");
const { useAuth } = require("@clerk/express");

const getSearchResults = async (req, res) => {
  const senderID = req.auth?.userId;
  try {
    const { searchTerm } = req.params;
    if (!searchTerm) {
      return res.status(400).json({ message: "Search term is required" });
    }

    const users = await clerkClient.users.getUserList();
    const q = "SELECT * FROM request WHERE senderID = ?";
    const values = [req.auth?.userId];
    const [result] = await pool.query(q, values);

    if (!users) {
      // console.log("Users not found");
    }
    const filteredUsers = users.data.filter((user) => {
      return (user.firstName || "").includes(searchTerm);
    });
    const formattedUsers = filteredUsers
      .filter((user) => user.id != senderID)
      .map((user) => {
        const request = result.find((req) => req.receiverID === user.id);
        return {
          id: user.id,
          UserName: `${user.firstName} ${user.lastName ? user.lastName : ""}`,
          image: user.imageUrl,
          requestStatus: request ? request.requestStatus : "unknown",
        };
      });
    // console.log(formattedUsers, "formattedUsers");
    return res.status(200).json({ data: formattedUsers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const sendRequest = async (req, res) => {
  let connection;
  try {
    const senderID = req.auth?.userId;
    const { receiverID } = req.body;

    if (!senderID || !receiverID) {
      // console.log("senderID", senderID);
      // console.log("receiverID", receiverID);
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
    console.error(error);

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
      // console.log("Sender ID is missing");
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const q = "SELECT * FROM request WHERE senderID = ?";
    const [result] = await pool.execute(q, [senderID]);
    // console.log(rows, "rows");

    const receiverID = result.map((row) => row.receiverID);
    // console.log(receiverID);

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No accepted friend requests found" });
    }

    // const q1 = "SELECT * FROM request WHERE senderID = ?";
    // const values = [req.auth?.userId];
    // const [result] = await pool.query(q1, values);

    const users = await clerkClient.users.getUserList({ ids: receiverID });
    //  console.log(users, "users");
    const formattedUsers = users.data
      .filter((user) => user.id != senderID)
      .map((user) => {
        const request = result.find((req) => req.receiverID === user.id);
        return {
          id: user.id,
          UserName: `${user.firstName} ${user.lastName ? user.lastName : ""}`,
          image: user.imageUrl,
          requestStatus: request ? request.requestStatus : null,
        };
      });

    const userID = req.auth?.userId;
    const q1 = `
    SELECT c.*
    FROM Conversations AS c
    JOIN participations AS p
      ON c.id = p.conversationID
    WHERE p.participantID = ?
  `;
    const [result2] = await pool.execute(q1, [userID]);
    // console.log(result2, "rows");
    const group = result2.filter((row) => row.group == "yes");
    // console.log(group, "group");

    return res.status(200).json({ data: formattedUsers, group: group });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Internal server error" });
  }
};

// Backend API route (Node.js/Express or Next.js API route)
const getUser = async (req, res) => {
  const { clerkId } = req.params;
  if (!clerkId) {
    // console.log("Clerk ID is required");
    return res.status(400).json({ message: "Clerk ID is required" });
  }
  const clerkSecretKey = process.env.CLERK_SECRET_KEY;
  // console.log(clerkSecretKey, "clerkSecretKey");
  try {
    const response = await fetch(`https://api.clerk.dev/v1/users/${clerkId}`, {
      headers: {
        Authorization: `Bearer ${clerkSecretKey}`,
        "Content-Type": "application/json",
      },
    });

    //  console.log(response, "response");
    const userData = await response.json();
    const formattedUser = {
      id: userData.id,
      userName: `${userData.first_name} ${
        userData.lastName ? userData.last_Name : ""
      }`,
      image: userData.imageUrl,
    };
    // console.log(formattedUser, "formattedUser");
    res.json({ username: formattedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

const sendLastSeen = async (req, res) => {
  const { userId, lastSeen } = req.body;
  // console.log(userId, "userId");
  // console.log(lastSeen, "lastSeen");
  if (!userId || !lastSeen) {
    return res
      .status(400)
      .json({ message: "User ID and lastSeen are required" });
  }
  try {
    const q = "SELECT * FROM participations WHERE participantID = ?";
    const values = [userId];
    const result = await pool.query(q, values);
    //  console.log(result, "result");

    if (result[0].length === 0) {
      // console.log("User not found");

      return res.status(404).json("User not found");
    }
    const q3 = "UPDATE participations SET lastSeen = ? WHERE participantID = ?";
    const values3 = [lastSeen, userId];
    // console.log(values3, "values3");
    const result3 = await pool.query(q3, values3);
    // console.log(result3, "result3");

    return res.status(200).json("Last seen updated!");
  } catch (error) {
    console.error(error);
    return res.status(500).json("internal serverl error");
  }
};

const getLastSeen = async (req, res) => {
  const { userId } = req.params;
  // console.log(userId, "userId");

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const q =
      "SELECT lastSeen , participantID FROM participations WHERE participantID = ?";
    const [rows] = await pool.query(q, [userId]);

    // console.log(rows, "rows");

    if (rows.length === 0) {
      return res
        .status(200)
        .json({ lastSeen: null, message: "No last seen data found" });
    }

    return res.status(200).json({
      lastSeen: rows[0].lastSeen,
      participantID: rows[0].participantID,
      message: "Last seen retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting last seen:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//senond btn which is use to creaet a new grpup
const newGroup = async (req, res) => {
  try {
    const { groupName, groupImage, userId } = req.body;
    // console.log(groupName, groupImage, userId);

    if (!groupName || !groupImage || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const q =
      "INSERT INTO Conversations (title , `group` ,groupImage, createdAt,userID) VALUES (?,?,?,NOW(),?)";

    const values = [groupName, "yes", groupImage, userId];
    const [result] = await pool.query(q, values);
    // console.log(result, "result");

    if (result.affectedRows === 0) {
      // console.log("Failed to create group");
      return res.status(500).json({ message: "Failed to create group" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Group created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json("internal serverl error");
  }
};

const addParticipantsINGroup = async (req, res) => {
  try {
    const { conversationID, participantID } = req.body;
    if (!conversationID || !participantID) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const q =
      "INSERT INTO participations (conversationID, participantID) VALUES (?,?)";
    const values = [conversationID, participantID];
    const [result] = await pool.query(q, values);
    if (result.affectedRows === 0) {
      // console.log("Failed to add participant");
      return res.status(500).json({ message: "Failed to add participant" });
    }

    return res.status(200).json({ message: "Participant added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json("internal serverl error");
  }
};

module.exports = {
  getSearchResults,
  sendRequest,
  getReqAccepted,
  getUser,
  sendLastSeen,
  getLastSeen,
  newGroup,
  addParticipantsINGroup,
};
