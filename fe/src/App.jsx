import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Link, Routes, Navigate } from "react-router-dom";
import TableData from "./route/table";
import Contact from "./route/contact";
import Redirect from "./route/redirect";
import cookies from "./utils/cookies";

const App = () => {
  useEffect(() => {
   

      const userDataString = sessionStorage.getItem('token');
      console.log(userDataString);
      if (!userDataString){
       (window.location.href = "http://localhost:8082/api/V1/login") 
      }

 


  }, []);

  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/tableData">Check Table</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </nav>

      <hr />

      <Routes>
        <Route path="/contact" element={<Contact />} />
        <Route path="/tableData" element={<TableData />} />
        <Route path="/redirecting" element={<Redirect />} />
        {/* You can add more routes here */}
        {/* <Route path="/otherRoute" element={<OtherComponent />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
