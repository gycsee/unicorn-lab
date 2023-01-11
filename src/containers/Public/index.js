import React from 'react';
import { Route, Switch, Link, Redirect } from 'react-router-dom';
import loadable from '@loadable/component';
import {
  Layout,
  Button,
} from 'antd';
import { createUseStyles } from 'react-jss';
import {
  MenuUnfoldOutlined,
} from '@ant-design/icons';

const { Header, Content } = Layout;

const Home = loadable(() => import('./Home'));
const AboutUs = loadable(() => import('./AboutUs'));
const Setting = loadable(() => import('./Setting'));

const useStyles = createUseStyles({
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
  },
  logoTitle: {
    display: 'block!important',
    fontSize: '18px',
    padding: '0 20px',
    color: 'inherit',
  },
})

const Public = () => {
  const classes = useStyles();
  return (
    <Layout style={{ width: '100vw', height: '100vh', overflowX: 'hidden' }}>
      <Header
        style={{
          padding: '0 16px',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          paddingInline: '0px!important',
          boxShadow: 'rgba(0, 0, 0, 0.08) 0px 1px 4px 0px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div className={classes.headerLeft}>
          <Button type="primary" size="large" icon={<MenuUnfoldOutlined />} />
          <Link className={classes.logoTitle} to="/">
            Unicorn Lab
          </Link>
        </div>
        <div className={classes.headerRight}></div>
      </Header>
      <Content
        style={{
          padding: '16px',
        }}
      >
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/about">
            <AboutUs />
          </Route>
          <Route path="/setting">
            <Setting />
          </Route>
          <Redirect to="/" />
        </Switch>
      </Content>
    </Layout>
  );
}

export default Public;
