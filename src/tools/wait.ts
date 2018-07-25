export function nextFrame() {
    return new Promise((resolve, reject) => {
        requestAnimationFrame(() => {
            resolve();
        });
    });
}

export function sleep(duration: number) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, duration);
    });
}
