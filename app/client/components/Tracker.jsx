import React from 'react';
import VideoCanvas from './VideoCanvas';
import Parser from '../models/Parser';
import Button from './Button';
import CorrectionsPanel from './Corrections';

export default class Tracker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ready: false,
            paused: true,
            time: 0.0,
        };

        this.parser = new Parser('/csvData', () => {
            this.setState({ ready: true });
        });

        this.handlePlayPause = this.handlePlayPause.bind(this);
        this.handleSeek = this.handleSeek.bind(this);
    }

    handlePlayPause(paused) {
      if (!this.state.ready) return;
      this.setState({ paused });
    }

    handleSeek(time) {
      if (!this.state.ready) return;
      this.setState({ time });
    }

    render() {
        return (
          <div>
            <VideoCanvas
              parser={this.parser}
              paused={this.state.paused}
              time={this.state.time}
              ready={this.state.ready}
              src={'/video'}
              playPauseCallback={this.handlePlayPause}
              seekCallback={this.handleSeek}
              onClick={this.handleClick}
            />
            <CorrectionsPanel />
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
