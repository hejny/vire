import { Vector2, ISerializedVector2 } from './Vector2';
import { VectorSet } from './VectorSet';

export interface ISerializedRectangle {
    center: ISerializedVector2;
    size: ISerializedVector2;
    rotation: number;
    borderRadius: number;
}

export class Rectangle {
    static deserialize(serializedRectangle: ISerializedRectangle): Rectangle {
        return new Rectangle(
            Vector2.deserialize(serializedRectangle.center),
            Vector2.deserialize(serializedRectangle.size),
            serializedRectangle.rotation,
            serializedRectangle.borderRadius,
            null,
        );
    }

    constructor(
        public center: Vector2 = Vector2.ZERO,
        public size: Vector2 = Vector2.ONE,
        public rotation: number = 0,
        public borderRadius = 0,
        public set: VectorSet | null = null,
    ) {
        this.normalize();
    }

    serialize(): ISerializedRectangle {
        return {
            center: this.center,
            size: this.size,
            rotation: this.rotation,
            borderRadius: this.borderRadius,
        };
    }

    private normalize() {
        this.size = new Vector2(Math.abs(this.size.x), Math.abs(this.size.y));
    }

    static One() {
        return new Rectangle();
    }

    static fromMinMax(
        maxx: number,
        maxy: number,
        minx: number,
        miny: number,
        rotation: number,
    ) {
        return new Rectangle(
            new Vector2((maxx + minx) / 2, (maxy + miny) / 2),
            new Vector2(maxx - minx, maxy - miny),
            rotation,
        );
    }

    get clone() {
        return new Rectangle(
            this.center,
            this.size,
            this.rotation,
            this.borderRadius,
        );
    }

    cloneDeep() {
        return new Rectangle(
            this.center.clone,
            this.size.clone,
            this.rotation,
            this.borderRadius,
        );
    }

    intersects(position: Vector2): boolean {
        const position1r = this.center;
        const position2r = position.rotate(-this.rotation, this.center);

        return (
            position1r.x - this.size.x / 2 <= position2r.x &&
            position1r.y - this.size.y / 2 <= position2r.y &&
            position1r.x + this.size.x / 2 >= position2r.x &&
            position1r.y + this.size.y / 2 >= position2r.y
        );
    }

    grow(amount: number) {
        return new Rectangle(
            this.center,
            new Vector2(this.size.x + amount * 2, this.size.y + amount * 2),
            this.rotation,
        );
    }

    rotate(radians = 0, position = this.center) {
        this.center = this.center.rotate(radians, position); //todo maybe in place
        this.rotation += radians;
    }

    isIn(outerBoard: Rectangle) {
        return (
            outerBoard.intersects(this.topLeft) &&
            outerBoard.intersects(this.topRight) &&
            outerBoard.intersects(this.bottomLeft) &&
            outerBoard.intersects(this.bottomRight)
        );
    }

    get topLeft() {
        return this.center
            .add(new Vector2(this.size.x * -0.5, this.size.y * -0.5))
            .rotate(this.rotation, this.center);
    }

    get topRight() {
        return this.center
            .add(new Vector2(this.size.x * 0.5, this.size.y * -0.5))
            .rotate(this.rotation, this.center);
    }

    get bottomLeft() {
        return this.center
            .add(new Vector2(this.size.x * -0.5, this.size.y * 0.5))
            .rotate(this.rotation, this.center);
    }

    get bottomRight() {
        return this.center
            .add(new Vector2(this.size.x * 0.5, this.size.y * 0.5))
            .rotate(this.rotation, this.center);
    }

    set topLeft(value: Vector2) {
        const delta = value.subtract(this.topLeft);
        this.center = this.center.add(delta.scale(0.5));
        this.size = this.size.subtract(delta);
        this.normalize();
    }

    set bottomRight(value: Vector2) {
        const delta = value.subtract(this.bottomRight);
        this.center = this.center.add(delta.scale(0.5));
        this.size = this.size.add(delta);
        this.normalize();
    }

    get area(): number {
        return this.size.x * this.size.y;
    }

    toSvg(): string {
        return `<rect x="${this.topLeft.x}" y="${this.topLeft.y}" width="${
            this.size.x
        }" height="${this.size.y}"
        rx="${this.borderRadius}" ry="${this.borderRadius}"
        style="fill:rgba(0,0,255,0.2);stroke-width:2;stroke:rgb(255,0,0)" />`;
    }
}
