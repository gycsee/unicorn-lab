import React from 'react';
import { Map } from 'immutable';
import { message, Collapse, Switch, Checkbox, Table, Badge, Typography, Tag, Form, Input } from 'antd';
import XLSX from 'xlsx';
import _ from 'lodash';
import { createUseStyles } from 'react-jss';

import DownloadCsv from "components/DownloadCsv";
import DownloadExcel from "components/DownloadExcel";
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
import CsvExcelDropzone from 'components/FileDropzone/CsvExcelDropzone';
import { getByteLen } from 'common/util';

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
  const [csvOrginData, setCsvOriginData] = React.useState([]); // csv原始数据，columns + rows
  const [data, setData] = React.useState(Map({
    columns: [], // csv columns
    routes: Map(), // 线路数据
  }));
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
    setData(data.mergeIn(['routes', key], { color: color }));
  }

  const onVisibleChange = key => (checked, event) => {
    setData(data.mergeIn(['routes', key], { visible: checked }));
  }

  const allVisibleTriggle = checked => e => {
    setData(data.update('routes', item => item.map(route => ({...route, visible: !checked}))));
  }

  const onSelectChange = selectedRowKeys => {
    setSelectedRowKeys(selectedRowKeys);
  }

  const getDownloadCsvData = () => {
    const routeIdIndex = data.get('columns').findIndex(item => item === 'routeId');
    const appearedIds = [];
    return csvOrginData.filter((item, index) => {
      if (index === 0) {
        return true;
      } else {
        return selectedRowKeys.includes(item[routeIdIndex]);
      }
    })
      .map((item, index) => {
        if (index === 0) {
          return [...item, 'totalDistance'];
        } else {
          if (appearedIds.includes(item[routeIdIndex])) {
            return [...item, ''];
          } else {
            appearedIds.push(item[routeIdIndex]);
            return [...item, (data.getIn(['routes', item[routeIdIndex], 'distanceArray']).reduce((a, c) => a + Number(c), 0)) / 1000];
          }
        }
      })
  }

  const getDownloadExcelData = async () => {
    let wb = await new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = e => {
        const d = new Uint8Array(e.target.result);
        resolve(XLSX.read(d, { type: 'array' }));
      };
      fileReader.readAsArrayBuffer(file);
    });
    const aoa = [
      [ "routeId", "总距离（千米）" ],
      ...data.get('routes').toArray().map(item => ([item[0], item[1].distanceArray.reduce((a, c) => a + Number(c), 0) / 1000]))
    ];
    let ws = XLSX.utils.aoa_to_sheet(aoa);
    let objectMaxLength = [];
    for (let i = 0; i < aoa.length; i++) {
      let value = aoa[i];
      for (let j = 0; j < value.length; j++) {
        const temp = objectMaxLength[j];
        if (typeof value[j] == "number") {
          objectMaxLength[j] = temp > 10 ? temp : 10;
        } else {
          const len = getByteLen(value[j]);
          objectMaxLength[j] = temp >= len ? temp : len;
        }
      }
    }
    const wscols = objectMaxLength.map(w => { return { wch: w } });
    ws['!cols'] = wscols;
    let sheetName = '路线数据', i = 2;
    while (wb.SheetNames.includes(sheetName)) {
      sheetName = `${sheetName}${i++}`
    }
    await XLSX.utils.book_append_sheet(wb, ws, sheetName);
    return wb;
  }

  const handleFileChange = async (parsedData, f) => {
    if (parsedData.length === 0) {
      setFile(null);
      setData(Map({
        columns: [],
        routes: Map()
      }));
      setSelectedRowKeys([]);
      setCsvOriginData([]);
      return null;
    }
    const [columns, ...rows] = parsedData;
    console.table(parsedData);
    const routeIdIndex = columns.findIndex(item => item === 'routeId');
    const longitudeIndex = columns.findIndex(item => item === 'longitude');
    const latitudeIndex = columns.findIndex(item => item === 'latitude');
    const seqIndex = columns.findIndex(item => item === 'seq');
    const travelWayIndex = columns.findIndex(item => item === 'travelWay');
    if (routeIdIndex === -1 || longitudeIndex === -1 || latitudeIndex === -1) {
      message.error('请确保csv中存在以下列：routeId、longitude、latitude');
      return null;
    }
    
    const routesMap = _.groupBy(rows, row => row[routeIdIndex]);
    let routesData = Map();
    let requestUrls = [];
    const routeIds = Object.keys(routesMap);
    const colors = getColorCategories(routeIds.length);
    routeIds.forEach((key, index) => {
      const pointers = seqIndex === -1
        ? routesMap[key]
        : routesMap[key].sort(seqSorter(seqIndex)); // 按照 seq 对原数据进行排序
      const travelWay = travelWayIndex === -1 ? 0 : Number(pointers[0][travelWayIndex]);
      routesData = routesData.set(key, { index, name: key, visible: true, color: colors[index], path: [], distanceArray: [], markers: pointers });
      const markers = pointers.map(pointer => `${pointer[longitudeIndex]},${pointer[latitudeIndex]}`)
      requestUrls.push(...getGdDirectionUrl(travelWay, markers).map(item => ({ key, ...item })))
    });

    const requestPromises = requestUrls.map(requestUrl => {
      // 调用高德路径规划api接口获取数据
      return gdPathFetch(requestUrl.key, requestUrl.url, requestUrl.travelWay)
    })
    for (const requestPromise of requestPromises) {
      const requestPromiseData = await requestPromise;
      routesData = routesData.updateIn([requestPromiseData.key], item => ({
        ...item,
        path: [...item.path, requestPromiseData.data],
        distanceArray: [...item.distanceArray, requestPromiseData.distance],
      }));
    }
    setFile(f);
    setSelectedRowKeys([]);
    setData(Map({
      columns,
      routes: routesData
    }));
    setCsvOriginData(parsedData)
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
      render: (text, record) => {
        return `${(text.reduce((a, c) => a + Number(c), 0))/1000}`
      }
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

  const visibleLength = data.get('routes').size
    ? data.get('routes').filter(item => item.visible).size
    : 0;
  return (
    <GdLayout>
      <GdContent>
        <GdMap {...option} >
          <GdInfoWindow position={info.get('position')} visible={info.get('visible')} data={info.get('data')} />
          {data.get('routes').size && data.get('routes').toArray().map((item, index) => {
            const { markers, path, distanceArray, name, color, visible } = item[1];
            return (
              <GdRoute
                key={name}
                name={name}
                visible={visible}
                color={color}
                columns={data.get('columns')}
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
              csvUrl="/data/multiRoutes.csv"
              excelUrl="/data/multiRoutes.xlsx"
              title="线路示例数据"
            />

            <CsvExcelDropzone onChange={handleFileChange} />

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
            {data.get('routes').size
              ? (
                <Table
                  size="small"
                  title={currentPageData => (
                    <div className={classes.tableHeader}>
                      <div>
                        <Badge count={selectedRowKeys.length} showZero>
                          {file.name.endsWith('.xlsx')
                            ? <DownloadExcel
                              onClick={getDownloadExcelData}
                              size="small"
                              filename={'new-' + file.name}
                              label='下载'
                              disabled={selectedRowKeys.length === 0}
                            />
                            : <DownloadCsv
                              onClick={getDownloadCsvData}
                              size="small"
                              filename={'new-' + file.name}
                              label='下载'
                              disabled={selectedRowKeys.length === 0}
                            />
                          }
                        </Badge>
                      </div>
                      <div>
                        <Checkbox
                          indeterminate={!!visibleLength && visibleLength < data.get('routes').size}
                          checked={visibleLength === data.get('routes').size}
                          onChange={allVisibleTriggle(visibleLength === data.get('routes').size)}
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
                              (a, c) => data.getIn(['routes', c, 'distanceArray']).reduce((aInner, cInner) => aInner + Number(cInner), 0) + a,
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
                  dataSource={data.get('routes').toArray().map(item => ({key: item[0], ...item[1]})).sort((a, b) => (a.index - b.index))}
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
