import React from 'react';
import Button from './Button';

/**
 * Form to handle jumping between frames
 */
export default class ObjectIdInput extends React.Component {

    static defaultProps = {
        handleIdCallback: () => {},
    };

    static propTypes = {
        handleIdCallback: React.PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = { value: '' };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        const id = Number(this.state.value);

        if ((!id) || (id < 0)) {
            alert('Invalid id requested'); // eslint-disable-line
        } else {
            this.props.handleIdCallback(id);
        }

        this.setState({ value: '' });
        event.preventDefault();
    }

    render() {
        return (
          <div>
            <input
              className="box-id"
              type="number"
              value={this.state.value}
              onChange={this.handleChange}
            />
            <Button className="finish-button" handler={this.handleSubmit} text="correct" />
          </div>
        );
    }
}
