import React from 'react';

/**
 * Form to handle inputs as numbers
 */
export default class NumberInput extends React.Component {

    static defaultProps = {
        className: '',
    }

    static propTypes = {
        className: React.PropTypes.str,
    }

    constructor(props) {
        super(props);
        this.state = { value: '' };
        this.handleChange = this.handleChange.bind(this);
        this.getInput = this.getInput.bind(this);
    }

    getInput() {
        return Number(this.state.value);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
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
