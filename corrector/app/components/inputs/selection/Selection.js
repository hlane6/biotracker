import React from 'react';

/**
 * Selection input that takes in its options as a prop
 */
export default class Selection extends React.Component {

  static defaultProps = {
    choices: [],
    default: null,
    className: '',
    handler: () => {},
  };

  static propTypes = {
    choices: React.PropTypes.array,
    className: React.PropTypes.string,
    handler: React.PropTypes.function,
  };

  constructor(props) {
    super(props);
    this.handleSelection = this.handleSelection.bind(this);
    this.getSelection = this.getSelection.bind(this);
  }

  handleSelection() {
    this.props.handler(this.getSelection());
  }

  getSelection() {
    return this.select.options[this.select.selectedIndex].value;
  }

  render() {
    const options = this.props.choices.map((choice) => {
      return (
        <option value={choice} selected={choice == this.props.default} key={choice.toString()}>
          {choice.toString()}
        </option>
      );
    });

    return (
      <select
        className={this.props.className}
        ref={(select) => {this.select = select}}
        onChange={this.handleSelection}
      >
        {options}
      </select>
    );
  }
}
