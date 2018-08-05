import { VectorSet } from '../geometry/VectorSet';
import { Wireframe } from '..';
import { Image } from '../Image';
import { IProgressFrame } from '../../model/DataModel';
import { imageSeparateIslands } from './Flood';

export async function createWireframe(
    image: Image,
    quality = 200,
    progressCallback: (progressFrame: IProgressFrame) => Promise<void>,
): Promise<Wireframe> {

    await progressCallback({
        percent: 0,
        image: null,
    });


    const imageResizedPurged = image
        /**/
        .resizePurge(
            //image.size,
            image.size.scale(quality / image.size.x),
        );

    /*/
        const _ = Detection.Color.WHITE;
        const $ = Detection.Color.BLACK;
        
        const imageResizedPurgedNoGaps = imageResizedPurged.replacePattern(
            new Detection.Image([[_, _, _], [_, $, _], [_, _, _]]),
            _,
        );
        /*
            .replacePatterns(
                [
                    new Detection.Image([[_, _, _], [_, $, _], [_, _, _]]),
                    new Detection.Image([[_, _, _], [_, $, _], [_, $, _]]),
                    new Detection.Image([[_, _, _], [_, $, _], [_, _, $]]),
                ],
                _,
            )
            .replacePatterns(
                [
                    new Detection.Image([[$, _, _], [_, _, _], [_, _, $]]),
                    new Detection.Image([[_, $, _], [_, _, _], [_, $, _]]),
                ],
                $,
            );
        /**/

    /*const separateIslands = await imageResizedPurgedNoGaps.separateIslands(
            async (percent, islands) => {
                islands;
                this.progress = {
                    percent,
                    images: [
                        imageResizedPurged,
                        imageResizedPurgedNoGaps,
                        imageResizedPurgedNoGaps.withIslands(islands),
                    ],
                };
                await nextFrame();
            },
        );*/

    /*const lines = detectLines(imageResizedPurgedNoGaps);
        console.log('lines', lines);
        for (const line of lines) {
            line.draw(imageResizedPurgedNoGaps, Detection.Color.RED);
        }*/

    const separateIslands = await imageSeparateIslands(
        imageResizedPurged,
        async (percent, islands) => {
            console.log(Math.round(percent * 100 * 10) / 10 + '%');
            await progressCallback({
                percent,
                image: imageResizedPurged.withIslands(islands),
            });
        },
    );

    const rects = separateIslands.map((island) => island.boundingBox());

    await progressCallback({
        percent: 1,
        image: imageResizedPurged.withIslands(separateIslands),
    });

    return new Wireframe(
        imageResizedPurged.size,
        rects.filter(
            (rectangle) =>
                rectangle.area > 30 ||
                rectangle.size.x > 100 ||
                rectangle.size.y > 100,
        ),
    );
}
