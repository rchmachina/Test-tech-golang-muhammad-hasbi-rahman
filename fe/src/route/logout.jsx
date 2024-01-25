import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogOut = () => {
    const navigate = useNavigate();
    useEffect(() => {
    const logingOut = async () => {

      sessionStorage.clear()
      window.location.reload();
    };

    logingOut();
  }, [navigate]);

  return (
    <p>
      log out user loading...
    </p>
  );
};

export default LogOut;
