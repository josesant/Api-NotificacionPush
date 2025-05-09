// const express = require("express");
// const bodyParser = require("body-parser");
// const { JWT } = require("google-auth-library");
// const cors = require("cors");
// const fs = require("fs");
// const axios = require("axios");
// const swaggerUi = require("swagger-ui-express");
// const swaggerJsdoc = require("swagger-jsdoc");

// // Configuración del servidor
// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // Prefijo para las rutas
// const API_PREFIX = "/api-notification-push";

// // Configuración de Swagger
// const swaggerOptions = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "API de Notificaciones Push",
//       version: "1.0.0",
//       description: "API para manejar notificaciones push con Firebase",
//     },
//     servers: [
//       {
//         // url: `https://cochadevprod.com.ar${API_PREFIX}`, // Prefijo incluido en las URLs
//         url: `http://localhost:5011${API_PREFIX}`,
//       },
//     ],
//   },
//   apis: [__filename], // Indica que las definiciones están en este archivo
// };

// const swaggerSpec = swaggerJsdoc(swaggerOptions);
// app.use(`${API_PREFIX}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// // Ruta del archivo de credenciales descargado desde Firebase Console
// const SERVICE_ACCOUNT_PATH = "./cred.go.json";

// // Verificar si el archivo existe
// if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
//   console.error("El archivo de credenciales no se encuentra en la ruta especificada.");
//   process.exit(1);
// } else {
//   console.log("El archivo de credenciales se encuentra en la ruta especificada.");
// }

// const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH));

// // Router para las rutas con prefijo
// const router = express.Router();

// /**
//  * @swagger
//  * tags:
//  *   name: Notificaciones
//  */

// /**
//  * @swagger
//  * /send-notification:
//  *   post:
//  *     summary: Envía una notificación push
//  *     tags: [Notificaciones]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               senderToken:
//  *                 type: string                 
//  *               receiverToken:
//  *                 type: string                 
//  *               title:
//  *                 type: string
//  *               body:
//  *                 type: string                  
//  *     responses:
//  *       200:
//  *         description: Notificación enviada exitosamente
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                 senderToken:
//  *                   type: string
//  *                 receiverToken:
//  *                   type: string
//  *       400:
//  *         description: Faltan datos en la solicitud
//  *       500:
//  *         description: Error al enviar la notificación
//  */
// router.post("/send-notification", async (req, res) => {
//   const { senderToken, receiverToken, title, body } = req.body;
//   console.log("enviando notificacion");
//   console.log("senderToken:", senderToken);
//   console.log("receiverToken:", receiverToken);

//   if (!senderToken || !receiverToken || !title || !body) {
//     return res.status(400).json({ error: `Faltan datos en la solicitud" ${senderToken}, ${receiverToken}  `});
//   }

//   try {
//     const client = new JWT({
//       email: serviceAccount.client_email,
//       key: serviceAccount.private_key,
//       scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
//     });

//     const { access_token: accessToken } = await client.authorize();

//     const message = {
//       message: {
//         token: receiverToken,
//         notification: {
//           title,
//           body,
//         },
//         data: {
//           senderToken, // Incluimos el token del remitente en los datos personalizados
//         },
//       },
//     };

//     const response = await axios.post(
//       `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`,
//       message,
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     res.json({
//       message: "Notificación enviada",
//       senderToken,
//       receiverToken,
//       response: response.data,
//     });
//   } catch (error) {
//     console.error("Error al enviar la notificación:", error.message);
//     res.status(500).json({ error: "Error al enviar la notificación" });
//   }
// });

// // Usar el router con el prefijo
// app.use(API_PREFIX, router);

// // Iniciar el servidor
// const PORT = 5011;
// app.listen(PORT, () => {
//   console.log(`Servidor corriendo en http://localhost:${PORT}`);
//   console.log(`Swagger disponible en http://localhost:${PORT}${API_PREFIX}/api-docs`);
// });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const notificationRoutes = require("./routes/notificationRoutes");
const errorHandler = require("./middlewares/errorHandler");
const faceRoutes = require('./routes/faceRoute');

const app = express();
const API_PREFIX = process.env.API_PREFIX ;

app.use(cors());
app.use(bodyParser.json());
app.use(`${API_PREFIX}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(API_PREFIX, notificationRoutes);
app.use(API_PREFIX, faceRoutes);
app.use(errorHandler);

const PORT = process.env.API_PORT || 5011;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Swagger disponible en http://localhost:${PORT}${API_PREFIX}/api-docs`);
});
