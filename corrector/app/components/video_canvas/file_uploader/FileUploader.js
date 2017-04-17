import React from 'react';
import { ipcRenderer } from 'electron';
import Button from '../../inputs/button/Button';
import styles from './FileUploader.css';

export default class FileUploader extends React.Component {

  static defaultProps = {
    width: 720,
    height: 480,
    className: '',
  };

  static propTypes = {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    className: React.PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.style = {
      width: `${this.props.width}px`,
      height: `${this.props.height}px`,
    };

    this.state = {
      videoUploaded: false,
      csvUploaded: false,
    };

    this.openVideoFile = this.openVideoFile.bind(this);
    this.handleVideoFile = this.handleVideoFile.bind(this);

    this.openCSVFile = this.openCSVFile.bind(this);
    this.handleCSVFile = this.handleCSVFile.bind(this);

    // Bind the ipc call backs so we can process files
    ipcRenderer.on('selected-video-file', this.handleVideoFile.bind(this));
    ipcRenderer.on('selected-csv-file', this.handleCSVFile.bind(this));
  }

  openVideoFile() {
    ipcRenderer.send('open-video-file');
  }

  handleVideoFile() {
    this.setState({ videoUploaded: true });
  }

  openCSVFile() {
    ipcRenderer.send('open-csv-file');
  }

  handleCSVFile() {
    this.setState({ csvUploaded: true });
  }

  render() {
    return (
      <div
        className={styles.file_uploader + ' ' + this.props.className}
        style={this.style}
      >
        <div className={styles.button_container}>
          <Button
            className={styles.button}
            text={this.state.videoUploaded
              ? 'Video Selected'
              : 'Select Video'}
            handler={this.openVideoFile}
          />
          <img
            className={this.state.videoUploaded
              ? styles.checkmark
              : styles.hidden}
            src={require('../../../assets/img/checkmark.png')}
            alt={''}
          />
          <Button
            className={styles.button}
            text={this.state.csvUploaded
              ? 'CSV Selected'
              : 'Select CSV File'}
            handler={this.openCSVFile}
          />
          <img
            className={this.state.csvUploaded
            ? styles.checkmark
            : styles.hidden}
            src={require('../../../assets/img/checkmark.png')}
            alt={''}
          />
        </div>
      </div>
    );
  }

}