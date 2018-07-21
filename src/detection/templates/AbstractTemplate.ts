import { ITemplate } from "./ITemplate";
import Vector2 from "../Vector2";
import Rectangle from "../Rectangle";

export class AbstractTemplate implements ITemplate{

    constructor(public size:Vector2){
    }

    snappingValues(coord:'x'|'y',edge:0|1):number[]{
        return [];
    }

    snapValue(coord:'x'|'y',edge:0|1,value:number):number{
        return this.snappingValues(coord,edge).sort((a,b)=>Math.abs(a-value)>Math.abs(b-value)?1:-1)[0]
    }

    snapRectangle(rectangle:Rectangle):Rectangle{
        rectangle = rectangle.clone;
        {
            const {x,y} = rectangle.topLeft;
            rectangle.topLeft = new Vector2(
                this.snapValue('x',0,x),
                this.snapValue('y',0,y)
            );
        }
        {
            const {x,y} = rectangle.bottomRight;
            rectangle.bottomRight = new Vector2(
                this.snapValue('x',1,x),
                this.snapValue('y',1,y)
            );
        }
        return rectangle;
    }


}