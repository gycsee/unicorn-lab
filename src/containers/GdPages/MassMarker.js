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
  GdSimpleMarker,
  GdPointSimplifier,
} from 'components/Gd/GdUiComponents';

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
  const [rows, setRows] = React.useState([]);
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
          <GdSimpleMarker />
          <GdPointSimplifier
            data={groups.size
              ? rows.filter(item => groups.getIn([item.license, 'visible']))
              : rows
            }
          />
          <GdSetting defaultMapStyle={'whitesmoke'} />
        </GdMap>
      </GdContent>
      <GdPanel>
        <Collapse defaultActiveKey={['file', 'columns', 'groups']} >
          <Collapse.Panel key="file" header="数据文件">
            <SampleDataCard
              className={classes.SampleDataCard}
              url="/data/pointSimplifier.csv"
              title="示例数据"
              description="pointSimplifier.csv"
            />

            <Upload
              accept='.csv'
              fileList={file ? [file] : []}
              beforeUpload={async file => {
                const rawData = await new Promise((resolve, reject) => {
                  const fileReader = new FileReader();
                  fileReader.onload = ({target: {result}}) => {
                    resolve(result);
                  };
                  fileReader.readAsText(file);
                });
                const parsedData = csvParse(rawData);
                const [...rows] = parsedData;
                const parsedDataColumns = parsedData.columns;
                if (parsedDataColumns &&
                  parsedDataColumns.includes('longitude') &&
                  parsedDataColumns.includes('latitude')
                ) {
                  setFile(file);
                  setRows(rows);
                  setColumns(parsedDataColumns);
                  let groupsMap = Map();
                  if (parsedDataColumns.includes('license')) {
                    _.unionBy(rows, 'license').forEach(element => {
                      groupsMap = groupsMap.set(element.license, {
                        license: element.license,
                        visible: true,
                      })
                    });
                  }
                  setGroups(groupsMap)
                } else {
                  message.error('请确保csv中存在以下列：longitude、latitude')
                }
                return false;
              }}
              listType='picture'
              onRemove={file => {
                setFile(null);
                setRows([]);
                setColumns([]);
                setGroups(Map())
              }}
            >
              <Button type="primary" size="small" icon={<UploadOutlined />}> 
                上传文件
              </Button>
            </Upload>

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
            {groups.size
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
                  dataSource={groups.toArray().map(item => ({key: item[0], ...item[1]}))}
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
