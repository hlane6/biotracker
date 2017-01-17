import React from 'react';
import ReactDOM from 'react-dom';
import Biotracker from './components/biotracker';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Biotracker />, div);
});
