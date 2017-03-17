import React from 'react';
import Button from './Button';


export default class CorrectionsPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            corrections: [],
        }
        this.handleCorrection = this.handleCorrection.bind(this);
    }

    handleCorrection() {

    }

    render() {
        return (
            <div className="sidebar">
                <h2 className="h2-corrections">make corrections</h2>
                <p className="corrections-content-1">
                  {`Object Selected: ${this.props.pick ? this.props.pick.id : "None"}`}
                </p>
                <p className="corrections-content-2">2. new box id:</p>
                <input className="box-id" type="number" placeholder="box id" />
                <Button handler={this.handleCorrection} text="correct" />
            </div>
        );
    }

}
