import axios from "axios";


/* =========================================
   CUSTOMER API INSTANCE
========================================= */

const api = axios.create({
  baseURL:
    "http://localhost:5000/api",

  headers: {
    "Content-Type":
      "application/json",
  },
});


/* =========================================
   REQUEST INTERCEPTOR

   Automatically adds customer JWT
   to protected customer requests.
========================================= */

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        "customerToken"
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(
      error
    );
  }
);


/* =========================================
   RESPONSE INTERCEPTOR
========================================= */

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {

    /*
      IMPORTANT:

      We don't automatically redirect
      here because some public endpoints
      may legitimately return 401.

      ProtectedRoute will handle customer
      page protection later.
    */

    if (
      error.response?.status ===
      401
    ) {
      console.warn(
        "Customer authentication required or session expired."
      );
    }

    return Promise.reject(
      error
    );
  }
);


export default api;