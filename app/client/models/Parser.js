import Papa from 'papaparse';
// import BoundingBox from './BoundingBox';

// IMPLEMENT MATH OPERATIONS FOR WIDTH AND HEIGHT!
const COLORS = {
    0: 'green',
    1: 'red',
    2: 'blue',
    3: 'yellow',
    4: 'orange',
    5: 'purple',
    6: 'black',
    7: 'white',
    8: 'pink',
    9: 'cyan',
    10: 'darkgreen',
    11: 'gold',
    12: 'navy',
    13: 'springgreen',
    14: 'yellowgreen',
    15: 'rosybrown',
    16: 'royalblue',
    17: 'saddlebrown',
    18: 'salmon',
    19: 'sandybrown',
    20: 'seagreen',
    21: 'seashell',
    22: 'sienna',
    23: 'silver',
    24: 'skyblue',
    25: 'slateblue',
    26: 'slategray',
    27: 'snow',
    28: 'steelblue',
    29: 'tan',
    30: 'teal',
    31: 'thistle',
    32: 'tomato',
    33: 'turquoise',
    34: 'violet',
    35: 'wheat',
    36: 'lawngreen',
    37: 'lemonchiffon',
    38: 'lightblue',
    39: 'lightcoral',
    40: 'lightcyan',
    41: 'lightpink',
    42: 'lightsalmon',
    43: 'lightseagreen',
    44: 'lightyellow',
    45: 'lime',
    46: 'magenta',
    47: 'maroon',
    48: 'mediumblue',
    49: 'mediumpurple',
    50: 'mediumseagreen',
};

class BoundingBox {
    constructor(id, x, y, width, height, theta) {
        this.color = COLORS[id];
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
            data[0].target_id,
            data[0].x,
            data[0].y,
            data[0].width,
            data[0].height,
            data[0].theta,
        ));

        for (let i = 1; i < results.data.length; i += 1) {
            let box = new BoundingBox(
                data[i].target_id,
                data[i].x,
                data[i].y,
                data[i].width,
                data[i].height,
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
