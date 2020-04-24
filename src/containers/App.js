import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Public  from 'containers/Public';
import GdPages  from 'containers/GdPages';

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
