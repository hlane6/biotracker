import React from 'react';

/**
 * Simple Button component
 */
export default class Button extends React.Component {

    static defaultProps = {
        handler: () => {},
        text: '',
        className: '',
    };

    static propTypes = {
        handler: React.PropTypes.func,
        text: React.PropTypes.string,
        className: React.PropTypes.string,
    };

    render() {
        return (
          <button
            className={`${this.props.className} button`}
            onClick={this.props.handler}
          >
            {this.props.text}
          </button>
        );
    }
}
