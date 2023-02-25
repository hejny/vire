import { AbstractSymetricTemplate } from './AbstractSymetricTemplate';
import { ITemplate } from './ITemplate';

export class FlatDesignTemplate extends AbstractSymetricTemplate
    implements ITemplate {
    snappingValuesHalf(coord: 'x' | 'y'): number[] {
        const pad = this.size.x / 400 * 30;
        const step = this.size.x / 400 * 20;

        const snappingValues: number[] = [pad];

        for (let value = pad; value < this.size[coord] - pad; value += step) {
            snappingValues.push(value);
        }

        return snappingValues;
    }
}
