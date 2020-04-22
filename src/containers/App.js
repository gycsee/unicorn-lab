import React from 'react';
import { Route, Switch } from 'react-router-dom';
import loadable from '@loadable/component';

const Public = loadable(() => import('containers/Public'));
const GdPages = loadable(() => import('containers/GdPages'));

const App = () => {
  return (
    <Switch>
      <Route path="/gd" >
        <GdPages />
      </Route>
      <Route path="/" >
        <Public />
      </Route>
    </Switch>
  );
}

export default App;
