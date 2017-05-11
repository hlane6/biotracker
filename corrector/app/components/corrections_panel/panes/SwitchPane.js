import React from 'react';
import { SwitchCorrection } from '../../../models/Corrections';
import styles from './Panes.css';

export default class SwitchPane extends React.Component {

  static defaultProps = {
    clicks: [],
    stageHandler: () => {},
  };

  static propTypes = {
    clicks: React.PropTypes.array,
    stageHandler: React.PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      frame: null,
      id1: null,
      id2: null,
    };

    this.getCorrection = this.getCorrection.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.clear = this.clear.bind(this);
  }

  /**
   * Creates a SwitchCorrection based on the current state of the pane.
   * Will go through the following steps to try and create a correction:
   *  1. Get values of id1 and id2 from saved state
   *  2. Get click with box if available, and if either of id1 or id2
   *    is not valid, will use it first for id1, then id2
   *  3. Otherwise if any value is not valid, will return null
  */
  getCorrection() {
    const { clicks } = this.props;
    let frame = this.state.frame;
    let id1 = this.state.id1;
    let id2 = this.state.id2;

    if (clicks.length) {
      const click = clicks.pop();
      frame = click.frame;

      if (click.box) {
        if (!id1) id1 = click.box.id;
        else if (!id2) id2 = click.box.id;
      }

      this.setState({
        frame,
        id1,
        id2,
      });
    }

    if (frame === null || id1 === null || id2 === nulll) {
      return null;
    }

    return new SwitchCorrection(
      frame,
      id1,
      id2);
  }

  handleUpdate() {
    const correction = this.getCorrection();
    if (correction) this.props.stageHandler(correction);
  }

  clear() {
    this.setState({
      frame: null,
      id1: null,
      id2: null,
    });
  }

  render() {
    return (
      <div className={styles.switch + ' ' + styles.pane}>
        <p className={styles.label}>
          {`Box 1: ${ this.state.id1 ? this.state.id1 : 'Select a box'}`}
        </p>
        <p className={styles.label}>
          {`Box 2: ${ this.state.id2 ? this.state.id2 : 'Select a box'}`}
        </p>
      </div>
    );
  }
}
