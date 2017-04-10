import React from 'react';
import { ipcRenderer } from 'electron';
import Button from '../inputs/button/Button';
import NumberInput from '../inputs/number_input/NumberInput';
import styles from './CorrectionsPanel.css';

/**
* Side bar component allowing user interaction to correct
* incorrect bounding boxes
*/
export default class CorrectionsPanel extends React.Component {

  static defaultProps = {
    time: 0,
  };

  static propTypes = {
    time: React.PropTypes.number,
  };

  constructor(props) {
    super(props);

    this.state = {
      updating: false,
      pick: null,
    };

    this.handleCorrection = this.handleCorrection.bind(this);
    this.handleSelection = this.handleSelection.bind(this);

    ipcRenderer.on('update-selection', this.handleSelection.bind(this));
  }

  /**
   * Callback for when this component receives a trigger for
   * an updated selection from the MainWindow
   */
  handleSelection(event, selection) {
    this.setState({ pick: selection });
  }

  /**
   * Handler for creating a correction. Will make sure there is a valid pick
   * and a valid new id and will then send out a message to create a new event
   * that will be handled by the MainWindow
   */
  handleCorrection() {
    if (!this.state.pick) {
      alert('Invalid correciton: no selection');
      return;
    }

    const newId = this.input.getInput();
    if (!newId || newId < 0) {
      alert('Invalid new id');
      return;
    }

    this.setState({ updating: true });

    ipcRenderer.send('add-correction', {
      oldId: this.state.pick.id,
      newId,
    });

    this.setState({
      updating: false,
    });
  }

  render() {
    return (
      <div>
        <div className={styles.sidebar}>
          <h2 className={styles.corrections_header}>make corrections</h2>
          <p className={styles.corrections_label}>
            {`Old Id: ${this.state.pick ?
              this.state.pick.id : 'Select a box'}`}
          </p>
          <p className={styles.corrections_label}>{'New Id:'}</p>
          <NumberInput
            className={styles.box_input}
            ref={(input) => { this.input = input; }}
            handleCallback={this.handleCorrection}
          />
          <Button
            className={styles.finish_button}
            handler={this.handleCorrection}
            text={this.state.updating ? 'Updating...' : 'Correct'}
          />
        </div>
      </div>
    );
  }

}
