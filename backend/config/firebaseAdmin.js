const {
  initializeApp,
  cert,
  getApps,
} = require("firebase-admin/app");

const {
  getAuth,
} = require("firebase-admin/auth");


/* =========================================
   GET FIREBASE SERVICE ACCOUNT FROM ENV
========================================= */

const encodedServiceAccount =
  process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;


/* =========================================
   CHECK ENV VARIABLE
========================================= */

if (!encodedServiceAccount) {
  throw new Error(
    "FIREBASE_SERVICE_ACCOUNT_BASE64 is missing."
  );
}


/* =========================================
   DECODE BASE64 SERVICE ACCOUNT
========================================= */

let serviceAccount;

try {
  const decodedServiceAccount =
    Buffer.from(
      encodedServiceAccount,
      "base64"
    ).toString("utf8");

  serviceAccount =
    JSON.parse(
      decodedServiceAccount
    );

  console.log(
    "Firebase Admin Config: Loaded"
  );

} catch (error) {

  console.error(
    "Firebase Admin decode error:",
    error.message
  );

  throw new Error(
    "Invalid Firebase service account configuration."
  );
}


/* =========================================
   INITIALIZE FIREBASE ADMIN
========================================= */

if (getApps().length === 0) {

  initializeApp({
    credential: cert(
      serviceAccount
    ),
  });

}


/* =========================================
   FIREBASE ADMIN AUTH
========================================= */

const firebaseAdminAuth =
  getAuth();


/* =========================================
   EXPORT
========================================= */

module.exports = {
  firebaseAdminAuth,
};