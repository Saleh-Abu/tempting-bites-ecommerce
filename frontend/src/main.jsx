import { StrictMode } from "react";

import {
  createRoot,
} from "react-dom/client";

import {
  BrowserRouter,
} from "react-router-dom";

import {
  Provider,
} from "react-redux";

import App from "./App.jsx";

import "./index.css";

import {
  store,
} from "./store/store";

import {
  AuthProvider,
} from "./context/AuthContext.jsx";


createRoot(
  document.getElementById("root")
).render(
  <StrictMode>

    <Provider store={store}>

      <BrowserRouter>

        <AuthProvider>

          <App />

        </AuthProvider>

      </BrowserRouter>

    </Provider>

  </StrictMode>
);