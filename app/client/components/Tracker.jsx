import React from 'react';
import VideoCanvas from './VideoCanvas';
import Parser from '../models/Parser';

export default class Tracker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            paused: true,
            frame: 0,
            time: 0.0,
        };
        this.parser = new Parser('../data/test');
        // console.log(this.parser.data);
        console.log(this.parser.getBoundingBox(1, 0));
        this.handlePlayPause = this.handlePlayPause.bind(this);
        this.handleSeek = this.handleSeek.bind(this);
    }

    handlePlayPause(paused) {
        this.setState({ paused });
    }

    handleSeek(time) {
        this.setState({ time });
    }

    render() {
        return (
          <div>
            <VideoCanvas
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
