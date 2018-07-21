import Vector2, { ISerializedVector2 } from './Vector2';
import Rectangle, { ISerializedRectangle } from './Rectangle';
import { Image } from './Image';
import { setPointColor } from './getAreaColor';
import { Color } from './Color';
import { ITemplate } from './templates/ITemplate';
import { GridTemplate } from './templates/GridTemplate';
import { FlatDesignTemplate } from './templates/FlatDesignTemplate';

export interface ISerializedWireframe{
    size: ISerializedVector2,
    rectangles: ISerializedRectangle[],
}

export class Wireframe {

   
    static deserialize(serializedWireframe:ISerializedWireframe):Wireframe{
        return new Wireframe(
            Vector2.deserialize(serializedWireframe.size),
            serializedWireframe.rectangles.map((serializedRectangle)=>Rectangle.deserialize(serializedRectangle))
        )
    }


    private template:ITemplate;

    constructor(public size: Vector2, public rectangles: Rectangle[]) {
        this.template = new FlatDesignTemplate(this.size);
    }

    serialize():ISerializedWireframe{
        return {
            size: this.size,
            rectangles: this.rectangles.map((rectangle)=>rectangle.serialize())
        }
    }

    /*static async fromImage(
        image: Image,
        percentCallback: (percent: number) => void,
    ) : Promise<Wireframe>  {

        let detectedPoints = image.detectPoints();
        console.log(detectedPoints);
        //detectedPoints = new VectorSet([]);
        //console.log(detectedPoints);
    
        const islands = await detectedPoints.separateIslands(percentCallback);
        const rects = islands.map((island) => island.boundingBox());
    
        console.log(rects);


        percentCallback(1);
    
        return new Wireframe(
            image.size,
            rects.filter(
                (rectangle) =>
                    rectangle.area > 30 ||
                    rectangle.size.x > 100 ||
                    rectangle.size.y > 100,
            ),
        );
        
    }*/


    snap():Wireframe {
        


        return new Wireframe(
            this.size,
            this.rectangles.map((rectangle)=>this.template.snapRectangle(rectangle))
        )
    }

    createDebugCanvas() {
        const debugDanvas = document.createElement('canvas');
        debugDanvas.width = this.size.x;
        debugDanvas.height = this.size.y;
        const ctx = debugDanvas.getContext('2d')!;

        /*for (let y = 0; y < this.image.size.y; y++) {
            for (let x = 0; x < this.image.size.x; x++) {
                const point = new Vector2(x, y);
                const color = this.image.getPointColor(point);
                ctx.fillStyle = color.css;
                ctx.fillRect(point.x, point.y, 1, 1);
            }
        }*/

        for (const rectangle of this.rectangles) {
            
            
            const detectionColor = new Color(255, 255, 0);//Color.Random();
            
            if(rectangle.set){
                for (const point of rectangle.set.points) {
                    setPointColor(ctx, point, detectionColor);
                }
            }


            {
                //-----------------------boundingPoints render

                //-----------------------

                //-----------------------boundingBox render
                ctx.fillStyle = 'rgba(0,255,0,0.1)'; //detectionColor.css;
                ctx.fillRect(
                    rectangle.topLeft.x,
                    rectangle.topLeft.y,
                    rectangle.size.x,
                    rectangle.size.y,
                );
                ctx.restore();
                ctx.strokeStyle = '#000000';
                ctx.rect(
                    rectangle.topLeft.x,
                    rectangle.topLeft.y,
                    rectangle.size.x,
                    rectangle.size.y,
                );
                ctx.stroke();
                //-----------------------
            }
        }

        return debugDanvas;
    }

    toSvg(): string {
        return `
            <svg width="${this.size.x}" height="${this.size.y}"
            xmlns="http://www.w3.org/2000/svg">


            ${(()=>{
                const lines:string[] = [];

                for(const coord1 of ['x','y'] as ('x'|'y')[]){

                    const coord2:'x'|'y' = coord1==='x'?'y':'x';
        
                    for(const edge of [0,1] as (0|1)[]){
                        lines.push(
                            ...this.template.snappingValues(coord1,edge)
                                .map((snappingValue)=>
                                    `<line ${coord1}1="${snappingValue}" ${coord2}1="${0}" ${coord1}2="${snappingValue}" ${coord2}2="${this.size[coord2]}" style="stroke:${edge===0?'#cccc99':'#99cccc'};stroke-width:1" />`)
                        );
                    }
                }

                
                return lines.join('\n');
            })()}

            ${this.rectangles.map((rect) => rect.toSvg()).join('\n')}
            
            </svg>
        `;
    }
}
