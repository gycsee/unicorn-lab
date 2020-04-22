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
  Layout: {
    width: '100vw',
    height: '100vh',
    // background: '#fff',
  },
  Header: {
    position: 'fixed',
    zIndex: 1,
    width: '100%',
    padding: 0,
    boxShadow: 'rgba(0, 0, 0, 0.08) 0px 1px 4px 0px',
    // backgroundColor: 'rgb(255, 255, 255)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
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
  Content: {
    // background: '#fff',
    padding: '16px 16px',
    marginTop: '48px',
  },
  trigger: {
    width: '48px',
    height: '48px',
  },
})

const Public = () => {
  const classes = useStyles();
  return (
    <Layout className={classes.Layout}>
      <Header className={classes.Header}>
        <div className={classes.headerLeft}>
          <Button type="primary" className={classes.trigger} icon={<MenuUnfoldOutlined />} />
          <Link className={classes.logoTitle} to="/">Unicorn Lab</Link>
        </div>
        <div className={classes.headerRight}>
        </div>
      </Header>
      <Content className={classes.Content}>
        <Switch>
          <Route exact path="/" >
            <Home />
          </Route>
          <Route path="/about" >
            <AboutUs />
          </Route>
          <Route path="/setting" >
            <Setting />
          </Route>
          <Redirect to="/" />
        </Switch>
      </Content>
    </Layout>
  );
}

export default Public;
