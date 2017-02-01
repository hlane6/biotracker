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
        step: 33.367,
        width: 600,
        height: 600,
    };

    static propTypes = {
        draw: React.PropTypes.func,
        onClick: React.PropTypes.func,
        step: React.PropTypes.number,
        width: React.PropTypes.number,
        height: React.PropTypes.number,
    };

    constructor(props) {
        super(props);
        this.requestAnimationFrameCallback = this.requestAnimationFrameCallback.bind(this);
        this.state = { progress: 0 };

        this.style = {
            width: `${props.width}px`,
            height: `${props.height}px`,
        };
    }

    componentDidMount() {
        this.forceUpdate();
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

            if (this.state.progress + delta > this.props.step) {
                this.props.draw({ time, delta, ctx });
            }

            this.setState(prevState => ({
                progress: (prevState.progress + delta > this.props.step)
                        ? 0
                        : prevState.progress + delta,
            }));
        }
    }

    render() {
        requestAnimationFrame(this.requestAnimationFrameCallback);
        return (
          <canvas
            style={this.style}
            className="canvas"
            ref={(input) => { this.canvas = input; }}
            onClick={this.props.onClick}
          />
        );
    }
}
