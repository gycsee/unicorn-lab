import React from 'react';

const ScatterPointLayer = ({ __map__, data }) => {
  const layer = React.useRef(null);
  React.useEffect(() => {
    const initPage = () => {
      const map = __map__;
      layer.current = new window.Loca.ScatterPointLayer({
        map: map,
        eventSupport: true,  // 图层事件支持，LabelsLayer 默认开启
        fitView: true,
        // visible: true,
      });

      layer.current.setData(data, { lnglat: 'lnglat' }).setOptions({
        // unit: "meter",
        style: {
          zooms: [3, 20],  // 文字显示范围
          radius: 100,
          color: obj => {
            return obj.value.color;
          },
        },
      }).render();

      layer.current.on('click', function(event) {
        console.log('Click target: ', event.target) // 触发click事件的元素
        console.log('Event type: ', event.type) // 事件名称
        console.log('Raw Event: ', event.originalEvent) // 原始DomEvent事件
        console.log('Raw data: ', event.rawData) // 触发元素对应的原始数据
        console.log('LngLat: ', event.lnglat) // 元素所在经纬度
      });
      
    }
    if (!layer.current) {
      initPage();
    } else {
      layer.current.setData(data, { lnglat: 'lnglat' });
    }

    return () => {
      if (layer.current) {
        layer.current.off('click');
        layer.current.setMap(null);
      }
    }
  }, [__map__, data])

  return null;
}

export default ScatterPointLayer;
