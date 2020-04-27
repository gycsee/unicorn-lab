import React from 'react';
import { Col, Row } from 'antd';

import Card from 'components/Card';
import massMarkerPng from 'assets/images/massMarker.png';
import multiRoutesPng from 'assets/images/multiRoutes.png';

const cards = [
  {
    title: '海量点',
    description: '海量点展示，并根据license(例如车牌号)进行点分类',
    image: massMarkerPng,
    path: '/gd/mass-marker',
    downloadUrl: '/data/pointSimplifier.csv',
  }, {
    title: '多线路展示',
    description: '路径规划',
    image: multiRoutesPng,
    path: '/gd/multi-routes',
    downloadUrl: '/data/routes.csv',
  },
]

const Home = () => {
  return (
    <div>
      <Row gutter={[16, 8]}>
        {cards.map((item, index) => (
          <Col key={index} xs={24} sm={24} md={12} lg={8} xxl={6}>
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
