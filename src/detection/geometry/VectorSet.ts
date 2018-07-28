import { Vector2 } from './Vector2';
import { Rectangle } from './Rectangle';
import { nextFrame } from '../nextFrame';
import { Color } from '../Color';

export class VectorSet {
    private outerPoints: Vector2[] = [];
    constructor(public points: Vector2[] = []) {
        this.outerPoints.push(points[0]);
    }

    add(...points: Vector2[]):this {
        this.points.push(...points);
        return this;
    }

    clone(): VectorSet {
        return new VectorSet([...this.points]);
    }

    get length() {
        return this.points.length;
    }

    distance(geomentry: Vector2 | VectorSet): number {
        //todo DRY
        if (geomentry instanceof Vector2) {
            return Math.min(
                ...this.points.map((pointInSet) =>
                    pointInSet.distance(geomentry),
                ),
            );
        } else {
            return Math.min(
                ...this.points.map((pointInSet) =>
                    geomentry.distance(pointInSet),
                ),
            );
        }
    }

    distanceFast(geomentry: Vector2 | VectorSet): number {
        //todo DRY
        if (geomentry instanceof Vector2) {
            return Math.min(
                ...this.points.map((pointInSet) =>
                    pointInSet.distanceFast(geomentry),
                ),
            );
        } else {
            return Math.min(
                ...this.points.map((pointInSet) =>
                    geomentry.distanceFast(pointInSet),
                ),
            );
        }
    }

    distanceOptimized(geomentry: Vector2 | VectorSet): number {
        //todo DRY
        if (geomentry instanceof Vector2) {
            return this.points[0].distance(geomentry);
            /*return Math.min(
                ...this.points.map((pointInSet) =>
                    pointInSet.length(geomentry),
                ),
            );*/
        } else {
            return Math.min(
                ...this.points.map((pointInSet) =>
                    geomentry.distanceOptimized(pointInSet),
                ),
            );
        }
    }

    union(vectorSet2: VectorSet): VectorSet {
        return new VectorSet([...this.points, ...vectorSet2.points]);
    }

    isThisSubset(vectorSet2: VectorSet): boolean {
        for (const point1 of vectorSet2.points) {
            if (this.points.some((point2) => !point1.equals(point2))) {
                return false;
            }
        }
        return true;
    }

    equals(vectorSet2: VectorSet): boolean {
        return this.isThisSubset(vectorSet2) && vectorSet2.isThisSubset(this);
    }

    addUnique(...points: Vector2[]): this {
        //todo add fluent API to other methods
        for (const point of points) {
            if (!this.points.some((point2) => point.equals(point2))) {
                this.points.push(point);
            }
        }
        return this;
    }

    get unique(): VectorSet {
        const vectorSet2 = new VectorSet();
        vectorSet2.addUnique(...this.points);
        return vectorSet2;
    }

    subtract(vectorSetNegative: VectorSet): VectorSet {
        const vectorSet = new VectorSet();
        for (const point of this.points) {
            if (
                !vectorSetNegative.points.some((pointNegative) =>
                    pointNegative.equals(point),
                )
            ) {
                vectorSet.add(point);
            }
        }
        return vectorSet;
    }

    subtractWithArea(vectorSetNegative: VectorSet,radius:number): VectorSet {
        const vectorSet = new VectorSet();
        for (const point of this.points) {
            if (
                !vectorSetNegative.points.some((pointNegative) =>
                    pointNegative.distance(point)<=radius,
                )
            ) {
                vectorSet.add(point);
            }
        }
        return vectorSet;
    }

    private separateIslandsNoise(): VectorSet[] {
        return this.points.map((point) => new VectorSet([point]));
    }

    private separateIslandsSolid(): VectorSet[] {
        return [new VectorSet(this.points)];
    }

    async separateIslands(
        percentCallback: (percent: number) => void,
    ): Promise<VectorSet[]> {
        function iteration(separateIslands: VectorSet[]): VectorSet[] {
            for (const vectorSet1 of separateIslands) {
                let vectorSetsOld: VectorSet[] = [vectorSet1];
                let vectorSet1new = vectorSet1;

                for (const vectorSet2 of separateIslands) {
                    if (vectorSet1 !== vectorSet2) {
                        if (vectorSet1.distanceFast(vectorSet2) <= 1) {
                            vectorSetsOld.push(vectorSet2);

                            vectorSet1new = vectorSet1new.union(vectorSet2);
                        }
                    }
                }

                if (vectorSetsOld.length > 1) {
                    separateIslands = separateIslands.filter(
                        (island) => vectorSetsOld.indexOf(island) === -1,
                    );
                    separateIslands.push(vectorSet1new);
                    return separateIslands;
                }
            }

            return separateIslands;
        }

        let separateIslands = this.separateIslandsNoise();
        let fullLength = separateIslands.length;

        let i = 0;
        while (true) {
            if (i % 100 === 0) {
                await nextFrame();
                percentCallback(1 - separateIslands.length / fullLength);
            }
            i++;

            const separateIslandsNext = iteration(separateIslands);

            if (separateIslandsNext === separateIslands) {
                return separateIslandsNext;
            } else {
                separateIslands = separateIslandsNext;
            }
        }
    }

    boundingPoints(): [Vector2, Vector2, Vector2, Vector2] {
        const xs = this.points.map((point) => point.x);
        const ys = this.points.map((point) => point.y);

        const IDEAL = [
            new Vector2(Math.min(...xs), Math.min(...ys)),
            new Vector2(Math.min(...xs), Math.max(...ys)),
            new Vector2(Math.max(...xs), Math.max(...ys)),
            new Vector2(Math.max(...xs), Math.min(...ys)),
        ];

        let real: (Vector2)[] = IDEAL.map(() => this.points[0]);

        this.points.forEach((point) => {
            real = real.map((originalpoint, i) => {
                const IDEAL_POINT = IDEAL[i];
                if (
                    originalpoint!.distance(IDEAL_POINT) >
                    point.distance(IDEAL_POINT)
                ) {
                    return point;
                } else {
                    return originalpoint;
                }
            });
        });

        return real as [Vector2, Vector2, Vector2, Vector2];
    }

    boundingPointsComposite(): [Vector2, Vector2, Vector2, Vector2] {
        //todo DRY
        const xs = this.points.map((point) => point.x);
        const ys = this.points.map((point) => point.y);

        return [
            new Vector2(Math.min(...xs), Math.min(...ys)),
            new Vector2(Math.min(...xs), Math.max(...ys)),
            new Vector2(Math.max(...xs), Math.max(...ys)),
            new Vector2(Math.max(...xs), Math.min(...ys)),
        ];
    }

    boundingBox(): Rectangle {
        const boundingPoints = this.boundingPoints();
        const boundingPointsComposite = this.boundingPointsComposite();

        const bb = Rectangle.fromMinMax(
            boundingPoints[0].x,
            boundingPoints[0].y,
            boundingPoints[2].x,
            boundingPoints[2].y,
            0,
        );
        bb.set = this;
        bb.borderRadius =
            Math.abs(boundingPoints[0].x - boundingPointsComposite[0].x) +
            Math.abs(boundingPoints[1].x - boundingPointsComposite[1].x) +
            Math.abs(boundingPoints[2].x - boundingPointsComposite[2].x) +
            Math.abs(boundingPoints[3].x - boundingPointsComposite[3].x);
        bb.borderRadius = Math.floor(bb.borderRadius / 5) * 5;
        return bb;
    }

    private _color: Color | null = null;
    get color(): Color {
        if (!this._color) {
            this._color = Color.Random();
        }
        return this._color;
    }

    /*separateIslands(): VectorSet[] {
        
        const islands = [];
        let rest:VectorSet = this;

        while (rest.points.length) {
            
            const island = new VectorSet([rest.points[0]]);
            const outer = new VectorSet();

            let added = true;
            while(added){
                added = false;
                for (const point of rest.points) {
                    const distance = island.distance(point);
                    if(distance!==0){
                    if (
                        distance < 10
                    ) {
                        island.add(point);
                        added = true;
                    } else {

                        console.log('adding outer',distance,point,island);
                        outer.add(point);
                    }
                    }
                }
            }
            
            
            
            
            rest = outer;
            islands.push(island);



            //return islands;
        }

        console.log(islands);
        return islands;
    }*/
}
