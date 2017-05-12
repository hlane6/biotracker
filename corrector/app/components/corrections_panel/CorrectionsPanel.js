import React from 'react';
import { ipcRenderer } from 'electron';
import Button from '../inputs/button/Button';
import NumberInput from '../inputs/number_input/NumberInput';
import Selection from '../inputs/selection/Selection';
import AddPane from './panes/AddPane';
import RemovePane from './panes/RemovePane';
import RotatePane from './panes/RotatePane';
import SwitchPane from './panes/SwitchPane';
import UpdatePane from './panes/UpdatePane';
import {MODES} from '../../models/Corrections';
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
      mode: MODES.ADD,

      /* An array treated as a queue of clicks. Each click has this form:
       *  location: where the last click was in local x, y coordinates
       *  box: a bounding box if a box was clicked, null otherwise
       *  frame: the corresponding frame number for the click
      */
      clicks: [],
    };

    this.handleClick = this.handleClick.bind(this)
    this.handleModeSelection = this.handleModeSelection.bind(this);
    this.handleStaging = this.handleStaging.bind(this);
    this.handleCorrection = this.handleCorrection.bind(this);
    this.clearCorrection = this.clearCorrection.bind(this);

    ipcRenderer.on('clicked', this.handleClick.bind(this));
  }

  /**
   * Handler for when a click event is sent from the main window.
   *  payload: the payload sent by the event which should include both a
   *    location and box key specifying information about the click
   */
  handleClick(event, payload) {
    this.setState((prevState, props) => {
      const { clicks } = prevState;
      clicks.push(payload);
      return { clicks };
    }, () => {
      const correction = this.pane.getCorrection();
      if (correction) this.handleStaging(correction);
    });

  }

  /**
   * Handler for selecting a correction mode
   */
  handleModeSelection(newMode) {
    this.setState({ mode: newMode });
  }

  /**
   * Handler for when a correction is updated. Will send the new
   * correction to the main window so it can be temporarily displayed
   * for the current frame.
   */
  handleStaging(correction) {
    if (!correction) return;

    // While we are sending the actual correction here, we also
    // have to send the type of correction so that it can be reconstructed
    // in the main window. This is because ipc will convert the correction
    // into json, so it's update function will be lost.
    ipcRenderer.send('stage-correction', {
      correction,
      type: correction.toString(),
    });
  }

  /**
   * Handler for creating a correction. Will make sure there is a valid pick
   * and a valid new id and will then send out a message to create a new event
   * that will be handled by the MainWindow
   */
  handleCorrection() {
    const correction = this.pane.getCorrection()

    if (!correction) return;

    this.setState({ updating: true });

    ipcRenderer.send('add-correction', {
      correction,
      type: correction.toString(),
    });

    this.setState({ updating: false });
  }

  clearCorrection() {
    this.pane.clear();
    ipcRenderer.send('unstage-correction');
  }

  render() {
    const ref = (pane) => { this.pane = pane; };

    const addPane = (
      <AddPane
        clicks={this.state.clicks}
        stageHandler={this.handleStaging}
        ref={ref}
      />
    );

    const removePane = (
      <RemovePane
        clicks={this.state.clicks}
        stageHandler={this.handleStaging}
        ref={ref}
      />
    );

    const rotatePane = (
      <RotatePane
        clicks={this.state.clicks}
        stageHandler={this.handleStaging}
        ref={ref}
      />
    );

    const switchPane = (
      <SwitchPane
        clicks={this.state.clicks}
        stageHandler={this.handleStaging}
        ref={ref}
      />
    );

    const updatePane = (
      <UpdatePane
        clicks={this.state.clicks}
        stageHandler={this.handleStaging}
        ref={ref}
      />
    );

    const PANES = {
      ADD: addPane,
      REMOVE: removePane,
      ROTATE: rotatePane,
      SWITCH: switchPane,
      UPDATE: updatePane,
    };

    return (
      <div>
        <div className={styles.panel}>
          <h2 className={styles.header}>corrections</h2>
          <Selection
            className={styles.selection}
            choices={Object.keys(MODES)}
            default={'ADD'}
            handler={this.handleModeSelection}
          />

          <div className={styles.separator} />

          {PANES[this.state.mode]}

          <div className={styles.separator} />

          <Button
            className={styles.clear + ' ' + styles.button}
            handler={this.clearCorrection}
            text={'Clear'}
          />
          <Button
            className={styles.finish + ' ' + styles.button}
            handler={this.handleCorrection}
            text={this.state.updating ? 'Updating...' : 'Save'}
          />
        </div>
      </div>
    );
  }

}
