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
        time: 0.0,
        frame: 0,
        duration: 1.0,
        getVideo: function() {},
        playPauseCallback: function() {},
        seekCallback: function() {},
    };

    static propTypes = {
        paused: React.PropTypes.bool,
        time: React.PropTypes.number,
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
        this.handleSeekInput = this.handleSeekInput.bind(this);
    }

    render() {
        return (
            <div className='videoControls'>
                <SeekInput
                        frame={ this.props.frame }
                        duration={ this.props.duration }
                        handleSeek={ this.handleSeekInput }
                        playPauseCallback={ this.props.playPauseCallback }
                />
                <ul className='videoControls-list'>
                    <li><Button handler={ this.seek.bind(this, -10) } text='<<' /></li>
                    <li><Button handler={ this.seek.bind(this, -1) } text='<' /></li>
                    <li><Button handler={ this.playPause } text={ (this.props.paused) ? '|>' : '||' } /></li>
                    <li><Button handler={ this.seek.bind(this, 1) } text='>' /></li>
                    <li><Button handler={ this.seek.bind(this, 10) } text='>>' /></li>
                </ul>

                <JumpInput
                        inputCallback={ this.handleSeekInput }
                />

                <h6>{ this.props.frame } { this.props.frame * 30 }</h6>
            </div>
        );
    }

    playPause() {
        if ( this.props.paused ) {
            this.props.getVideo().play();
        } else {
            this.props.getVideo().pause();
        }

        this.props.playPauseCallback(!this.props.paused);
    }

    seek(frames) {
        const newFrame = (this.props.frame + frames);
        const newTime = newFrame / 30 + .00001;

        if (newTime > this.props.getVideo().duration) {
            return;
        }

        this.props.getVideo().currentTime = newTime;
        this.props.seekCallback(newFrame);
    }

    handleSeekInput({ time, frame }) {
        if (frame === undefined && time === undefined) {
            return;
        } else if (frame === undefined) {
            frame = Math.floor(time * 30);
        }

        this.seek(frame - this.props.frame);
    }

}
