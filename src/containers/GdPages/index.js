import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';

const MassMarker = loadable(() => import('./MassMarker'));
const SingleRoute = loadable(() => import('./SingleRoute'));
const DoubleRoutes = loadable(() => import('./DoubleRoutes'));
const MultiRoutes = loadable(() => import('./MultiRoutes'));
const MassLabel = loadable(() => import('./MassLabel'));
const StaticMassLabel = loadable(() => import('./StaticMassLabel'));

const GdPages = () => {
  let { path, url } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path} >
        <h3>Please select a gd page.</h3>
      </Route>
      <Route path={`${url}/mass-marker`} >
        <MassMarker />
      </Route>
      <Route path={`${url}/single-route`} >
        <SingleRoute />
      </Route>
      <Route path={`${url}/double-routes`} >
        <DoubleRoutes />
      </Route>
      <Route path={`${url}/multi-routes`} >
        <MultiRoutes />
      </Route>
      <Route path={`${url}/mass-label`} >
        <MassLabel />
      </Route>
      <Route path={`${url}/af23s48af2fak23fd3w32`} >
        <StaticMassLabel />
      </Route>
    </Switch>
  );
}

export default GdPages;
