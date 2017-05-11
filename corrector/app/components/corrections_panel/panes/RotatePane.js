import React from 'react';
import NumberInput from '../../inputs/number_input/NumberInput';
import Slider from '../../inputs/slider/Slider';
import { RotateCorrection } from '../../../models/Corrections';
import styles from './Panes.css';

export default class RotatePane extends React.Component {

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
      box: null,
      theta: 0,
    };

    this.getCorrection = this.getCorrection.bind(this);
    this.handleTheta = this.handleTheta.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.clear = this.clear.bind(this);
  }

  /**
   * Creates a RotateCorrection from the current state of the pane. Will
   * attempt to create one by following these steps:
   *  1. Will get values from saved state
   *  2. If box is null, will try to get a click with a box, and use
   *    that as box
   *  3. If theta is null, will try to get a click, and use its location
   *    and the box to calculate a value for theta.
   *  4. Otherwise, if any value is invalid, will return null
  */
  getCorrection() {
    const { clicks } = this.props;
    let frame = this.state.frame;
    let box = this.state.box;
    let theta = this.state.theta;

    if (clicks.length) {
      const click = clicks.pop();
      frame = click.frame;

      if (click.box && box === null) {
        box = click.box;
        theta = Math.floor(click.box.theta);

        this.thetaInput.setState({ value: Math.floor(theta) });
      }
    }

    this.setState({
      frame,
      box,
      theta,
    });


    if (frame === null || box === null || theta === null) {
      return null;
    }

    return new RotateCorrection(
      frame,
      box.id,
      theta);
  }

  handleTheta(value) {
    this.setState({ theta: value }, this.handleUpdate);
  }

  handleUpdate() {
    const correction = this.getCorrection();
    if (correction) this.props.stageHandler(correction);
  }

  clear() {
    this.setState({
      frame: null,
      box: null,
      theta: 0,
    });
    this.thetaInput.setState({ value: 0 });
  }

  render() {
    return (
      <div className={styles.rotate + ' ' + styles.pane}>
        <p className={styles.label}>
          {`Box: ${this.state.box ? this.state.box.id : 'Select a box'}`}
        </p>
        <p className={styles.label}>
          {`Theta: ${this.state.theta}`}
        </p>
        <Slider
          className={styles.theta_input}
          minValue={-180}
          maxValue={180}
          width={180}
          onChange={this.handleTheta}
          ref={(input) => { this.thetaInput = input; }}
        />
      </div>
    );
  }
}
