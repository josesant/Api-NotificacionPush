const express = require("express");
const bodyParser = require("body-parser");
const { JWT } = require("google-auth-library");
const cors = require("cors");
const fs = require("fs");
const axios = require("axios");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

// Configuración del servidor
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Notificaciones Push",
      version: "1.0.0",
      description: "API para manejar notificaciones push con Firebase",
    },
  },
  apis: [__filename], // Indica que las definiciones están en este archivo
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Ruta del archivo de credenciales descargado desde Firebase Console
const SERVICE_ACCOUNT_PATH = "./cred.go.json";

// Verificar si el archivo existe
if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error("El archivo de credenciales no se encuentra en la ruta especificada.");
  process.exit(1);
} else {
  console.log("El archivo de credenciales se encuentra en la ruta especificada.");
}

const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH));
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
 *               deviceToken:
 *                 type: string
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notificación enviada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Faltan datos en la solicitud
 *       500:
 *         description: Error al enviar la notificación
 */
app.post("/send-notification", async (req, res) => {
  const { deviceToken, title, body } = req.body;

  console.log("deviceToken:", deviceToken);
  if (!deviceToken || !title || !body) {
    return res.status(400).json({ error: "Faltan datos en la solicitud" });
  }

  try {
    const client = new JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
    });

    const { access_token: accessToken } = await client.authorize();

    const message = {
      message: {
        token: deviceToken,
        notification: {
          title: title,
          body: body,
        },
      },
    };

    const response = await axios.post(
      `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`,
      message,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ message: "Notificación enviada", response: response.data });
  } catch (error) {
    console.error("Error al enviar la notificación:", error.message);
    res.status(500).json({ error: "Error al enviar la notificación" });
  }
});

// Iniciar el servidor
const PORT = 5011;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Swagger disponible en http://localhost:${PORT}/api-docs`);
});
