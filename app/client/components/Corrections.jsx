import React from 'react';
import Button from './Button';
import ObjectIdInput from './ObjectIdInput';


export default class CorrectionsPanel extends React.Component {

    static defaultProps = {
        pick: null,
        time: 0,
        composer: null,
        handleCorrection: () => {},
    };

    static propTypes = {
        pick: React.PropTypes.object,
        time: React.PropTypes.number,
        composer: React.PropTypes.object,
        handleCorrection: React.PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            corrections: [],
        }
        this.handleCorrection = this.handleCorrection.bind(this);
    }

    handleCorrection(newId) {
        if (!this.props.pick) return;
        
        this.props.composer.addCorrection(
            Math.floor(this.props.time * 30),
            this.props.pick.id,
            newId
        )
    }

    render() {
        return (
            <div className="sidebar">
                <h2 className="h2-corrections">make corrections</h2>
                <p className="corrections-content-1">
                  {`Object Selected: ${this.props.pick ? this.props.pick.id : "None"}`}
                </p>
                <p className="corrections-content-2">2. new box id:</p>
                <ObjectIdInput
                  handleIdCallback={this.handleCorrection}
                />
            </div>
        );
    }

}
