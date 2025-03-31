import React, { useState } from 'react';
import Geogebra from '../../src';
import './style.css';

function App() {
  const [position, setPosition] = useState('Position A: (?,?)');
  const [appLoaded, setAppLoaded] = useState(false);
  const [width, setWidth] = useState(600);

  function clickHandler() {
    const app = window.appId;
    const min = -3;
    const max = 2;
    const x = Math.round(Math.random() * (max - min + 1) + min);
    const y = Math.round(Math.random() * (max - min + 1) + min);
    app.evalCommand(`A=(${x},${y})`);
    setPosition(`Position A: (${x},${y})`);
  }

  function clickDeleteHandler() {
    const app = window.appId;
    if (app.exists('A')) {
      app.deleteObject('A');
      setPosition(`Position A: (?,?)`);
    }
  }

  function positionA() {
    const app = window.appId;
    setPosition(`Position A: (${app.getXcoord('A')},${app.getYcoord('A')})`);
  }

  function registerGeogebraListeners() {
    const app = window.appId;
    // app.evalCommand('A=(0,0)');
    // app.registerObjectClickListener('A', () => {
    //   alert('A clicked');
    // });
    app.registerUpdateListener(positionA);

    //app.setPerspective('G');
    //app.setGridVisible(true);
    console.log('Geogebra Listeners registered');
    setAppLoaded(true);
  }

  return (
    <div className="App">
      <div className="demo">
        <h1>alv-geogebra Demo</h1>
        set Point 'A' and look what happens if you move it
        <Geogebra
          debug
          id="appId"
          filename="t1.ggb"
          appName="graphing"
          width={width}
          height="400"
          enableUndoRedo="false"
          appletOnLoad={registerGeogebraListeners}
        />
        <div className="button-row">
          <button
            className="mdc-button mdc-button--raised foo-button"
            onClick={clickHandler}
            disabled={!appLoaded}
          >
            <div className="mdc-button__ripple"></div>
            <span className="mdc-button__label">set 'A'</span>
          </button>
          <button
            className="mdc-button mdc-button--outlined foo-button"
            onClick={clickDeleteHandler}
            disabled={!appLoaded}
          >
            <div className="mdc-button__ripple"></div>
            <span className="mdc-button__label">delete 'A'</span>
          </button>
        </div>
        {position}
      </div>
    </div>
  );
}
export default App;
