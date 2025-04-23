const express = require("express");
const multer = require("multer");
const { proxyBiometric } = require("../controllers/faceController");

const upload = multer({ dest: "uploads/" });
const router = express.Router();

/**
 * @swagger
 * /biometric/verify:
 *   post:
 *     summary: Proxy biométrico para reconocimiento facial
 *     tags:
 *       - Biometría
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - image
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID del usuario a verificar
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagen del rostro
 *     responses:
 *       200:
 *         description: Verificación exitosa
 *       400:
 *         description: Datos inválidos o faltantes
 *       500:
 *         description: Error al realizar la verificación
 */
router.post("/biometric/verify", upload.single("image"), proxyBiometric);

module.exports = router;
