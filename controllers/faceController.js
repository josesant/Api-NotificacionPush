const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const https = require("https");

const FACE_API_URL = "https://acdr-apigw.acudir.net:58443/tch/FaceRecognition";
const FACE_API_KEY = "B6p6xk41CigvH94D7Lr6aHSYGDHloy";

const agent = new https.Agent({
  rejectUnauthorized: false, // ⚠️ Solo para pruebas
});

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

    // 🧪 LOG: Headers y contenido del form
    console.log("➡️ Headers enviados:");
    console.log({
      ...form.getHeaders(),
      acdr: FACE_API_KEY,
    });

    console.log("➡️ Enviando campos:");
    console.log("ID:", id);
    console.log("Imagen:", imageFile.originalname);

    const response = await axios.post(FACE_API_URL, form, {
      headers: {
        ...form.getHeaders(),
        acdr: FACE_API_KEY,
        "User-Agent": "Mozilla/5.0"
      },
      httpsAgent: agent,
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("❌ Error reenviando a Acudir:", error.message);
    const responseData = error.response?.data || { error: "Error al reenviar la imagen" };

    if (error.response) {
      console.error("🧪 Código:", error.response.status);
      console.error("🧪 Detalle:", error.response.data);
    }

    res.status(error.response?.status || 500).json(responseData);
  }
};


module.exports = { proxyBiometric };
