import React from 'react';
import VideoCanvas from './VideoCanvas';

export default class Tracker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            paused: true,
            frame: 0,
        };
        this.handlePlayPause = this.handlePlayPause.bind(this);
        this.handleSeek = this.handleSeek.bind(this);
        this.handleDraw = this.handleDraw.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handlePlayPause(paused) {
        this.setState({ paused });
    }

    handleSeek(frame) {
        this.setState({ frame });
    }

    handleDraw() {
        this.setState(prevState => ({ frame: prevState.frame + 1 }));
    }

    /* eslint-disable */
    // FIXME: implement clicking and remove eslint
    handleClick(event) {
        console.log(event);
    }
    /* eslint-enable */

    render() {
        return (
          <div>
            <VideoCanvas
              paused={this.state.paused}
              frame={this.state.frame}
              src={'/video'}
              playPauseCallback={this.handlePlayPause}
              seekCallback={this.handleSeek}
              drawCallback={this.handleDraw}
              onClick={this.handleClick}
            />
          </div>
        );
    }
}
