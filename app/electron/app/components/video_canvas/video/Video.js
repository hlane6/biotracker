import React from 'react';
import {ipcRenderer} from 'electron';

/**
* Foundation component to handle rendering a Video
* Video should not actually be rendered, but will be
* used by the Canvas to draw its content
*/
export default class Video extends React.Component {

  static defaultProps = {
    src: '',
    onReady: () => {},
  };

  static propTypes = {
    src: React.PropTypes.string,
    onReady: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.onReady = this.onReady.bind(this);
    this.style = { display: 'none' };
    this.handleVideoFile = this.handleVideoFile.bind(this);

    // Bind the ipc call backs so we can process files
    ipcRenderer.on('selected-video-file', this.handleVideoFile.bind(this));
  }

  componentDidMount() {
    this.rawVideo.addEventListener('canplay', this.onReady);
  }

  handleVideoFile(event, file) {
    this.rawVideo.src = file;
  }

  /**
  * We dont know the duration, width, or height of the video until it loads,
  * so we send the duration back up through a callback to be updated elsewhere
  */
  onReady() {
    console.log('duration ', this.rawVideo.duration);
    this.props.onReady({
      duration: this.rawVideo.duration,
      width: this.rawVideo.videoWidth,
      height: this.rawVideo.videoHeight,
    });
  }

  render() {
    return (
      <video
        className="video"
        src={this.props.src}
        style={this.style}
        type="video/mp4"
        ref={(video) => { this.rawVideo = video; }}
        controls
      />
    );
  }

}
