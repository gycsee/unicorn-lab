import React from 'react';
import { createUseStyles } from 'react-jss';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { CSVLink } from "react-csv";
import classnames from 'classnames';

const useStyles = createUseStyles({
  CSVLink: {
    '& a': {
      color: 'white',
    }
  },
})

const DownloadCsv = ({
  data,
  filename,
  className,
  label = '下载',
  ...restProps
}) => {
  const classes = useStyles();
  return (
    <Button
      type="primary"
      className={classnames(classes.CSVLink, className)}
      icon={<DownloadOutlined />}
      {...restProps}
    > 
      <CSVLink
        data={data}
        filename={filename}
        target="_blank"
      >
        {label}
      </CSVLink>
    </Button>
  );
}

export default DownloadCsv;
