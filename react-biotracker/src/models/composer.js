import Parser from "./parser";
import DeleteCorrection from "./corrections/delete-correction";

/**
 * Class to handle editing and exporting of bboxes
 * for a video. Changes made to the bboxes will be noted
 * here, but will not be noted in the parser.
 *
 * Changes take place at a specific frame and perpetute
 * throughout the rest of the video
 *
 * Supported changes are:
 *   exchanging - switching the ids of two bboxes
 *   deleting - removing a bbox from the video onward
 */
export default class Composer {

    static STEP_SIZE = 100;

    constructor(url, correctionHandler) {
        // Public functions
        this.next = this.next.bind(this);
        this.get = this.get.bind(this);
        this.getCurrentFrame = this.getCurrentFrame.bind(this);
        this.exchange = this.exchange.bind(this);
        this.delete = this.delete.bind(this);
        this.correctionHandler = correctionHandler.bind(this);

        // Private helper functions
        this.__collect = this.__collect.bind(this);

        // Private variables
        this.__parser = new Parser(url);
        this.__data = [];
        this.__corrections = [];
        this.__head = -1;
        this.__done = false;
    }

    /**
        * Returns bboxes for a specific frame and sets head to that frame
        * Returns null if frame <0 or greater than video length
        */
    get(frame) {
        // First check if we need to collect some data
        if ((this.__data.length === 0) ||
                (frame >= this.__data.length - Composer.STEP_SIZE)) {
            this.__collect(Composer.STEP_SIZE * 2);
        } else if ((frame >= this.__data.length) && (!this.__done)) {
            this.__collect(frame - this.__data.length + Composer.STEP_SIZE * 2);
        }

        if ((frame < 0) || (frame >= this.__data.length - 1)) {
            return null;
        }

        this.__head = frame;
        let boxes = this.__data[this.__head];

        for (const correction of this.__corrections) {
            if (correction.frame <= frame) {
                boxes = correction.apply(boxes);
            }
        }

        return boxes;
    }

    /**
        * Returns the current frame as a number
        */
    getCurrentFrame() {
        return this.__head;
    }

    /**
        * Returns next frame of bboxes if they exist
        * Returns null otherwise
        */
    next() {
        return this.get(++this.__head);
    }

    /**
        * Switches ids of two bboxes after a specific frame
        * Returns 0 on success
        * Returns <0 on error
        */
    exchange(frame, oldId, newId) {
    }

    /**
        * Removes a bboxes after a specific frame
        * Returns 0 on success
        * Returns <0 on error
        */
    delete(frame, id) {
        this.__corrections.push(new DeleteCorrection(id, frame));
        this.correctionHandler(this.__corrections);
    }

    /**
        * Private helper function
        * Gets data from parser and puts it into our __data
        * @param num The number of frames to collect
        */
    __collect(num) {
        if (this.__done) {
            return;
        }

        for (let i = 0; i < num; i++) {
            const data = this.__parser.next();

            if (!data) {
                this.__done = true;
                return;
            }

            this.__data.push(data);
        }
    }

}
