import React from 'react';
import { Map } from 'immutable';
import { message, Collapse, Switch, Checkbox, Table, Form, Input } from 'antd';
import _ from 'lodash';
import { createUseStyles } from 'react-jss';

import {
  GdLayout,
  GdContent,
  GdMap,
  GdPanel,
  GdInfoWindow,
  GdSetting,
} from 'components/Gd';
import SampleDataCard from 'components/SampleDataViewer/SampleDataCard';
import CsvExcelDropzone from 'components/FileDropzone/CsvExcelDropzone';
import {
  GdLocal,
  LabelsLayer,
  ScatterPointLayer,
} from 'components/Gd/GdLocalComponents';
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
  }
})

const MassLabel = ({ mapStyle }) => {
  const classes = useStyles();
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
  }, [])

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

  const onVisibleChange = key => (checked, event) => {
    setData(data.mergeIn(['groups', key], { visible: checked }));
  }

  const allVisibleTriggle = checked => e => {
    setData(data.set('groups', data.get('groups').map(item => ({...item, visible: !checked}))));
  }

  const handleFileChange = async (parsedData, f) => {
    if (parsedData.length === 0) {
      setData(Map({
        columns: [],
        groups: Map(),
      }));
      return null;
    }
    const [columns, ...rows] = parsedData;
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

  const option = {
    events: {
      created: amapCreateEvent,
      click: () => setInfo(info.set('visible', false))
    },
  }

  const tableColumns = [
    {
      title: 'zone',
      dataIndex: 'zone',
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
      return rowData.map(row => ({ color, label: row[storeIdIndex], lnglat: [Number(row[longitudeIndex]), Number(row[latitudeIndex])]}))
    }))
    : [];
  
  return (
    <GdLayout>
      <GdContent>
        <GdMap {...option} >
          <GdInfoWindow position={info.get('position')} visible={info.get('visible')} data={info.get('data')} />
          <GdSetting defaultMapStyle={'whitesmoke'} />
          <GdLocal >
            {filteredData.length && <LabelsLayer data={filteredData}/>}
            {filteredData.length && <ScatterPointLayer data={filteredData}/>}
          </GdLocal>
        </GdMap>
      </GdContent>
      <GdPanel>
        <Collapse defaultActiveKey={['file', 'columns', 'groups']} >
          <Collapse.Panel key="file" header="数据文件">
            <SampleDataCard
              className={classes.SampleDataCard}
              csvUrl="/data/pointSimplifier.csv"
              excelUrl="/data/pointSimplifier.xlsx"
              title="海量点示例数据"
            />

            <CsvExcelDropzone onChange={handleFileChange} />

          </Collapse.Panel>
          <Collapse.Panel key="columns" header="必填字段说明">
            <Form
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}
              name="columns"
              initialValues={{
                longitude: 'longitude',
                latitude: 'latitude',
                license: 'license',
              }}
            >
              <Form.Item
                label="经度"
                name="longitude"
                required
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                label="纬度"
                name="latitude"
                required
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                label="分组标识"
                name="license"
              >
                <Input disabled />
              </Form.Item>
            </Form>
          </Collapse.Panel>
          <Collapse.Panel key="groups" header="海量点分组">
            {data.get('groups').size > 1
              ? (
                <Table
                  size="small"
                  title={currentPageData => (
                    <div className={classes.tableHeader}>
                      <div>
                        <Checkbox
                          indeterminate={!!visibleGroupLength && visibleGroupLength < data.get('groups').size}
                          checked={visibleGroupLength === data.get('groups').size}
                          onChange={allVisibleTriggle(visibleGroupLength === data.get('groups').size)}
                        >
                          全显示
                        </Checkbox>
                      </div>
                    </div>
                  )}
                  pagination={false}
                  columns={tableColumns}
                  scroll={{ y: 400 }}
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

export default MassLabel;
