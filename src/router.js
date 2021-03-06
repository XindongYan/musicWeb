import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import IndexPage from './routes/IndexPage';
import Register from './routes/Register';
import Login from './routes/Login';
import Backend from './routes/backend';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/backend" exact component={Backend} />
        <Route path="/login" exact component={Login} />
        <Route path="/register" exact component={Register} />
        <Route path="/" exact component={IndexPage} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
