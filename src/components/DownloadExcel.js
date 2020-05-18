import React from 'react';
import XLSX from 'xlsx';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const DownloadExcel = ({
  label = '下载',
  filename,
  onClick,
  ...restProps
}) => {

  const handleDownload = async (event, done) => {
    const workbook = await onClick();
    XLSX.writeFile(workbook, filename);
  }

  return (
    <Button
      type="primary"
      icon={<DownloadOutlined />}
      onClick={handleDownload}
      {...restProps}
    > 
      {label}
    </Button>
  );
}

export default DownloadExcel;
