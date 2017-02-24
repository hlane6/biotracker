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
        ready: false,
        playPauseCallback: () => {},
        seekCallback: () => {},
        onClick: () => {},
    };

    static propTypes = {
        paused: React.PropTypes.bool,
        time: React.PropTypes.number,
        src: React.PropTypes.string,
        ready: React.PropTypes.bool,
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
            boxes: [],
        };

        this.draw = this.draw.bind(this);
        this.getVideo = this.getVideo.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    getVideo() {
        return this.video.rawVideo;
    }

    draw({ ctx }) {
        /*  This line makes it so that we don't render the video until the
            parser has finished loading all the data. We should add a loading
            animation to make it look prettier. */
        if (!this.props.ready) { return; }
        const { width, height } = ctx.canvas;

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(this.getVideo(), 0, 0, width, height);
        ctx.strokeStyle = 'red';

        for (let box of this.state.boxes) {
            ctx.translate(box.x, box.y);
            ctx.rotate(box.theta * Math.PI / 180);

            ctx.strokeRect(
                -box.width / 2,
                -box.height / 2,
                box.width,
                box.height
            );

            ctx.rotate(-box.theta * Math.PI / 180);
            ctx.translate(-box.x, -box.y);
        }
        this.setState({
            boxes: this.props.parser.getFrame(Math.floor(this.props.time * 30))
        });

        if (this.props.paused || this.getVideo().ended) { return; }
        this.props.seekCallback(this.getVideo().currentTime);
    }

    updateState({ duration, width, height }) {
        this.setState({ duration, width, height });
    }

    render() {
        return (
          <div className="videoCanvas container-home">
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
