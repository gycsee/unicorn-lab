import React from 'react';
import { Radio, Checkbox, Button, Popover, Divider, FloatButton } from 'antd';
import {
  SettingFilled,
} from '@ant-design/icons';
import { createUseStyles } from 'react-jss';

const styleOptions = [
  { label: '标准', value: 'normal'},
  { label: '幻影黑', value: 'dark'},
  { label: '月光银', value: 'light'},
  { label: '远山黛', value: 'whitesmoke'},
  { label: '草色青', value: 'fresh'},
  { label: '雅士灰', value: 'grey'},
  { label: '涂鸦', value: 'graffiti'},
  { label: '马卡龙', value: 'macaron'},
  { label: '靛青蓝', value: 'blue'},
  { label: '极夜蓝', value: 'darkblue'},
  { label: '酱籽', value: 'wine'},
]
const featureOptions = [
  { label: '地图背景', value: 'bg'},
  { label: 'POI点', value: 'point'},
  { label: '道路', value: 'road'},
  { label: '建筑物', value: 'building'},
]
const useStyles = createUseStyles({
  Popover: {
    maxWidth: 400,
  },
  footer: {
    marginTop: '8px',
    display: 'flex',
    flexDirection: 'row',
  },
  footerButton: {
    margin: '4px 8px',
  },
})

const GdSetting = ({
  defaultMapStyle,
  defaultFeatures,
  PopoverProps: popoverProps,
  __map__,
}) => {
  const classes = useStyles();
  const [visible, setVisible] = React.useState(false);
  const [mapStyle, setMapStyle] = React.useState(defaultMapStyle || 'whitesmoke')
  const [features, setFeatures] = React.useState(defaultFeatures || ['bg', 'point', 'road', 'building'])
  
  React.useEffect(() => {
    if (__map__) {
      __map__.setMapStyle("amap://styles/" + mapStyle);
      __map__.setFeatures(features);
    }
  }, [__map__, mapStyle, features])

  const visibleTriggle = () => {
    setVisible(!visible);
  }

  const handleStyleChange = e => {
    setMapStyle(e.target.value);
  };
  const handleFeatureChange = checkedValues => {
    setFeatures(checkedValues);
  };
  const handleReset = () => {
    setMapStyle(defaultMapStyle || 'whitesmoke');
    setFeatures(defaultFeatures || ['bg', 'point', 'road', 'building']);
    setVisible(false);
  }

  if (!__map__) {
    console.log('组件 GdSetting 必须作为 AMap 的子组件使用');
    return;
  }

  const panel = (
    <div>
      <Divider>地图样式</Divider>
      <Radio.Group options={styleOptions} value={mapStyle} onChange={handleStyleChange}/ >
      <Divider>显示的元素种类</Divider>
      <Checkbox.Group options={featureOptions} value={features} onChange={handleFeatureChange} />
      <div className={classes.footer}>
        <Button onClick={visibleTriggle} className={classes.footerButton} type="primary" size="small">关闭</Button>
        <Button onClick={handleReset} className={classes.footerButton} type="primary" size="small">重置</Button>
      </div>
    </div>
  )
  return (
    <Popover
      overlayClassName={classes.Popover}
      placement="bottomLeft"
      title={false}
      trigger="click"
      content={panel}
      open={visible}
      {...popoverProps}
    >
      <Button
        onClick={visibleTriggle}
        style={{
          position: 'absolute',
          right: '10px',
          top: '20px',
          zIndex: 150,
        }}
        shape="circle"
        icon={<SettingFilled />}
      />
    </Popover>
  );
}

export default GdSetting;
