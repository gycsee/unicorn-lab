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
})

const Card = ({
  title,
  description,
  image,
  path,
  ...cardProps
}) => {
  const classes = useStyles();
  return (
    <AntCard
      className={classes.root}
      cover={
        <img
          alt={title}
          src={image}
        />
      }
      actions={[
        <Button type="link" size="small" icon={<DownloadOutlined />}>
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
