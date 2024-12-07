const swaggerJsdoc = require("swagger-jsdoc");
require("dotenv").config();
const API_PREFIX = process.env.API_PREFIX ;
const SERVER_URL = process.env.SWAGGER_SERVER_URL ;

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Notificaciones Push",
      version: "1.0.0",
      description: "API para manejar notificaciones push con Firebase",
    },
    servers: [
      {
        url: `${SERVER_URL}${API_PREFIX}`,
      },
    ],
  },
  apis: ["./routes/*.js"], // Rutas documentadas
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
module.exports = swaggerSpec;
