import React from "react";
import {
  Route,
  Routes,
  BrowserRouter
} from "react-router-dom";

import LandingPage from "./components/views/LandingPage/Sections/LandingPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/Register";


function App() {
  return (
    <BrowserRouter>
      <div>
        {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
        <Routes>
          <Route exact path="/" Component={LandingPage}/>
          <Route exact path="/login" Component={LoginPage}/>
          <Route exact path="/register" Component={RegisterPage}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;