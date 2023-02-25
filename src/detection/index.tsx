import { Color } from './Color';
import { Vector2 } from './geometry/Vector2';
import { Image } from './Image';
import { imageSeparateIslands } from './processing/Flood';
import { Wireframe } from './Wireframe';

/*const space = (global as any) || (window as any);

space.Detection = {
    Image,
    Wireframe,
    Color,
    Vector2,
};*/

export { Image, Wireframe, Color, Vector2, imageSeparateIslands };
