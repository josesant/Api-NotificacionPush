const express = require("express");
const multer = require("multer");
const { proxyBiometric } = require("../controllers/faceController");

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/biometric/verify", upload.single("image"), proxyBiometric);

module.exports = router;
