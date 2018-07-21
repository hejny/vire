import { ITemplate } from "./ITemplate";
import { AbstractSymetricTemplate } from "./AbstractSymetricTemplate";


export class FlatDesignTemplate extends AbstractSymetricTemplate implements ITemplate{

    
    snappingValuesHalf(coord:'x'|'y'):number[]{


        const pad = 30;

        const snappingValues:number[] = [pad];

        for(let value=pad;value<this.size[coord]-pad;value+=20){
            snappingValues.push(value);
        }



        return snappingValues;
    }




}