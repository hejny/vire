import { Image } from './Image';
import { Color } from './Color';
import { Wireframe } from './Wireframe';

const space = global as any || window as any;

space.Detection = {
    Image, Wireframe, Color
}

export {
    Image, Wireframe, Color
}