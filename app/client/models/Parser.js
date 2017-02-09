import Papa from 'papaparse';
import BoundingBox from './BoundingBox';

export default class Parser {

    constructor(url) {
        this.__data = [];
        Papa.parse(url, {
            header: true,
            download: true,
            complete: function(results, file) {
                this.__data = results.data;
            }
        });
    }

    get data() {
        return this.__data;
    }

    getFrame(frameNum) {
        let boundingBoxes = [];
        boundingBoxes.push(new BoundingBox(1, 2, 3, 4, 1));
        for (var i=0; i < this.__data.length; i++) {
            if (this.__data[i].frame_num == frameNum) {
                boundingBoxes.push(new BoundingBox(
                    this.__data[i].x,
                    this.__data[i].y,
                    10,
                    10,
                    this.__data[i].theta
                ));
            }
        }
        return boundingBoxes;
    }
}