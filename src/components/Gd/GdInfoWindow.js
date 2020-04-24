import React from 'react';
import { InfoWindow } from 'react-amap'
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  InfoWindow: {
    background: '#363F49 !important',
    color: '#A0A7B4 !important',
    padding: '10px !important',
    maxWidth: '300px !important',
    minWidth: '200px !important',
    fontSize: '12px !important',
    opacity: '0.9 !important',
    '& table': {
      width: '100%',
    },
    '& tr': {
      verticalAlign: 'top!important',
    },
  },
  InfoWindowLabel: {
    whiteSpace: 'nowrap',
  },
  InfoWindowContent: {
    textAlign: 'right!important',
    color: '#D3D8E0!important',
    maxWidth: '200px!important',
    wordBreak: 'break-all!important',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
  }
})

const GdInfoWindow = ({
  position,
  visible,
  data,
  ...restProps
}) => {
  const classes = useStyles();
  return (
    <InfoWindow
      position={position}
      visible={visible}
      isCustom={true}
      offset={[0, -20]}
      className={classes.InfoWindow}
      {...restProps}
    >
      <table>
        <tbody>
          {Object.keys(data).map((item, index) => (
            <tr key={index}>
              <td className={classes.InfoWindowLabel}>{item}</td>
              <td>&nbsp;</td>
              <td className={classes.InfoWindowContent}>{data[item]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </InfoWindow>
  )
}

export default GdInfoWindow;
