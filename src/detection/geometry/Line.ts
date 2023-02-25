import { Vector2 } from '..';
import { Color } from '../Color';
import { Image } from '../Image';
import { VectorSet } from './VectorSet';

export class Line {
    constructor(public start: Vector2, public end: Vector2) {}

    get length(): number {
        return this.start.distance(this.end);
    }

    get points(): VectorSet {
        if (this.start.equals(this.end)) {
            return new VectorSet([this.start]);
        }

        const points = new VectorSet();

        const directionVector = this.end.subtract(this.start).normalized;
        const pointer = this.start;

        const segments = Math.ceil(this.start.distance(this.end));
        for (let segment = 0; segment < segments; segment++) {
            points.addUnique(pointer.round);
            pointer.addInPlace(directionVector);
        }

        return points;
    }

    draw(image: Image, color: Color) {
        //console.log('Line.draw',this);
        for (const point of this.points.points) {
            //console.log('setPointColor',point);
            image.setPointColor(point, color);
        }
    }

    coverage(image: Image, color: Color): number {
        const points = this.points;
        let covered = 0;
        for (const point of this.points.points) {
            if (image.getPointColor(point) === color) {
                covered++;
            }
        }
        return covered / points.length;
    }
}
