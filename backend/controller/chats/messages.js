const pool = require("../../db");

const StartNewConversation = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { senderId, receiverId, conversationID, message } = req.body;
    await connection.beginTransaction();

    if (!conversationID || !senderId || !message || !receiverId) {
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
      // If no conversation exists, create a new one
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

    // Insert the message into the messages table
    const [rows] = await connection.query(
      "INSERT INTO messages (conversationID, senderID, messages) VALUES (?, ?, ?)",
      [conversationId, senderId, message]
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

const CheckConversation = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { senderId, receiverId } = req.body;
    console.log(senderId, receiverId, "senderId, receiverId");

    const [rows] = await connection.query(
      `SELECT c.id 
       FROM Conversations c
       JOIN participations p1 ON c.id = p1.conversationID
       JOIN participations p2 ON c.id = p2.conversationID
       WHERE p1.participantID = ? AND p2.participantID = ?`,
      [senderId, receiverId]
    );
    console.log(rows, "rows");
    if (rows.length > 0) {
      return res.status(200).json(rows[0].id);
    } else {
      return res.status(404).json({ message: "No conversation found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    connection.release();
  }
};

// const SendMessages = async (req, res) => {
//   try {
//     const { conversationId, senderId, message } = req.body;
//     const connection = await pool.getConnection();
//     if (!conversationId || !senderId || !message) {
//       console.log("Missing required fields");
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     await connection.beginTransaction();

//     const [conversationResult] = await connection.query(
//       "SELECT * FROM Conversations WHERE id = ?",
//       [conversationId]
//     );
//     if (conversationResult.length === 0) {
//       return res.status(404).json({ message: "Conversation not found" });
//     }

//     await connection.commit();

//     return res.status(200).json({ message: "Message sent successfully" });
//   } catch (error) {
//     await connection.rollback();
//     console.log(error);
//     return res.status(500).json({ message: "Internal server error" });
//   } finally {
//     connection.release();
//   }
// };

const GetMessages = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { conversationId } = req.params;
    console.log(conversationId, "conversationId");

    if (!conversationId) {
      console.log("Missing conversationId");
      return res.status(400).json({ message: "Missing conversationId" });
    }

    const [rows] = await connection.query(
      "SELECT * FROM messages WHERE conversationID = ?",
      [conversationId]
    );
    console.log(rows, "rows");
    if (rows.length === 0) {
      console.log("No messages found");
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
  CheckConversation,
  GetMessages,
};
