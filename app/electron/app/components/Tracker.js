import React from 'react';
import VideoCanvas from './VideoCanvas';
import Parser from '../models/Parser';
import CorrectionsPanel from './CorrectionsPanel';
import Button from './Button';
import {ipcRenderer} from 'electron';

/**
* Root component which keeps track of the boxes, a users pick
* and will update the app with video metadata once it loads
*/
export default class Tracker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ready: false,
            paused: true,
            time: 0.0,
            duration: 0.0,
            width: 720,
            height: 480,
            boxes: [],
            pick: null,
        };

        this.parser = null;

        this.onReady = this.onReady.bind(this);
        this.handlePlayPause = this.handlePlayPause.bind(this);
        this.handleSeek = this.handleSeek.bind(this);
        this.handleClick = this.handleClick.bind(this);

        // File handlers
        this.openVideoFile = this.openVideoFile.bind(this);
        this.openCSVFile = this.openCSVFile.bind(this);
        this.handleCSVFile = this.handleCSVFile.bind(this);

        // Bind the ipc call backs so we can process files
        ipcRenderer.on('selected-csv-file', this.handleCSVFile.bind(this));
    }

    onReady({ duration, width, height }) {
        this.setState({ duration, width, height });
    }

    handlePlayPause(paused) {
        if (!this.state.ready) return;
        this.setState({ paused });
    }

    handleSeek(time) {
        if (!this.state.ready) return;
        this.setState({
            time,
            boxes: this.parser.getFrame(Math.floor(time * 30)),
            pick: null,
        });
    }

    openVideoFile(event) {
        ipcRenderer.send('open-video-file');
    }

    handleCSVFile(event, file) {
        console.log(file);
        this.parser = new Parser(file, () => {
            console.log('csv ready');
            this.setState({
                ready: true,
                boxes: this.parser.getFrame(0),
            });
        });
    }

    openCSVFile() {
        ipcRenderer.send('open-csv-file');
    }

    handleClick(event) {
        const { offsetX, offsetY } = event.nativeEvent;

        for (const box of this.state.boxes) {
            if (box.collidesWith(offsetX, offsetY)) {
                this.setState({ pick: box });
            }
        }
    }

    render() {
        return (
          <div className="container-home">
            <div className="row">
              <Button text="Load Video File" handler={this.openVideoFile} />
              <Button text="Load CSV File" handler={this.openCSVFile} />
            </div>
            <div className="row">
              <div className="nine columns">
                <VideoCanvas
                  parser={this.parser}
                  paused={this.state.paused}
                  time={this.state.time}
                  ready={this.state.ready}
                  boxes={this.state.boxes}
                  duration={this.state.duration}
                  width={this.state.width}
                  height={this.state.height}
                  src={""}
                  playPauseCallback={this.handlePlayPause}
                  seekCallback={this.handleSeek}
                  onReady={this.onReady}
                  onClick={this.handleClick}
                />
              </div>
              <div className="three columns">
                <CorrectionsPanel
                  pick={this.state.pick}
                  time={this.state.time}
                  parser={this.parser}
                  handleCorrection={this.handleCorrection}
                />
              </div>
            </div>
          </div>
        );
    }
}
