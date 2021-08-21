import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './components/home';
import Register from './components/register';
import Login from './components/login';
import './App.css';

function App() {
  return (
    <div className="App">
      <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/register" component={Register} exact />
          <Route path="/login" component={Login} exact />
          <Route component={Error} />
        </Switch>
    </div>
  );
}

export default App;
