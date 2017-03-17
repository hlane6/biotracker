import React from 'react';


export default class CorrectionsPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            corrections: [],
        }
    }

    render() {
        return (
            <div className="sidebar">
                <h2 className="h2-corrections">make corrections</h2>
                <p className="corrections-content-1">1. click on the object you need to correct</p>
                <p className="corrections-content-2">2. new box id:</p>
                <input className="box-id" type="number" placeholder="box id" />
                <button className="finish-button">correct</button>
            </div>
        );
    }

}
