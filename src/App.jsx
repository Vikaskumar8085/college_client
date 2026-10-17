import React, { useState } from "react";
import { useSelector } from "react-redux";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";

function App() {
  const { token } = useSelector((state) => state.auth);
  const [isRegister, setIsRegister] = useState(false);

  if (!token) {
    return isRegister ? (
      <Register switchToLogin={() => setIsRegister(false)} />
    ) : (
      <Login switchToRegister={() => setIsRegister(true)} />
    );
  }

  return <Dashboard />;
}

export default App;
