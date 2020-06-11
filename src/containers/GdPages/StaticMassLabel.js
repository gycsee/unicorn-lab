import React from 'react';
import { Map } from 'immutable';
import { Markers } from 'react-amap'
import { message } from 'antd';
import _ from 'lodash';
import { createUseStyles } from 'react-jss';
import * as d3 from 'd3-fetch';

import {
  GdLayout,
  GdMap,
  GdInfoWindow,
  GdSetting,
} from 'components/Gd';

import { getColorCategories } from 'common/util';

const useStyles = createUseStyles({
  tableHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  SampleDataCard:{
    marginTop: '8px',
    marginBottom: '8px',
  },
  markerContent: {
    width: '8px',
    height: '8px',
    lineHeight: '8px',
    borderRadius: '50%',
    color: 'white',
    textAlign: 'center',
    position: 'relative',
    left: '-4px',
  },
  labelMarkerContent: {
    lineHeight: '14px',
    fontSize: '12px',
    padding: '2px 4px',
    color: 'white',
    textAlign: 'center',
    position: 'relative',
    left: '-50%',
    top: '-20px',
    border: '1px solid #fff',
    borderRadius: '2px',
  }
})

const StaticMassLabel = ({ mapStyle }) => {
  const classes = useStyles();
  const amap = React.useRef(null);
  const [visible, setVisible] = React.useState(Map({
    marker: true,
    label: true,
  }))
  const [data, setData] = React.useState(Map({
    columns: [],
    groups: Map(),
  }));
  const [info, setInfo] = React.useState(Map({
    visible:  false,
    position: {
      longitude: 120,
      latitude: 30
    },
    data: {}
  }))

  const amapCreateEvent = React.useCallback((mapInstance) => {
    amap.current = mapInstance;
  }, [amap])

  React.useEffect(() => {
    return () => {
      if (amap.current) {
        amap.current = null;
      }
    }
  }, [])

  React.useEffect(() => {
    const handleFileChange = async (parsedData, f) => {
      if (parsedData.length === 0) {
        setData(Map({
          columns: [],
          groups: Map(),
        }));
        return null;
      }
      const [...originRows] = parsedData;
      const rows = originRows.map(item => Object.values(item));
      const columns = parsedData.columns;
      const longitudeIndex = columns.findIndex(item => item === 'longitude');
      const latitudeIndex = columns.findIndex(item => item === 'latitude');
      const storeIdIndex = columns.findIndex(item => item === 'storeId');
      const zoneIndex = columns.findIndex(item => item === 'zone');
      if (longitudeIndex === -1 || latitudeIndex === -1 || storeIdIndex === -1 || zoneIndex === -1) {
        message.error('请确保csv中存在以下列：storeId、zone、longitude、latitude');
        return null;
      }
      
      let groupsMap = Map();
      if (zoneIndex !== -1) {
        const groups = _.groupBy(rows, row => row[zoneIndex]);
        const zones = Object.keys(groups);
        const colors = getColorCategories(zones.length);
        zones.forEach((zone, index) => {
          groupsMap = groupsMap.set(zone, {
            index,
            visible: true,
            zone: zone,
            color: colors[index],
            data: groups[zone]
          })
        });
      } else {
        groupsMap.set('_one', {
          index: 0,
          visible: true,
          zone: '',
          color: 'red',
          data: rows
        })
      }
      setData(Map({
        columns,
        groups: groupsMap
      }));
    }

    if (data.get('groups').size === 0) {
      d3.csv('https://unicorn-rel.oss-cn-beijing.aliyuncs.com/companies/mnsm/markerLabels.csv').then(res => {
        handleFileChange(res)
      });
    }
  }, [])

  

  const markersEvents = {
    created: (instance) => {
      if (amap.current) {
        amap.current.setFitView();
      }
    },
    click: (MapsOption, marker) => {
      const position = marker.getPosition();
      const extData = marker.getExtData();
      const row = extData.row;
      let infoData = {};
      data.get('columns')
        .forEach((column, index) => {
          if (!['longitude', 'latitude'].includes(column)) {
            infoData[column] = row[index];
          }
        });
      setInfo(info.merge({
        position: {
          longitude: position.lng,
          latitude: position.lat
        },
        visible: true,
        data: infoData,
      }))
    },
  }

  const renderCircleMarker = (extData) => <div className={classes.markerContent} style={{ background: extData.color }} />
  const renderLabelMarker = (extData) => <div className={classes.labelMarkerContent} style={{ background: extData.color }}>{extData.label}</div>

  const option = {
    events: {
      created: amapCreateEvent,
      click: () => setInfo(info.set('visible', false))
    },
  }

  const columns = data.get('columns');
  const longitudeIndex = columns.findIndex(item => item === 'longitude');
  const latitudeIndex = columns.findIndex(item => item === 'latitude');
  const storeIdIndex = columns.findIndex(item => item === 'storeId');

  const filteredData = data.get('groups').size
    ? _.concat(...data.get('groups').filter(item => item.visible).toArray().map(item => {
      const { color, data: rowData } = item[1];
      return rowData.map(row => ({
        color,
        label: row[storeIdIndex],
        position: {
          longitude: Number(row[longitudeIndex]),
          latitude: Number(row[latitudeIndex])
        },
        row,
      }))
    }))
    : [];

  return (
    <GdLayout>
      <GdMap {...option} >
        <GdInfoWindow position={info.get('position')} visible={info.get('visible')} data={info.get('data')} />
        <GdSetting defaultMapStyle={'whitesmoke'} />
        <Markers markers={visible.get('marker') ? filteredData : []} render={renderCircleMarker}/>
        <Markers markers={visible.get('label') ? filteredData : []} events={markersEvents} render={renderLabelMarker}/>
      </GdMap>
    </GdLayout>
  );
}

export default StaticMassLabel;
