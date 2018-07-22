import { Image } from './Image';
import { Color } from './Color';
import { Vector2 } from './Vector2';
import { Wireframe } from './Wireframe';

const space = (global as any) || (window as any);

space.Detection = {
    Image,
    Wireframe,
    Color,
    Vector2,
};

export { Image, Wireframe, Color, Vector2 };
