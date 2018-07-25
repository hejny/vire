export function canvasFromSrc(src:string):Promise<HTMLCanvasElement> {
    return new Promise((resolve,reject)=>{

        const img = document.createElement('img');
        img.src = src;
        img.addEventListener("load", ()=>{
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