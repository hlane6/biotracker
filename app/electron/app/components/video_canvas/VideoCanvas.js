import React from 'react';
import Canvas from './canvas/Canvas';
import FileUploader from './file_uploader/FileUploader';
import Video from './video/Video';
import VideoControls from './video_controls/VideoControls';
import Button from '../inputs/button/Button';
import Parser from '../../models/Parser';
import {ipcRenderer} from 'electron';
import styles from './VideoCanvas.css';

/**
 * Combines a video and a canvas and provides the controls
 */
export default class VideoCanvas extends React.Component {

    static defaultProps = {
        paused: false,
        time: 0,
        src: '',
        ready: false,
        boxes: [],
        duration: 0.0,
        width: 720,
        height: 480,
        playPauseCallback: () => {},
        seekCallback: () => {},
        onClick: () => {},
        downloadHandler: () => {},
    };

    static propTypes = {
        paused: React.PropTypes.bool,
        time: React.PropTypes.number,
        src: React.PropTypes.string,
        ready: React.PropTypes.bool,
        boxes: React.PropTypes.array,
        duration: React.PropTypes.number,
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        playPauseCallback: React.PropTypes.func,
        seekCallback: React.PropTypes.func,
        onClick: React.PropTypes.func,
        downloadHandler: React.PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.draw = this.draw.bind(this);
        this.getVideo = this.getVideo.bind(this);
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

        if (!this.props.paused) {
            ctx.clearRect(0, 0, width, height);
        }

        ctx.drawImage(this.getVideo(), 0, 0, width, height);

        for (let box of this.props.boxes) {
            ctx.strokeStyle = box.color;
            ctx.font = '12px sans-serif';
            ctx.fillStyle = 'white';
            ctx.fillText(parseInt(box.id), box.x, box.y);

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

        if (this.props.paused || this.getVideo().ended) { return; }
        this.props.seekCallback(this.getVideo().currentTime);
    }

    render() {
        return (
          <div className="videoCanvas">
            <Video
              ref={(video) => { this.video = video; }}
              onReady={this.props.onReady}
            />
            <Canvas
              className={this.props.ready ? "" : styles.hidden}
              draw={this.draw}
              width={this.props.width}
              height={this.props.height}
              onClick={this.props.onClick}
            />
            <FileUploader
              className={this.props.ready ? styles.hidden : ""}
            />
            <VideoControls
              paused={this.props.paused}
              time={this.props.time}
              duration={this.props.duration}
              width={this.props.width}
              getVideo={this.getVideo}
              playPauseCallback={this.props.playPauseCallback}
              seekCallback={this.props.seekCallback}
              downloadHandler={this.props.downloadHandler}
            />
          </div>
        );
    }
}
