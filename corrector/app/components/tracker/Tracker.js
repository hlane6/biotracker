import React from 'react';
import { ipcRenderer } from 'electron';
import VideoCanvas from '../video_canvas/VideoCanvas';
import Parser from '../../models/Parser';
import Composer from '../../models/Composer';
import { AddCorrection,
  MODES,
  RemoveCorrection,
  RotateCorrection,
  SwitchCorrection,
  UpdateCorrection } from '../../models/Corrections';
import Header from '../header/Header';
import styles from './Tracker.css';

/**
 * TODO: update design of CorrectionPanel
 */

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
    this.composer = null;

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
    ipcRenderer.on('stage-correction', this.stageCorrection.bind(this));
    ipcRenderer.on('unstage-correction', this.unstageCorrection.bind(this));
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
      boxes: this.composer.frame(Math.floor(time * 30)),
      pick: null,
    });
  }

  /**
   * Callback occurs when a csv file has been uploaded so that we can
   * update the proper state and start fetching the boxes.
   */
  handleCSVFile(event, file) {
    this.parser = new Parser(file, (data) => {
      this.composer = new Composer(data);

      this.setState({
        csvReady: true,
        boxes: this.composer.frame(0),
      });
    });
  }

  /**
   * Click handler for the canvas. Will detect collisions with any
   * boxes and send out an update-selection message if a collision occurs.
   */
  handleClick(event) {
    const { offsetX, offsetY } = event.nativeEvent;
    const payload = {
      box: null,
      location: {
        x: offsetX,
        y: offsetY,
      },
      frame: Math.floor(this.state.time * 30),
    };

    for (const box of this.state.boxes) {
      if (box.collidesWith(offsetX, offsetY)) {
        payload.box = box;
      }
    }

    ipcRenderer.send('clicked', payload);
  }

  /**
   * Callback occurs when an add-correction event is sent from the
   * CorrectionsWindow
   */
  addCorrection(event, payload) {
    const { type, correction } = payload;
    let toAdd = this.reconstructCorrection(type, correction);
    if (correction) this.composer.add(toAdd);
  }

  /**
   * Callback occurs when staging a correction. This will update the
   * current frames boxes based on the current state of the correction.
   * This correction will not be saved until the add-correction event
   * is sent.
   */
  stageCorrection(event, payload) {
    const { type, correction } = payload;
    let toStage = this.reconstructCorrection(type, correction);

    this.setState((prevState, props) => {
      return {
        boxes: toStage.update(
          this.composer.frame(Math.floor(prevState.time * 30))),
      }
    });
  }

  unstageCorrection() {
    this.setState((prevState, props) => {
      return {
        boxes: this.composer.frame(Math.floor(prevState.time * 30))
      }
    });
  }

  reconstructCorrection(type, correction) {
    let toAdd = null;

    if (type == MODES.ADD) {
      toAdd = new AddCorrection(
        correction.frame,
        correction.id,
        correction.x,
        correction.y,
        correction.width,
        correction.height,
        correction.theta);
    } else if (type == MODES.REMOVE) {
      toAdd = new RemoveCorrection(
        correction.frame,
        correction.id);
    } else if (type == MODES.ROTATE) {
      toAdd = new RotateCorrection(
        correction.frame,
        correction.id,
        correction.theta);
    } else if (type == MODES.SWITCH) {
      toAdd = new SwitchCorrection(
        correction.frame,
        correction.id1,
        correction.id2);
    } else if (type == MODES.UPDATE) {
      toAdd = new UpdateCorrection(
        correction.frame,
        correction.oldId,
        correction.newId);
    }

    return toAdd;
  }

  /**
  * Download button handler which will download the updated
  * csv file based on the parsers bounding boxes.
  */
  downloadCSV() {
    const csv = this.composer.csv;

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
