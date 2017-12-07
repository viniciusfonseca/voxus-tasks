import React from 'react';
import {
  Switch,
  Route
} from 'react-router-dom';

import asAsyncComponent from './utils/asAsyncComponent';

const AsyncHome = asAsyncComponent(() => import('./pages/Home'));
const AsyncAbout = asAsyncComponent(() => import('./pages/About'));
const AsyncLogin = asAsyncComponent(() => import('./pages/Login'))

const App = () => (
  <div className="app">
    <div className="main">
      <Switch>
        <Route exact path="/" component={AsyncHome} />
        <Route path="/about" component={AsyncAbout} />
        <Route path="/login" component={AsyncLogin} />
      </Switch>
    </div>
  </div>
);

export default App;
