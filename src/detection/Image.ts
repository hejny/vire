import { Color } from './Color';
import { VectorSet } from './geometry/VectorSet';
import { Vector2 } from './geometry/Vector2';

export class Image {
    //todo from canvas

    static fromCanvas(canvas: HTMLCanvasElement): Image {
        return Image.fromCtx(canvas.getContext('2d')!);
    }

    static fromCtx(ctx: CanvasRenderingContext2D): Image {
        var imageData = ctx.getImageData(
            0,
            0,
            ctx.canvas.width,
            ctx.canvas.height,
        );
        return Image.fromImageData(imageData);
    }

    static fromImageData(imageData: ImageData): Image {
        const table: Color[][] = [];
        for (let y = 0; y < imageData.height; y++) {
            const row: Color[] = [];
            table.push(row);
            for (let x = 0; x < imageData.width; x++) {
                const i = y * imageData.width + x;
                row.push(
                    new Color(
                        imageData.data[i * 4 + 0],
                        imageData.data[i * 4 + 1],
                        imageData.data[i * 4 + 2],
                    ),
                );
            }
        }
        return new Image(table);
    }

    constructor(public pixels: Color[][]) {}

    get clone(): Image {
        const table: Color[][] = [];
        for (let y = 0; y < this.size.y; y++) {
            const row: Color[] = [];
            table.push(row);
            for (let x = 0; x < this.size.x; x++) {
                row.push(this.pixels[y][x]);
            }
        }
        return new Image(table);
    }

    equals(image: Image): boolean {
        if (!this.size.equals(image.size)) {
            return false;
        }
        for (let y = 0; y < this.size.y; y++) {
            for (let x = 0; x < this.size.x; x++) {
                const point = new Vector2(x, y);
                if (
                    !this.getPointColor(point).equals(
                        image.getPointColor(point),
                    )
                ) {
                    return false;
                }
            }
        }
        return true;
    }

    get canvas(): HTMLCanvasElement {
        const canvasElement = document.createElement('canvas');
        canvasElement.width = this.size.x;
        canvasElement.height = this.size.y;
        const ctx = canvasElement.getContext('2d')!;
        for (let y = 0; y < this.size.y; y++) {
            for (let x = 0; x < this.size.x; x++) {
                const point = new Vector2(x, y);
                const color = this.getPointColor(point);
                ctx.fillStyle = color.css;
                ctx.fillRect(point.x, point.y, 1, 1);
            }
        }
        return canvasElement;
    }

    get dataURL(): string {
        //todo fromDataUrl without canvas if possible
        return this.canvas.toDataURL(); //todo without canvas
    }

    get size() {
        return new Vector2(this.pixels[0].length, this.pixels.length);
    }

    get points(): VectorSet {
        const points = new VectorSet();
        for (let y = 0; y < this.size.y; y++) {
            for (let x = 0; x < this.size.x; x++) {
                points.add(new Vector2(x, y));
            }
        }
        return points;
    }

    get flipVertical(): Image {
        const table: Color[][] = [];
        for (let y = 0; y < this.size.y; y++) {
            table.push(this.pixels[this.size.y - y - 1]);
        }
        return new Image(table);
    }

    get flipHorizontal(): Image {
        const table: Color[][] = [];
        for (let y = 0; y < this.size.y; y++) {
            const row: Color[] = [];
            table.push(row);
            for (let x = 0; x < this.size.x; x++) {
                row.push(this.pixels[y][this.size.x - x - 1]);
            }
        }
        return new Image(table);
    }

    /*
    get darkPoints():VectorSet{

        const averageColorLightness = this.averageColor.lightness/1.6;

        const points = new VectorSet();
        for (let y = 0; y < this.size.y; y++) {
            for (let x = 0; x < this.size.x; x++) {

                const point = new Vector2(x,y);
                const color = this.getPointColor(point);
                if(averageColorLightness>color.lightness){
                    points.add(point);
                }
            }
        }
        return points;
    }
    /**/

    get firstBlackPoint(): Vector2 | null {
        for (let y = 0; y < this.size.y; y++) {
            for (let x = 0; x < this.size.x; x++) {
                const point = new Vector2(x, y);
                if (this.getPointColor(point) === Color.BLACK) {
                    return point;
                }
            }
        }
        return null;
    }

    get blackPoints(): VectorSet {
        const points = new VectorSet();
        for (let y = 0; y < this.size.y; y++) {
            for (let x = 0; x < this.size.x; x++) {
                const point = new Vector2(x, y);
                if (this.getPointColor(point) === Color.BLACK) {
                    points.add(point);
                }
            }
        }
        return points;
    }

    get averageColor(): Color {
        const averageColor = new Color(0, 0, 0);
        for (let y = 0; y < this.size.y; y++) {
            for (let x = 0; x < this.size.x; x++) {
                const color = this.getPointColor(new Vector2(x, y));
                averageColor.r += color.r;
                averageColor.g += color.g;
                averageColor.b += color.b;
            }
        }

        averageColor.r /= this.size.x * this.size.y;
        averageColor.g /= this.size.x * this.size.y;
        averageColor.b /= this.size.x * this.size.y;

        return averageColor;
    }

    isPoint(point: Vector2): boolean {
        return (
            point.x >= 0 &&
            point.y >= 0 &&
            point.x < this.size.x &&
            point.y < this.size.y
        );
    }

    getPointColor(point: Vector2): Color {
        return this.pixels[point.y][point.x];
    }

    setPointColor(point: Vector2, color: Color): this {
        this.pixels[point.y][point.x] = color;
        return this;
    }

    /**/
    getAreaAverageColor(point: Vector2, size: Vector2): Color {
        const averageColor = new Color(0, 0, 0);
        let i = 0;
        const tmpTestedPoints = [];

        for (
            let y = Math.floor(point.y - size.y / 2);
            y < Math.ceil(point.y + size.y / 2);
            y++
        ) {
            for (
                let x = Math.floor(point.x - size.x / 2);
                x < Math.ceil(point.x + size.x / 2);
                x++
            ) {
                const point = new Vector2(x, y);
                tmpTestedPoints.push(point);

                //console.log(point);

                if (this.isPoint(point)) {
                    const color = this.getPointColor(point);
                    averageColor.r += color.r;
                    averageColor.g += color.g;
                    averageColor.b += color.b;
                    i++;
                }
            }
        }

        if (i === 0) {
            console.log('point', point);
            console.log('size', size);
            console.log('tmpTestedPoints', tmpTestedPoints);
            throw new Error(`There are no pixels!`);
        }

        averageColor.r /= i;
        averageColor.g /= i;
        averageColor.b /= i;

        return averageColor;
    }
    /**/

    getAreaDarkColor(point: Vector2, size: Vector2): Color {
        const tmpTestedPoints = [];

        let maxColor = new Color(255, 255, 255);
        //maxColor = new Color(0,0,0);

        for (
            let y = Math.floor(point.y - size.y / 2);
            y < Math.ceil(point.y + size.y / 2);
            y++
        ) {
            for (
                let x = Math.floor(point.x - size.x / 2);
                x < Math.ceil(point.x + size.x / 2);
                x++
            ) {
                const point = new Vector2(x, y);
                tmpTestedPoints.push(point);

                //console.log(point);

                if (this.isPoint(point)) {
                    const color = this.getPointColor(point);
                    if (color.lightness < maxColor.lightness) {
                        maxColor = color;
                    }
                }
            }
        }

        return maxColor;
    }

    isAreaCovered(point: Vector2, size: Vector2): boolean {
        const tmpTestedPoints = [];

        const areaAverageColorLightness = this.getAreaAverageColor(point, size)
            .lightness;
        let all = 0;
        let filled = 0;
        let darker = 0;
        let lighter = 0;
        let maxColor = new Color(255, 255, 255);

        for (
            let y = Math.floor(point.y - size.y / 2);
            y < Math.ceil(point.y + size.y / 2);
            y++
        ) {
            for (
                let x = Math.floor(point.x - size.x / 2);
                x < Math.ceil(point.x + size.x / 2);
                x++
            ) {
                const point = new Vector2(x, y);
                tmpTestedPoints.push(point);

                //console.log(point);

                if (this.isPoint(point)) {
                    const color = this.getPointColor(point);

                    all++;
                    if (color.lightness < areaAverageColorLightness) {
                        darker++;
                    } else {
                        lighter++;
                    }
                    if (color.lightness < areaAverageColorLightness / 1.05) {
                        filled++;
                    }
                    if (color.lightness < maxColor.lightness) {
                        maxColor = color;
                    }
                }
            }
        }

        return filled > all * 0.1; //||maxColor.lightness<0.2;
    }

    /*
    isPointCovered(point: Vector2): boolean {

        const size = new Vector2(5,5);//todo CONST
        const TRESHOLD = new Color(100,100,100);
        const TRESHOLD_COUNT = 4;//size.x*size.y*(5/100);

        const tmpTestedPoints = [];
        let count = 0;
        

        for (
            let y = Math.floor(point.y - size.y / 2);
            y < Math.ceil(point.y + size.y / 2);
            y++
        ) {
            for (
                let x = Math.floor(point.x - size.x / 2);
                x < Math.ceil(point.x + size.x / 2);
                x++
            ) {
                const point = new Vector2(x, y);
                tmpTestedPoints.push(point);

                //console.log(point);

                if (this.isPoint(point)) {
                    const color = this.getPointColor(point);
                   if(color.lightness<TRESHOLD.lightness){
                        count++;
                   }
                }
            }
        }

        return count>=TRESHOLD_COUNT;
    }
    /**/

    /*isPointCovered(point: Vector2): boolean {

        const size = new Vector2(2,2);//todo CONST
        let max = this.getPointColor(point);
        let min = this.getPointColor(point);

        const tmpTestedPoints = [];
        let count = 0;
        

        for (
            let y = Math.floor(point.y - size.y / 2);
            y < Math.ceil(point.y + size.y / 2);
            y++
        ) {
            for (
                let x = Math.floor(point.x - size.x / 2);
                x < Math.ceil(point.x + size.x / 2);
                x++
            ) {
                const point = new Vector2(x, y);
                tmpTestedPoints.push(point);

                //console.log(point);

                if (this.isPoint(point)) {
                    const color = this.getPointColor(point);
                   if(color.lightness<min.lightness){
                        min=color;
                   }
                   if(color.lightness>min.lightness){
                        max=color;
               }
                }
            }
        }

        return max.lightness-min.lightness>0.3;
    }*/

    /*
    detectPoints(): VectorSet {
        const averageColor = this.averageColor;
        const detectedPoints = new VectorSet([]);

        console.log(this, averageColor);

        for (let y = 0; y < this.size.y; y++) {
            for (let x = 0; x < this.size.x; x++) {
                const point = new Vector2(x, y);
                const color = this.getPointColor(point);

                //const areaColor = this.getAreaColor(point,new Vector2(10,10));

                //* 1.41
                //if(this.isPointCovered(point)){
                if (color.lightness * 1.2  < averageColor.lightness ) {
                //if (color.lightness* 1.2  < areaColor.lightness) {
                    //console.log(color,point);
                    //throw color;
                    
                    if(this.isPointCovered(point)){
                        detectedPoints.add(point);
                    }
                    
                    
                }
            }
        }

        console.log(
            `Detected ${detectedPoints.points.length}( ${Math.round(
                detectedPoints.points.length /
                    (this.size.x * this.size.y) *
                    100 *
                    10,
            ) / 10}% ) of points.`,
        );

        return detectedPoints;
    }
    /**/

    /**/
    resize(size: Vector2): Image {
        const table: Color[][] = [];

        const area = new Vector2(this.size.x / size.x, this.size.y / size.y);
        console.log(area);

        for (let y = 0; y < size.y; y++) {
            const row: Color[] = [];
            table.push(row);

            for (let x = 0; x < size.x; x++) {
                const point = new Vector2(x, y);
                const pointOld = new Vector2(
                    point.x / size.x * this.size.x,
                    point.y / size.y * this.size.y,
                );

                row.push(this.getAreaDarkColor(pointOld, area));
                //pointOld
                //row.push(this.getAreaColor(pointOld,area));
                //row.push(new Color());
            }
        }
        return new Image(table);
    }
    /**/

    /*
    purge():Image{
        const averageColorLightness= this.averageColor.lightness / 1.2;

        const table: Color[][] = [];
        
        for (let y = 0; y < this.size.y; y++) {
            const row: Color[] = [];
            table.push(row);

            for (let x = 0; x < this.size.x; x++) {
                
                row.push(this.getPointColor(new Vector2(x, y)).lightness>averageColorLightness?Color.WHITE: Color.BLACK);
            }
        }
        return new Image(table);
    }
    /**/

    resizePurge(size: Vector2): Image {
        const table: Color[][] = [];

        const area = new Vector2(
            this.size.x / size.x,
            this.size.y / size.y,
        ).scale(1);
        //console.log(area);

        for (let y = 0; y < size.y; y++) {
            const row: Color[] = [];
            table.push(row);

            for (let x = 0; x < size.x; x++) {
                const point = new Vector2(x, y);
                const pointOld = new Vector2(
                    point.x / size.x * this.size.x,
                    point.y / size.y * this.size.y,
                );

                row.push(
                    this.isAreaCovered(pointOld, area)
                        ? Color.BLACK
                        : Color.WHITE,
                );
                //pointOld
                //row.push(this.getAreaColor(pointOld,area));
                //row.push(new Color());
            }
        }
        return new Image(table);
    }

    findPatternUniqueFlip(pattern: Image): VectorSet {
        if (pattern.size.x % 2 !== 1 && pattern.size.y % 2 !== 1) {
            throw new Error(`Pattern should have 2n+1 size;`);
        }
        return new VectorSet(
            this.points.points.filter((point) => {
                for (let y = 0; y < pattern.size.y; y++) {
                    for (let x = 0; x < pattern.size.x; x++) {
                        const detectionPoint = point.add(
                            new Vector2(
                                x - Math.floor(pattern.size.x / 2),
                                y - Math.floor(pattern.size.y / 2),
                            ),
                        );
                        if (!this.isPoint(detectionPoint)) {
                            return false;
                        }
                        if (
                            !this.getPointColor(detectionPoint).equals(
                                pattern.getPointColor(new Vector2(x, y)),
                            )
                        ) {
                            return false;
                        }
                    }
                }
                return true;
            }),
        );
    }

    findPattern(pattern: Image): VectorSet {
        const patterns = [
            pattern,
            pattern.flipHorizontal,
            pattern.flipVertical,
            pattern.flipHorizontal.flipVertical,
        ];
        //todo optimize filter only unique patterns
        return patterns.reduce(
            (detected, pattern) =>
                detected.union(this.findPatternUniqueFlip(pattern)),
            new VectorSet(),
        ).unique;
    }

    replacePattern(pattern: Image, color: Color): Image {
        const image = this.clone;
        this.findPattern(pattern).points.forEach((point) => {
            image.setPointColor(point, color);
        });
        return image;
    }

    replacePatterns(patterns: Image[], color: Color): Image {
        let lastImage = this;
        for (let i = 0; i < 10; i++) {
            //todo limit
            const currentImage = patterns.reduce(
                (image, pattern) => image.replacePattern(pattern, color),
                lastImage,
            );
            if (currentImage.equals(lastImage)) {
                return currentImage;
            }
        }
        return lastImage;
        //throw new Error(`Limit on replacePatterns.`);
    }

    /*removeGaps():Image{
        const table: Color[][] = [];

        
        for (let y = 0; y < this.size.y; y++) {
            const row: Color[] = [];
            table.push(row);
            for (let x = 0; x < this.size.x; x++) {

                const point = new Vector2(x, y);
                
                if(this.getPointColor(point)===Color.WHITE){

                    const filledNeighbours = 
                    [
                        Vector2.UP,
                        Vector2.DOWN,
                        Vector2.LEFT,
                        Vector2.RIGHT

                    ].reduce((sum,direction)=>{
                        const neibourghPoint = point.add(direction);

                        if(this.isPoint(neibourghPoint)){
                            return sum+(this.getPointColor(neibourghPoint)===Color.BLACK?1:0);
                        }else{
                            return sum;
                        }


                    },0);

                    row.push((filledNeighbours>=3)?Color.BLACK: Color.WHITE);

                }else{
                    row.push(Color.BLACK);
                }

            }
        }
        return new Image(table);
    }
    */

    /*
    removeNoise():Image{
        const table: Color[][] = [];

        
        for (let y = 0; y < this.size.y; y++) {
            const row: Color[] = [];
            table.push(row);
            for (let x = 0; x < this.size.x; x++) {

                const point = new Vector2(x, y);
                
                if(this.getPointColor(point)===Color.BLACK){

                    const filledNeighbours = 
                    [

                        //Vector2.ZERO,

                        Vector2.UP,
                        Vector2.DOWN,
                        Vector2.LEFT,
                        Vector2.RIGHT,

                        Vector2.UP_LEFT,
                        Vector2.UP_RIGHT,
                        Vector2.DOWN_LEFT,
                        Vector2.DOWN_RIGHT,


                    ].reduce((sum,direction)=>{
                        const neibourghPoint = point.add(direction);

                        if(this.isPoint(neibourghPoint)){
                            return sum+(this.getPointColor(neibourghPoint)===Color.BLACK?1:0);
                        }else{
                            return sum;
                        }


                    },0);

                    row.push((filledNeighbours>=4)?Color.BLACK: Color.WHITE);

                }else{
                    row.push(Color.WHITE);
                }

            }
        }
        return new Image(table);
    }
    */

    /*
    async separateIslands(
        percentCallback: (percent: number, islands: VectorSet[]) => Promise<void>,
    ): Promise<VectorSet[]> {

        await percentCallback(0,[]);

        const pointsTotal = this.size.x * this.size.y;
        let pointsProcessed = 0;

        const processPoint = async (point:Vector2,island:VectorSet = new VectorSet())=>{

            pointsProcessed++;
            if(pointsProcessed%1000){
                await percentCallback(pointsProcessed/pointsTotal,[island]);
            }

            island.add(point);

            const newPoints = [
                new Vector2(point.x+1,point.y),
                new Vector2(point.x-1,point.y),
                new Vector2(point.x,point.y+1),
                new Vector2(point.x,point.y-1)
            ]
            .filter(point2=>this.isPoint(point2))
            .filter(point2=>!island.points.some(point3=>point2.equals(point3)))
            .filter(point2=>this.areNeighbors(point,point2));
    
            for(const newPoint of newPoints){
                await processPoint(newPoint,island);
            }
            return island;
        }
    
        const island = await processPoint(new Vector2(5,5));
    
        await percentCallback(1,[island]);
    
        return [island]
    }
    */

    withIslands(islands: VectorSet[]): Image {
        const image = this.clone;
        //todo maybe to other method
        for (const island of islands) {
            const detectionColor = Color.RED; //new Color(0, 255, 0);//Color.Random();
            for (const point of island.points) {
                //const color = this.getPointColor(point);
                image.setPointColor(point, detectionColor);
                //ctx.fillStyle = detectionColor.css;
                //ctx.fillRect(point.x, point.y, 1, 1);
            }
        }
        return image;
    }
}
