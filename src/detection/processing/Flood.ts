import { VectorSet } from '../geometry/VectorSet';
import { Image } from '../Image';
import { Vector2 } from '..';
import { access } from 'fs';

export async function imageSeparateIslands(
    image: Image,
    progressCallback: (percent: number, islands: VectorSet[]) => Promise<void>,
    //todo maybe detection color
): Promise<VectorSet[]> {
    await progressCallback(0, []);

    //const pointsTotal = image.size.x * image.size.y;

    const islands: VectorSet[] = [];
    let unassignedPoints = image.blackPoints;
    const pointsTotalCount = unassignedPoints.length;
    let pointsAssinnedCount = 0;

    while (unassignedPoints.length !== 0) {
        const landingPoint = unassignedPoints.points[0];
        const island = await floodIteration(
            image,
            [new VectorSet([landingPoint])],
            //new VectorSet([landingPoint]),
            async (island) => {},
            /*async (island) =>
                await percentCallback(
                    (island.length + pointsAssinnedCount) /
                    pointsTotalCount,
                    [...islands, island],
                ),
            */
        );

        pointsAssinnedCount += island.length;
        unassignedPoints = unassignedPoints.subtract(island);

        if (island.length > image.size.area / 2000) {
            islands.push(island);

            await progressCallback(
                pointsAssinnedCount / pointsTotalCount,
                islands,
            );
        }
    }

    await progressCallback(1, islands);
    return islands;
}

function areNeighbors(image: Image, point1: Vector2, point2: Vector2) {
    return (
        Math.abs(
            image.getPointColor(point1).lightness -
                image.getPointColor(point2).lightness,
        ) < 0.07
    );
}

function areExactNeighbors(image: Image, point1: Vector2, point2: Vector2) {
    return image.getPointColor(point1) === image.getPointColor(point2);
}

async function floodIteration(
    image: Image,
    pointsLayers: VectorSet[],
    iterationCallback: (island: VectorSet) => Promise<void>,
    iterationLevel = 0,
): Promise<VectorSet> {
    //const pointsProcessed = pointsInner.length;
    //await percentCallback(pointsProcessed/pointsTotal,[pointsInner]);

    //console.log('pointsLayers',pointsLayers);

    if (iterationLevel % 1 === 0) {
        await iterationCallback(pointsLayers[pointsLayers.length - 1]);
    }

    const pointsNextLayerUnpure = new VectorSet(
        pointsLayers[pointsLayers.length - 1].points
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
                    .filter((point2) =>
                        areExactNeighbors(image, point, point2),
                    ),
            )
            .reduce(
                (pointsOuter, newPoints) => [...pointsOuter, ...newPoints],
                [],
            ),
    ).unique;

    let pointsNextLayer = pointsNextLayerUnpure.subtract(
        pointsLayers[pointsLayers.length - 1],
    );

    if (pointsLayers[pointsLayers.length - 2]) {
        pointsNextLayer = pointsNextLayer.subtract(
            pointsLayers[pointsLayers.length - 2],
        );
    }

    if (pointsNextLayer.length === 0) {
        return VectorSet.union(...pointsLayers);
    } else {
        pointsLayers.push(pointsNextLayer);
        return await floodIteration(
            image,
            pointsLayers,
            iterationCallback,
            iterationLevel + 1,
        );
    }
}
