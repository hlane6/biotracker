import React from "react";
import Button from "./button";

export default class Spash extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            file: null,
        }

        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return (
            <div>
                <h2>Select a File</h2>
                <input type="file"
                        accept="video/mp4"
                        multiple="false"
                        onChange={ this.handleInput }
                />
                <Button handler={ this.handleSubmit } text={ this.state.file ? "Upload " + this.state.file.name : "N/A" } />
            </div>
        );
    }

    handleInput(event) {
        event.preventDefault();
        if (event.target && event.target.files) {
            this.setState({ file: event.target.files[0] });
        }
    }

    handleSubmit() {

    }

}
