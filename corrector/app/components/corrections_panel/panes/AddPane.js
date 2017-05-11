import React from 'react';
import NumberInput from '../../inputs/number_input/NumberInput';
import Slider from '../../inputs/slider/Slider';
import { AddCorrection } from '../../../models/Corrections';
import styles from './Panes.css';

export default class AddPane extends React.Component {

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
      id: null,
      x: null,
      y: null,
      width: 40,
      height: 40,
      theta: 0,
    };

    this.getCorrection = this.getCorrection.bind(this);
    this.handleId = this.handleId.bind(this);
    this.handleWidth = this.handleWidth.bind(this);
    this.handleHeight = this.handleHeight.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleTheta = this.handleTheta.bind(this);
    this.clear = this.clear.bind(this);
  }

  getCorrection() {
    const { clicks } = this.props;
    let frame = this.state.frame;
    let id = this.state.id;
    let x = this.state.x;
    let y = this.state.y;
    let width = this.state.width;
    let height = this.state.height;
    let theta = this.state.theta;

    if (clicks.length) {
      const click = clicks.pop();
      frame = click.frame;

      if (x === null && y === null) {
        x = click.location.x;
        y = click.location.y;
      }
    }

    this.setState({
      frame,
      id,
      x,
      y,
      width,
      height,
      theta,
    });

    if (frame === null || id === null || x === null || y === null
        || width === null || height === null || theta === null) {
      return null;
    }

    return new AddCorrection(
      frame,
      id,
      x,
      y,
      width,
      height,
      theta);
  }

  handleId(value) {
    if (value == '' || Number(value) === NaN) return;
    this.setState({ id: Number(value) }, this.handleUpdate);
  }

  handleWidth(value) {
    this.setState({ width: value }, this.handleUpdate);
  }

  handleHeight(value) {
    this.setState({ height: value }, this.handleUpdate);
  }

  handleTheta(value) {
    this.setState({ theta: value }, this.handleUpdate);
  }

  handleUpdate() {
    const correction = this.getCorrection();
    if (correction) this.props.stageHandler(correction);
  }

  clear() {
    this.idInput.clear();
    this.widthInput.clear();
    this.heightInput.clear();
    this.setState({
      frame: null,
      id: 0,
      x: null,
      y: null,
      width: 40,
      height: 40,
      theta: 0,
    });
  }

  render() {
    return (
      <div className={styles.add + ' ' + styles.pane}>
        <p className={styles.label}>
          {'Id:'}
        </p>
        <NumberInput
          className={styles.id_input}
          onChange={this.handleId}
          ref={(input) => { this.idInput = input; }}
        />
        <p className={styles.label}>
          {`X: ${this.state.x || 'Click a location'}`}
        </p>
        <p className={styles.label}>
          {`Y: ${this.state.y || 'Click a location'}`}
        </p>
        <p className={styles.label}>
          {`Width: ${this.state.width || 'Enter a width'}`}
        </p>
        <Slider
          className={styles.width_input}
          minValue={10}
          maxValue={90}
          width={160}
          onChange={this.handleWidth}
          ref={(input) => { this.widthInput = input; }}
        />
        <p className={styles.label}>
          {`Height: ${this.state.height || 'Enter a height'}`}
        </p>
        <Slider
          className={styles.height_input}
          minValue={10}
          maxValue={90}
          width={160}
          onChange={this.handleHeight}
          ref={(input) => { this.heightInput = input; }}
        />
        <p className={styles.label}>
          {`Theta: ${this.state.theta}`}
        </p>
        <Slider
          className={styles.theta_input}
          minValue={0}
          maxValue={180}
          width={180}
          onChange={this.handleTheta}
          ref={(input) => { this.thetaInput = input; }}
        />
      </div>
    );
  }
}
