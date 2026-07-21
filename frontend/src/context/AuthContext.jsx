import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(null);

  const [token, setToken] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  /* =========================================
     RESTORE CUSTOMER LOGIN
  ========================================= */

  useEffect(() => {
    try {
      const storedToken =
        localStorage.getItem(
          "customerToken"
        );

      const storedUser =
        localStorage.getItem(
          "customerUser"
        );

      if (
        storedToken &&
        storedUser
      ) {
        const parsedUser =
          JSON.parse(
            storedUser
          );

        setToken(
          storedToken
        );

        setUser(
          parsedUser
        );
      }
    } catch (error) {
      console.error(
        "Unable to restore customer session:",
        error
      );

      /*
        If stored user data is broken,
        clear the invalid session.
      */

      localStorage.removeItem(
        "customerToken"
      );

      localStorage.removeItem(
        "customerUser"
      );

      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);


  /* =========================================
     CUSTOMER LOGIN
  ========================================= */

  const login = (
    userData,
    jwt
  ) => {
    if (
      !userData ||
      !jwt
    ) {
      console.error(
        "Login requires user data and token."
      );

      return;
    }

    setUser(userData);

    setToken(jwt);

    localStorage.setItem(
      "customerToken",
      jwt
    );

    localStorage.setItem(
      "customerUser",
      JSON.stringify(
        userData
      )
    );
  };


  /* =========================================
     CUSTOMER LOGOUT
  ========================================= */

  const logout = () => {
    setUser(null);

    setToken(null);

    localStorage.removeItem(
      "customerToken"
    );

    localStorage.removeItem(
      "customerUser"
    );
  };


  /* =========================================
     UPDATE CUSTOMER DATA

     Useful later for:
     - Profile editing
     - Phone updates
     - Name updates
  ========================================= */

  const updateUser = (
    updatedUser
  ) => {
    if (!updatedUser) {
      return;
    }

    setUser(
      updatedUser
    );

    localStorage.setItem(
      "customerUser",
      JSON.stringify(
        updatedUser
      )
    );
  };


  /* =========================================
     AUTHENTICATION STATUS
  ========================================= */

  const isAuthenticated =
    Boolean(
      token && user
    );


  /* =========================================
     PROVIDER
  ========================================= */

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,

        isAuthenticated,

        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


/* =========================================
   AUTH HOOK
========================================= */

export function useAuth() {
  const context =
    useContext(
      AuthContext
    );

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}


export default AuthContext;