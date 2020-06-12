import React from 'react';
import { Map } from 'immutable';
import { Markers } from 'react-amap'
import { message, Collapse, Switch, Checkbox, Table, Form, Input, Space, Tag } from 'antd';
import _ from 'lodash';
import { createUseStyles } from 'react-jss';
import * as d3 from 'd3-fetch';

import {
  GdLayout,
  GdContent,
  GdMap,
  GdPanel,
  GdInfoWindow,
  GdSetting,
} from 'components/Gd';
import SampleDataCard from 'components/SampleDataViewer/SampleDataCard';
import ColorPicker from "components/ColorPicker";
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

  const onVisibleChange = key => (checked, event) => {
    setData(data.mergeIn(['groups', key], { visible: checked }));
  }

  const allVisibleTriggle = checked => e => {
    setData(data.set('groups', data.get('groups').map(item => ({...item, visible: !checked}))));
  }  

  const markersEvents = {
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

  const handleMarkersVisibleChange = key => (checked, event) => {
    setVisible(visible.set(key, checked))
  }

  const renderCircleMarker = (extData) => <div className={classes.markerContent} style={{ background: extData.color }} />
  const renderLabelMarker = (extData) => <div className={classes.labelMarkerContent} style={{ background: extData.color }}>{extData.label}</div>

  const option = {
    events: {
      created: amapCreateEvent,
      click: () => setInfo(info.set('visible', false))
    },
  }

  const onColorChange = key => (color) => {
    setData(data.mergeIn(['groups', key], { color: color }));
  }

  const tableColumns = [
    {
      title: 'zone',
      dataIndex: 'zone',
      fixed: true,
      width: '140px',
      render: (text, record) => (
        <ColorPicker
          color={record.color}
          type="sketch"
          onChangeComplete={onColorChange(text)}
        >
          <Tag color={record.color}>{text}</Tag>
        </ColorPicker>
      )
    }, {
      title: '显示',
      dataIndex: 'visible',
      render: (text, record) => (
        <Switch
          size="small"
          checked={text}
          onChange={onVisibleChange(record.zone)}
        />
      )
    }
  ]

  const visibleGroupLength = data.get('groups').size
    ? data.get('groups').filter(item => item.visible).size
    : 0;

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
      <GdContent>
        <GdMap {...option} >
          <GdInfoWindow position={info.get('position')} visible={info.get('visible')} data={info.get('data')} />
          <GdSetting defaultMapStyle={'whitesmoke'} />
          <Markers markers={visible.get('marker') ? filteredData : []} render={renderCircleMarker}/>
          <Markers markers={visible.get('label') ? filteredData : []} events={markersEvents} render={renderLabelMarker}/>
        </GdMap>
      </GdContent>
      <GdPanel>
        <Collapse defaultActiveKey={['file', 'columns', 'groups']} >
          <Collapse.Panel key="file" header="数据文件">
            <SampleDataCard
              className={classes.SampleDataCard}
              csvUrl="https://unicorn-rel.oss-cn-beijing.aliyuncs.com/companies/mnsm/markerLabels.csv"
              title="散点/文字"
            />
          </Collapse.Panel>
          <Collapse.Panel key="groups" header="海量点分组">
            {data.get('groups').size > 1
              ? (
                <Table
                  size="small"
                  title={currentPageData => (
                    <div className={classes.tableHeader}>
                      <Space>
                        <Checkbox
                          indeterminate={!!visibleGroupLength && visibleGroupLength < data.get('groups').size}
                          checked={visibleGroupLength === data.get('groups').size}
                          onChange={allVisibleTriggle(visibleGroupLength === data.get('groups').size)}
                        >
                          全显示
                        </Checkbox>
                        <Switch
                          size="small"
                          checkedChildren="显示圆点"
                          unCheckedChildren="隐藏圆点"
                          checked={visible.get('marker')}
                          onChange={handleMarkersVisibleChange('marker')}
                        />
                        <Switch
                          size="small"
                          checkedChildren="显示文字"
                          unCheckedChildren="隐藏文字"
                          checked={visible.get('label')}
                          onChange={handleMarkersVisibleChange('label')}
                        />
                      </Space>
                    </div>
                  )}
                  pagination={false}
                  columns={tableColumns}
                  dataSource={data.get('groups').toArray().map(item => ({key: item[0], ...item[1]})).sort((a, b) => (a.index - b.index))}
                />
              )
              : '请先参考模版文件上传数据'
            }
          </Collapse.Panel>
        </Collapse>
      </GdPanel>
    </GdLayout>
  );
}

export default StaticMassLabel;
