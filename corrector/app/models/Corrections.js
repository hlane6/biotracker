import { BoundingBox } from './Parser';

const MODES = {
  ADD: 'ADD',
  ROTATE: 'ROTATE',
  REMOVE: 'REMOVE',
  SWITCH: 'SWITCH',
  UPDATE: 'UPDATE',
};

/**
 * Base correction object. All corrections have the following properties:
 *  frame: the frame the correction was created on
 *
 *  A correction will have more fields based on the type of correction is it
 */
class Correction {

  constructor(frame) {
    this.frame = frame;
  }

  /**
   * All corrections have an update method that will take in a frame of boxes
   * and will return a new frame of boxes that now agree with the correction.
   * Depending on what boxes are entered, the new boxes might simply be copies.
   */
  update(oldBoxes) {
    return oldBoxes.map((box) => {
      return new BoundingBox(
        box.id,
        box.x,
        box.y,
        box.width,
        box.height,
        box.theta);
    });
  }

}

/**
 * An AddCorrection creates an entirely new bounding box and adds it
 * to a frame of boxes. It requires the following fields:
 *  id: new id of the box to create
 *  x: x coor of the box to create
 *  y: y coor of the box to create
 *  width: width of the box to create
 *  height: height of the box to create
 *  theta: theta of the box to create
 */
class AddCorrection extends Correction {

  constructor(frame, id, x, y, width, height, theta) {
    super(frame);
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.theta = theta;

    this.update = this.update.bind(this);
  }

  update(oldBoxes) {
    return oldBoxes.concat([new BoundingBox(
      this.id,
      this.x,
      this.y,
      this.width,
      this.height,
      this.theta)
    ]);
  }

  toString() {
    return MODES.ADD;
  }
}
/**
 * A RemoveCorrection remove an already existing box from a frame of boxes
 * It requires the following field:
 *  id: the id of the box to remove
 */
class RemoveCorrection extends Correction {

  constructor(frame, id) {
    super(frame);
    this.id = id;

    this.update = this.update.bind(this);
  }

  update(oldBoxes) {
    return oldBoxes.filter((box) => {
      return box.id !== this.id
    });
  }

  toString() {
    return MODES.REMOVE;
  }
}

/**
 * A RotateCorrection updates the theta of an already existing box from a frame
 * of boxes. It requires the following fields:
 *  id: the id of the box to update
 *  theta: the change in rotation
 */
class RotateCorrection extends Correction {

  constructor(frame, id, theta) {
    super(frame);
    this.id = id;
    this.theta = theta;

    this.update = this.update.bind(this);
  }

  update(oldBoxes) {
    return oldBoxes.map((box) => {
      if (box.id === this.id) {
        return new BoundingBox(
          box.id,
          box.x,
          box.y,
          box.width,
          box.height,
          this.theta);
      }
      return box;
    });
  }

  toString() {
    return MODES.ROTATE;
  }

}

/**
 * A SwitchCorrection switches the ids of two currently existing boxes.
 * If both boxes don't already exist, no switch is made. It requires
 * the following fields:
 *  id1: the first id we will be switching
 *  id2: the second id we will be switching
 */
class SwitchCorrection extends Correction {

  constructor(frame, id1, id2) {
    super(frame);
    this.id1 = id1;
    this.id2 = id2;

    this.update = this.update.bind(this);
  }

  update(oldBoxes) {
    return oldBoxes.map((box) => {
      if (box.id === this.id1) {
        return new BoundingBox(
          this.id2,
          box.x,
          box.y,
          box.width,
          box.height,
          box.theta);
      } else if (box.id === this.id2) {
        return new BoundingBox(
          this.id1,
          box.x,
          box.y,
          box.width,
          box.height,
          box.theta);
      }
      return box
    });
  }

  toString() {
    return MODES.SWITCH;
  }
}

/**
 * An UpdateCorrection updates the id of an already existing bounding box.
 * It requires the following fields:
 *  oldId: the id of the box we are updating
 *  newId: the new id to assign to the box
 */
class UpdateCorrection extends Correction {

  constructor(frame, oldId, newId) {
    super(frame);
    this.oldId = oldId;
    this.newId = newId;

    this.update = this.update.bind(this);
  }

  update(oldBoxes) {
    return oldBoxes.map((box) => {
      if (box.id === this.oldId) {
        return new BoundingBox(
          this.newId,
          box.x,
          box.y,
          box.width,
          box.height,
          box.theta);
      }
      return box;
    });
  }

  toString() {
    return MODES.UPDATE;
  }

}

export {
  MODES,
  AddCorrection,
  RemoveCorrection,
  RotateCorrection,
  SwitchCorrection,
  UpdateCorrection};
