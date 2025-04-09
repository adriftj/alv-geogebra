import React, { useEffect, useState, useRef } from 'react';

const isPropsChanged = (props1, props2) => {
  const keys = new Set([...Object.keys(props1), ...Object.keys(props2)]);
  for(const key of keys) {
    if (typeof props1[key] === 'function' || typeof props2[key] === 'function')
      continue;
    if (typeof props1[key] === 'object' || typeof props2[key] === 'object')
      continue;
    if(props1[key] !== props2[key])
      return true;
  }
  return false;
}

const Geogebra = (props) => {
  const refProps = useRef(props);
  const parentRef = useRef(null);

  let { id, onReady, appletOnLoad, debug, reloadOnPropChange,
        width, height, float, filename } = refProps.current;
  id ??= 'ggbapplet';
  debug ??= false;

  const [watchPropsChange, setWatchPropsChange] = useState(false);
  const [api, setApi] = useState(null);

  if (reloadOnPropChange) {
    useEffect(() => {
      if (isPropsChanged(props, refProps.current)) {
        refProps.current = props;
        setWatchPropsChange(true);
      }
    }, [props]);
  }

  useEffect(() => {
    if (window.GGBApplet && parentRef.current) {
      const parameter = JSON.parse(JSON.stringify(refProps.current));
      parameter.appletOnLoad = (api) => { // called after the Applet is ready
        setApi(api);
        if (parameter.code) {
          if(!parameter.filename)
            api.setPerspective('G');
          api.evalCommand(parameter.code);
        }
        if (appletOnLoad) appletOnLoad();
        if (onReady) onReady();
        debug && console.log(`Applet with id "${id}" is ready`);
      };
      parameter.appName ??= 'suite';
      if(parameter.float || parameter.width) {
        if(!parameter.filename) {
          parameter.width ??= 300;
          parameter.height ??= 300;
        }
        parameter.enableRightClick ??= false;
        parameter.enableLabelDrags ??= false;
        parameter.enableShiftDragZoom ??= false;
        parameter.enableUndoRedo ??= false;
      }
      else {
        if(!parameter.filename)
          parameter.height ??= 300;
        parameter.showResetIcon ??= !!parameter.filename;
        parameter.showFullscreenButton ??= !parameter.width;
      }
      const ggbApp = new window.GGBApplet(parameter, true);
      ggbApp.setHTML5Codebase('GeoGebra/HTML5/5.0/web3d/');
      ggbApp.inject(parentRef.current.children[0]);
      setWatchPropsChange(false);
      debug && console.log(`applet with id "${id}" succesfull injected`);
    }
  }, [watchPropsChange]);

  useEffect(()=>{
    if (!parentRef.current || float || width)
      return;

    const observer = new ResizeObserver((entries) => {
      if(api) {
        for (let entry of entries) {
          const { width } = entry.contentRect;
          api.setWidth(width);
        }
      }
    });

    observer.observe(parentRef.current);

    return () => {
      if (parentRef.current)
        observer.unobserve(parentRef.current);
      observer.disconnect();
    };
  }, [api]);

  let styles = {};
  if(float) {
    styles.float = float;
    if(!filename) {
      width ??= 300;
      height ??= 300;
    }
    if(width) styles.width = width;
    if(height) styles.height = height;
  }
  else
    styles.width = '100%';
  return  <div ref={parentRef} style={styles}><div id={id}/></div>;
};

export default Geogebra;
