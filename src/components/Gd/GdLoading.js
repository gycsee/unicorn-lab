import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  root: {
    position: 'relative',
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
})

const GdLoading = ({ children }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      地图加载中
    </div>
  );
}

export default GdLoading;
