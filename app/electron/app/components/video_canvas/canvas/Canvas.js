import React from 'react';

/**
 * Foundational component to handle the inner workings of canvas
 * Provides a callback function that will run every frame to
 * handle the drawing. Inspired from react-canvas
 */
export default class Canvas extends React.Component {

  // Defaults to no callback and 30 FPS
  static defaultProps = {
    draw: () => {},
    onClick: () => {},
    width: 600,
    height: 600,
    className: '',
  };

  static propTypes = {
    draw: React.PropTypes.func,
    onClick: React.PropTypes.func,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    className: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.requestAnimationFrameCallback = this.requestAnimationFrameCallback.bind(this);
    this.style = {
      width: `${this.props.width}px`,
      height: `${this.props.height}px`,
    };
  }

  componentDidMount() {
    this.forceUpdate();
    this.canvas.getContext('2d').imageSmoothingEnabled = false;
  }

  requestAnimationFrameCallback(time) {
    if (this.previousFrameTime !== time) {
      const ctx = (this.canvas && this.canvas.getContext('2d'));
      let delta = 0;

      if (this.props.draw && ctx) {
        requestAnimationFrame(this.requestAnimationFrameCallback);

        if (!this.previousFrameTime) {
          this.previousFrameTime = time;
        } else {
          delta = time - this.previousFrameTime;
        }
        this.previousFrameTime = time;
      }

      this.props.draw({ time, delta, ctx });
    }
  }

  render() {
      requestAnimationFrame(this.requestAnimationFrameCallback);
      return (
        <canvas
          style={this.style}
          className={this.props.className}
          width={this.props.width}
          height={this.props.height}
          ref={(input) => { this.canvas = input; }}
          onClick={this.props.onClick}
        />
      );
  }
}
