import { Color } from './Color';
import Vector2 from './Vector2';

export function getPointColor(
    ctx: CanvasRenderingContext2D,
    point: Vector2,
): Color {
    var frame = ctx.getImageData(point.x, point.y, 1, 1);
    return new Color(frame.data[0], frame.data[1], frame.data[2]);
}

export function setPointColor(
    ctx: CanvasRenderingContext2D,
    point: Vector2,
    color: Color,
) {
    ctx.fillStyle = color.css;
    ctx.fillRect(point.x, point.y, 1, 1);
}

export function getAreaColor(
    ctx: CanvasRenderingContext2D,
    topLeft: Vector2,
    size: Vector2,
): Color {
    var frame = ctx.getImageData(topLeft.x, topLeft.y, size.x, size.y);

    let color1 = new Color();

    var length = frame.data.length / 4;
    for (var i = 0; i < length; i++) {
        color1.r += frame.data[i * 4 + 0];
        color1.g += frame.data[i * 4 + 1];
        color1.b += frame.data[i * 4 + 2];
    }

    (color1.r /= length), (color1.g /= length), (color1.b /= length);

    return color1;
}
