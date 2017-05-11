import React from 'react';

/**
 * Form to handle inputs as numbers
 */
export default class NumberInput extends React.Component {

  static defaultProps = {
    className: '',
    onChange: () => {},
  }

  static propTypes = {
    className: React.PropTypes.string,
    onChange: React.PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = { value: '' };
    this.handleChange = this.handleChange.bind(this);
    this.getInput = this.getInput.bind(this);
  }

  getInput() {
    if (this.state.value == '' || Number(this.state.value) === NaN) return null;
    return Number(this.state.value);
  }

  clear() {
    this.setState({ value: '' });
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
    this.props.onChange(event.target.value);
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
