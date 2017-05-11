import React from 'react';

export default class SeekInput extends React.Component {

  static defaultProps = {
    minValue: 10,
    maxValue: 100,
    width: 100,
    onChange: () => {},
    className: '',
  };

  static propTypes = {
    minValue: React.PropTypes.number,
    maxValue: React.PropTypes.number,
    width: React.PropTypes.number,
    onChange: React.PropTypes.func,
    className: React.PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.style = {
      width: `${props.width}px`,
    };

    this.state = {
      value: Math.floor((this.props.minValue + this.props.maxValue) / 2),
    };

    this.handleChange = this.handleChange.bind(this);
    this.getValue = this.getValue.bind(this);
    this.clear = this.clear.bind(this);
  }

  getValue() {
    return this.state.value;
  }

  clear() {
    this.setState({
      value: Math.floor((this.props.minValue + this.props.maxValue) / 2)
    });
  }

  handleChange(event) {
    this.setState({ value: Number(event.target.value) });
    this.props.onChange(Number(event.target.value));
  }

  render() {
    return (
      <input
        type="range"
        min={this.props.minValue}
        max={this.props.maxValue}
        step={1}
        onChange={this.handleChange}
        style={this.style}
        defaultValue={Math.floor((this.props.minValue + this.props.maxValue) / 2)}
        value={this.state.value}
      />
    );
  }

}
