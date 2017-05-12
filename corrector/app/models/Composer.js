export default class Composer {

  constructor(data) {
    this._corrections = [];
    this._data = data;

    this.add = this.add.bind(this);
    this.propogate = this.propogate.bind(this);
  }

  /**
  * @param frame the frame number to get bounding boxes for
  * @return an array of bounding boxes for the given frame
  */
  frame(index) {
    if (index < 0 || index > this._data.length) {
      return null;
    }
    return this._data[index];
  }

  add(correction) {
    this._corrections.push(correction);
    this.propogate(correction);
  }

  propogate(correction) {
    this._data[correction.frame] = correction.update(this._data[correction.frame]);
  }

  get csv() {
    const columnDelimiter = ',';
    const lineDelimiter = '\n';
    const keys = ['frame_num', 'target_id', 'x', 'y', 'width', 'height', 'theta'];

    let csv = 'data:text/csv;charset=utf-8,';
    csv += keys.join(columnDelimiter);
    csv += lineDelimiter;

    for (let i = 0; i < this._data.length; i++) {
      for (let j = 0; j < this._data[i].length; j++) {
        const box = this._data[i][j];
        csv += (`${i},${box.id},${box.x},${box.y},`
            + `${box.width},${box.height},${box.theta}\n`);
      }
    }

    return csv;
  }

}
