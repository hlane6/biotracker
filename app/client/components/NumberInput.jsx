import React from 'react';
import Button from './Button';

/**
 * Form to handle jumping between frames
 */
export default class NumberInput extends React.Component {

    static defaultProps = {
        handleCallback: () => {},
    };

    static propTypes = {
        handleCallback: React.PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = { value: '' };
        this.handleChange = this.handleChange.bind(this);
        this.getInput = this.getInput.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    getInput() {
        return Number(this.state.value);
    }

    render() {
        return (
          <input
            className={this.props.className}
            type="number"
            value={this.state.value}
            onChange={this.handleChange}
          />
        );
    }
}
