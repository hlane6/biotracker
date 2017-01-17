import React from "react";

/**
 * Shows corrections entered so far by the user
 */
export default class Corrections extends React.Component {

    render() {
        const items = this.props.corrections.map((correction) =>
            <li className="bt-correction-item">{ correction.toString() }</li>
        );

        return (
            <div className="row">
                <h3>Corrections</h3>
                <ul>{ items }</ul>
            </div>
        );
    }

}
