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
  const ui = document.getElementById("ui");

  // Hide website
  //websiteRoot.style.display = "none";

  // Show game elements
  //ui.style.display = "block";
  //gameCanvas.style.display = "block";

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

  initGame();
}


