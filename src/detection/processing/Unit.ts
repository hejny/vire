import { Image, Vector2 } from '..';
import { Color } from '../Color';
import { Line } from '../geometry/Line';
import { VectorSet } from '../geometry/VectorSet';

const DIRECTIONS = [
    new Vector2(1, 0),
    new Vector2(0, 1),
    //new Vector2(1,1),
];

export function detectLines(image: Image): Line[] {
    image = image.clone;

    //for(let startingPoint;startingPoint = image.firstBlackPoint;){}
    const lines: Line[] = [];

    let blackPoints = image.blackPoints;

    for (let i = 0; i < 4000; i++) {
        console.log('blackPoints.length', blackPoints.length);

        let startingPoint = blackPoints.points[0];
        if (!startingPoint) {
            console.log('finished');
            break;
        }

        const directionLines: {
            line: Line;
            points: VectorSet;
        }[] = DIRECTIONS.map((direction) =>
            detectLineFromPoint(image, startingPoint, direction),
        );

        let lineDetected = false;
        for (const directionLine of directionLines) {
            if (directionLine.line.length > 10) {
                lineDetected = true;
                lines.push(directionLine.line);
                blackPoints = blackPoints
                    .subtractWithArea(directionLine.points, 4)
                    .addAtBegining(directionLine.line.end);
            }
        }

        if (!lineDetected) {
            blackPoints = blackPoints.subtract(new VectorSet([startingPoint]));
        }

        /*const { line: lineHorizontal, points: pointsHorizontal } = detectLineFromPoint(image,startingPoint,new Vector2(1,0));
        const { line: lineVertical, points: pointsVertical, } = detectLineFromPoint(image,startingPoint,new Vector2(0,1));
 

        if(lineHorizontal.length>10){
            lines.push(lineHorizontal);
            blackPoints = blackPoints.subtractWithArea(pointsHorizontal,5);
        }

        if(lineVertical.length>10){
            lines.push(lineVertical);
            blackPoints = blackPoints.subtractWithArea(pointsVertical,5);
        }

        blackPoints = blackPoints.subtract(new VectorSet([startingPoint]));*/
    }

    return lines;
}

function detectLineFromPoint(
    image: Image,
    startingPoint: Vector2,
    directionVector: Vector2,
): { line: Line; points: VectorSet } {
    directionVector = directionVector.normalized;
    const directionVectorOrtogonal = new Vector2(
        directionVector.y,
        -directionVector.x,
    );

    const points = new VectorSet([startingPoint.round]);

    let currentPoint = startingPoint.round;
    let lastCoveredPoint = currentPoint.clone;

    while (true) {
        //todo image edge

        //console.log(currentPoint);
        const currentPointDirect = currentPoint.add(directionVector);
        let currentPointNext: Vector2 | null = null;
        //const currentPointRound = currentPoint.round;

        for (const side of [0, 1, -1]) {
            const testingPoint = currentPointDirect.add(
                directionVectorOrtogonal.scale(side),
            ).round;
            if (image.getPointColor(testingPoint) === Color.BLACK) {
                currentPointNext = testingPoint;
                break;
            }
        }

        if (currentPointNext) {
            currentPoint = currentPointNext;
            lastCoveredPoint = currentPoint;
            points.add(currentPoint);
        } else {
            //if(lastCoveredPoint.distance(currentPointDirect)>0){//todo is it nessessary
            return {
                line: new Line(startingPoint.round, lastCoveredPoint),
                points,
            };
            //lines.push(line);
            //line.draw(image,Color.WHITE);
            //break;
            //}
        }
    }
}
