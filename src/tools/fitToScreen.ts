import * as Detection from '../detection';

export function fitToScreen(
    screenSize: Detection.Vector2,
    contentSize: Detection.Vector2,
) {
    const screenSizeRatio = screenSize.x / screenSize.y,
        contentSizeRatio = contentSize.x / contentSize.y;

    if (screenSizeRatio > contentSizeRatio) {
        return new Detection.Vector2(
            screenSize.y * contentSizeRatio,
            screenSize.y,
        );
    } else if (screenSizeRatio < contentSizeRatio) {
        return new Detection.Vector2(
            screenSize.x,
            screenSize.x / contentSizeRatio,
        );
    } else {
        return screenSize;
    }
}

export function fitToScreenInfo(
    screenSize: Detection.Vector2,
    contentSize: Detection.Vector2,
) {
    const contentSizeFit = fitToScreen(screenSize, contentSize);
    return {
        ratio: contentSizeFit.x / contentSize.x,
        size: contentSizeFit,
        topLeft: new Detection.Vector2(
            (screenSize.x - contentSizeFit.x) / 2,
            (screenSize.y - contentSizeFit.y) / 2,
        ),
    };
}
