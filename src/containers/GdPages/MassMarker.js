import React from 'react';
import { Map } from 'immutable';
import { Upload, Button, message, Collapse, Switch, Checkbox, Table, Form, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { csvParse } from 'd3-dsv';
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
import {
  GdPointSimplifier,
} from 'components/Gd/GdUiComponents';
import CsvExcelDropzone from 'components/FileDropzone/CsvExcelDropzone';

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

const MassMarker = ({ mapStyle }) => {
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

  const [file, setFile] = React.useState(null);
  const [originData, setOriginData] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const [groups, setGroups] = React.useState(Map());
  const [info, setInfo] = React.useState(Map({
    visible:  false,
    position: {
      longitude: 120,
      latitude: 30
    },
    data: {}
  }))

  const onVisibleChange = key => (checked, event) => {
    setGroups(groups.mergeIn([key], { visible: checked }));
  }

  const allVisibleTriggle = checked => e => {
    setGroups(groups.map(item => ({...item, visible: !checked})));
  }

  const handleFileChange = async (parsedData, f) => {
    if (parsedData.length === 0) {
      setFile(null);
      setOriginData([]);
      setColumns([]);
      setGroups(Map())
      return null;
    }
    const [parsedDataColumns, ...rows] = parsedData;
    console.table(parsedData);
    const longitudeIndex = parsedDataColumns.findIndex(item => item === 'longitude');
    const latitudeIndex = parsedDataColumns.findIndex(item => item === 'latitude');
    const licenseIndex = parsedDataColumns.findIndex(item => item === 'license');
    if (longitudeIndex === -1 || latitudeIndex === -1) {
      message.error('请确保csv中存在以下列：longitude、latitude');
      return null;
    }
    
    let groupsMap = Map();
    if (licenseIndex !== -1) {
      const groups = _.groupBy(rows, row => row[licenseIndex]);
      Object.keys(groups).forEach((element, index) => {
        groupsMap = groupsMap.set(element, {
          index,
          license: element,
          visible: true,
          data: groups[element].map(item => ({
            longitude: item[longitudeIndex],
            latitude: item[latitudeIndex],
            license: item[licenseIndex],
          }))
        })
      });
    } else {
      groupsMap.set('_one', {
        index: 0,
        license: '',
        visible: true,
        data: rows.map(item => ({
          longitude: item[longitudeIndex],
          latitude: item[latitudeIndex],
          license: item[licenseIndex],
        }))
      })
    }
    setGroups(groupsMap);
    setFile(f);
    setOriginData(rows);
    setColumns(parsedDataColumns);
    
  }

  const option = {
    useAMapUI: () => { console.log("AMapUI Loaded Done") },
    events: {
      created: amapCreateEvent,
      click: () => setInfo(info.set('visible', false))
    },
  }

  const tableColumns = [
    {
      title: 'license',
      dataIndex: 'license',
    }, {
      title: '显示',
      dataIndex: 'visible',
      render: (text, record) => (
        <Switch
          size="small"
          checked={text}
          onChange={onVisibleChange(record.license)}
        />
      )
    }
  ]

  const visibleGroupLength = groups.size
    ? groups.filter(item => item.visible).size
    : 0;

  return (
    <GdLayout>
      <GdContent>
        <GdMap {...option} >
          <GdInfoWindow position={info.get('position')} visible={info.get('visible')} data={info.get('data')} />
          {<GdPointSimplifier
            data={groups.size
              ? _.concat(...groups.filter(item => item.visible).toArray().map(item => item[1].data))
              : []
            }
          />}
          <GdSetting defaultMapStyle={'whitesmoke'} />
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
            {groups.size > 1
              ? (
                <Table
                  size="small"
                  title={currentPageData => (
                    <div className={classes.tableHeader}>
                      <div>
                        <Checkbox
                          indeterminate={!!visibleGroupLength && visibleGroupLength < groups.size}
                          checked={visibleGroupLength === groups.size}
                          onChange={allVisibleTriggle(visibleGroupLength === groups.size)}
                        >
                          全显示
                        </Checkbox>
                      </div>
                    </div>
                  )}
                  pagination={false}
                  columns={tableColumns}
                  scroll={{ y: 400 }}
                  dataSource={groups.toArray().map(item => ({key: item[0], ...item[1]})).sort((a, b) => (a.index - b.index))}
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

export default MassMarker;
