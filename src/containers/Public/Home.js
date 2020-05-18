import React from 'react';
import { Col, Row } from 'antd';

import Card from 'components/Card';
import massMarkerPng from 'assets/images/massMarker.png';
import multiRoutesPng from 'assets/images/multiRoutes.png';

const PUBLIC_URL = process.env.PUBLIC_URL;

const cards = [
  {
    title: '海量点',
    description: '海量点展示，并根据license(例如车牌号)进行点分类',
    image: massMarkerPng,
    path: '/gd/mass-marker',
    csvUrl: PUBLIC_URL + '/data/pointSimplifier.csv',
    excelUrl: PUBLIC_URL + '/data/pointSimplifier.xlsx',
  }, {
    title: '多线路展示',
    description: '路径规划',
    image: multiRoutesPng,
    path: '/gd/multi-routes',
    csvUrl: PUBLIC_URL + '/data/multiRoutes.csv',
    excelUrl: PUBLIC_URL + '/data/multiRoutes.xlsx',
  },
]

const Home = () => {
  return (
    <div>
      <Row gutter={[16, 8]}>
        {cards.map((item, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6} xxl={4}>
            <Card
              bordered={false}
              {...item}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Home;
