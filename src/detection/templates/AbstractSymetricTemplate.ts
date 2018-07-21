import { ITemplate } from "./ITemplate";
import { AbstractTemplate } from "./AbstractTemplate";

export class AbstractSymetricTemplate extends AbstractTemplate implements ITemplate{

    snappingValues(coord:'x'|'y',edge:0|1):number[]{
        return this.snappingValuesHalf(coord).map((value)=>edge===0?value:this.size[coord]-value);
    }

    snappingValuesHalf(coord:'x'|'y'):number[]{
        return [];
    }

}