import React from 'react';
import { Modal, Button } from 'antd';
import * as d3 from 'd3-fetch';
import { AutoSizer } from 'react-virtualized';

import DynamicWidthMultiGrid from 'components/Table/DynamicWidthMultiGrid';

const SampleCsv = ({
  label = '示例数据',
  url,
}) => {
  const [visible, setVisible] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const loading = visible && data.length === 0;
  React.useEffect(() => {
    if (loading) {
      d3.csv(url).then(function(data) {
        const  [...rows] = data;
        setData(rows);
        setColumns(data.columns);
      });
    }
  }, [loading, url])

  const handleOpen = () => {
    setVisible(true);
  }
  const handleClose = () => {
    setVisible(false);
  }

  const list = [columns, ...data.map(item => columns.map(column => item[column]))];
  console.log(list);
  return (
    <>
      <Button type="primary" onClick={handleOpen}>
        {label}
      </Button>
      <Modal
        title="示例数据"
        open={visible}
        footer={null}
        centered={true}
        width={900}
        onOk={handleClose}
        onCancel={handleClose}
        bodyStyle={{
          backgroundColor: 'white',
          color: 'black',
        }}
      >
        <AutoSizer disableHeight>
          {({width}) => (
            <DynamicWidthMultiGrid
              list={list}
              columnCount={columns.length}
              width={width}
            />
          )}
        </AutoSizer>
      </Modal>
    </>
  );
}

export default SampleCsv;
