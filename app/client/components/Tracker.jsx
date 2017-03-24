import React from 'react';
import VideoCanvas from './VideoCanvas';
import Parser from '../models/Parser';
import Button from './Button';
import CorrectionsPanel from './CorrectionsPanel';

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

        this.parser = new Parser('/csvData', () => {
            this.setState({
                ready: true,
                boxes: this.parser.getFrame(0),
            });
        });

        this.onReady = this.onReady.bind(this);
        this.handlePlayPause = this.handlePlayPause.bind(this);
        this.handleSeek = this.handleSeek.bind(this);
        this.handleClick = this.handleClick.bind(this);
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
      const newBoxes = this.composer.correct(
        Math.floor(time * 30),
        this.parser.getFrame(Math.floor(time * 30))
      );

      this.setState({
          time: time,
          boxes: newBoxes,
          pick: null,
      });
    }

    handleClick(event) {
        const {offsetX, offsetY} = event.nativeEvent;

        for (let box of this.state.boxes) {
            if (box.collidesWith(offsetX, offsetY)) {
                this.setState({ pick: box });
            }
        }
    }

    render() {
        return (
          <div className="container-home">
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
              src={'/video'}
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
