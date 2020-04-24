import React from 'react';
import { createUseStyles } from 'react-jss';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { CSVLink } from "react-csv";

const useStyles = createUseStyles({
  CSVLink: {
    marginTop: '16px',
    marginBottom: '16px',
    '& a': {
      color: 'white',
    }
  },
})
const DownloadCsv = ({
  data,
  filename,
  ...restProps
}) => {
  const classes = useStyles();
  return (
    <Button type="primary" className={classes.CSVLink} icon={<DownloadOutlined />} {...restProps}> 
      <CSVLink
        data={data}
        filename={filename}
        target="_blank"
      >
        下载
      </CSVLink>
    </Button>
  );
}

export default DownloadCsv;
