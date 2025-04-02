import React, { useEffect, useState, useRef } from 'react';

const Geogebra = (props) => {
  const refProps = useRef(props);

  let { id, onReady, appletOnLoad, debug, reloadOnPropChange } = refProps.current;
  id ??= 'ggb-applet';
  debug ??= false;

  const [watchPropsChange, setWatchPropsChange] = useState(false);

  if (reloadOnPropChange) {
    useEffect(() => {
      const propsChanged = Object.keys(props).map((key) => {
        if (
          typeof refProps.current[key] === 'function' &&
          typeof props[key] === 'function'
        )
          return false;
        if (
          typeof refProps.current[key] === 'object' &&
          typeof props[key] === 'object'
        )
          return false;
        return refProps.current[key] !== props[key];
      });
      if (propsChanged.some((element) => element === true)) {
        refProps.current = props;
        setWatchPropsChange(true);
      }
    }, [props]);
  }
  useEffect(() => {
    if (window.GGBApplet) {
      const parameter = JSON.parse(JSON.stringify(refProps.current));
      parameter.appletOnLoad = () => { // called after the Applet is ready
        if (appletOnLoad) appletOnLoad();
        if (onReady) onReady();
        debug && console.log(`Applet with id "${id}" is ready`);
      };
      parameter.appName ??= 'graphing';
      parameter.reloadOnPropChange ??= false;
      const ggbApp = new window.GGBApplet(parameter, true);
      ggbApp.setHTML5Codebase('GeoGebra/HTML5/5.0/web3d/');
      ggbApp.inject(id);
      setWatchPropsChange(false);
      debug && console.log(`applet with id "${id}" succesfull injected`);
    }
  }, [watchPropsChange]);

  return (<div id={id}></div>);
};

export default Geogebra;
