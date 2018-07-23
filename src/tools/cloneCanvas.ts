export function cloneCanvas(oldCanvas:HTMLCanvasElement):HTMLCanvasElement {

    //create a new canvas
    const newCanvas = document.createElement('canvas');
    const ctx = newCanvas.getContext('2d')!;

    //set dimensions
    newCanvas.width = oldCanvas.width;
    newCanvas.height = oldCanvas.height;

    //apply the old canvas to the new one
    ctx.drawImage(oldCanvas, 0, 0);

    //return the new canvas
    return newCanvas;
}