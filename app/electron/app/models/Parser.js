import Baby from 'babyparse';
import fs from 'fs';

/**
* Colors for bounding boxes
* TODO: Have less similar colors / better way for choosing
*/
export const COLORS = {
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
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.theta = theta;
        this.theta_in_radians = theta * (Math.PI / 180);

        this.rotatePoint = this.rotatePoint.bind(this);
        this.collidesWith = this.collidesWith.bind(this);
    }

    /**
    * Determines whether a given point collides with this bounding box
    * @param otherX the x coor of the point
    * @param otherY the y coor of the point
    * return true if it collides, false otherwise
    */
    collidesWith(otherX, otherY) {
        const { rotatedX, rotatedY } = this.rotatePoint(
            otherX - this.x,
            otherY - this.y
        );

        return (rotatedX < (this.width / 2))
            && (rotatedX > -(this.width / 2))
            && (rotatedY < (this.height / 2))
            && (rotatedY > -(this.height / 2));
    }

    /**
    * Helper function to rotate a point to the bounding boxes
    * reference Frame
    */
    rotatePoint(x, y) {
        const rotatedX = (x * Math.cos(this.theta_in_radians))
            + (y * -Math.sin(this.theta_in_radians));
        const rotatedY = (x * Math.sin(this.theta_in_radians))
            + (y * Math.cos(this.theta_in_radians));
        return { rotatedX, rotatedY };
    }

}

export default class Parser {

    constructor(url, completedCallback) {
        this.finish = this.finish.bind(this);
        this.data = [];
        this.callback = completedCallback;

        fs.readFile(url, 'utf8', (err, data) => {
            Baby.parse(data, {
                delimiter: ',',
                header: true,
                dynamicTyping: true,
                complete: this.finish,
            });
        });

        this.getFrame = this.getFrame.bind(this);
        this.update = this.update.bind(this);
    }

    finish(results) {
        let boundingBoxes = [];
        const data = results.data;
        console.log(results);

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
        console.log(this.data.length);
        this.callback();
    }

    /**
    * @param frame the frame number to get bounding boxes for
    * @return an array of bounding boxes for the given frame
    */
    getFrame(frame) {
        if (frame < 0 || frame > this.data.length) {
            return null;
        }
        return this.data[frame];
    }

    /**
    * Updates all bounding boxes based on a given correction. From the
        corrections starting frame, every box with the oldId will be
        updated to have the newId and corresponding color
    * @param correction, a correction contains an frame, oldId, and newId
    */
    update(correction) {
        for (let i = correction.frame; i < this.data.length; i++) {
            for (let j = 0; j < this.data[i].length; j++) {
                if (correction.oldId == this.data[i][j].id) {
                    this.data[i][j].id = correction.newId;
                    this.data[i][j].color = COLORS[correction.newId];
                }
            }
        }
    }

}
