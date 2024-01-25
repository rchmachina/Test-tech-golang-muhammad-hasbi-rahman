// NavigationMenu.jsx
import React from "react";
import { Link } from "react-router-dom";

const NavigationMenu = () => {
  const userLoginOauthGoogle = sessionStorage.getItem("token");
  const userLoginNonOauth = sessionStorage.getItem("loginWithoutOAuth");
  const alreadyLogin = userLoginOauthGoogle || userLoginNonOauth;

  return (
    <ul>
      <li>
        <Link to="/contact">Contact</Link>
      </li>
      <li>
        <Link to="/tableData">Table Data</Link>
      </li>

      {alreadyLogin ? (
        <li>
          <Link to="logout">log out</Link>
        </li>
      ) : null}
    </ul>
  );
};

export default NavigationMenu;
