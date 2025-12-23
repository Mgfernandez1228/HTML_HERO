import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'jotai';
import { store } from './store.js';
import App from './App.jsx'

import ReactUI from './ReactUI.jsx'
import initGame from "./initGame.js";

//The Actual Website

// WEBSITE ROOT
const websiteRoot = document.getElementById("website-root");
createRoot(websiteRoot).render(
  <StrictMode>
    <App />
  </StrictMode>
);

let activeRoot = null;

//Game Root
export function startGame(){
  console.log('[main] startGame called');
  
  initGame();


  const websiteRoot = document.getElementById("website-root");
  const ui = document.getElementById("ui");
  const gameCanvas = document.getElementById("game");
  const body = document.body;
  

  websiteRoot.style.display = "none";  // hide website
  ui.style.display = "block";          // show game UI
  gameCanvas.style.display = "block";


  body.style.overflow = "hidden";//hides the whole website when in the game.
  
  // Use ResizeObserver on the UI parent so element positions (absolute/relative)
  // remain consistent with the original layout while still making the whole
  // UI scale down to fit smaller viewports.
  const getDesignDims = () => {
    const cs = getComputedStyle(document.documentElement);
    const w = parseFloat(cs.getPropertyValue('--width')) || 1920;
    const h = parseFloat(cs.getPropertyValue('--height')) || 1080;
    return { w, h };
  };

  const updateScaleForParent = (parent) => {
    try{
      const { w, h } = getDesignDims();
      const scale = Math.min(
        parent.offsetWidth / w,
        parent.offsetHeight / h
      );
      document.documentElement.style.setProperty('--scale', String(scale));
    }catch(e){
      document.documentElement.style.setProperty('--scale', '1');
    }
  };

  // observe the ui.parentElement (same approach as original implementation)
  try{
    const parent = ui.parentElement;
    if(parent){
      updateScaleForParent(parent);
      const ro = new ResizeObserver(() => updateScaleForParent(parent));
      ro.observe(parent);

      // also update on global resize/orientation as a safety net
      const bound = () => updateScaleForParent(parent);
      window.addEventListener('resize', bound);
      window.addEventListener('orientationchange', bound);
    }
  }catch(e){
    // fallback: set neutral scale
    document.documentElement.style.setProperty('--scale', '1');
  }


  activeRoot = createRoot(ui);

  activeRoot.render(
    <StrictMode>
      <Provider store ={store}>
        <ReactUI />
      </Provider>
    </StrictMode>,
  );
  
}




