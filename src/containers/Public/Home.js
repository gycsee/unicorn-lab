import React from 'react';
import { Col, Row } from 'antd';

import Card from 'components/Card';

const cards = [
  {
    title: '路径规划1',
    description: '单线,单线站点数不超过50',
    image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
    path: '/gd/single-route',
  }, {
    title: '海量点',
    description: '海量点展示，并根据license(例如车牌号)进行点分类，分类规则：颜色【随机】、大小【5-10随机】、形状【圆、正方形随机】',
    image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
    path: '/gd/mass-marker',
  }, {
    title: '计划车次与实际车次对比',
    description: 'attribute=0：计划路线（绿色路线）上的站点（绿色圆点）；attribute=1：实际路线（红色路线）且为计划站点（红色圆点）；attribute=2：实际路线且为非计划站点（红色三角形）',
    image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
    path: '/gd/double-routes',
  }, {
    title: '多线路展示',
    description: 'AgentId 相同表示在同一条路线上。必填字段：AgentName - 线路名；AgentId - 线路ID；Longitude - 精度；Latitude - 维度；非必填字段：TravelWay - 交通方式【仅可取值 walking、bicycling、driving、truck，默认 bicycling】',
    image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
    path: '/gd/multi-routes',
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
