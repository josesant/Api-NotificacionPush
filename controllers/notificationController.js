const axios = require("axios");
const { JWT } = require("google-auth-library");
const serviceAccount = require("../config/firebase");

// Verificar si un token de FCM es válido
const validateToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token es requerido" });
  }

  try {
    const client = new JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
    });

    const { access_token: accessToken } = await client.authorize();

    // Prueba el token enviando un mensaje de verificación a FCM
    const testMessage = {
      message: {
        token: token,
        notification: {
          title: "Verificación",
          body: "Token válido.",
        },
      },
    };

    await axios.post(
      `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`,
      testMessage,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ valid: true, message: "Token válido." });
  } catch (error) {
    console.error("Error al validar el token:", error.response?.data || error.message);

    // Manejar errores específicos de FCM
    if (error.response?.data?.error?.status === "INVALID_ARGUMENT") {
      return res.status(400).json({ valid: false, error: "Token inválido." });
    }

    res.status(500).json({ valid: false, error: "Error al validar el token." });
  }
};

// Enviar una notificación
const sendNotification = async (req, res) => {
  console.log(req.body);
  const { senderToken, receiverToken, title, body } = req.body;

  if (!senderToken || !receiverToken || !title || !body) {
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
        token: receiverToken,
        notification: { title, body },
        data: { senderToken },
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

    res.json({
      message: "Notificación enviada",
      senderToken,
      receiverToken,
      response: response.data,
    });
  } catch (error) {
    console.error("Error al enviar la notificación:", error.message);
    res.status(500).json({ error: "Error al enviar la notificación" });
  }
};

module.exports = { sendNotification, validateToken };
