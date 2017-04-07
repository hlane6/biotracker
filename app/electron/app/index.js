import React from 'react';
import { render } from 'react-dom';
import './app.global.css';
import Tracker from './components/tracker/Tracker';

// Fonts
require('./assets/fonts/Montserrat/montserrat.css');

render(
  <Tracker />,
  document.getElementById('root')
);
