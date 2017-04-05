import React from 'react';
import Button from '../../inputs/button/Button';
import NumberInput from '../../inputs/number_input/NumberInput';
import SeekInput from '../../inputs/seek_input/SeekInput';
import styles from './VideoControls.css';

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
        downloadHandler: () => {},
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
        downloadHandler: React.PropTypes.func,
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

    handleSeekInput({ time, deltaFrame }) {
        const frame = this.input.getInput();

        if (time === undefined && frame === undefined && deltaFrame === undefined) {
            return;
        } else if (time === undefined && deltaFrame !== undefined) {
            this.seek(this.props.time + (deltaFrame / 30));
        } else if (time === undefined && deltaFrame === undefined && frame !== undefined) {
            this.seek(frame / 30);
        }

        this.seek(time);
    }

    render() {
        return (
          <div className={styles.video_controls}>
            <SeekInput
              time={this.props.time}
              duration={this.props.duration}
              width={this.props.width}
              handleSeekCallback={this.handleSeekInput}
              playPauseCallback={this.props.playPauseCallback}
            />
            <Button
              className={styles.video_navigation}
              handler={this.jumpBackward}
              text="<<"
            />
            <Button
              className={styles.video_navigation}
              handler={this.stepBackward}
              text="<"
            />
            <Button
              className={styles.video_navigation}
              handler={this.playPause}
              text={(this.props.paused) ? 'play' : 'pause'}
            />
            <Button
              className={styles.video_navigation}
              handler={this.stepForward}
              text=">"
            />
            <Button
              className={styles.video_navigation}
              handler={this.jumpForward}
              text=">>"
             />
            <NumberInput
              className={styles.frame}
              ref={(input) => { this.input = input; }}
            />
            <Button
              className={styles.seek_frame}
              handler={this.handleSeekInput}
              text="jump"
            />
            <Button
              className={styles.bottom_button}
              text="download data file"
              handler={this.props.downloadHandler}
            />
          </div>
        );
    }
}
