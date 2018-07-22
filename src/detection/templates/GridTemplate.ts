import { ITemplate } from './ITemplate';
import { AbstractTemplate } from './AbstractTemplate';

export class GridTemplate extends AbstractTemplate implements ITemplate {
    snappingValues(coord: 'x' | 'y', edge: 0 | 1): number[] {
        const snappingValues: number[] = [];

        const l = 30;

        for (let i = 0; i < l; i++) {
            snappingValues.push(this.size[coord] / l * i);
        }

        return snappingValues;
    }
}
