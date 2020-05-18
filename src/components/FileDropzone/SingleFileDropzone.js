import React from 'react';
import { useDropzone } from 'react-dropzone';
import { createUseStyles } from 'react-jss';
import { Tag } from 'antd';
import { FileExcelOutlined } from '@ant-design/icons';

const useStyles = createUseStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  dropzone: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px 8px',
    border: '1px dashed #177ddc',
    borderRadius: '2px',
    color: '#177ddc',
    fontSize: '12px',
    outline: 'none',
    transition: 'all .24s ease-in-out',
    cursor: 'pointer',
    '&:hover': {
      opacity: '0.65',
    }
  },
  file: {
    textAlign: 'center',
    marginTop: '8px',
    marginBottom: '8px',
  },
});

const SingleFileDropzone = ({
  tooltip = '将文件拖到此处，或单击直接上传',
  fileIcon = <FileExcelOutlined />,
  accept = [".xlsx"],
  onChange,
}) => {
  const classes = useStyles();
  const [file, setFile] = React.useState(null);

  React.useEffect(() => {
    setFile(file);
  }, [file])

  const onDrop = acceptedFiles => {
    const f = acceptedFiles[0];
    if (f) {
      onChange(f);
      setFile(f);
    } else {
      setFile(null);
      onChange(null);
    }
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
    multiple: false,
  });

  const handleFileRemove = () => {
    setFile(null);
    onChange(null);
  }
  return (
    <div className={classes.root}>
      <div {...getRootProps({className: classes.dropzone})}>
        <input {...getInputProps()} />
        <span>{tooltip}</span>
      </div>

      {file && <div className={classes.file}>
        <Tag icon={fileIcon} color="blue" closable={true} onClose={handleFileRemove}>
          {file.name}
        </Tag>
      </div>}
    </div>
  );
}

export default SingleFileDropzone;
