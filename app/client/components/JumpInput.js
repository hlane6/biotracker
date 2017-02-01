import React from 'react';
import Button from './Button';

/**
 * Form to handle jumping between frames
 */
export default class JumpInput extends React.Component {

    static defaultProps = {
        inputCallback : function() {},
    };

    static propTypes = {
        /**
         * A callback function to handle the change of input higher up in
         * the app. Takes in one argument, a frame as a number
         */
        inputCallback : React.PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = { value: '' };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return (
            <div>
                <input
                        type='text'
                        value={ this.state.value }
                        onChange={ this.handleChange }
                />
                <Button handler={ this.handleSubmit } text='Jump' />
            </div>
        );
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        const frame = Number(this.state.value);

        if ((!frame) || (frame < 0)) {
            // TODO: Have a more graceful failure. The input should change
            // states and become red or something.
            alert('Invalid frame requested');
        } else {
            this.props.inputCallback({ frame: frame });
        }

        this.setState({ value: '' });
        event.preventDefault();
    }
}
