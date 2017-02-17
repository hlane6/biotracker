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
            let box = new BoundingBox(
                data[i].x,
                data[i].y,
                10,
                10,
                data[i].theta,
            );
            if (data[i].frame_num === data[i - 1].frame_num) {
                boundingBoxes.push(box);
            } else {
                this.data.push(boundingBoxes);
                boundingBoxes = [];
                boundingBoxes.push(box);
            }
        }

        this.callback();
    }

    getBoundingBoxes(frame) {
        if (frame < 0 || frame > this.data.length) {
            return null;
        }

        return this.data[frame];
    }

    getFrame(frame) {
        return this.getBoundingBoxes(frame, 0);
    }
}
