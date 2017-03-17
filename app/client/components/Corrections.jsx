import React from 'react';


export default class CorrectionsPanel extends React.Component {

    render() {
        return (
            <div className="sidebar">
                <h2 className="h2-corrections">make corrections</h2>
                <div className="tab">
                    <a className="tab-links">add</a>
                </div>
                <p className="corrections-content-1">1. click on the object <br/> you need a box for</p>
                <p className="corrections-content-2">2. create box id:</p>
                <form className="corrections-input">
                    <input className="box-id" type="number" placeholder="box id" />
                </form>
                <button className="finish-button">finish</button>
            </div>
        );
    }
}
