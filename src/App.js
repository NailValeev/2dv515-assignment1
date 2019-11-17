import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route} from "react-router-dom";

import Navbar from "./components/navbar.component"
import Home from "./components/home.component";
import Euclidean from "./components/euclidean.component";
import Pearson from "./components/pearson.component";

function App () {
  return (
    <Router>
      <div className="container">
        <Navbar />
        <br />
        <Route path="/" exact component={Home} />
        <Route path="/euclidean" component={Euclidean} />
        <Route path="/pearson" component={Pearson} />
      </div>
    </Router>
  );
}

export default App;
