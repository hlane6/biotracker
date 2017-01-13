import React from 'react';
import Button from './button';

export default class Spash extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            file: null,
        }

        this.onChange = this.onChange.bind(this);
    }

    render() {
        return (
            <div>
                <h1>Biotracker - A Web App</h1>
            </div>
        );
    }

    onChange(event) {
        event.preventDefault();
        if ( event.target && event.target.files ) {
            this.setState({ file: event.target.files[0] });
        }
    }

}
