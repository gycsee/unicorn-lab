import React from 'react';
import { Card, Avatar, Button } from 'antd';
import { DownloadOutlined, FolderViewOutlined, LinkOutlined } from '@ant-design/icons';
import SampleCsvModal from './SampleCsvModal'

const SampleDataCard = ({
  url,
  title = '示例数据',
  description = 'data.csv',
  ...restProps
}) => {
  return (
    <Card
      style={{ width: '100%' }}
      actions={[
        <Button key='csv' type="link" href={url} icon={<DownloadOutlined />}>CSV</Button>,
        <Button key='excel' type="link" href={url} icon={<DownloadOutlined />}>Excel</Button>,
        <SampleCsvModal
          key='view'
          label={'查看'}
          url={url}
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
        description={description}
      />
    </Card>
  );
}

export default SampleDataCard;
