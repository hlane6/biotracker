import Papa from "papaparse";
import BBox from "./bbox";

/**
 * CURRENT CSV FORMAT
 * frame_num,tgt_id,x,y,theta,typename,tracklet_id
 */

const COLOR_NAMES = ['red',
        'blue',
        'purple',
        'yellow',
        'orange',
        'green',
        'coral',
        'cyan',
        'darkred',
        'gold',
        'greenyellow',
        'hotpink',
        'lightblue',
        'lightskyblue',
        'lightgreen',
        'darkgreen',
        'darkblue',
        'greenyellow',
        'goldenrod',
        'dodgerblue',
        'floralwhite',
        'indianred',
        'honeydew',
        'lightpink',
        'lightseagreen',
        'mediumaquamarine',
        'mediumblue',
        'lime',
        'limegreen',
        'mediumorchid',
        'mediumslateblue'
    ];

/**
 * A wrapper class around PapaParse to handle
 * parsing csv files into frames of bboxes
 * for drawing. Uses streaming from PapaParse
 * to handle arbitrarily large files so as to
 * not keep the whole file in memory. Its memory
 * footprint can be controlled by adjusting
 * MAX_SIZE.
 */
export default class Parser {

    static MAX_SIZE = 100;

    constructor(url) {
        this.__step = this.__step.bind(this);
        this.__complete = this.__complete.bind(this);
        this.next = this.next.bind(this);

        this.__parser = null;
        this.__data = [];
        this.__current_step = -1;
        this.finished = false;

        Papa.parse(url, {
            download: true,
            header: true,
            dynamicTyping: true,
            step: this.__step,
            complete: this.__complete,
        });
    }

    /**
        * Returns the next frame of bounding boxes if they exist
        * Else returns null
        */
    next() {
        if ((this.__data.length < 1) || (this.__data.length < 1 && this.finished)) {
            return null;
        }

        const result = this.__data.shift();

        if (((this.__data.length < (Parser.MAX_SIZE / 2)) &&
                (this.__parser.paused)) &&
                (!this.finished)) {
            this.__parser.resume();
        }

        return result;
    }

    __step(results, parser) {
        if (!this.__parser) { this.__parser = parser };

        /* result.data should be list of one element, so data.shift
         * should return first element */
        const { frame_num, x, y, tracklet_id } = results.data.shift();
        const color = COLOR_NAMES[tracklet_id];
        const box = new BBox(tracklet_id, x - 10, y - 10, 20, 20, color);

        if (frame_num !== this.__current_step) {
            this.__data.push([box]);
            this.__current_step += 1;
        } else {
            this.__data[this.__data.length - 1].push(box);
        }

        if (this.__data.length > Parser.MAX_SIZE) {
            this.__parser.pause();
        }
    }

    __complete() {
        this.finished = true;
    }
}
