import React from 'react';
import Button from '../../inputs/button/Button';
import styles from './FileUploader.css';
import {ipcRenderer} from 'electron';

export default class FileUploader extends React.Component {

    static defaultProps = {
        width: 600,
        height: 600,
    }

    static propTypes = {
        width: React.PropTypes.number,
        height: React.PropTypes.number,
    }

    constructor(props) {
        super(props);

        this.style = {
            width: `${this.props.width}px`,
            height: `${this.props.height}px`,
        };

        this.state = {
            videoUploaded: false,
            csvUploaded: false,
        }

        this.openVideoFile = this.openVideoFile.bind(this);
        this.handleVideoFile = this.handleVideoFile.bind(this);

        this.openCSVFile = this.openCSVFile.bind(this);
        this.handleCSVFile = this.handleCSVFile.bind(this);

        // Bind the ipc call backs so we can process files
        ipcRenderer.on('selected-video-file', this.handleVideoFile.bind(this));
        ipcRenderer.on('selected-csv-file', this.handleCSVFile.bind(this));
    }

    openVideoFile(event) {
        ipcRenderer.send('open-video-file');
    }

    handleVideoFile(event, file) {
        this.setState({ videoUploaded: true });
    }

    openCSVFile() {
        ipcRenderer.send('open-csv-file');
    }

    handleCSVFile(event, file) {
        this.setState({ csvUploaded: true });
    }

    render() {
        return (
          <div
            className={styles.file_uploader + " " + this.props.className}
            style={this.style}
          >
            <div className={styles.button_container}>
              <Button
                className={styles.button}
                text={this.state.videoUploaded ? "Video Selected" : "Select Video"}
                handler={this.openVideoFile}
              />
              <Button
                className={styles.button}
                text={this.state.csvUploaded ? "CSV Selected" : "Select CSV File"}
                handler={this.openCSVFile}
              />
            </div>
          </div>
        )
    }

}
