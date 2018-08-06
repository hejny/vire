export function canvasFromSrc(src: string): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
        const img = document.createElement('img');
        img.src = src;
        img.addEventListener('load', () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            canvas.width = img.width;
            canvas.height = img.height;
            console.log(img);
            ctx.drawImage(img, 0, 0);
            resolve(canvas);
        });
    });
}

export function drawHighlightedRect(
    ctx: CanvasRenderingContext2D,
    x:number,
    y:number,
    width:number,
    height:number,
    colors: string[],
    lineWidth: number = 1
){
    for(const color of colors){


    
        ctx.lineCap = 'round';
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.strokeRect(
            x,
            y,
            width,
            height,
        );
        //ctx.strokeRect

        x-=lineWidth;
        y-=lineWidth;
        width+=lineWidth*2;
        height+=lineWidth*2;
    }
}
