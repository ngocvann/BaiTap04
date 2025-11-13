import { useState, useEffect } from "react";
import { AuthContext } from "./auth.context";
import { getAccountAPI } from "../../util/api";

export const AuthWrapper = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: { email: "", name: "" },
  });

  const [appLoading, setAppLoading] = useState(true);

  const fetchAccount = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setAppLoading(false);
      return;
    }

    const res = await getAccountAPI();
    if (res && !res.EC) {
      setAuth({
        isAuthenticated: true,
        user: res,
      });
    }
    setAppLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      await fetchAccount();
    };
    init();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, appLoading, setAppLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
