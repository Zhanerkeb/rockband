import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import 'antd/dist/antd.css'

import Main from './containers/Main';
import Login from './containers/Login';
import './App.css';

function App() {
  return (
    <div className="App">
        <Router>
            <Switch>
                <Route exact path="/admin" component={Login}/>
                <Route path="/main" component={Main}/>
            </Switch>
        </Router>
    </div>
  );
}

export default App;
