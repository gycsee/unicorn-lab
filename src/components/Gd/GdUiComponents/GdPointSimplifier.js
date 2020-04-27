import React from 'react';
import _ from 'lodash';

// 生成随机颜色字符串
var getRandomColor = function() {
  return '#'+('00000'+(Math.random()*0x1000000<<0).toString(16)).slice(-6);
}

// 生成随机点样式对象
function getRandPointerStyle() {
  const pointStyle = ['circle', 'rect'];
  const color = getRandomColor();
  const size = Number.parseInt(Math.random()*5) + 5; // 4-6
  const style = Number.parseInt(Math.random()*2); // 0-1
  return {
    pointStyle: {
      content: pointStyle[style],
      fillStyle: color,
      width: size,
      height: size
    },
    pointHardcoreStyle: {
      width: size - 2,
      height: size - 2
    }
  };
}


const GdPointSimplifier = ({ __map__, data }) => {
  const pointSimplifierIns = React.useRef(null);
  React.useEffect(() => {
    const initPage = (PointSimplifier) => {
      const map = __map__;
      const groupStyleOptions = {}; // 点样式组
      _.uniqBy(data, 'license').forEach((element, index) => {
        groupStyleOptions[element.license] = getRandPointerStyle();// 样式组中增加样式
      });
      
      pointSimplifierIns.current = new PointSimplifier({
        map: map, //关联的map
        autoSetFitView: true,
        compareDataItem: function (a, b, aIndex, bIndex) {
          //数据源中靠后的元素优先，index大的排到前面去
          return aIndex > bIndex ? -1 : 1;
        },
        getPosition: function (dataItem) {
          //返回数据项的经纬度，AMap.LngLat实例或者经纬度数组
          return [dataItem.longitude, dataItem.latitude];
        },
        getHoverTitle: function (dataItem, idx) {
          //返回数据项的Title信息，鼠标hover时显示
          return `序号: ${idx}，license: ${dataItem.license}`;
        },
        //使用GroupStyleRender
        renderConstructor: PointSimplifier.Render.Canvas.GroupStyleRender,
        renderOptions: {
          //点的样式
          pointStyle: {
            fillStyle: 'red',
            width: 7,
            height: 7
          },
          getGroupId: function (item, idx) {
            return item.license
          },
          groupStyleOptions: groupStyleOptions
        }
      });
  
      //设置数据源，data需要是一个数组
      pointSimplifierIns.current.setData(data);
  
      //监听事件
      pointSimplifierIns.current.on('pointClick pointMouseover pointMouseout', function (e, record) {
        console.log(e.type, record);
      });
  
    }
    if (!pointSimplifierIns.current) {
      window.AMapUI.loadUI(['misc/PointSimplifier'], (PointSimplifier) => {
        initPage(PointSimplifier);
      })
    } else {
      let renderOptions = pointSimplifierIns.current.getRenderOptions();
      const groupStyleOptions = {}; // 点样式组
  
      _.uniqBy(data, 'license').forEach((element, index) => {
        groupStyleOptions[element.license] = getRandPointerStyle();// 样式组中增加样式
      });
      renderOptions.groupStyleOptions = groupStyleOptions;
      pointSimplifierIns.current.setData(data);

      pointSimplifierIns.current.render();
    }
  }, [__map__, data])
  return null;
}

export default GdPointSimplifier;
