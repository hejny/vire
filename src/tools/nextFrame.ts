export function nextFrame() {
    return new Promise((resolve, reject) => {
        requestAnimationFrame(() => {
                resolve();
        });
    });
}