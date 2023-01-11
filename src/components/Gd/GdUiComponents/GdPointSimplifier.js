import React from 'react';

const GdPointSimplifier = ({ __map__, data, groupStyles }) => {
  const pointSimplifierIns = React.useRef(null);
  React.useEffect(() => {
    const initPage = (PointSimplifier) => {
      const map = __map__;
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
          groupStyleOptions: groupStyles
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
      renderOptions.groupStyleOptions = groupStyles;
      pointSimplifierIns.current.setData(data);

      pointSimplifierIns.current.render();
    }
  }, [__map__, data, groupStyles])
  return null;
}

export default GdPointSimplifier;
