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


export function startGame(){

initGame();


  const websiteRoot = document.getElementById("website-root");
  const ui = document.getElementById("ui");
  const gameCanvas = document.getElementById("game");
  const body = document.body;
  

  websiteRoot.style.display = "none";  // hide website
  ui.style.display = "block";          // show game UI
  gameCanvas.style.display = "block";


  // ui.style.visibility = "visible";
  // ui.style.pointerEvents = "auto";

  // gameCanvas.style.display = "block";  // show game canvas

  body.style.overflow = "hidden";//hides the whole website when in the game.

  
  new ResizeObserver(() => {
    document.documentElement.style.setProperty(
      "--scale",
      Math.min(
        ui.parentElement.offsetWidth / ui.offsetWidth,
        ui.parentElement.offsetHeight / ui.offsetHeight
      )
    );
  }).observe(ui.parentElement);


  createRoot(ui).render(
    <StrictMode>
      <Provider store ={store}>
        <ReactUI />
      </Provider>
    </StrictMode>,
  );

 

  

  
}


