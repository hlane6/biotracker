// @flow
import React from 'react';
import { Link } from 'react-router';
import styles from './Home.css';
import Button from './Button';
import {ipcRenderer} from 'electron';

export default class Home extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      videoFile: null,
      csvFile: null,
    }

    this.openVideoFile = this.openVideoFile.bind(this);
    this.handleVideoFile = this.handleVideoFile.bind(this);
    ipcRenderer.on('selected-video-file', this.handleVideoFile.bind(this));
    ipcRenderer.on('selected-csv-file', this.handleCSVFile.bind(this));
  }

  handleVideoFile(event, file) {
    this.setState({ videoFile: file });
  }

  handleCSVFile(event, file) {
    this.setState({ csvFile: file });
  }

  openVideoFile() {
    ipcRenderer.send('open-video-file');
  }

  openCSVFile() {
    ipcRenderer.send('open-csv-file');
  }

  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <h1>Hello from React + Electron</h1>
          <Link to="/corrector">to Corrector</Link>
          <br/>
          <Button text='Select Video' handler={this.openVideoFile} />
          <p>
            Selected video file:
            { this.state.videoFile ? this.state.videoFile : ' No Video file selected' }
          </p>
          <Button text='Select CSV' handler={this.openCSVFile} />
          <p>
            Selected csv file:
            { this.state.csvFile ? this.state.csvFile : ' No CSV file selected' }
          </p>
        </div>
      </div>
    );
  }

}
