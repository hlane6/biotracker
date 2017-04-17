import React from 'react';
import { ipcRenderer } from 'electron';
import VideoCanvas from '../video_canvas/VideoCanvas';
import Parser from '../../models/Parser';
import Header from '../header/Header';
import styles from './Tracker.css';

/**
* Root component which keeps track of the boxes, a users pick
* and will update the app with video metadata once it loads
*/
export default class Tracker extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      videoReady: false,
      csvReady: false,
      paused: true,
      time: 0.0,
      duration: 0.0,
      width: 720,
      height: 480,
      boxes: [],
    };

    this.parser = null;

    this.onReady = this.onReady.bind(this);
    this.handlePlayPause = this.handlePlayPause.bind(this);
    this.handleSeek = this.handleSeek.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.downloadCSV = this.downloadCSV.bind(this);

    // File handlers
    this.handleCSVFile = this.handleCSVFile.bind(this);

    // Bind the ipc call backs so we can process files
    ipcRenderer.on('selected-csv-file', this.handleCSVFile.bind(this));
    ipcRenderer.on('add-correction', this.addCorrection.bind(this));
  }

  /**
   * Callback that occurs once a video has been uploaded and its metadata
   * has been loaded. This will update the state so that the proper
   * width, height, and duration of the video can be progated throughout
   * the app
   */
  onReady({ duration, width, height }) {
    this.setState({
      duration,
      width,
      height,
      videoReady: true,
    });
  }

  /**
   * Callback occurs when the video has been played or paused so that
   * we can update the state.
   */
  handlePlayPause(paused) {
    if (!(this.state.videoReady && this.state.csvReady)) return;
    this.setState({ paused });
  }

  /**
   * Callback to handle a new time for the video.
   */
  handleSeek(time) {
    if (!(this.state.videoReady && this.state.csvReady)) return;
    this.setState({
      time,
      boxes: this.parser.getFrame(Math.floor(time * 30)),
      pick: null,
    });
  }

  /**
   * Callback occurs when a csv file has been uploaded so that we can
   * update the proper state and start fetching the boxes.
   */
  handleCSVFile(event, file) {
    this.parser = new Parser(file, () => {
      this.setState({
        csvReady: true,
        boxes: this.parser.getFrame(0),
      });
    });
  }

  /**
   * Click handler for the canvas. Will detect collisions with any
   * boxes and send out an update-selection message if a collision occurs.
   */
  handleClick(event) {
    const { offsetX, offsetY } = event.nativeEvent;

    for (const box of this.state.boxes) {
      if (box.collidesWith(offsetX, offsetY)) {
        ipcRenderer.send('update-selection', box);
      }
    }
  }

  /**
   * Callback occurs when an add-correction event is sent from the
   * CorrectionsWindow
   */
  addCorrection(event, correction) {
    this.parser.update({
      frame: Math.floor(this.state.time / 30),
      newId: correction.newId,
      oldId: correction.oldId
    });
  }

  /**
  * Download button handler which will download the updated
  * csv file based on the parsers bounding boxes.
  */
  downloadCSV() {
    const columnDelimiter = ',';
    const lineDelimiter = '\n';
    const keys = ['frame_num', 'target_id', 'x', 'y', 'width', 'height', 'theta'];

    let csv = 'data:text/csv;charset=utf-8,';
    csv += keys.join(columnDelimiter);
    csv += lineDelimiter;

    for (let i = 0; i < this.parser.data.length; i++) {
      for (let j = 0; j < this.parser.data[i].length; j++) {
        const box = this.parser.data[i][j];
        csv += (`${i},${box.id},${box.x},${box.y},`
            + `${box.width},${box.height},${box.theta}\n`);
      }
    }

    const filename = 'export.csv';
    const encodedCsv = encodeURI(csv);
    const link = document.createElement('a');
    link.setAttribute('href', encodedCsv);
    link.setAttribute('download', filename);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  render() {
    return (
      <div className={styles.container}>
        <Header
          time={this.state.time}
        />
        <VideoCanvas
          parser={this.parser}
          paused={this.state.paused}
          time={this.state.time}
          ready={this.state.csvReady && this.state.videoReady}
          boxes={this.state.boxes}
          duration={this.state.duration}
          width={this.state.width}
          height={this.state.height}
          playPauseCallback={this.handlePlayPause}
          seekCallback={this.handleSeek}
          onReady={this.onReady}
          onClick={this.handleClick}
          downloadHandler={this.downloadCSV}
        />
      </div>
    );
  }
}