import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useNavigate,
} from "react-router-dom";
import { TableData, Contact, Redirect, LoginForm, LogOut} from "./route";
import { NavigationMenu } from "./route";

const App = () => {

  const userLoginOauthGoogle = sessionStorage.getItem("token");
  const userLoginNonOauth = sessionStorage.getItem("loginWithoutOAuth");
  const alreadyLogin = userLoginOauthGoogle || userLoginNonOauth;


  return (
    <Router>
      <NavigationMenu />
      <Routes>
        {alreadyLogin ? (
          <>
            <Route path="/contact" element={<Contact />} />
            <Route path="/tableData" element={<TableData />} />
            <Route path="/logout" element={<LogOut />} />
            <Route path="*" element={<Contact />} />
          </>
        ) : (
          <>
            <Route path="/redirecting" element={<Redirect />} />
            <Route path="/loginform" element={<LoginForm />} />
            <Route path="/*" element={<LoginForm />} />
          </>
        )}

      </Routes>
    </Router>
  );
};

export default App;
