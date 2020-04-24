import React from 'react';
import { Polyline } from 'react-amap'

const GdRoute = ({
  name,
  visible,
  color,
  markers,
  path,
  lineEvents,
  markerEvents,
  ...restProps
}) => {
  const routePath = [];
  path.forEach(pathItem => {
    const polylineLocations = pathItem.join(';').split(';');
    polylineLocations.forEach(polylineLocation => {
      const location = polylineLocation.split(',');
        if (location.length === 2) {     
          const longitude = Number.parseFloat(location[0]);
          const latitude = Number.parseFloat(location[1]);
          if(!Number.isNaN(longitude) && !Number.isNaN(latitude)) {
            routePath.push({
              longitude: longitude,
              latitude: latitude
            });
          }
        }
    });
  });
  return (
    <>
      <Polyline
        path={routePath}
        events={lineEvents}
        style={{
          strokeColor: color,
          strokeWeight: 4,
          strokeOpacity: 1,
          showDir: true,
          outlineColor: 'white'
        }}
        extData={{ '线路': name, '站点数': markers.length }}
        visible={visible}
        {...restProps}
      />
    </>
  );
}

export default GdRoute;
