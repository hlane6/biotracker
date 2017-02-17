import Papa from 'papaparse';
// import BoundingBox from './BoundingBox';

// IMPLEMENT MATH OPERATIONS FOR WIDTH AND HEIGHT!

class BoundingBox {
    constructor(x, y, width, height, theta) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.theta = theta;
    }
}

export default class Parser {

    constructor(url, completedCallback) {
        this.finish = this.finish.bind(this);
        this.data = [];
        this.callback = completedCallback;

        Papa.parse(url, {
            header: true,
            download: true,
            complete: this.finish,
        });

        this.getBoundingBoxes = this.getBoundingBoxes.bind(this);
    }

    finish(results) {
        let boundingBoxes = [];
        const data = results.data;

        boundingBoxes.push(new BoundingBox(
                    data[0].x,
                    data[0].y,
                    10,
                    10,
                    data[0].theta,
        ));

        for (let i = 1; i < results.data.length; i += 1) {
            if (data[i].frame_num === data[i - 1].frame_num) {
                boundingBoxes.push(new BoundingBox(
                    data[i].x,
                    data[i].y,
                    10,
                    10,
                    data[i].theta,
                ));
            } else {
                this.data.push(boundingBoxes);
                boundingBoxes = [];
                boundingBoxes.push(new BoundingBox(
                    data[i].x,
                    data[i].y,
                    10,
                    10,
                    data[i].theta,
                ));
            }
        }

        this.callback();
    }

    getBoundingBoxes(frame, offset) {
        if ((frame + offset) < 0 || (frame + offset) > this.data.length) {
            return null;
        }

        return this.data[frame + offset];
    }

    getFrame(frame) {
        return this.getBoundingBoxes(frame, 0);
    }

    nextFrame(frame) {
        return this.getBoundingBoxes(frame, 1);
    }

    prevFrame(frame) {
        return this.getBoundingBoxes(frame, -1);
    }
}
