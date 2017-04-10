import React from 'react';
import styles from './SeekInput.css';

/**
 * Input to handle seeking in video
 */
export default class SeekInput extends React.Component {

  static defaultProps = {
    time: 0,
    duration: 1,
    width: 720,
    handleSeekCallback: () => {},
    playPauseCallback: () => {},
  };

  static propTypes = {
    time: React.PropTypes.number,
    duration: React.PropTypes.number,
    width: React.PropTypes.number,
    /**
     * A callback function to handle the change of input higher up in
     * the app. Takes in one argument, a frame as a number
     */
    handleSeekCallback: React.PropTypes.func,
    playPauseCallback: React.PropTypes.func,
  };
  constructor(props) {
    super(props);
    // FIXME: Be able to adjust to width of video
    this.style = { width: `${this.props.width}px` };
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  handleMouseDown() {
    this.props.playPauseCallback(true);
  }

  handleChange(event) {
    this.props.handleSeekCallback({ time: parseFloat(event.target.value) });
  }

  handleMouseUp() {
    this.props.playPauseCallback(true);
  }

  render() {
    return (
      <div>
        <input
          className={styles.scrubber}
          type="range" min={0} max={this.props.duration} step="any"
          value={this.props.time}
          onMouseDown={this.handleMouseDown}
          onChange={this.handleChange}
          onMouseUp={this.handleMouseUp}
          style={this.style}
        />
      </div>
    );
  }
}
