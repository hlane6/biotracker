import Papa from 'papaparse';
// import BoundingBox from './BoundingBox';

// IMPLEMENT MATH OPERATIONS FOR WIDTH AND HEIGHT!

class BoundingBox {
    constructor(x, y, width, height, theta) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.theta= theta;
    }
}

export default class Parser {

    constructor(url) {
        this.__data = [];
        Papa.parse(url, {
            header: true,
            download: true,
            complete: function(results, file) {
                // this.__data = results.data;
                this.data(results.data)
                // console.log(this.__data);
            }
        });
    }

    get data() {
        return this.__data;
    }

    set data(data) {
        this.__data = data;
    }

    getBoundingBoxes(frame, offset) {

        let boundingBoxes = [];
        let found = false;
        let counter = 0;

        if ((frame + offset) < 0 || (frame + offset) > this.__data.length) {
            throw 'Invalid frame number';
        }

        for (var i=0; i < this.__data.length; i++) {
            if (this.__data[i].frame_num == (frame + offset)) {
                boundingBoxes.push(new BoundingBox(
                    this.__data[i].x,
                    this.__data[i].y,
                    this.__data[i].width,
                    this.__data[i].height,
                    this.__data[i].theta
                ));
                found = true;
                counter++;
            }
            if (found == true && (this.__data[i].frame_num != this.__data[i-1].frame_num) && counter > 1) {
                break;
            }
        }
        return boundingBoxes;
    }

    getFrame(frame) {
        getBoundingBoxes(frame, 0);
    }

    nextFrame(frame) {
        getBoundingBoxes(frame, 1);
    }

    // next5(frame) {
    //     getBoundingBoxes(frame, 5);
    // }

    prevFrame(frame) {
        getBoundingBoxes(frame, -1);
    }

    // prev5(frame) {
    //     getBoundingBoxes(frame, -5);
    // }
}