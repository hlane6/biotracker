import React from "react";
import Button from "./button";
import JumpInput from "./jump-input";
import SeekInput from "./seek-input";

/**
 * Controls for a VideoCanvas component
 */
export default class VideoControls extends React.Component {

    static defaultProps = {
        paused              : false,
        time                : 0.0,
        frame               : 0,
        duration            : 1.0,
        getVideo            : function() {},
        playPauseCallback   : function() {},
        seekCallback        : function() {},
    };

    static propTypes = {
        paused              : React.PropTypes.bool,
        time                : React.PropTypes.number,
        duration            : React.PropTypes.number,
        getVideo            : React.PropTypes.func,
        playPauseCallback   : React.PropTypes.func,
        seekCallback        : React.PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.playPause = this.playPause.bind(this);
        this.seek = this.seek.bind(this);

        this.__handleSeekInput = this.__handleSeekInput.bind(this);
    }

    render() {
        return (
            <div className="bt-video-controls">
                <SeekInput
                        frame={ this.props.frame }
                        duration={ this.props.duration }
                        handleSeek={ this.__handleSeekInput }
                        playPauseCallback={ this.props.playPauseCallback }
                />
                <ul className="bt-video-controls-list">
                    <li><Button handler={ this.seek.bind(this, -10) } text="<<" /></li>
                    <li><Button handler={ this.seek.bind(this, -1) } text="<" /></li>
                    <li><Button handler={ this.playPause } text={ (this.props.paused) ? "|>" : "||" } /></li>
                    <li><Button handler={ this.seek.bind(this, 1) } text=">" /></li>
                    <li><Button handler={ this.seek.bind(this, 10) } text=">>" /></li>
                </ul>

                <JumpInput
                        inputCallback={ this.__handleSeekInput }
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

    __handleSeekInput({ time, frame }) {
        if (frame === undefined && time === undefined) {
            return;
        } else if (frame === undefined) {
            frame = Math.floor(time * 30);
        }

        this.seek(frame - this.props.frame);
    }

}
