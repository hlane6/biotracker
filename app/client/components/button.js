import React from 'react';

/**
 * Simple Button component
 */
export default class Button extends React.Component {

    static defaultProps = {
        handler     : function() {},
        text        : ""
    };

    static propTypes = {
        handler     : React.PropTypes.func,
        text        : React.PropTypes.string
    };

    render() {
        return (
            <button className="button"
                    onClick={ this.props.handler }>
                { this.props.text }
            </button>
        );
    }
}
