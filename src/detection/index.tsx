import { Image } from './Image';
import { Color } from './Color';
import { Vector2 } from './geometry/Vector2';
import { Wireframe } from './Wireframe';
import { imageSeparateIslands } from './genetics/Flood';

/*const space = (global as any) || (window as any);

space.Detection = {
    Image,
    Wireframe,
    Color,
    Vector2,
};*/

export { Image, Wireframe, Color, Vector2, imageSeparateIslands };
