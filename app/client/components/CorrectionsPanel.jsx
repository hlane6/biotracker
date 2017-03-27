import React from 'react';
import Button from './Button';
import NumberInput from './NumberInput';

/**
* Side bar component allowing user interaction to correct
* incorrect bounding boxes
*/
export default class CorrectionsPanel extends React.Component {

    static defaultProps = {
        pick: null,
        time: 0,
        parser: null,
    };

    static propTypes = {
        pick: React.PropTypes.object,
        time: React.PropTypes.number,
        parser: React.PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {
            updating: false,
            downloadURL: '/csvData',
        };
        this.handleCorrection = this.handleCorrection.bind(this);
        this.downloadCSV = this.downloadCSV.bind(this);
    }

    handleCorrection() {
        if (!this.props.pick) {
            alert('Invalid correciton: no selection');
            return;
        }

        const newId = this.input.getInput();
        if (!newId || newId < 0) {
            alert('Invalid new id');
            return;
        }

        this.setState({ updating: true });

        this.props.parser.update({
            frame: Math.floor(this.props.time * 30),
            oldId: this.props.pick.id,
            newId,
        });

        this.setState({
            updating: false,
        });
    }

    /**
    * Download button handler which will download the updated
    * csv file based on the parsers bounding boxes.
    */
    downloadCSV() {
        const columnDelimiter = ',';
        const lineDelimiter = '\n';
        const keys = ['id', 'x', 'y', 'width', 'height', 'theta'];

        let csv = 'data:text/csv;charset=utf-8,';
        csv += keys.join(columnDelimiter);
        csv += lineDelimiter;

        for (let i = 0; i < this.props.parser.data.length; i++) {
            for (let j = 0; j < this.props.parser.data[i].length; j++) {
                const box = this.props.parser.data[i][j];
                csv += (`${i},${box.id},${box.x},${box.y},`
                    + `${box.width},${box.height},${box.theta}\n`);
            }
        }

        const filename = 'export.csv';
        const encodedCsv = encodeURI(csv);
        const link = document.createElement('a');
        link.setAttribute('href', encodedCsv);
        link.setAttribute('download', filename);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    render() {
        return (
          <div className="CorrectionsPanel">
            <div className="sidebar">
              <h2 className="h2-corrections">make corrections</h2>
              <p>{`Frame: ${Math.floor(30 * this.props.time)}`}</p>
              <p>
                {`Old Id: ${this.props.pick ?
                  this.props.pick.id : 'None Selected'}`}
              </p>
              <p>{'New Id:'}</p>
              <NumberInput
                className="box-id"
                ref={(input) => { this.input = input; }}
                handleCallback={this.handleCorrection}
              />
              <Button
                className="finish-button"
                handler={this.handleCorrection}
                text={this.state.updating ? 'Updating...' : 'Correct'}
              />
            </div>
            <Button
              className="bottom-buttons"
              text="download data file"
              handler={this.downloadCSV}
            />
          </div>
        );
    }

}
