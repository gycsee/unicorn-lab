import React from 'react';
import { Map } from 'immutable';
import { Upload, Button, message, Collapse, Switch, Checkbox, Table, Badge, Typography, Tag, Form, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { csvParse } from 'd3-dsv';
import _ from 'lodash';
import { createUseStyles } from 'react-jss';

import DownloadCsv from "components/DownloadCsv";
import ColorPicker from "components/ColorPicker";
import { getColorCategories } from 'common/util';
import {
  GdLayout,
  GdContent,
  GdMap,
  GdPanel,
  GdInfoWindow,
  GdRoute,
  GdSetting,
} from 'components/Gd';
import {
  seqSorter,
  getGdDirectionUrl,
  gdPathFetch,
} from 'components/Gd/util';
import SampleDataCard from 'components/SampleDataViewer/SampleDataCard';

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

const MultiRoutes = ({ mapStyle }) => {
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
  const [data, setData] = React.useState(null);
  const [info, setInfo] = React.useState(Map({
    visible:  false,
    position: {
      longitude: 120,
      latitude: 30
    },
    data: {}
  }))
  const [selectedRowKeys, setSelectedRowKeys] = React.useState([]);

  const markerEvents = {
    click: (e) => {
      const marker = e.target;
      const position = marker.getPosition();
      const extData = marker.getExtData();
      setInfo(info.merge({
        position: {
          longitude: position.lng,
          latitude: position.lat
        },
        visible: true,
        data: extData,
      }))
    },
  }

  const lineEvents = {
    created: (instance) => {
      if (amap.current) {
        amap.current.setFitView();
      }
    },
    click: (e) => {
      const extData = e.target.getExtData();
      setInfo(info.merge({
        position: {
          longitude: e.lnglat.lng,
          latitude: e.lnglat.lat
        },
        visible: true,
        data: extData,
      }))
    },
  }

  const onColorChange = key => (color) => {
    setData({
      ...data,
      [key]: {
        ...data[key],
        color: color,
      }
    })
  }

  const onVisibleChange = key => (checked, event) => {
    setData({
      ...data,
      [key]: {
        ...data[key],
        visible: checked,
      }
    })
  }

  const allVisibleTriggle = checked => e => {
    const newData = Object.keys(data).map(key => ({
      ...data[key],
      visible: !checked
    }))
    setData(newData);
  }

  const onSelectChange = selectedRowKeys => {
    setSelectedRowKeys(selectedRowKeys);
  }

  const option = {
    events: {
      created: amapCreateEvent,
      click: () => setInfo(info.set('visible', false))
    },
  }

  const tableColumns = [
    {
      title: '线路',
      dataIndex: 'name',
      fixed: true,
      width: '100px',
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
      title: '里程(千米)',
      dataIndex: 'distanceArray',
      align: 'right',
      width: '94px',
      render: (text, record) => `${(text.reduce((a, c) => a + Number(c), 0))/1000}`
    }, {
      title: '显示',
      dataIndex: 'visible',
      width: '40px',
      render: (text, record) => (
        <Switch
          size="small"
          checked={text}
          onChange={onVisibleChange(record.name)}
        />
      )
    }
  ]

  const visibleLength = data
    ? Object.values(data).filter(item => item.visible).length
    : 0;
  return (
    <GdLayout>
      <GdContent>
        <GdMap {...option} >
          <GdInfoWindow position={info.get('position')} visible={info.get('visible')} data={info.get('data')} />
          {data && Object.keys(data).map((routeId, index) => {
            const { markers, path, distanceArray, name, color, visible } = data[routeId];
            return (
              <GdRoute
                key={index}
                name={name}
                visible={visible}
                color={color}
                markers={markers}
                path={path}
                distanceArray={distanceArray}
                markerEvents={markerEvents}
                lineEvents={lineEvents}
              />
            )
          })}
          <GdSetting defaultMapStyle={'whitesmoke'} />
        </GdMap>
      </GdContent>
      <GdPanel>
        <Collapse defaultActiveKey={['file', 'columns', 'routes']} >
          <Collapse.Panel key="file" header="数据文件">
            <SampleDataCard
              className={classes.SampleDataCard}
              url="/data/multiRoutes.csv"
              title="示例数据"
              description="multiRoutes.csv"
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
                console.table(rows, parsedData.columns);
                if (parsedData.columns &&
                  parsedData.columns.includes('routeId') &&
                  parsedData.columns.includes('longitude') &&
                  parsedData.columns.includes('latitude')
                ) {
                  const routesMap = _.groupBy(rows, row => row.routeId);
                  let routesData = {};
                  let requestUrls = [];
                  const routeIds = Object.keys(routesMap);
                  const colors = getColorCategories(routeIds.length)
                  routeIds.forEach((key, index) => {
                    const pointers = routesMap[key].sort(seqSorter('seq')); // 按照 seq 对原数据进行排序
                    routesData[key] = { name: key, visible: true, color: colors[index], path: [], distanceArray: [], markers: pointers };
                    const markers = pointers.map(pointer => `${pointer.longitude},${pointer.latitude}`)
                    requestUrls.push(...getGdDirectionUrl(Number(pointers[0].travelWay), markers).map(item => ({ key, ...item })))
                  });

                  const requestPromises = requestUrls.map(requestUrl => {
                    // 调用高德路径规划api接口获取数据
                    return gdPathFetch(requestUrl.key, requestUrl.url, requestUrl.travelWay)
                  })
                  for (const requestPromise of requestPromises) {
                    const requestPromiseData = await requestPromise;
                    await routesData[requestPromiseData.key].path.push(requestPromiseData.data);
                    await routesData[requestPromiseData.key].distanceArray.push(requestPromiseData.distance);
                  }
                  setFile(file);
                  setRows(rows);
                  setColumns(parsedData.columns);
                  setData(routesData);
                  setSelectedRowKeys([]);
                } else {
                  message.error('请确保csv中存在以下列：routeId、longitude、latitude')
                }
                return false;
              }}
              listType='picture'
              onRemove={file => {
                setFile(null);
                setRows([]);
                setColumns([]);
                setData(null);
                setSelectedRowKeys([]);
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
                routeId: 'routeId',
                longitude: 'longitude',
                latitude: 'latitude',
                seq: 'seq',
              }}
            >
              <Form.Item
                label="线路唯一标识"
                name="routeId"
                required
              >
                <Input disabled />
              </Form.Item>
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
                label="站点顺序"
                name="seq"
              >
                <Input disabled />
              </Form.Item>
            </Form>
          </Collapse.Panel>
          <Collapse.Panel key="routes" header="线路列表">
            {data
              ? (
                <Table
                  size="small"
                  title={currentPageData => (
                    <div className={classes.tableHeader}>
                      <div>
                        <Badge count={selectedRowKeys.length} showZero>
                          <DownloadCsv
                            data={rows.filter(item => selectedRowKeys.includes(item.routeId)).map(item => ({
                              ...item,
                              totalDistance: (data[item.routeId].distanceArray.reduce((a, c) => a + Number(c), 0))/1000
                            }))}
                            size="small"
                            filename={'new-' + file.name}
                            label='下载'
                            disabled={selectedRowKeys.length === 0}
                          />
                        </Badge>
                      </div>
                      <div>
                        <Checkbox
                          indeterminate={!!visibleLength && visibleLength < Object.keys(data).length}
                          checked={visibleLength === Object.keys(data).length}
                          onChange={allVisibleTriggle(visibleLength === Object.keys(data).length)}
                        >
                          全显示
                        </Checkbox>
                      </div>
                    </div>
                  )}
                  summary={pageData => {
                    return (
                      <tr>
                        <td colSpan={4}>
                          已选择线路的总里程为：
                          <Typography.Text type="danger">
                            {selectedRowKeys.reduce(
                              (a, c) => data[c].distanceArray.reduce((a, c) => a + Number(c), 0),
                              0
                            )/1000}
                          </Typography.Text>
                          千米
                        </td>
                      </tr>
                    )
                  }}
                  pagination={false}
                  rowSelection={{
                    fixed: true,
                    columnWidth: '26px',
                    selectedRowKeys,
                    onChange: onSelectChange,
                  }}
                  columns={tableColumns}
                  dataSource={Object.keys(data).map(key => ({key, ...data[key]}))}
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

export default MultiRoutes;
