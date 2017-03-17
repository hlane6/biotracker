import React from 'react';
import VideoCanvas from './VideoCanvas';
import Parser from '../models/Parser';
import Button from './Button';
import CorrectionsPanel from './Corrections';
import Composer from '../models/Composer';

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

        this.composer = new Composer();

        this.onReady = this.onReady.bind(this);
        this.handlePlayPause = this.handlePlayPause.bind(this);
        this.handleSeek = this.handleSeek.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleCorrection = this.handleCorrection.bind(this);
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
          time: time,
          boxes: this.parser.getFrame(Math.floor(time * 30)),
          pick: null,
      });
    }

    handleClick(event) {
        const {offsetX, offsetY} = event.nativeEvent;
        console.log(event);

        for (let box of this.state.boxes) {
            if (box.collidesWith(offsetX, offsetY)) {
                this.setState({ pick: box });
            }
        }
    }

    handleCorrection(correction) {

    }

    render() {
        return (
          <div>
            <h1>{this.state.time}</h1>
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

            <CorrectionsPanel
              pick={this.state.pick}
              time={this.state.time}
              composer={this.composer}
              handleCorrection={this.handleCorrection}
            />

            <a href="/csvData">
              <Button className="bottom-buttons" text="download data file" />
            </a>
            <a href="/">
              <Button className="bottom-buttons" text="change video" />
            </a>
          </div>
        );
    }
}
