class Correction {
    constructor(startingFrame, oldId, newId) {
        this.startingFrame = startingFrame;
        this.oldId = oldId;
        this.newId = newId;
    }
}

/**
* Class which keeps the track of the corrections that have been created
* so far and will generate new boxes based on those corrections based on
* incorrect boxes.
*/
export default class Composer {

    constructor() {
        this.corrections = [];
        this.correct = this.correct.bind(this);
        this.addCorrection = this.addCorrection.bind(this);
    }

    /**
    * Takes in old boxes and returns new bounding boxes, based
    * on the frame number and the current corrections
    *
    * @param frame the frame these boxes correspond to so the Composer
            knows which corrections to apply
    * @param oldBoxes the boxes that are incorrect
    * @return a new array of corrected boxes
    */
    correct(frame, oldBoxes) {
        return oldBoxes;
    }

    addCorrection(frame, oldId, newId) {
        if (oldId === newId) return;
        if (frame < 0) return;

        this.corrections.push(new Correction(frame, oldId, newId));
    }

}