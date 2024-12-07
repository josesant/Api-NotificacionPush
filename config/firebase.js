const fs = require("fs");
require("dotenv").config();

const SERVICE_ACCOUNT_PATH = process.env.SERVICE_ACCOUNT_PATH;

if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error("El archivo de credenciales no se encuentra en la ruta especificada.");
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH));
module.exports = serviceAccount;
