import React from 'react';
import NumberInput from '../../inputs/number_input/NumberInput';
import { UpdateCorrection } from '../../../models/Corrections';
import styles from './Panes.css';

export default class UpdatePane extends React.Component {

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
      oldId: null,
      newId: null,
    };

    this.getCorrection = this.getCorrection.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.clear = this.clear.bind(this);
  }

  /**
   * Creates a new UpdateCorrection based on the current state of the
   * pane. Will go through the following steps to try and build a correction:
   *  1. If click payload is available, will try to get the click's box
   *    and fill out oldId
   *  2. If the NumberInput input is valid, will fill newId with it
   *  3. If either of those are not valid, but there was a valid value
   *    in the currently saved state, will use those values
   *  4. Otherwise, if none of those values are valid, will return null
  */
  getCorrection() {
    const { clicks } = this.props;
    let frame = this.state.frame;
    let oldId = this.state.oldId;

    if (clicks.length) {
      const click = clicks.pop();
      console.log(click);
      frame = click.frame;

      if (click.box) {
        oldId = click.box.id;
      }
    }

    const newId = this.input.getInput();

    this.setState({
      frame,
      oldId,
      newId,
    });

    if (frame === null || oldId === null || newId === null) {
      return null;
    }

    return new UpdateCorrection(
      frame,
      oldId,
      newId);
  }

  handleUpdate(value) {
    if (value == '' || Number(value) === NaN) return;

    const correction = this.getCorrection();

    if (correction) {
      correction.newId = Number(value);
      this.props.stageHandler(correction);
    }

    this.setState({ newId: Number(value) });
  }

  clear() {
    this.input.clear();
    this.setState({
      frame: null,
      oldId: null,
      newId: null,
    });
  }

  render() {
    return (
      <div className={styles.update + ' ' + styles.pane}>
        <p className={styles.label}>
          {`Box: ${ this.state.oldId ? this.state.oldId : 'Select a box'}`}
        </p>
        <p className={styles.label}>
          {'New Id:'}
        </p>
        <NumberInput
          className={styles.id_input}
          onChange={this.handleUpdate}
          ref={(input) => { this.input = input; }}
        />
      </div>
    );
  }
}
