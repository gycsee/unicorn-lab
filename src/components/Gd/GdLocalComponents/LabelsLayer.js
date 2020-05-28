import React from 'react';

const LabelsLayer = ({ __map__, data }) => {
  const layer = React.useRef(null);
  React.useEffect(() => {
    const initPage = () => {
      const map = __map__;
      layer.current = new window.Loca.LabelsLayer({
        map: map,
        eventSupport: true,  // 图层事件支持，LabelsLayer 默认开启
        fitView: true,
        // visible: true,
        zIndex: 99,
        collision: false  // 是否开启文字自动避让
      });

      layer.current.setData(data, { lnglat: 'lnglat' }).setOptions({
        style: {
          direction: "top",  // 文字位置
          offset: [0, 0],  // 文字偏移距离
          zooms: [3, 20],  // 文字显示范围
          text: obj => {
            return obj.value.label
          },  // 文本内容
          fillColor: obj => {
            return obj.value.color;
          },  // 文字填充色
          fontFamily: '字体',  // 文字字体(2D)
          fontSize: 12,  // 文字大小, 默认值：12
          fontWeight: "bold",  // 文字粗细(2D)。 可选值： 'normal'| 'lighter'| 'bold' 。默认值：'normal'
        },
      }).render();
    }
    if (!layer.current) {
      initPage();
    } else {
      layer.current.setData(data, {lnglat: 'lnglat' });
    }
    
    return () => {
      if (layer.current) {
        layer.current.setMap(null);
      }
    }
  }, [__map__, data])


  return null;
}

export default LabelsLayer;
