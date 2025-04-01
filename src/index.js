import React, { useEffect, useState, useRef } from 'react';

const Geogebra = (props) => {
  const refProps = useRef(props);

  let { id, onReady, appletOnLoad, debug, reloadOnPropChange } =
    refProps.current;
  if (!id)
    id = 'ggb-applet';
  if (!debug)
    debug = false;

  const [watchPropsChange, setWatchPropsChange] = useState(false);
  //gets called by GeoGebra after the Applet is ready
  const onAppletReady = () => {
    if (appletOnLoad) appletOnLoad();
    if (onReady) onReady();
    debug && console.log(`Applet with id "${id}" is ready`);
  };

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
      parameter.appletOnLoad = onAppletReady;
      const ggbApp = new window.GGBApplet(parameter, true);
      ggbApp.setHTML5Codebase('GeoGebra/HTML5/5.0/web3d/');
      ggbApp.inject(id);
      setWatchPropsChange(false);
      debug &&
        console.log(`applet with id "${id}" succesfull injected into the DOM`);
    }
    return () => {
      const tag = document.getElementById(id);
      if (tag)
        tag.replaceChildren();
    };
  }, [watchPropsChange]);

  return (<div id={id}></div>);
};

Geogebra.defaultProps = {
  appName: 'classic',
  width: 800,
  height: 600,
  showToolBar: true,
  showAlgebraInput: true,
  showMenuBar: true,
  reloadOnPropChange: false,
};

export default Geogebra;
