import { Rectangle } from '../Rectangle';

export interface ITemplate {
    snappingValues: (coord: 'x' | 'y', edge: 0 | 1) => number[];
    snapValue: (coord: 'x' | 'y', edge: 0 | 1, value: number) => number;
    snapRectangle: (rectangle: Rectangle) => Rectangle;
}
