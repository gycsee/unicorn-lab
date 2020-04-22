import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';
import { createUseStyles } from 'react-jss';
import {
  Layout,
} from 'antd';

const { Content } = Layout;

const MassMarker = loadable(() => import('./MassMarker'));
const SingleRoute = loadable(() => import('./SingleRoute'));
const DoubleRoutes = loadable(() => import('./DoubleRoutes'));
const MultiRoutes = loadable(() => import('./MultiRoutes'));

const useStyles = createUseStyles({
  Layout: {
    width: '100vw',
    height: '100vh',
  },
  Content: {
    padding: '0 50px',
  },
})

const GdPages = () => {
  const classes = useStyles();
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
    </Switch>
  );
}

export default GdPages;
