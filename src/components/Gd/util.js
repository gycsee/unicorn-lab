import config from './config';
import _ from 'lodash';
import axios from 'axios';
import { message } from 'antd';

// 根据 key 对站点进行排序
export const seqSorter = key => (a, b) => {
  const first = Number(a[key]);
  const second = Number(b[key]);
  if (Number.isNaN(first) || Number.isNaN(second)) {
    return 0;
  } else {
    return first - second;
  }
}

// 获取高德接口中 polyline 汇总的 path
function _getPolyline(steps) {
  let polylineArr = [];
  for (const iterator of steps) {
    polylineArr.push(iterator.polyline)
  }
  return polylineArr;
}


/**
 * 根据交通方式和线路总站点数获取路径规划请求的url数组
 * @param {number} travelWay 交通方式，0: 小轿车；1-4: 货车车型；5: 步行；6：骑行
 * @param {array} points 经纬度数组 eg: ['121.213213,37.121323', '121.213213,37.121323']
 */
export function getGdDirectionUrl(travelWay, points) {
  if (![0, 1, 2, 3, 4, 5, 6].includes(travelWay)) {
    // 不在支持的交通方式内则使用小轿车（0）进行路径规划
    travelWay = 0;
  }
  let urls = [];
  let count = 0;
  if (travelWay < 5) {
    const pointChunk = points.length > 18 ? _.chunk(points, 17) : [points];
    for (let i = 0; i < pointChunk.length; i++) {
      const allPoints = pointChunk[i];
      const origin = i === 0 ? allPoints[0] : _.last(pointChunk[i - 1])
      const destination = _.last(allPoints);
      const waypoints = allPoints.slice(0, 16);
      if (travelWay === 0) {
        urls.push({
          url: `https://restapi.amap.com/v3/direction/driving?origin=${origin}&destination=${destination}&waypoints=${waypoints.join(';')}&extensions=base&strategy=2&key=${config.webKeyArray[count++ % 4]}`,
          travelWay,
        })
      } else {
        urls.push({
          url: `https://restapi.amap.com/v4/direction/truck?origin=${origin}&destination=${destination}&waypoints=${waypoints.join(';')}&extensions=base&strategy=10&size=${travelWay}&key=${config.AMAP_DRIVING_KEY}`,
          travelWay,
        })
      }
    }
  } else {
    for (let i = 0; i < points.length - 1; i++) {
      if (i < points.length - 1) {
        const origin = points[i];
        const destination = points[i + 1];
        const amapKey = config.webKeyArray[count++ % 4];
        if (travelWay === 5) {
          urls.push({
            url: `https://restapi.amap.com/v3/direction/walking?origin=${origin}&destination=${destination}&key=${amapKey}`,
            travelWay
          });
        } else {
          urls.push({
            url: `https://restapi.amap.com/v4/direction/bicycling?origin=${origin}&destination=${destination}&key=${amapKey}`,
            travelWay
          });
        }
      }
    }
    
  }
  return urls;
}

/**
 * 调用高德路径规划接口获取数据
 * @param {string} key 线路标识
 * @param {string} url 
 * @param {number} travelWay 交通方式，0: 小轿车；1-4: 货车车型；5: 步行；6：骑行
 */
export function gdPathFetch(key, url, travelWay) {
  return axios(url)
    .then(res => {
      if (res.status === 200 && (res.data.info === 'OK' || res.data.errcode === 0)) {
        return res.data;
      } else {
        message.error(res.data.info || res.data.errmsg || '路径规划接口错误！');
        throw new Error('数据获取失败：' + url);
      }
    })
    .then(json => {
      let steps = [];
      let distance = 0;
      switch (travelWay) {
        case 5:
          steps = _getPolyline(json.route.paths[0].steps);
          distance = json.route.paths[0].distance;
          break;
        case 6:
          steps = _getPolyline(json.data.paths[0].steps);
          distance = json.data.paths[0].distance;
          break;
        case 0:
          debugger
          steps = _getPolyline(json.route.paths[0].steps);
          distance = json.route.paths[0].distance;
          break;
        default:
          steps = _getPolyline(json.data.route.paths[0].steps);
          distance = json.data.route.paths[0].distance;
          break;
      }
      return ({ key: key, data: steps, distance });
    })
    .catch(error => {
      return ({ key: key, data: [], distance: 0 });
    })
}