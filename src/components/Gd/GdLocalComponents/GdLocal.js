import React from 'react';

import LocalLoader from './LocalLoader';

const GdLocal = ({
  amapkey,
  version,
  protocol,
  children,
  ...restProps
}) => {
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!loaded) {
      new LocalLoader({
        key: amapkey,
        version: version,
        protocol: protocol
      }).load().then(() => {
        setLoaded(true);
      })
    }
  })

  const renderChildren = () => {
    return React.Children.map(children, (child) => {
      if (child) {
        return React.cloneElement(child, restProps)
      }
      return child
    })
  }

  return loaded ? renderChildren() : null;
}

export default GdLocal;
