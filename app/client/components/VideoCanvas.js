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
        time: 0.0,
        src: '',
        playPauseCallback: function() {},
        seekCallback: function() {},
        drawCallback: function() {},
        onClick: function() {},
    };

    static propTypes = {
        paused: React.PropTypes.bool,
        time: React.PropTypes.number,
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

    render() {
        return (
            <div className='videoCanvas'>
                <Header />
                <Video
                        src={ this.props.src }
                        ref={(video) => { this.video = video; }}
                        onLoad={ this.updateDuration }
                />
                <Canvas
                        draw={ this.draw }
                        width={ 720 }
                        height={ 480 }
                        step={ 33.367 }
                        onClick={ this.props.onClick }
                />
                <VideoControls
                        paused={ this.props.paused }
                        time={ this.props.time }
                        frame={ this.props.frame }
                        duration={ this.state.duration }
                        getVideo={ this.getVideo }
                        playPauseCallback={ this.props.playPauseCallback }
                        seekCallback={ this.props.seekCallback }
                />
            </div>
        );
    }

    draw({ ctx, delta }) {
        const { width, height } = ctx.canvas;

        ctx.save();
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(this.getVideo(), 0, 0, width, height);

        ctx.restore();

        if (this.props.paused) { return; }
        this.getVideo().currentTime = this.props.frame / 30.0;
        this.props.drawCallback(this.props.frame);
    }

    getVideo() {
        return this.video.getVideo();
    }

    updateDuration(duration) {
        this.setState({ duration: duration });
    }

}
