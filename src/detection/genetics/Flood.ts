
import { VectorSet } from '../geometry/VectorSet';
import { Image } from '../Image';
import { Vector2 } from '..';
import { access } from 'fs';

export async function imageSeparateIslands(
    image: Image,
    percentCallback: (percent: number, islands: VectorSet[]) => Promise<void>,
    //todo maybe detection color
): Promise<VectorSet[]> {
    await percentCallback(0, []);

    //const pointsTotal = image.size.x * image.size.y;

    const islands: VectorSet[] = [];
    let unassignedPoints = image.blackPoints;
    const pointsTotalCount = unassignedPoints.length;
    let pointsAssinnedCount = 0;

    while (unassignedPoints.length !== 0) {
        const landingPoint = unassignedPoints.points[0];
        const island = await floodIteration(
            image,
            new VectorSet([landingPoint]),
            new VectorSet([landingPoint]),
            async (island) => {}
            /*async (island) =>
                await percentCallback(
                    (island.length + pointsAssinnedCount) /
                    pointsTotalCount,
                    [...islands, island],
                ),
            */
        );
        unassignedPoints = unassignedPoints.subtract(island);
        islands.push(island);
        pointsAssinnedCount += island.length;

        await percentCallback(
            pointsAssinnedCount / pointsTotalCount,
            islands
        )
    }

    await percentCallback(1, islands);
    return islands;
}

function areNeighbors(image: Image,point1: Vector2, point2: Vector2) {
    return (
        Math.abs(
            image.getPointColor(point1).lightness -
                image.getPointColor(point2).lightness,
        ) < 0.07
    );
}

function areExactNeighbors(image: Image,point1: Vector2, point2: Vector2) {
    return image.getPointColor(point1) === image.getPointColor(point2);
}

async function floodIteration(
    image: Image,
    pointsInner: VectorSet,
    pointsInnerBorder: VectorSet,
    iterationCallback: (island: VectorSet) => Promise<void>,
    iterationLevel = 0,
): Promise<VectorSet> {
    //const pointsProcessed = pointsInner.length;
    //await percentCallback(pointsProcessed/pointsTotal,[pointsInner]);

    if (iterationLevel % 1 === 0) {
        await iterationCallback(pointsInnerBorder);
    }

    const pointsOuterUnuniqueBorder = new VectorSet(
        pointsInnerBorder.points
            .map((point) =>
                [
                    point,
                    new Vector2(point.x + 1, point.y),
                    new Vector2(point.x - 1, point.y),
                    new Vector2(point.x, point.y + 1),
                    new Vector2(point.x, point.y - 1),
                ]
                    .filter((point2) => image.isPoint(point2))
                    //.filter(point2=>!island.points.some(point3=>point2.equals(point3)))
                    .filter((point2) => areExactNeighbors(image,point, point2)),
            )
            .reduce(
                (pointsOuter, newPoints) => [...pointsOuter, ...newPoints],
                [],
            ),
    );

    const pointsOuter = pointsInner
        .clone()
        .addUnique(...pointsOuterUnuniqueBorder.points);

    //console.log(pointsOuter.length);

    if (pointsOuter.length === pointsInner.length) {
        return pointsOuter;
    } else {
        return await floodIteration(
            image,
            pointsOuter,
            pointsOuter.subtract(pointsInner),
            iterationCallback,
            iterationLevel + 1,
        );
    }
}
