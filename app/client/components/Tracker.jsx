import React from 'react';
import VideoCanvas from './VideoCanvas';
import Parser from '../models/Parser';

export default class Tracker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ready: false,
            paused: true,
            frame: 0,
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
              src={'/video'}
              playPauseCallback={this.handlePlayPause}
              seekCallback={this.handleSeek}
              onClick={this.handleClick}
            />
          </div>
        );
    }
}
