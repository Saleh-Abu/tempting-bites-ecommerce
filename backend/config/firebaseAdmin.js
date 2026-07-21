const {
  initializeApp,
  cert,
  getApps,
} = require("firebase-admin/app");

const {
  getAuth,
} = require("firebase-admin/auth");

const serviceAccount =
  require("./firebase-service-account.json");


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