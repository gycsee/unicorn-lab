import React from 'react';
import { Marker, Polyline } from 'react-amap'
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  markerContent: {
    borderRadius: '50%',
    fontSize: '12px',
    color: 'white',
    textAlign: 'center',
  },
})
const GdRoute = ({
  name,
  visible,
  color,
  columns,
  markers,
  path,
  distanceArray = [],
  lineEvents,
  markerEvents,
  ...restProps
}) => {
  const classes = useStyles();
  const distance = distanceArray.reduce((a, c) => a + c, 0);
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

  const longitudeIndex = columns.findIndex(item => item === 'longitude');
  const latitudeIndex = columns.findIndex(item => item === 'latitude');
  return (
    <>
      {markers.map((markerItem, index) => {
        const longitude = markerItem[longitudeIndex];
        const latitude = markerItem[latitudeIndex];
        if (Number.isNaN(Number(longitude)) || Number.isNaN(Number(latitude))) {
          return null;
        }
        const position = { longitude, latitude };
        let radius =  16;
        let zIndex =  100;
        let markerSeq = index + 1;
        let startBackgroundColor = color;
        if (index === 0) {
          radius = 24;
          zIndex = 101;
          markerSeq = '起';
          startBackgroundColor = 'black';
        }
        if (index === markers.length - 1) {
          radius = 20;
          zIndex = 101;
        }
        const offSet = -(radius / 2);
        let extData = {};
        columns.forEach((column, columnIndex) => {
          extData[column] = markerItem[columnIndex];
        });
        return (
          <Marker
            key={index}
            position={position}
            events={markerEvents}
            offset={[offSet, offSet]}
            title={name}
            extData={extData}
            zIndex={zIndex}
            visible={visible}
            {...restProps}
          >
            <div className={classes.markerContent} style={{
              width: radius,
              height: radius,
              lineHeight: radius + 'px',
              background: startBackgroundColor,
            }}>
              {markerSeq}
            </div>
          </Marker>
        )
      })}
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
        extData={{ '线路': name, '站点数': markers.length, '总距离': `${distance/1000}千米` }}
        visible={visible}
        {...restProps}
      />
    </>
  );
}

export default GdRoute;
