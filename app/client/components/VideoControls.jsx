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
        frame: 0,
        duration: 1.0,
        getVideo: () => {},
        playPauseCallback: () => {},
        seekCallback: () => {},
    };

    static propTypes = {
        paused: React.PropTypes.bool,
        frame: React.PropTypes.number,
        duration: React.PropTypes.number,

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
        this.jumpBackward = this.seek.bind(this, -10);
        this.stepBackward = this.seek.bind(this, -1);
        this.stepForward = this.seek.bind(this, 1);
        this.jumpForward = this.seek.bind(this, 10);
        this.handleSeekInput = this.handleSeekInput.bind(this);
    }

    playPause() {
        if (this.props.paused) {
            this.props.getVideo().play();
        } else {
            this.props.getVideo().pause();
        }

        this.props.playPauseCallback(!this.props.paused);
    }

    seek(frames) {
        const newFrame = (this.props.frame + frames);
        const newTime = (newFrame / 30) + 0.00001;

        if (newTime > this.props.getVideo().duration) {
            return;
        }

        this.props.getVideo().currentTime = newTime;
        this.props.seekCallback(newFrame);
    }

    handleSeekInput(frame) {
        if (frame === undefined) {
            return;
        }
        this.seek(frame - this.props.frame);
    }

    render() {
        return (
          <div className="videoControls">
            <SeekInput
              frame={this.props.frame}
              duration={this.props.duration}
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
            <h6>{this.props.frame} {this.props.frame * 30}</h6>
          </div>
        );
    }
}
