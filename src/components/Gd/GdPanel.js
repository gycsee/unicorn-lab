import React from 'react';
import { useHistory } from "react-router-dom";
import { createUseStyles } from 'react-jss';
import {
  Button,
} from 'antd';
import {
  CaretLeftOutlined,
  CaretRightOutlined,
  HomeFilled,
} from '@ant-design/icons';

const useStyles = createUseStyles({
  root: {
    height: '100%',
    display: 'flex',
    position: 'absolute',
    left: 0,
    top: 0,
    padding: '20px 10px 20px 10px',
  },
  layout: {
    boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 3px',
    left: '0px',
    boxAlign: 'stretch',
    alignItems: 'stretch',
    boxFlex: 1,
    flexGrow: 1,
    width: props => props.width,
    transition: 'width 250ms ease 0s',
  },
  content: {
    backgroundColor: 'rgb(36, 39, 48)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    overflowY: 'auto',
    borderRadius: '1px',
  },
  header: {
    padding: '10px 10px',
    overflow: 'hidden',
    minHeight: 40,
  },
  children: {
    flexGrow: 1,
  },
  trigger: {
    position: 'absolute!important',
    right: '-20px',
    top: '20px',
  },
})

const GdPanel = ({ width = '300px', children }) => {
  let history = useHistory();
  const [show, setShow] = React.useState(true);
  const classes = useStyles({ width: show ? width : 0 });

  const handleTriggle = event => {
    setShow(!show);
  }

  const backHome = () => {
    history.push('/')
  }

  return (
    <div className={classes.root}>
      <div className={classes.layout}>
        <div className={classes.content}>
          <div className={classes.header}>
            <Button onClick={backHome} size="small" icon={<HomeFilled />} >返回首页</Button>
          </div>
          <div className={classes.children}>{children}</div>
        </div>
        <Button
          className={classes.trigger}
          onClick={handleTriggle}
          danger
          icon={show
          ? <CaretLeftOutlined />
          : <CaretRightOutlined />
          }
          size='small'
        />
      </div>
    </div>
  );
}

export default GdPanel;
