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
        frame: 0,
        src: '',
        playPauseCallback: () => {},
        seekCallback: () => {},
        drawCallback: () => {},
        onClick: () => {},
    };

    static propTypes = {
        paused: React.PropTypes.bool,
        frame: React.PropTypes.number,
        src: React.PropTypes.string,
        playPauseCallback: React.PropTypes.func,
        seekCallback: React.PropTypes.func,
        drawCallback: React.PropTypes.func,
        onClick: React.PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = { duration: 1.0 };
        this.draw = this.draw.bind(this);
        this.getVideo = this.getVideo.bind(this);
        this.updateDuration = this.updateDuration.bind(this);
    }

    getVideo() {
        return this.video.rawVideo;
    }

    draw({ ctx }) {
        const { width, height } = ctx.canvas;

        // ctx.clearRect(0, 0, width, height);
        ctx.drawImage(this.getVideo(), 0, 0, width, height);

        if (this.props.paused || this.getVideo().ended) { return; }
        this.getVideo().currentTime = this.props.frame / 30.0;
        this.props.drawCallback();
    }

    updateDuration(duration) {
        this.setState({ duration });
    }

    render() {
        return (
          <div className="videoCanvas">
            <Video
              src={this.props.src}
              ref={(video) => { this.video = video; }}
              onReady={this.updateDuration}
            />
            <Canvas
              draw={this.draw}
              width={720}
              height={480}
              step={33}
              onClick={this.props.onClick}
            />
            <VideoControls
              paused={this.props.paused}
              frame={this.props.frame}
              duration={this.state.duration}
              getVideo={this.getVideo}
              playPauseCallback={this.props.playPauseCallback}
              seekCallback={this.props.seekCallback}
            />
          </div>
        );
    }
}
