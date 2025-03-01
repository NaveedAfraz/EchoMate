const pool = require("../../db");

const StartNewConversation = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { senderId, receiverId, conversationID, message, image } = req.body;
    await connection.beginTransaction();

    if (!senderId || !message || !receiverId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [existingConversation] = await connection.query(
      `SELECT c.id 
       FROM Conversations c
       JOIN participations p1 ON c.id = p1.conversationID
       JOIN participations p2 ON c.id = p2.conversationID
       WHERE p1.participantID = ? AND p2.participantID = ?`,
      [senderId, receiverId]
    );
    let conversationId;
    if (existingConversation.length > 0) {
      conversationId = existingConversation[0].id;
    } else {
      const [conversationResult] = await connection.query(
        "INSERT INTO Conversations (title, `group`, createdAt, userID) VALUES (?, ?, NOW(), ?)",
        ["New Conversation", "1", senderId]
      );
      conversationId = conversationResult.insertId;

      await connection.query(
        "INSERT INTO participations (participantID, conversationID) VALUES (?, ?), (?, ?)",
        [senderId, conversationId, receiverId, conversationId]
      );
    }

    const [rows] = await connection.query(
      "INSERT INTO messages (conversationID, senderID,receiverID,messages,messageImage) VALUES (?, ?,?, ?,?)",
      [conversationId, senderId, receiverId, message, image ? image : null]
    );

    await connection.commit();

    return res.status(200).json({
      message: "Message sent successfully",
      data: rows,
      conversationId: conversationId,
    });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    connection.release();
  }
};

const StartGroupConversation = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { senderId, isGroup, message, image, groupName, conversationID } =
      req.body;
    await connection.beginTransaction();

    if (!senderId || !message || !conversationID) {
      return res.status(400).json({
        message:
          "Missing required fields. Need senderId, message, and groupName",
      });
    }
    let conversationId;
    if (!conversationID) {
      const [conversationResult] = await connection.query(
        "INSERT INTO Conversations (title, `group`, createdAt, userID) VALUES (?, ?, NOW(), ?)",
        [groupName, isGroup ? "1" : "0", senderId]
      );
      conversationId = conversationResult.insertId;
      await connection.query(
        "INSERT INTO participations (participantID, conversationID) VALUES (?, ?)",
        [senderId, conversationId]
      );
    } else {
      conversationId = conversationID;
    }

    const [rows] = await connection.query(
      "INSERT INTO messages (conversationId, senderId,receiverId, messages,ReadReceipts, messageImage) VALUES (?, ?, ?, ?, ?, ?)",
      [conversationId, senderId, "group", message, "delivered", image ? image : null]
    );

    await connection.commit();

    return res.status(200).json({
      message: "Group created successfully",
      data: rows,
      conversationId: conversationId,
    });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    connection.release();
  }
};

const CheckConversation = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { senderId, receiverId, isGroup } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let rows;
    if (receiverId && !isGroup) {
      [rows] = await connection.query(
        `SELECT c.id  
         FROM Conversations c
         JOIN participations p1 ON c.id = p1.conversationID 
         JOIN participations p2 ON c.id = p2.conversationID
         WHERE p1.participantID = ? AND p2.participantID = ?
         AND c.\`group\` = 'no'`,
        [senderId, receiverId]
      );
    } else if (receiverId && isGroup) {
      [rows] = await connection.query(
        `SELECT c.id 
         FROM Conversations c
         JOIN participations p ON c.id = p.conversationID
         WHERE c.id = ? AND p.participantID = ? AND c.\`group\` = 'yes'`,
        [receiverId, senderId]
      );
    }

    if (rows.length > 0) {
      if (isGroup) {
        return res.status(200).json(parseInt(receiverId));
      }
      return res.status(200).json(rows[0].id);
    } else {
      return res.status(401).json({ message: "No conversation found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    connection.release();
  }
};

const GetMessages = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { conversationId } = req.params;

    if (!conversationId) {
      return res.status(400).json({ message: "Missing conversationId" });
    }

    const [rows] = await connection.query(
      "SELECT * FROM messages WHERE conversationID = ?",
      [conversationId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "No messages found" });
    }
    return res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    connection.release();
  }
};

module.exports = {
  StartNewConversation,
  StartGroupConversation,
  CheckConversation,
  GetMessages,
};
