import React from 'react';
import Button from './Button';
import JumpInput from './JumpInput';
import SeekInput from './SeekInput';

/**
 * Separates out rendering the video and controlling the video
 * into their own components.
 */
export default class VideoControls extends React.Component {

    static defaultProps = {
        paused: false,
        time: 0,
        duration: 1.0,
        width: 720,
        getVideo: () => {},
        playPauseCallback: () => {},
        seekCallback: () => {},
    };

    static propTypes = {
        paused: React.PropTypes.bool,
        time: React.PropTypes.number,
        duration: React.PropTypes.number,
        width: React.PropTypes.number,

        /** This is a function that returns an html video element
        * that the controls operate on. Using this allows for the
        * decoupling of rendering and controlling the video
        */
        getVideo: React.PropTypes.func,

        /** These callbacks are provided so that components higher
        * up can handle when an input occurs. The callbacks should
        * basically set the state in the Tracker component
        */
        playPauseCallback: React.PropTypes.func,
        seekCallback: React.PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.playPause = this.playPause.bind(this);
        this.seek = this.seek.bind(this);
        this.handleSeekInput = this.handleSeekInput.bind(this);
        this.jumpBackward = this.handleSeekInput.bind(this, { deltaFrame: -10 });
        this.stepBackward = this.handleSeekInput.bind(this, { deltaFrame: -1 });
        this.stepForward = this.handleSeekInput.bind(this, { deltaFrame: 1 });
        this.jumpForward = this.handleSeekInput.bind(this, { deltaFrame: 10 });
    }

    playPause() {
        if (this.props.paused) {
            this.props.getVideo().play();
        } else {
            this.props.getVideo().pause();
        }

        this.props.playPauseCallback(!this.props.paused);
    }

    seek(time) {
        if (time > this.props.getVideo().duration || time < 0) {
            return;
        }
        this.props.getVideo().currentTime = time;
        this.props.seekCallback(time);
    }

    handleSeekInput({ time, frame, deltaFrame }) {
        if (time === undefined && frame === undefined && deltaFrame === undefined) {
            return;
        } else if (time === undefined && deltaFrame === undefined && frame !== undefined) {
            this.seek(frame / 30);
        } else if (time === undefined && frame === undefined && deltaFrame !== undefined) {
            this.seek(this.props.time + (deltaFrame / 30));
        }
        this.seek(time);
    }

    render() {
        return (
          <div className="videoControls">
            <SeekInput
              time={this.props.time}
              duration={this.props.duration}
              width={this.props.width}
              handleSeekCallback={this.handleSeekInput}
              playPauseCallback={this.props.playPauseCallback}
            />
            <ul className="videoControls-list">
              <li><Button handler={this.jumpBackward} text="<<" /></li>
              <li><Button handler={this.stepBackward} text="<" /></li>
              <li><Button handler={this.playPause} text={(this.props.paused) ? '|>' : '||'} /></li>
              <li><Button handler={this.stepForward} text=">" /></li>
              <li><Button handler={this.jumpForward} text=">>" /></li>
            </ul>
            <JumpInput
              handleJumpCallback={this.handleSeekInput}
            />
            <h6>{this.props.time} {this.props.time * 30}</h6>
          </div>
        );
    }
}
