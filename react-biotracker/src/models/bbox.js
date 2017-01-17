/**
 * Small class representing a single bounding box.
 * Allows for movement of bounding box, but will
 * need to abract movement away once keyframes start
 * coming in.
 */
export default class BBox {

    constructor(id, x, y, width, height, color) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.direction = 3;
    }

    __withinX(x) {
        return (x >= this.x) && (x <= (this.x + this.width));
    }

    __withinY(y) {
        return (y >= this.y) && (y <= (this.y + this.height));
    }

    // Helper function to detect collisions
    detectHit(x, y) {
        return  this.__withinX(x) && this.__withinY(y);
    }

}

