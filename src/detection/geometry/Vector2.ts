export interface ISerializedVector2 {
    x: number;
    y: number;
}

export class Vector2 {
    static ZERO = new Vector2(0, 0);
    static ONE = new Vector2(1, 1);

    static UP = new Vector2(0, 1);
    static DOWN = new Vector2(0, -1);
    static LEFT = new Vector2(-1, 0);
    static RIGHT = new Vector2(1, 0);

    static UP_LEFT = new Vector2(-1, 1);
    static DOWN_LEFT = new Vector2(-1, -1);
    static UP_RIGHT = new Vector2(1, 1);
    static DOWN_RIGHT = new Vector2(1, -1);

    static deserialize(serializedVector2: ISerializedVector2): Vector2 {
        return new Vector2(serializedVector2.x, serializedVector2.y);
    }

    constructor(public x: number, public y: number) {}

    serialize(): ISerializedVector2 {
        return {
            x: this.x,
            y: this.y,
        };
    }

    get clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    get normalized(): Vector2 {
        return this.scale(1 / this.length);
    }

    get length() {
        return this.distance();
    }

    equals(vector: Vector2): boolean {
        return this.x === vector.x && this.y === vector.y;
    }

    //todo consolidate 2 add methods and 1 static method
    add(...vectors: Vector2[]): Vector2 {
        return new Vector2(
            vectors.reduce((x, vector2) => x + vector2.x, this.x),
            vectors.reduce((y, vector2) => y + vector2.y, this.y),
        );
    }

    addInPlace(...vectors: Vector2[]): void {
        //todo void vs. never
        for (const vector of vectors) {
            this.x += vector.x;
            this.y += vector.y;
        }
    }

    static add(...vectors: Vector2[]) {
        return new Vector2(
            vectors.reduce((x, vector2) => x + vector2.x, 0),
            vectors.reduce((y, vector2) => y + vector2.y, 0),
        );
    }

    subtract(vector2: Vector2): Vector2 {
        return new Vector2(this.x - vector2.x, this.y - vector2.y);
    }

    scale(scale: number): Vector2 {
        return new Vector2(this.x * scale, this.y * scale);
    }

    scaleInPlace(scale: number): void {
        this.x *= scale;
        this.y *= scale;
    }

    distance(vector2: Vector2 = Vector2.ZERO): number {
        return Math.sqrt(
            Math.pow(this.x - vector2.x, 2) + Math.pow(this.y - vector2.y, 2),
        );
    }

    distanceFast(vector2: Vector2 = Vector2.ZERO): number {
        return (
            (Math.abs(this.x - vector2.x) + Math.abs(this.y - vector2.y)) / 1
        );
    }

    rotation(vector2: Vector2 = Vector2.ZERO): number {
        return Math.atan2(this.y - vector2.y, this.x - vector2.x);
    }

    rotate(radians: number, vector2: Vector2 = Vector2.ZERO) {
        const base = this.subtract(vector2);
        const length = base.distance();
        const rotation = base.rotation();
        return new Vector2(
            Math.cos(rotation + radians) * length,
            Math.sin(rotation + radians) * length,
        ).add(vector2);
    }

    get area(): number {
        return this.x * this.y;
    }

    map(axisCallback: (value: number) => number): Vector2 {
        return new Vector2(axisCallback(this.x), axisCallback(this.y));
    }

    get round(): Vector2 {
        return this.map(Math.round);
    }

    get ceil(): Vector2 {
        return this.map(Math.ceil);
    }

    get floor(): Vector2 {
        return this.map(Math.floor);
    }

    toArray(): [number, number] {
        return [this.x, this.y];
    }

    toString(): string {
        return `[${this.x}, ${this.y}]`;
    }

    /*isNeibourgh(point2: Vector2): boolean {
        return this.length(point2) < 20;
    }*/
}
