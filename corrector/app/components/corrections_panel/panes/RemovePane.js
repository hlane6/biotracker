import React from 'react';
import { RemoveCorrection } from '../../../models/Corrections';
import styles from './Panes.css';

export default class RemovePan extends React.Component {

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

    this.state =  {
      frame: null,
      id: null,
    };

    this.getCorrection = this.getCorrection.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.clear = this.clear.bind(this);
  }

  /**
   * Creates a RemoveCorrection from the current state of the pane. Will
   * go through the following steps to try and create one:
   *  1. Get an id from the saved state
   *  2. If that is null, will try to find a click with a box if available
   *    and use that as the id.
   *  3. Otherwise, if any value is null will return null.
  */
  getCorrection() {
    const { clicks } = this.props;
    let frame = this.state.frame;
    let id = this.state.id;

    if (clicks.length) {
      const click = clicks.pop();
      frame = click.frame;

      if (click.box) {
        id = click.box.id;
      }
    }

    this.setState({
      frame,
      id,
    });

    if (frame === null || id === null) {
      return null;
    }

    return new RemoveCorrection(
      frame,
      id);
  }

  handleUpdate() {
    const correction = this.getCorrection();
    if (correction) this.props.stageHandler(correction);
  }

  clear() {
    this.setState({
      frame: null,
      id: null,
    });
  }

  render() {
    return (
      <div className={styles.remove + ' ' + styles.pane}>
        <p className={styles.label}>
          {`Box: ${this.state.id || 'Select a box'}`}
        </p>
      </div>
    );
  }

}
