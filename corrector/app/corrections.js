import React from 'react';
import { render } from 'react-dom';
import CorrectionsPanel from './components/corrections_panel/CorrectionsPanel';

// Fonts
 require('./assets/fonts/Montserrat/montserrat.css');

render(
  <CorrectionsPanel />,
  document.getElementById('root')
);
