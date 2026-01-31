import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const SessionExpiryContext = createContext();


const ONE_HOUR = 60 * 60 * 1000;
const CHECK_INTERVAL = 5 * 1000;

const SessionExpiryProvider = ({ children }) => {
  const [expired, setExpired] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const loginTime = localStorage.getItem("loginTime");

    if (!token || !loginTime) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - Number(loginTime);

      if (elapsed >= ONE_HOUR) {
        setExpired(true);
        clearInterval(interval);
      }
    }, CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const logout = () => {
    localStorage.clear();
    setExpired(false);
    window.location.reload();
    navigate("/home", { replace: true });
  };

  return (
    <SessionExpiryContext.Provider value={{ expired, logout }}>
      {children}

      {expired && (
        <div className="sessionExpired" style={overlay}>
          <div style={popup}>
            <h3>Session Expired</h3>
            <p>Your session has expired. Please login again.</p>
            <button onClick={logout}>Login Again</button>
          </div>
        </div>
      )}
    </SessionExpiryContext.Provider>
  );
};

export default SessionExpiryProvider;

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const popup = {
  background: "#fff",
  padding: 25,
  width: 350,
  borderRadius: 8,
  textAlign: "center",
};
