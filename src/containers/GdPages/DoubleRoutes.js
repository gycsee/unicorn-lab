import React from 'react';
import { Map } from 'react-amap'

import {
  GdLayout,
  GdContent,
  GdLoading,
  GdPanel,
  config,
} from 'components/Gd';

const DoubleRoutes = ({ mapStyle }) => {
  const amap = React.useRef(null);

  const amapCreateEvent = React.useCallback((mapInstance) => {
    amap.current = mapInstance;
  }, [amap])

  React.useEffect(() => {
    return () => {
      if (amap.current) {
        amap.current = null;
      }
    }
  })

  const option = {
    amapkey: config.AMAP_KEY,
    version: config.VERSION,
    mapStyle: `'amap://styles/${mapStyle || 'whitesmoke'}`,
    loading: <GdLoading />, 
    status: {
      resizeEnable: true,
    },
    plugins: ['ToolBar', 'Scale'],
    events: {
      created: amapCreateEvent
    },
  }
  return (
    <GdLayout>
      <GdContent>
        <Map {...option} >
          
        </Map>
      </GdContent>
      <GdPanel>
        控制面板
      </GdPanel>
    </GdLayout>
  );
}

export default DoubleRoutes;
