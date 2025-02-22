const ImageKit = require("imagekit");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const imagekit = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL,
});

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer.toString("base64");

    const uploadResponse = await imagekit.upload({
      file: fileBuffer,
      fileName: req.file.originalname,
      folder: "/profile_pictures",
    });

    res.json({ success: true, imageUrl: uploadResponse.url });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
