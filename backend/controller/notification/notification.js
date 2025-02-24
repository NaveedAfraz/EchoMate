const pool = require("../../db");

const fetchNodifications = async (req, res) => {
  const { id } = req.params;
  try {
    console.log(id, "rfffid");
    if (!id) {
      return res.status(400).json({
        message: "Receiver ID is required",
      });
    }
    const [rows] = await pool.query(
      "SELECT r.*, n.* FROM request r JOIN notifications n ON r.notificationid = n.notificationsID WHERE r.receiverID = ?",
      [id]
    );

    console.log(rows, "rows");
    const filteredRows = rows.filter((row) => row.read == 0);
    console.log(filteredRows, "filteredRows");

    // if (filteredRows.length === 0) {
    //   return res.status(400).json({
    //     message: "No notifications found",
    //   });
    // }
    res.status(200).json({
      message: "Notifications fetched successfully",
      data: filteredRows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

const handleRequest = async (req, res) => {
  const { id } = req.params;
  const { type, requestID } = req.body;
  //console.log(id, type, requestID);
  try {
    const [rows] = await pool.query(
      "UPDATE request SET requestStatus = ? WHERE requestID = ?",
      [type, requestID]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        message: "Request not found",
      });
    }
    console.log(rows, "rows of request");

    const [notification] = await pool.query(
      "SELECT notificationid FROM request WHERE requestID = ?",
      [requestID]
    );
    // console.log(notification, "notification");

    let notificationID = notification[0].notificationid;
    console.log(notificationID, "notificationID");

    if (notification.length === 0) {
      return res.status(404).json({
        message: "Notification not found for this request",
      });
    }

    const query2 =
      "UPDATE notifications SET `read` = ? WHERE notificationsID = ?";
    const [rows2] = await pool.query(query2, [true, notificationID]);
    console.log(rows2, "rows2");
    res.status(200).json({
      message: "Request handled successfully",
      data: rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to handle request",
      error: error.message,
    });
  }
};

module.exports = { fetchNodifications, handleRequest };
