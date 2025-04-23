const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

const FACE_API_URL = "https://acdr-apigw.acudir.net:58443/tch/FaceRecognition";
const FACE_API_KEY = "B6p6xk41CigvH94D7Lr6aHSYGDHloy";

const proxyBiometric = async (req, res) => {
  try {
    const { id } = req.body;
    const imageFile = req.file;

    if (!id || !imageFile) {
      return res.status(400).json({ error: "ID e imagen son requeridos" });
    }

    const form = new FormData();
    form.append("id", id);
    form.append("image", fs.createReadStream(imageFile.path), {
      filename: imageFile.originalname,
      contentType: imageFile.mimetype,
    });

    const response = await axios.post(FACE_API_URL, form, {
      headers: {
        ...form.getHeaders(),
        acdr: FACE_API_KEY,
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("❌ Error reenviando a Acudir:", error.message);
    const responseData = error.response?.data || { error: "Error al reenviar la imagen" };
    res.status(error.response?.status || 500).json(responseData);
  }
};

module.exports = { proxyBiometric };
