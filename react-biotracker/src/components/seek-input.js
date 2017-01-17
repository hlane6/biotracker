import React from 'react';

/**
 * Input to handle seeking in video
 */
export default class SeekInput extends React.Component {

    constructor(props) {
        super(props);

        this.style = {
            width: "720px",
        };

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }

    render() {
        return (
            <div>
                <input
                        type="range" min={ 0 } max={ this.props.duration } step="any"
                        value={ this.props.frame / 30 }
                        onMouseDown={ this.handleMouseDown }
                        onChange={ this.handleChange }
                        onMouseUp={ this.handleMouseUp }
                        style={ this.style }
                />
            </div>
        );
    }

    handleMouseDown(event) {
        this.props.playPauseCallback(true);
    }

    handleChange(event) {
        this.props.handleSeek({ frame: parseFloat(event.target.value) * 30 });
    }

    handleMouseUp(event) {
        this.props.playPauseCallback(true);
    }
}
