const express = require("express");
const { sendNotification, validateToken } = require("../controllers/notificationController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notificaciones
 */

/**
 * @swagger
 * /send-notification:
 *   post:
 *     summary: Envía una notificación push
 *     tags: [Notificaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               senderToken:
 *                 type: string                 
 *               receiverToken:
 *                 type: string                 
 *               title:
 *                 type: string
 *               body:
 *                 type: string                  
 *     responses:
 *       200:
 *         description: Notificación enviada exitosamente
 *       400:
 *         description: Faltan datos en la solicitud
 *       500:
 *         description: Error al enviar la notificación
 */
router.post("/send-notification", sendNotification);

/**
 * @swagger
 * /validate-token:
 *   post:
 *     summary: Valida un token de FCM
 *     tags: [Notificaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token de FCM a validar
 *     responses:
 *       200:
 *         description: Token válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Token inválido
 *       500:
 *         description: Error al validar el token
 */
router.post("/validate-token", validateToken);

module.exports = router;
