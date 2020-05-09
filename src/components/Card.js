import React from 'react';
import { Link } from 'react-router-dom';
import { createUseStyles } from 'react-jss';
import { Card as AntCard, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const useStyles = createUseStyles({
  root: {
    width: '100%',
  },
  description: {
    lineHeight: '20px',
    height: '40px',
    display: '-webkit-box',
    boxOrient: 'vertical',
    lineClamp: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  imageBox: {
    overflow: 'hidden',
    width: '100%',
    height: '180px',
    backgroundImage: props => `url(${props.image})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor: '#666',
    backgroundSize: 'cover',
  }
})

const Card = ({
  title,
  description,
  image,
  downloadUrl,
  path,
  ...cardProps
}) => {
  const classes = useStyles({ image });
  return (
    <AntCard
      className={classes.root}
      cover={<div className={classes.imageBox} />}
      actions={[
        <Button type="link" size="small" href={downloadUrl} icon={<DownloadOutlined />}>
          模版数据下载
        </Button>,
        <Link to={path}>开始</Link>
      ]}
    >
      <AntCard.Meta
        title={title}
        description={<div className={classes.description}>{description}</div>}
      />
    </AntCard>
  );
}

export default Card;
