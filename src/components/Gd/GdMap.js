import React from 'react';
import { Map as Amap } from 'react-amap'
import { createUseStyles } from 'react-jss';

import GdLoading from './GdLoading';
import config from './config';

const useStyles = createUseStyles({
  
})

const MultiRoutes = ({
  events,
  children,
  ...restProps
}) => {
  const classes = useStyles();

  const option = {
    amapkey: config.AMAP_KEY,
    version: config.VERSION,
    loading: <GdLoading />,
    status: {
      resizeEnable: true,
    },
    plugins: ['ToolBar', 'Scale'],
    events,
    ...restProps
  }
  return (
    <Amap {...option} >
      {children}
    </Amap>
  );
}

export default MultiRoutes;
