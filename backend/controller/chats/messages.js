const { log } = require("node:console");
const pool = require("../../db");

const StartNewConversation = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { senderId, receiverId } = req.body;
    console.log(senderId, receiverId, "senderId, receiverId");
    await connection.beginTransaction();

    const [conversationResult] = await connection.query(
      "INSERT INTO Conversations (title, `group`, createdAt, userID) VALUES (?, ?, NOW(), ?)",
      ["New Conversation", "1", senderId]
    );
    const conversationId = conversationResult.insertId;

    await connection.query(
      "INSERT INTO participations (participantID, conversationID) VALUES (?, ?), (?, ?)",
      [senderId, conversationId, receiverId, conversationId]
    );

    await connection.query(
      "INSERT INTO messages (conversationID, senderID, messages) VALUES (?, ?, ?)",
      [conversationId, senderId, "Hello, how are you?"]
    );

    await connection.commit();

    return res
      .status(200)
      .json({ message: "Conversation started successfully!" });
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
      return res.status(200).json({ data : rows[0].id });
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

module.exports = {
  StartNewConversation,
  CheckConversation,
};
