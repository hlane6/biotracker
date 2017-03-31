import React from 'react';
import {Link} from 'react-router';

export default class Tracker extends React.Component {
  render() {
    return (
      <div className="container">
        <Link to="/">Back</Link>
      </div>
    );
  }
}
