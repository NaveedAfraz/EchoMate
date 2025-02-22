const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
app.use(express.json());
const { requireAuth } = require("@clerk/express");
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/api", requireAuth());
const imgRoute = require("./helper/imageUpload");
app.use("/api/imageUpload", imgRoute);

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// })

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});
