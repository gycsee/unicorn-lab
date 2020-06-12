import React from 'react';
import { Card, Avatar, Button } from 'antd';
import { DownloadOutlined, FolderViewOutlined, LinkOutlined } from '@ant-design/icons';
import SampleCsvModal from './SampleCsvModal'

const SampleDataCard = ({
  csvUrl,
  excelUrl,
  title = '示例数据',
  ...restProps
}) => {
  return (
    <Card
      style={{ width: '100%' }}
      actions={[
        <Button key='csv' type="link" href={csvUrl} icon={<DownloadOutlined />}>CSV</Button>,
        excelUrl ? <Button key='excel' type="link" href={excelUrl} icon={<DownloadOutlined />}>Excel</Button> : null,
        <SampleCsvModal
          key='view'
          label={'查看'}
          url={csvUrl}
          ButtonProps={{
            icon: <FolderViewOutlined />,
            type: 'link',
          }}
        />,
      ]}
      {...restProps}
    >
      <Card.Meta
        avatar={<Avatar icon={<LinkOutlined />} />}
        title={title}
      />
    </Card>
  );
}

export default SampleDataCard;
