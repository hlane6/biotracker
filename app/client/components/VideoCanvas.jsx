import React from 'react';
import Canvas from './Canvas';
import Video from './Video';
import VideoControls from './VideoControls';

/**
 * Combines a video and a canvas and provides the controls
 */
export default class VideoCanvas extends React.Component {

    static defaultProps = {
        paused: false,
        time: 0,
        src: '',
        playPauseCallback: () => {},
        seekCallback: () => {},
        onClick: () => {},
    };

    static propTypes = {
        paused: React.PropTypes.bool,
        time: React.PropTypes.number,
        src: React.PropTypes.string,
        playPauseCallback: React.PropTypes.func,
        seekCallback: React.PropTypes.func,
        onClick: React.PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            duration: 1.0,
            width: 720,
            height: 420,
        };

        this.draw = this.draw.bind(this);
        this.getVideo = this.getVideo.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    getVideo() {
        return this.video.rawVideo;
    }

    draw({ ctx }) {
        const { width, height } = ctx.canvas;

        ctx.drawImage(this.getVideo(), 0, 0, width, height);

        if (this.props.paused || this.getVideo().ended) { return; }
        this.props.seekCallback(this.getVideo().currentTime);
    }

    updateState({ duration, width, height }) {
        this.setState({ duration, width, height });
    }

    render() {
        return (
          <div className="videoCanvas">
            <Video
              src={this.props.src}
              ref={(video) => { this.video = video; }}
              onReady={this.updateState}
            />
            <Canvas
              draw={this.draw}
              width={this.state.width}
              height={this.state.height}
              onClick={this.props.onClick}
            />
            <VideoControls
              paused={this.props.paused}
              time={this.props.time}
              duration={this.state.duration}
              width={this.state.width}
              getVideo={this.getVideo}
              playPauseCallback={this.props.playPauseCallback}
              seekCallback={this.props.seekCallback}
            />
          </div>
        );
    }
}
