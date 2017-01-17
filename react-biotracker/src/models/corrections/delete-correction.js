/**
 * Correction for the composer to follow
 */

/**
 * Corrections have a single method: apply
 * Apply will take in an array, and return a new array that abides
 * by its rule.
 */
export default class DeleteCorrection {

    constructor(id, frame) {
        this.id = id;
        this.frame = frame;
        this.apply = this.apply.bind(this);
        this.toString = this.toString.bind(this);
    }

    apply(boxes) {
        let newBoxes = [];

        for (const box of boxes) {
            if (box.id !== this.id) {
                newBoxes.push(box);
            }
        }

        return newBoxes;
    }

    toString() {
        return "Delete: " + this.id + " from " + this.frame + " onward";
    }
}
