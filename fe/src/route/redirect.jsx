import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Redirect = () => {
    const navigate = useNavigate();
    useEffect(() => {
    const setSessionAndNavigate = async () => {

      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('accessToken');
      const tokenNonAuth= urlParams.get('tokenNonAuth');

      await sessionStorage.setItem('token', JSON.stringify(accessToken));
      await sessionStorage.setItem('tokenNonAuth', JSON.stringify(tokenNonAuth));
      navigate("/");
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
