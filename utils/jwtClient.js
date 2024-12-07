const { JWT } = require("google-auth-library");
const serviceAccount = require("../config/firebase");

const createJwtClient = () => {
  return new JWT({
    email: serviceAccount.client_email,
    key: serviceAccount.private_key,
    scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
  });
};

module.exports = { createJwtClient };
