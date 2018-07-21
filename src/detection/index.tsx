import { Image } from './detection/Image';
import { Color } from './detection/Color';
import { Wireframe } from './detection/Wireframe';

const space = global as any || window as any;

space.imageDetection = {
    Image, Wireframe, Color
}

export {
    Image, Wireframe, Color
}