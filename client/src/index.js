import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {
  Navigation,
  Footer,
  Home,
  About,
} from "./pages";
import 'bootstrap/dist/css/bootstrap.min.css';
import Query_1 from "./pages/Query_1";
import Query_2 from "./pages/Query_2";
import Query_4 from "./pages/Query_4";
import Query_5 from "./pages/Query_5";
import Query_6 from "./pages/Query_6";
import Query_7 from "./pages/Query_7";
import Query_8 from "./pages/Query_8";

ReactDOM.render(
  <Router>
    <Navigation />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/about" component={About} />            
      <Route exact path="/query_1" component={Query_1} />
      <Route exact path="/query_2" component={Query_2} />
      <Route exact path="/query_4" component={Query_4} />
      <Route exact path="/query_5" component={Query_5} />
      <Route exact path="/query_6" component={Query_6} />
      {/* <Route exact path="/query_7" component={Query_7} /> */}
      <Route exact path="/query_8" component={Query_8} />
    </Switch>
    <Footer />
  </Router>,

  document.getElementById("root")
);