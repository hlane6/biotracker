import React from 'react';

/**
 * React Component to handle the inner workings of canvas
 * Provides a callback function that will run every frame to
 * handle the drawing. Inspired from the react-canvas
 */
export default class Canvas extends React.Component {

    // Defaults to no callback and 30 FPS
    static defaultProps = {
        draw        : function() {},
        onClick     : function() {},
        step        : 33.367,
        width       : 600,
        height      : 600
    };

    static propTypes = {
        draw        : React.PropTypes.func,
        onClick     : React.PropTypes.func,
        step        : React.PropTypes.number,
        width       : React.PropTypes.number,
        height      : React.PropTypes.number
    };

    constructor(props) {
        super(props);
        this.requestAnimationFrameCallback = this.requestAnimationFrameCallback.bind(this);
        this.state = { progress: 0 };

        this.style = {
            width: props.width + "px",
            height: props.height + "px",
        };
    }

    componentDidMount() {
        this.forceUpdate();
    }

    render() {
        const { ...other } = this.props;
        requestAnimationFrame(this.requestAnimationFrameCallback);

        return (
            <canvas style={ this.style }
                    className="bt-canvas"
                    ref='canvas'
                    { ...other }>
                { this.props.children }
            </canvas>
        );
    }

    requestAnimationFrameCallback(time) {
        if (this.previousFrameTime !== time) {
            const { props, refs } = this;
            const { draw, step } = props;
            const ctx = (refs && refs.canvas && refs.canvas.getContext('2d'));

            let delta = 0;

            if (draw && ctx) {
                requestAnimationFrame(this.requestAnimationFrameCallback);

                if (!this.previousFrameTime) {
                    this.previousFrameTime = time;
                } else {
                    delta = time - this.previousFrameTime
                }

                this.previousFrameTime = time;
            }

            if (this.state.progress + delta > step) {
                draw({ time: time, delta: delta, ctx: ctx });
            }

            this.setState((prevState, props) => ({
                progress: (prevState.progress + delta > step) ? 0 : prevState.progress + delta
            }));
        }
    }

}
