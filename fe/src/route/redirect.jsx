import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Redirect = () => {
    const navigate = useNavigate();
    useEffect(() => {
    const setSessionAndNavigate = async () => {

      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('accessToken');
      await sessionStorage.setItem('token', JSON.stringify(accessToken));
      await navigate("/contact");
      window.location.reload();
    };

    setSessionAndNavigate();
  }, [navigate]);

  return (
    <p>
      Loading...
    </p>
  );
};

export default Redirect;
