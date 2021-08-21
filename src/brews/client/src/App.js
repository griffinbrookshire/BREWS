import './App.css';
import React from 'react';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./Containers/Login"
import Landing from "./Containers/Landing";
import Account from "./Containers/Account";

function App() {
    return (
        <Router>
            <div>
                <Switch>
                    <Route exact path="/" component={Login}></Route>
                    <Route path="/Landing" component={Landing}></Route>
                    <Route path="/Account" component={Account}></Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
